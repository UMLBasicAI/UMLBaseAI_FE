import constants from '@/settings/constants'
import webStorageClient from '@/utils/webStorageClient'
import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
} from '@reduxjs/toolkit/query/react'
import { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useJwtDecode } from '@/hooks/useJwtDecode'
import { message } from 'antd'

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

    if (result.error?.status === 401 && !extraOptions?.skipAuth) {
        message.loading('Refreshing your side...')
        const refreshToken = webStorageClient.getRefreshToken()
        if (!refreshToken) return result
        const decoded = useJwtDecode()
        const refreshResult = await baseQuery(
            {
                url: '/refresh-access-token',
                method: 'PATCH',
                body: {
                    refreshToken: refreshToken,
                    accesTokenId: decoded?.jti,
                    userId: decoded?.sub,
                },
            },
            api,
            { skipAuth: true },
        )
        if (refreshResult.data) {
            const newAccessToken = (refreshResult.data as any).body?.accessToken
            const newRefreshToken = (refreshResult.data as any).body
                ?.refreshToken

            webStorageClient.setToken(newAccessToken, { maxAge: 60 * 60 })
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
