'use client'

import webStorageClient from '@/utils/webStorageClient'
import { Layout } from 'antd'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthLayoutProps {
    readonly children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
    const userToken =  webStorageClient.getToken()
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    },[])
    if (userToken && isClient) {
        redirect('/chat')
    }
    return <Layout className="!bg-transparent">{children}</Layout>
}

export default AuthLayout
