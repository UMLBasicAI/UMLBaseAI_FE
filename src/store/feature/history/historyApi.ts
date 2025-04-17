import { baseApi } from '@/store/feature/base';
import { HistoriesResponse } from './history';

export const aiApis = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getHistories: build.query<HistoriesResponse, {page?: number, size?: number }>({
            query: ({page = 1, size = 10 }) => ({
                url: `/histories?page=${page}&size=${size}`,
                method: 'GET',
                flashError: true,
            }),
            extraOptions: { skipAuth: false }
        }),
    }),
})

export const {
    useGetHistoriesQuery,
    useLazyGetHistoriesQuery,
} = aiApis;