'use client'

import { Layout } from 'antd'

interface AuthLayoutProps {
    readonly children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
    return <Layout className="!bg-transparent">{children}</Layout>
}

export default AuthLayout
