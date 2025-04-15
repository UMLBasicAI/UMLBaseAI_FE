'use client'
import { useEffect, useRef, useState } from 'react'
import ChatInterface from './chat-interface'

export default function MessageBox({
    historyId,
    messages,
    onSendMessage,
    isLoading,
}: {
    historyId: string
    messages: Array<{ type: 'request' | 'response'; content: string; sent_at: string }>
    onSendMessage: (message: string) => void
    isLoading: boolean
}) {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
    const [isResizingLeft, setIsResizingLeft] = useState(false)
    const startResizingLeft = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizingLeft(true)
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

            <div className="flex flex-1 flex-col">
                <ChatInterface
                    messages={messages}
                    onSendMessage={onSendMessage}
                    isLoading={isLoading}
                />
            </div>
        </>
    )
}
