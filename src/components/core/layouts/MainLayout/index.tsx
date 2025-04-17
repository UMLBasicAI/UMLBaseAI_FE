'use client'

import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Header from '../../common/Header'
import Slider from '../../elements/SliderChat'
import { usePathname } from 'next/navigation'

interface MainLayoutProps {
    readonly children: React.ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    return (
        <Layout className="!h-screen justify-between flex flex-col">
            <Header />
            <div className='flex flex-row h-full'>
                {
                    !(pathname == "/") && <Slider />
                }

                <Content className="mx-auto mt-0 flex flex-col">
                    {children}
                </Content>
            </div>
        </Layout>
    )
}

export default MainLayout
