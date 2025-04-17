'use client'

import type React from "react"

import { useState, useRef, useEffect } from "react"
import LoadWrapper from "../../common/LoadWrapper"

interface Message {
  type: "request" | "response"
  content: string
  sent_at: string
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
  handleLoadMessage: () => void
  isEndOfList: boolean
}

export default function ChatInterface({ messages, onSendMessage, isLoading, handleLoadMessage, isEndOfList }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSending, setIsSending] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setIsSending(true)
      await onSendMessage(input)
      setIsSending(false)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      setInput("")
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!isSending) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [isSending])

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 1000)
  }, [])

  console.log(messages);

  return (
    <div className="flex w-full flex-col flex-1">
      <div className="p-4 text-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">UML AI Assistant</h1>
      </div>

      <div className="flex-col max-h-[calc(100vh-190px)] justify-end h-full overflow-y-auto pt-2">
        <div className="space-y-4">
          {!isEndOfList && <LoadWrapper
            onLoad={handleLoadMessage}
            scrollContainerRef={containerRef}
          >
            <div></div>
          </LoadWrapper>}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "request" ? "justify-end pr-4" : "justify-start pl-4"} `}
              
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${message.type === "request"
                  ? "bg-gray-800 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
              >
                {message.content === "__loading__" ? (
                  <div className="flex items-center gap-2">
                    <span className="flex space-x-1">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:.1s]"></span>
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:.2s]"></span>
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:.3s]"></span>
                    </span>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            className="p-2 text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={!input.trim()}
          >
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
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
