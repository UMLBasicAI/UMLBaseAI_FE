'use client'

import React from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { App, ConfigProvider } from 'antd'
import { themes } from '@/style/themes'
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function AppProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            colorPrimary: themes.default.colors.primary,
                            algorithm: true,
                        },
                        Input: {
                            paddingBlock: 8,
                        },
                        Typography: {
                            titleMarginBottom: 0,
                            titleMarginTop: 0,
                        },
                        Table: {
                            headerBg: '#fff',
                            headerColor: '#000',
                            headerBorderRadius: 8,
                            footerBg: '#fff',
                        },
                        Select: {
                            controlHeight: 40,
                            fontSizeLG: 14,
                        },
                    },
                    token: {
                        colorPrimary: themes.default.colors.primary,
                    },
                }}
            >
                <App>
                    <Provider store={store}>{children}</Provider>
                </App>
            </ConfigProvider>
        </AntdRegistry>
    )
}
