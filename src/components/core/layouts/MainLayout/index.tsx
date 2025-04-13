'use client'

import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import './style.css'
import Header from '../../common/Header'

interface MainLayoutProps {
    readonly children: React.ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
    return (
        <Layout className="background flex h-screen flex-col">
            <Header />

            <Content className="!md:mx-w-[1440px] mx-auto mt-0 flex h-screen !min-w-full flex-col">
                {children}
            </Content>
        </Layout>
    )
}

export default MainLayout
