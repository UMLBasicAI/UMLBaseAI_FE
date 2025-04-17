import { AuthProvider } from '@/context/AuthContext'
import { cn } from '@/libs/utils'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import AppProvider from './provider'

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
