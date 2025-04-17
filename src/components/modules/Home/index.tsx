'use client'

import CodePreview from '@/components/core/elements/CodePreview'
import MessageBox from '@/components/core/elements/MessageBox'
import { useLazyGetHistoryByIdQuery, usePromptToAIMutation } from '@/store/feature/ai/aiAPI'
import { useCallback, useRef, useState } from 'react'


type MessagesType = Array<{ type: 'request' | 'response'; content: string; sent_at: string }>;
const size = 5;
export default function Home({ historyId }: { historyId: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

    const [plantUmlCode, setPlantUmlCode] = useState('')
    const [messages, setMessages] = useState<MessagesType>([])

    const [getMessageByHistoryId, { data: messagesResult, isFetching }] = useLazyGetHistoryByIdQuery()
    const [page, setPage] = useState(1)
    const [isEndOfList, setIsEndOfList] = useState(false)
    const scrollToStoneMessage = () => {
        const messageContainer = document.getElementById("message-container");
        const messages = messageContainer?.querySelectorAll('.message');
        if (messageContainer && messages) {
            const stoneMessage = messages[size];
            if (stoneMessage) {
                stoneMessage.scrollIntoView({ block: 'start' });
            }
        }
    };
    const handleLoadMessage = useCallback(async () => {
        if (historyId) {
            if (isEndOfList || isFetching || messagesResult?.body.isHasNextPage === false) return;
            try {
                const result = await getMessageByHistoryId({
                    historyId, page, size: size
                }).unwrap()
                const messages = (result?.body?.messages.map((message) => ({
                    content: message.content,
                    type: message.messageType === 'request' ? 'request' : 'response',
                    sent_at: message.createdAt,
                })) as MessagesType).reverse()
                if (!result?.body.isHasNextPage === true) setIsEndOfList(true);
                setPage((page) => page + 1);
                setMessages((prev) => [...messages, ...prev])
                scrollToStoneMessage();
                setPlantUmlCode(result?.body?.lastPlantUmlCode);
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
            { type: 'response', content: '__loading__', sent_at: 'loading' },
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
                ...prev.filter((msg) => msg.sent_at !== 'loading'),
                { type: 'response', content: responseText, sent_at: aiSentAt },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev.filter((msg) => msg.sent_at !== 'loading'),
                {
                    type: 'response',
                    content: 'Đã có lỗi xảy ra, không nhận được phản hồi',
                    sent_at: new Date().toISOString(),
                },
            ]);
            console.error('AI call error:', err);
        }
    };


    return (
        <div
            ref={containerRef}
            className="flex overflow-hidden h-full bg-gray-50"
        >
            <div className='flex h-full w-full justify-between'>
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
            </div>
        </div>
    )
}
