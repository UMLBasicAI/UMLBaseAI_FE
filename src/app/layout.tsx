import type { Metadata } from 'next'
import './globals.css'
import { Montserrat } from 'next/font/google'
import AppProvider from './provider'
import { cn } from '@/libs/utils'

export const metadata: Metadata = {
    title: 'SPINSEEK',
    icons: 'public/icons/sipnseek.png',
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
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    )
}
