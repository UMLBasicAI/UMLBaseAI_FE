'use client'
import { useEffect, useRef, useState } from 'react'
import ChatInterface from './chat-interface'
import { useParams } from 'next/navigation'

export default function MessageBox({ chatId }: { chatId: string }) {
    //Authentication
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
    // Default widths for the panels
    const params = useParams()
    const [isResizingLeft, setIsResizingLeft] = useState(false)

    const [messages, setMessages] = useState<
        Array<{ role: 'user' | 'assistant'; content: string }>
    >([])

    const messageData: any = {
        '1': [
            {
                role: 'assistant',
                content: 'Xin chào! Tôi có thể giúp gì cho bạn?.',
            },
        ],
        '2': [{ role: 'assistant', content: 'Chào! Bạn đang ở chat 2.' }],
        '3': [{ role: 'assistant', content: 'Chào! Bạn đang ở chat 333.' }],
    }

    useEffect(() => {
        if (chatId && messageData[chatId]) {
            setMessages(messageData[chatId])
        } else {
            setMessages([
                {
                    role: 'assistant',
                    content: 'Xin chào! Tôi có thể giúp gì cho bạn?',
                },
            ])
        }
    }, [chatId])
    const startResizingLeft = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizingLeft(true)
    }

    const handleSendMessage = (message: string) => {
        if (!message.trim()) return

        // Add user message
        setMessages((prev) => [...prev, { role: 'user', content: message }])

        // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Đây là phản hồi cho tin nhắn: "${message}"`,
                },
            ])
        }, 1000)
    }
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
