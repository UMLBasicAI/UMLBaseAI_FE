import UserLayout from '@/components/layouts/UserLayout'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: "SPINSEEK",
    icons: "/icons/sipnseek.png"
}

export default function UserRootLayout({children}: {children: React.ReactNode}) {
  return (
    <UserLayout>
        {children}
    </UserLayout>
  )
}
