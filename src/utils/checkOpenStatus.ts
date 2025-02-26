export const checkStoreStatus = (
    openTime: string,
    closeTime: string,
): string => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const [openHour, openMinute] = openTime.split(':').map(Number)
    const openMinutes = openHour * 60 + openMinute

    const [closeHour, closeMinute] = closeTime.split(':').map(Number)
    const closeMinutes = closeHour * 60 + closeMinute

    return currentTime >= openMinutes && currentTime <= closeMinutes
        ? 'Đang mở cửa'
        : 'Đã đóng cửa'
}

export const checkStoreStatusTriger = (
    openTime: string,
    closeTime: string,
): boolean => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const [openHour, openMinute] = openTime.split(':').map(Number)
    const openMinutes = openHour * 60 + openMinute

    const [closeHour, closeMinute] = closeTime.split(':').map(Number)
    const closeMinutes = closeHour * 60 + closeMinute

    return currentTime >= openMinutes && currentTime <= closeMinutes
        ? true
        : false
}
