import Home from '@/components/modules/Home'

interface PageProps {
    params: { slug: string }
}

export default function ChatPage({ params }: PageProps) {
    return <Home historyId={params.slug} />
}
