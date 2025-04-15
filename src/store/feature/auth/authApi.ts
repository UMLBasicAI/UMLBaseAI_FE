import { baseApi } from '@/store/feature/base';

import { authEndpoint } from "@/settings/endpoints";
export const authApis = baseApi.injectEndpoints({
    endpoints: (build) => ({
        exampleRequestLogin: build.mutation<any, { username: string, password: string, isRemember: boolean }>({
            query: (params) => ({
                url: authEndpoint.SIGNIN,
                body: {
                    username: params.username,
                    password: params.password,
                    isRemember: params.isRemember
                },
                flashError: true,
                method: 'POST',
            }),
            extraOptions: { skipAuth: true }
        }),
        exampleRequestSignUp: build.mutation<any, { username: string, password: string, email: string }>({
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
        exampleGet: build.query<any, void>({
            query: () => ({
                url: '/example',
                method: 'GET',
            }),
            extraOptions: { skipAuth: false }
        })
    }),
})

export const {
    useExampleRequestLoginMutation,
    useExampleRequestSignUpMutation,
    useExampleGetQuery,
    useLazyExampleGetQuery,
} = authApis;