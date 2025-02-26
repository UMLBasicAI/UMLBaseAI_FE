'use client'
import Footer from '@/components/core/modules/User/Footer'
import Header from '@/components/core/modules/User/Header'
import React, { useEffect } from 'react'
import { useGeolocation } from '../GeolocationProvider'
import toast from 'react-hot-toast'

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { latitude, longitude, error } = useGeolocation()

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (latitude && longitude) {
                console.log(latitude);
                console.log(longitude);
            } else {
                toast.error(
                    'Vui lòng cho phép truy cập vị trí để tìm kiếm chính xác!',
                )
            }
        }, 3000)
        return () => clearTimeout(timeOut)
    }, [latitude, longitude])

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Header />
            {children}
            <Footer />
        </div>
    )
}
