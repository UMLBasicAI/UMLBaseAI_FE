import MainLayout from '@/components/core/layouts/MainLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'UMLBasicAI - UML Diagram Generator',
    description:
        'Create, manage, and generate code from UML diagrams with AI assistance',
}

export default async function LayoutAuth({
    children,
}: {
    readonly children: React.ReactNode
}) {
    return <MainLayout>{children}</MainLayout>
}
