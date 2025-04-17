import AuthLayout from '@/components/core/layouts/AuthLayout'
import webStorageClient from '@/utils/webStorageClient'
import {redirect} from 'next/navigation'
export default async function LayoutAuth({
    children,
}: {
    readonly children: React.ReactNode
}) {
    return <AuthLayout>{children}</AuthLayout>
}
