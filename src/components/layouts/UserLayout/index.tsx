import Footer from '@/components/core/modules/User/Footer'
import Header from '@/components/core/modules/User/Header'
import React from 'react'

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Header />
            {children}
            <Footer />
        </div>
    )
}
