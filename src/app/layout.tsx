import type { Metadata } from 'next'
import './globals.css'
import { Montserrat } from 'next/font/google'
import AppProvider from './provider'
import { cn } from '@/libs/utils'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
    title: 'UML Basic AI',
    icons: '/icons/UMLBasicAI.png',
}
const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
})
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={cn(montserrat.className)}>
                <AppProvider>
                    <AuthProvider>{children}</AuthProvider>
                </AppProvider>
            </body>
        </html>
    )
}
