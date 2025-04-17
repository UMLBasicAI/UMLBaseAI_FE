import { baseApi } from '@/store/feature/base';

import { aiEndPoint } from "@/settings/endpoints";
import { HistoryResponse, PromptToAIResponse } from './ai';
export const aiApis = baseApi.injectEndpoints({
    endpoints: (build) => ({
        promptToAI: build.mutation<PromptToAIResponse, { historyId?: string, prompt: string }>({
            query: (params) => ({
                url: aiEndPoint.PROMPTTOAI,
                body: {
                    historyId: params.historyId,
                    prompt: params.prompt
                },
                flashError: true,
                method: 'POST',
            }),
            extraOptions: { skipAuth: false }
        }),
        getHistoryById: build.query<HistoryResponse, { historyId: string, page?: number, size?: number }>({
            query: ({ historyId, page = 1, size = 10 }) => ({
                url: `/history/${historyId}?page=${page}&size=${size}`,
                method: 'GET',
                flashError: true,
            }),
            extraOptions: { skipAuth: false }
        }),
    }),
})

export const {
    usePromptToAIMutation,
    useLazyGetHistoryByIdQuery,
} = aiApis;