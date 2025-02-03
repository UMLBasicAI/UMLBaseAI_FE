'use client'

import { Header } from '@/components/core/modules/Admin/Header'
import { Sidebar } from '@/components/core/modules/Admin/Sidebar'
import type React from 'react'
import { useState } from 'react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#FDF8F5] dark:bg-gray-900">
                    <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    )
}
