// utils/fetcher.ts
export const fetcher = async <T>(
    url: string,
    options?: RequestInit,
): Promise<T> => {
    const res = await fetch(url, options)

    if (!res.ok) {
        const error: any = new Error(
            'An error occurred while fetching the data.',
        )
        error.info = await res.json()
        error.status = res.status
        throw error
    }

    return res.json()
}
