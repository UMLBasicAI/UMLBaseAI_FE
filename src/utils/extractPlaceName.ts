export const extractPlaceName = (url: string): string | null => {
    const regex = /place\/(.*?)\//
    const match = url.match(regex)

    if (match && match[1]) {
        return decodeURIComponent(match[1]).replace(/\+/g, ' ')
    }

    return null
}
