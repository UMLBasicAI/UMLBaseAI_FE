'use client'
import { useEffect, useRef, useState } from 'react'
import ChatHistory from './history-chat'

export default function Slider() {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)

    const [chatHistory, setChatHistory] = useState([
        { id: '1', title: 'Chat mới', date: '20/03/2024' },
        { id: '2', title: 'Hỏi về React', date: '20/03/2024' },
        { id: '3', title: 'Tạo component', date: '18/03/2024' },
    ])

    return (
        <>
            <button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-r-md border border-gray-200 bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
                {leftSidebarOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                )}
            </button>
            <div
                style={{
                    width: leftSidebarOpen ? 'var(--left-width)' : '0px',
                }}
                className="relative flex flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-300"
            >
                <ChatHistory chatHistory={chatHistory} />
            </div>
        </>
    )
}
