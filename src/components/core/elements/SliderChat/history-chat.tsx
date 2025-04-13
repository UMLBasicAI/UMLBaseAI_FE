'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ChatHistoryProps {
    chatHistory: Array<{
        id: string
        title: string
        date: string
    }>
}

export default function ChatHistory({ chatHistory }: ChatHistoryProps) {
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState('')

    const filteredHistory = chatHistory.filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Chat History
                </h2>
                <button className="mt-2 flex w-full items-center rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>New Chat</span>
                </button>
            </div>

            <div className="relative border-b border-gray-200 p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredHistory.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {filteredHistory.map((chat) => (
                            <li key={chat.id} className="hover:bg-gray-50">
                                <button
                                    onClick={() =>
                                        router.push(`/chat/${chat.id}`)
                                    }
                                    className="w-full p-4 text-left"
                                >
                                    <h3 className="truncate text-sm font-medium text-gray-800">
                                        {chat.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {chat.date}
                                    </p>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-gray-500">No chats found</p>
                    </div>
                )}
            </div>
        </div>
    )
}
