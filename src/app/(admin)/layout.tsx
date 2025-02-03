import AdminLayout from '@/components/layouts/AdminLayout'
import UserLayout from '@/components/layouts/UserLayout'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'SPINSEEK | DASHBOARD',
    icons: '/icons/sipnseek.png',
}

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AdminLayout>{children}</AdminLayout>
}
