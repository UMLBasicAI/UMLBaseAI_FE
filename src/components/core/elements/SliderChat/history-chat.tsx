'use client'

import { cn } from '@/libs/utils'
import { History } from '@/store/feature/history/history'
import {
    useLazyDeleteHistoryQuery,
    useUpdateHistoryActionMutation,
} from '@/store/feature/history/historyApi'
import { Input, message, Modal, Popover } from 'antd'
import dayjs from 'dayjs'
import {
    AlertTriangle,
    MoreHorizontal,
    Pencil,
    Share2,
    Trash2,
    X
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

interface ChatHistoryProps {
    chatHistory: Array<{
        id: string
        title: string
        date: string
    }>
}
const { confirm } = Modal

export default function ChatHistory({
    chatHistory,
    setChatHistory,
}: {
    chatHistory: History[]
    setChatHistory?: React.Dispatch<React.SetStateAction<History[]>>
}) {
    const router = useRouter()
    const pathname = usePathname()
    console.log(pathname)

    const [searchTerm, setSearchTerm] = useState('')

    const filteredHistory = chatHistory?.filter((chat) =>
        chat?.action.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    const [deleteHistoryChat] = useLazyDeleteHistoryQuery()
    const handleDeleteChatInState = (fromIndex: number) => {
        const newChatHistory = chatHistory.filter(
            (_, index) => index !== fromIndex,
        )
        setChatHistory!(newChatHistory!)
    }
    const handleDeleteChatAsync = async (chat: History, fromIndex: number) => {
        const res = await deleteHistoryChat({ historyId: chat.id })
        if (res.data) {
            message.success('Chat deleted successfully')
            handleDeleteChatInState(fromIndex)
            router.push('/chat')
        }
        if (res.error) {
            message.error('Failed to delete chat')
        }
    }
    const [updateHistory] = useUpdateHistoryActionMutation()
    const handleUpdateNameActionInState = (
        fromIndex: number,
        newActionName: string,
    ) => {
        const newChatHistory = chatHistory.map((chat, index) => {
            if (index === fromIndex) {
                return { ...chat, action: newActionName }
            }
            return chat
        })
        setChatHistory!(newChatHistory!)
    }
    const handleRenameChatAsync = async (
        chat: History,
        newActionName: string,
    ) => {
        const res = await updateHistory({
            historyId: chat.id,
            newAction: newActionName,
        })
        if (res.data) {
            message.success('Chat renamed successfully')
        }
        if (res.error) {
            message.error('Failed to rename chat')
        }
    }

    return (
        <div className="flex h-[calc(100vh-80px)] flex-col">
            <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Chat History
                </h2>
                <button
                    className="mt-2 flex w-full items-center rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => router.push('/chat')}
                >
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
                {chatHistory?.length > 0 ? (
                    <>
                        {filteredHistory?.map((chat, index) => {
                            const isLast = index === chatHistory.length - 1

                            const handleDeleteChat = (chat: History) => {
                                confirm({
                                    title: 'Confirm chat deletion?',
                                    icon: (
                                        <div className="h-[30px] w-[30px] pr-2">
                                            <AlertTriangle className="text-red-500" />
                                        </div>
                                    ),
                                    content: (
                                        <p>
                                            <span className="w-[200px] overflow-hidden truncate text-ellipsis font-semibold">
                                                "{chat.action.slice(0, 50)}..."
                                            </span>{' '}
                                            will be permanently deleted. Are you
                                            sure you want to continue?
                                        </p>
                                    ),
                                    okText: 'Delete',
                                    okType: 'danger',
                                    cancelText: 'Cancel',
                                    cancelButtonProps: {
                                        className:
                                            '!text-gray-700 !border !border-gray-300 !hover:border-gray-400 !hover:text-gray-900',
                                    },
                                    centered: true,
                                    onOk() {
                                        handleDeleteChatAsync(chat, index)
                                    },
                                    onCancel() {
                                        console.log('Deletion cancelled')
                                    },
                                })
                            }

                            const handleRenameChat = (chat: History) => {
                                let newActionName = chat.action

                                Modal.confirm({
                                    title: 'Rename this conversation',
                                    icon: (
                                        <div className='h-[30px] w-[30px]'>
                                            <Pencil className="pr-2 text-gray-500" />
                                        </div>
                                    ),
                                    content: (
                                        <Input
                                            defaultValue={chat.action}
                                            onChange={(e) =>
                                                (newActionName = e.target.value)
                                            }
                                            placeholder="Enter new chat title"
                                            className="!border !border-gray-300 !bg-white focus:!border-gray-500 focus:!shadow-none focus:!ring-0"
                                        />
                                    ),
                                    okText: 'Save',
                                    okType: 'primary',
                                    okButtonProps: {
                                        className:
                                            '!bg-gray-500 !border !border-blugray-500 !hover:bg-blugray-600',
                                    },
                                    cancelText: 'Cancel',
                                    cancelButtonProps: {
                                        className:
                                            '!text-gray-700 !border !border-gray-300 !hover:border-gray-400 !hover:text-gray-900',
                                    },
                                    closeIcon: <X />,
                                    centered: true,
                                    onOk() {
                                        if (!newActionName.trim()) {
                                            message.warning(
                                                'Chat title cannot be empty!',
                                            )
                                            return Promise.reject()
                                        }

                                        handleRenameChatAsync(
                                            chat,
                                            newActionName,
                                        )
                                        handleUpdateNameActionInState(
                                            index,
                                            newActionName,
                                        )

                                        return Promise.resolve()
                                    },
                                    onCancel() {
                                        console.log('Rename cancelled')
                                    },
                                })
                            }

                            const popoverContent = (
                                <div className="flex flex-col gap-2">
                                    <button
                                        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => handleRenameChat(chat)}
                                    >
                                        <Pencil className="h-4 w-4" /> Rename
                                    </button>
                                    <button
                                        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-red-500 hover:bg-red-100"
                                        onClick={() => handleDeleteChat(chat)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />{' '}
                                        Delete
                                    </button>
                                    <button className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100">
                                        <Share2 className="h-4 w-4" /> Share
                                    </button>
                                </div>
                            )

                            return (
                                <li
                                    key={chat.id}
                                    className={cn(
                                        'group relative list-none hover:bg-gray-50',
                                        `${pathname.includes(chat.id) && 'bg-gray-100'}`,
                                    )}
                                    id={isLast ? 'last-history' : undefined}
                                >
                                    <button
                                        onClick={() =>
                                            router.push(`/chat/${chat.id}`)
                                        }
                                        className="w-full p-4 pr-10 text-left"
                                    >
                                        <h3 className="truncate text-sm font-medium text-gray-800">
                                            {chat.action}
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {dayjs(chat.createdAt).format(
                                                'DD/MM/YYYY HH:mm',
                                            )}
                                        </p>
                                    </button>

                                    <div className="absolute right-2 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Popover
                                            content={popoverContent}
                                            trigger="click"
                                            placement="bottomRight"
                                        >
                                            <button className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100">
                                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </Popover>
                                    </div>
                                </li>
                            )
                        })}
                    </>
                ) : (
                    <>
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-600">
                            <p>No chat history</p>
                            <p>Start your conversation!</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
