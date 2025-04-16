import { baseApi } from '@/store/feature/base';

import { aiEndPoint } from "@/settings/endpoints";
import { PromptToAIResponse } from './ai';
export const aiApis = baseApi.injectEndpoints({
    endpoints: (build) => ({
        promptToAI: build.mutation<PromptToAIResponse, { historyId?: string, prompt: string}>({
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
        })
    }),
})

export const {
    usePromptToAIMutation,
} = aiApis;