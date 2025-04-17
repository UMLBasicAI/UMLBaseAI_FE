import { baseApi } from '@/store/feature/base';
import { authEndpoint } from "@/settings/endpoints";

export const authApis = baseApi.injectEndpoints({
    endpoints: (build) => ({
        signIn: build.mutation<any, { username: string, password: string, isRemember: boolean }>({
            query: (params) => ({
                url: authEndpoint.SIGNIN,
                body: {
                    email: params.username,
                    password: params.password,
                    isRemember: params.isRemember
                },
                flashError: true,
                method: 'POST',
            }),
            extraOptions: { skipAuth: true }
        }),
        signUp: build.mutation<any, { username: string, password: string, email: string }>({
            query: (params) => ({
                url: authEndpoint.SIGNUP,
                body: {
                    username: params.username,
                    password: params.password,
                    email: params.email
                },
                flashError: true,
                method: 'POST',
            }),
            extraOptions: { skipAuth: true }
        }),
        getUserId: build.query<any,void>({
            query: (params) => ({
                url: authEndpoint.GET_USER_INFOR,
                flashError: true,
                method: 'GET',
            }),
        }),
        
    }),
})

export const {
    useSignInMutation,
    useSignUpMutation,
    useGetUserIdQuery
} = authApis;
