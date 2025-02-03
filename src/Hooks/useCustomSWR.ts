// hooks/useCustomSWR.ts
import useSWR, { SWRResponse, SWRConfiguration, KeyedMutator } from "swr";
import { fetcher } from "@/utils/fetcher";

interface UseCustomSWROptions extends RequestInit {
  endpoint?: string;
}

export default function useCustomSWR<T = any>(
  endpoint: string | null, // Endpoint can be null to disable fetching
  options?: UseCustomSWROptions, // Request options (e.g., headers, body)
  swrOptions?: SWRConfiguration // SWR configurations (e.g., revalidation options)
): SWRResponse<T, any> & { isLoading: boolean } {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Replace with your API base URL if needed
  const { data, error, mutate, isValidating } = useSWR<T>(
    endpoint ? `${baseUrl}${endpoint}` : null,
    (url) => fetcher<T>(url, options),
    swrOptions
  );

  // Ensure the hook returns `isLoading` instead of `loading`
  return {
    data,
    error,
    mutate,
    isValidating,
    isLoading: !data && !error, // Correct name is `isLoading`
  };
}
