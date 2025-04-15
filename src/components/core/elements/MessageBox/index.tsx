'use client'
import { useEffect, useRef, useState } from 'react'
import ChatInterface from './chat-interface'
import { useParams } from 'next/navigation'
import { usePromptToAIMutation } from '@/store/feature/ai/aiAPI'

export default function MessageBox({ chatId }: { chatId: string }) {
    //Pending historyId
    const historyId = undefined;
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
    const params = useParams()
    const [isResizingLeft, setIsResizingLeft] = useState(false)    
    type Message = {
        type: 'request' | 'response';
        content: string;
        sent_at: string;
      };
      
    const [messages, setMessages] = useState<Message[]>([]);


    const [triggerPromptToAI] = usePromptToAIMutation();
    const messageData: any = {
        '1': [
            {
                type: 'response',
                content: 'Xin chào! Tôi có thể giúp gì cho bạn?.',
            },
        ],
        '2': [{ type: 'response', content: 'Chào! Bạn đang ở chat 2.' }],
        '3': [{ type: 'response', content: 'Chào! Bạn đang ở chat 333.' }],
    }

    useEffect(() => {
        if (chatId && messageData[chatId]) {
            setMessages(messageData[chatId])
        } else {
            setMessages([
                {
                    type: 'response',
                    content: 'Xin chào! Tôi có thể giúp gì cho bạn?',
                    sent_at: ''
                },
            ])
        }
    }, [chatId])
    const startResizingLeft = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizingLeft(true)
    }

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;
    
        const sentAt = new Date().toISOString();
    
        setMessages((prev) => [
            ...prev,
            { type: 'request', content: message, sent_at: sentAt },
        ]);
    
        try {
            const result = await triggerPromptToAI(
                historyId ? { historyId, prompt: message  } : { prompt: message }
            ).unwrap();
    
            const responseText = result?.body?.responseText;
            const aiSentAt = new Date().toISOString();
    
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
        <>
            {leftSidebarOpen && (
                <div
                    onMouseDown={startResizingLeft}
                    className={`group relative z-10 h-full w-1.5 cursor-col-resize ${isResizingLeft ? 'bg-gray-400' : 'hover:bg-gray-300'}`}
                >
                    <div
                        className={`absolute inset-0 -left-1.5 w-4 group-hover:bg-gray-300/20 ${isResizingLeft ? 'bg-gray-300/20' : ''}`}
                    ></div>
                    <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-400 opacity-0 group-hover:opacity-100"></div>
                </div>
            )}

            {/* Main Chat Interface */}
            <div className="flex flex-1 flex-col">
                <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </>
    )
}
