import { GeolocationProvider } from '@/components/layouts/GeolocationProvider'
import { NextUIProvider } from '@nextui-org/react'
import React from 'react'
import { Toaster } from 'react-hot-toast'

export default function AppProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <NextUIProvider>
            <GeolocationProvider>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        className: '',
                        duration: 5000,
                        removeDelay: 1000,
                        style: {
                            background: '#fff',
                            color: '#000',
                        },

                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: 'green',
                                secondary: 'white',
                            },
                        },
                        error: {
                            duration: 3000,
                            iconTheme: {
                                primary: 'red',
                                secondary: 'white',
                            },
                        },
                    }}
                />
                {children}
            </GeolocationProvider>
        </NextUIProvider>
    )
}
