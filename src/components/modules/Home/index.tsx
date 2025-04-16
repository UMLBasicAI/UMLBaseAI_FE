'use client'

import Header from '@/components/core/common/Header'
import CodePreview from '@/components/core/elements/CodePreview'
import MessageBox from '@/components/core/elements/MessageBox'
import Slider from '@/components/core/elements/SliderChat'
import { usePromptToAIMutation } from '@/store/feature/ai/aiAPI'
import { useEffect, useRef, useState } from 'react'

export default function Home({ historyId }: { historyId: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

    const [plantUmlCode, setPlantUmlCode] = useState('')
    const [messages, setMessages] = useState<
        Array<{ type: 'request' | 'response'; content: string; sent_at: string }>
    >([])

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
        <main
            ref={containerRef}
            className="flex h-screen overflow-hidden bg-gray-50"
        >
            <Slider />
            <>
                <MessageBox
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
