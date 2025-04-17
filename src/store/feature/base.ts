import { AppJwtPayload } from '@/hooks/useJwtDecode'
import constants from '@/settings/constants'
import webStorageClient from '@/utils/webStorageClient'
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import {
    BaseQueryFn,
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { message } from 'antd'
import { jwtDecode } from 'jwt-decode'

interface CustomExtraOptions {
    skipAuth?: boolean
}

const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    CustomExtraOptions
> = async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: constants.API_SERVER,
        prepareHeaders: (headers) => {
            const accessToken = webStorageClient.getToken()
            // Skip setting the Authorization header if skipAuth is passed
            if (!extraOptions?.skipAuth && accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`)
            }

            return headers
        },
        mode: 'cors',
    })

    let result = await baseQuery(args, api, extraOptions)

    if ((result.error?.status === 401 || result.error?.status === 403) && !extraOptions?.skipAuth) {
        message.loading('Refreshing your side...')
        const refreshToken = webStorageClient.getRefreshToken()
        console.log("refresh",refreshToken);
        const token = webStorageClient.getToken()
        if (!token) return result;
        const decoded = jwtDecode<AppJwtPayload>(token)
        console.log("Decode")
        const refreshResult = await baseQuery(
            {
                url: '/refresh-access-token',
                method: 'PATCH',
                body: {
                    refreshToken: refreshToken,
                    accessTokenId: decoded?.jti,
                    userId: decoded?.sub,
                },
            },
            api,
            { skipAuth: true },
        )
        if (refreshResult.error) {
            message.error('Failed to refresh your site')
            webStorageClient.removeAll();
            return result;
        }

        if (refreshResult.data) {
            message.success('Token refreshed successfully!') 
            const newAccessToken = (refreshResult.data as any).body?.accessToken
            const newRefreshToken = (refreshResult.data as any).body
                ?.refreshToken

            webStorageClient.setToken(newAccessToken, { maxAge: 60*60*24*30 })
            webStorageClient.setRefreshToken(newRefreshToken, {
                maxAge: 60 * 60 * 24 * 30,
            })

            result = await baseQuery(args, api, extraOptions)
        } else {
            webStorageClient.removeAll();
        }
    }
    return result
}

export const baseApi = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
})
