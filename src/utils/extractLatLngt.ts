export const extractLatLng = (
    url: string,
): { lat: number; lng: number } | null => {
    const regex = /@([-\d.]+),([-\d.]+)/
    const match = url.match(regex)
    try {
        if (match && match.length >= 3) {
            return {
                lat: parseFloat(match[1]),
                lng: parseFloat(match[2]),
            }
        }
    } catch (error) {
        console.log(error)
    }
    return null
}
