import useSWRMutation, {
    SWRMutationResponse,
    SWRMutationConfiguration,
} from 'swr/mutation'
import { fetcher } from '@/utils/fetcher'

interface UseCustomSwrMutationOptions extends RequestInit {
    endpoint?: string
}

export default function useCustomSwrMutation<T = any, V = any>(
    endpoint: string,
    method?: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    options?: SWRMutationConfiguration<T, any, string, V>,
): SWRMutationResponse<T, any, string, V> & { isLoading: boolean } {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL // Base URL for your API
    const fullEndpoint = `${baseUrl}${endpoint}`
    const { trigger, data, error, isMutating, reset } = useSWRMutation<
        T,
        any,
        string,
        V
    >(
        fullEndpoint,
        async (url, { arg }: { arg: V }) => {
            const response = await fetcher<T>(url, {
                method: method ?? 'POST',
                body: JSON.stringify(arg),
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options,
            })

            return response
        },
        options,
    )

    return {
        trigger,
        data,
        error,
        isMutating,
        isLoading: isMutating,
        reset,
    }
}
