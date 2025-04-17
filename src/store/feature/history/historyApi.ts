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
        deleteHistory: build.query<void, { historyId: string }>({
            query: (params) => ({
                url: `/delete-prompt-history-by-id/${params.historyId}`,
                method: 'DELETE',
                flashError: true,
            }),
            extraOptions: { skipAuth: false }
        }),
        updateHistoryAction: build.mutation<void, { historyId: string, newAction: string }>({
            query: (params) => ({
                url: `/update-prompt-history-action`,
                body: params,
                method: 'PATCH',
                flashError: true,
            }),
            extraOptions: { skipAuth: false }
        })
    }),
})

export const {
    useGetHistoriesQuery,
    useLazyGetHistoriesQuery,
    useLazyDeleteHistoryQuery,
    useUpdateHistoryActionMutation
} = aiApis;