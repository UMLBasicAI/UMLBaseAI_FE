'use client'

import Header from '@/components/core/common/Header'
import CodePreview from '@/components/core/elements/CodePreview'
import MessageBox from '@/components/core/elements/MessageBox'
import Slider from '@/components/core/elements/SliderChat'
import { useLazyGetHistoryByIdQuery, usePromptToAIMutation } from '@/store/feature/ai/aiAPI'
import { useCallback, useEffect, useRef, useState } from 'react'


type MessagesType = Array<{ type: 'request' | 'response'; content: string; sent_at: string }>;

export default function Home({ historyId }: { historyId: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

    const [plantUmlCode, setPlantUmlCode] = useState('')
    const [messages, setMessages] = useState<MessagesType>([])

    const [getMessageByHistoryId, { data: messagesResult, isFetching }] = useLazyGetHistoryByIdQuery()
    const [page, setPage] = useState(1)
    const [isEndOfList, setIsEndOfList] = useState(false)
    const handleLoadMessage = useCallback(async () => {
        if (historyId) {
            if (isEndOfList || isFetching || messagesResult?.body.isHasNextPage === false) return;
            try {
                const result = await getMessageByHistoryId({
                    historyId, page, size: 4
                }).unwrap()
                const messages = (result?.body?.messages.map((message) => ({
                    content: message.content,
                    type: message.messageType === 'request' ? 'request' : 'response',
                    sent_at: message.createdAt,
                })) as MessagesType).reverse()
                if (!result?.body.isHasNextPage === true) setIsEndOfList(true);
                setPage((page) => page + 1);
                setMessages((prev) => [...messages, ...prev])
            } catch (err) {
                console.error('Error loading messages:', err)
            }
        }
    }, [page])
    const [triggerPromptToAI, { isLoading }] = usePromptToAIMutation()
    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        const sentAt = new Date().toISOString();

        setMessages((prev) => [
            ...prev,
            { type: 'request', content: message, sent_at: sentAt },
        ]);

        try {
            const result = await triggerPromptToAI(
                historyId ? { historyId, prompt: message } : { prompt: message }
            ).unwrap();

            const responseText = result?.body?.responseText;
            const aiSentAt = new Date().toISOString();
            if (result?.body?.plantUML) {
                setPlantUmlCode(result.body.plantUML);
                setRightSidebarOpen(true);
            }
            setMessages((prev) => [
                ...prev,
                { type: 'response', content: responseText, sent_at: aiSentAt },
            ]);
        } catch (err) {
            alert("AI Call Error");
            console.error('AI call error:', err);
        }
    };

    return (
        <main
            ref={containerRef}
            className="flex h-screen overflow-hidden bg-gray-50"
        >
            <Slider />
            <>
                <MessageBox
                    isEndOfList={isEndOfList}
                    handleLoadMessage={handleLoadMessage}
                    historyId={historyId}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
                <CodePreview
                    plantUMLCode={plantUmlCode}
                    setPlantUMLCode={setPlantUmlCode}
                    rightSidebarOpen={rightSidebarOpen}
                    setRightSidebarOpen={setRightSidebarOpen}
                />
            </>
        </main>
    )
}
