'use client'

import { useEffect, useRef, useState } from 'react'
import ChatHistory from './history-chat'
import ChatInterface from './chat-interface'
import CodePreview from './code-preview'
import Navbar from '../common/navbar/navbar'

export default function HomeComponent() {
    //Authentication
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState({
        displayName: 'Nguyễn Trường Giang',
        email: 'giangqt2k4@gmail.com',
        avatarUrl: '',
    })

    const handleLogout = () => {
        setIsLoggedIn(false)
    }

    const handleLogin = () => {
        setIsLoggedIn(true)
    }

    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

    // Default widths for the panels
    const [leftWidth, setLeftWidth] = useState(260) // 260px default width
    const [rightWidth, setRightWidth] = useState(380) // 380px default width

    // Track resizing state
    const [isResizingLeft, setIsResizingLeft] = useState(false)
    const [isResizingRight, setIsResizingRight] = useState(false)

    // Refs for resize handling
    const containerRef = useRef<HTMLDivElement>(null)

    const [messages, setMessages] = useState<
        Array<{ role: 'user' | 'assistant'; content: string }>
    >([{ role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn?' }])
    const [chatHistory, setChatHistory] = useState([
        { id: '1', title: 'Chat mới', date: '20/03/2024' },
        { id: '2', title: 'Hỏi về React', date: '20/03/2024' },
        { id: '3', title: 'Tạo component', date: '18/03/2024' },
    ])
    const [currentCode, setCurrentCode] = useState(`@startuml

    class Car {
        +startEngine()
        +stopEngine()
    }

    class ElectricCar {
        +chargeBattery()
    }

    Car <|-- ElectricCar

    @enduml
      `)

    const startResizingLeft = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizingLeft(true)
    }

    const startResizingRight = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizingRight(true)
    }

    const stopResizing = () => {
        setIsResizingLeft(false)
        setIsResizingRight(false)
    }

    // Resize panels based on mouse movement
    const resize = (e: MouseEvent) => {
        if (isResizingLeft && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect()
            const newWidth = Math.max(
                200,
                Math.min(
                    e.clientX - containerRect.left,
                    containerRect.width * 0.3,
                ),
            )
            setLeftWidth(newWidth)
        }

        if (isResizingRight && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect()
            const newWidth = Math.max(
                300,
                Math.min(
                    containerRect.right - e.clientX,
                    containerRect.width * 0.7,
                ),
            )
            setRightWidth(newWidth)
        }
    }

    // Set up event listeners for resizing
    useEffect(() => {
        if (isResizingLeft || isResizingRight) {
            document.body.style.cursor = 'col-resize'
            document.body.style.userSelect = 'none'

            const handleResize = (e: MouseEvent) => {
                // Use requestAnimationFrame for smoother resizing
                window.requestAnimationFrame(() => resize(e))
            }

            window.addEventListener('mousemove', handleResize)
            window.addEventListener('mouseup', stopResizing)

            return () => {
                window.removeEventListener('mousemove', handleResize)
                window.removeEventListener('mouseup', stopResizing)
            }
        } else {
            document.body.style.removeProperty('cursor')
            document.body.style.removeProperty('user-select')
        }
    }, [isResizingLeft, isResizingRight])

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
        <div className="flex h-screen flex-col">
            {/* Navbar with authentication state */}
            <Navbar
                isLoggedIn={isLoggedIn}
                userDisplayName={userInfo.displayName}
                userEmail={userInfo.email}
                userAvatarUrl={userInfo.avatarUrl}
                onLogout={handleLogout}
                onLogin={handleLogin}
            />
            <main
                ref={containerRef}
                className="flex h-screen overflow-hidden bg-gray-50"
                style={
                    {
                        // Use CSS variables for smoother transitions
                        '--left-width': `${leftWidth}px`,
                        '--right-width': `${rightWidth}px`,
                    } as React.CSSProperties
                }
            >
                {/* Left Sidebar - Chat History */}
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

                {/* Left resize handle */}
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

                {/* Right resize handle */}
                {rightSidebarOpen && (
                    <div
                        onMouseDown={startResizingRight}
                        className={`group relative z-10 h-full w-1.5 cursor-col-resize ${isResizingRight ? 'bg-gray-400' : 'hover:bg-gray-300'}`}
                    >
                        <div
                            className={`absolute inset-0 -left-1.5 w-4 group-hover:bg-gray-300/20 ${isResizingRight ? 'bg-gray-300/20' : ''}`}
                        ></div>
                        <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-400 opacity-0 group-hover:opacity-100"></div>
                    </div>
                )}
                {/* Right sidebar toggle button */}
                <button
                    onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-l-md border border-gray-200 bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    {rightSidebarOpen ? (
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
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    )}
                </button>
                {/* Right Sidebar - Code Preview */}
                <div
                    style={{
                        width: rightSidebarOpen ? 'var(--right-width)' : '0px',
                    }}
                    className="relative overflow-hidden border-l border-gray-200 bg-white transition-all duration-300"
                >
                    <CodePreview code={currentCode} />
                </div>
            </main>
        </div>
    )
}
