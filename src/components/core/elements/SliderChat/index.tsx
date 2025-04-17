"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import type React from "react"
import ChatHistory from "./history-chat"
import { useGetHistoriesQuery, useLazyGetHistoriesQuery } from "@/store/feature/history/historyApi"
import { History } from "@/store/feature/history/history"
import webStorageClient from "@/utils/webStorageClient"

export default function Slider() {
  // Default width for the left sidebar
  const defaultLeftWidth = 280
  const minLeftWidth = 180
  const maxLeftWidth = 500

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const leftSidebarRef = useRef<HTMLDivElement>(null)
  const initialLeftWidthRef = useRef(defaultLeftWidth)
  const initialClientXRef = useRef(0)
  const [page, setPage] = useState<number>(1);
  const [chatHistory, setChatHistory] = useState<History[]>([]);
  const [getHistories, {data, isFetching}] = useLazyGetHistoriesQuery();
  const token = webStorageClient.getToken();
  useEffect(() => {
    const handleLoadHistories = async () => {
      const response = await getHistories({page, size: 8}).unwrap();
      console.log(response)
      setChatHistory([...chatHistory, ...response.body.histories]);
    }
    if(token) {
      handleLoadHistories()
    }
  }, [page])
  console.log(chatHistory);

  const startResizingLeft = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingLeft(true)
    initialLeftWidthRef.current = leftWidth
    initialClientXRef.current = e.clientX
    document.body.style.cursor = "col-resize"
  }

  // Handle resizing logic
  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (isResizingLeft) {
        const deltaX = e.clientX - initialClientXRef.current
        const newWidth = Math.min(Math.max(initialLeftWidthRef.current + deltaX, minLeftWidth), maxLeftWidth)
        setLeftWidth(newWidth)

        // Update CSS variable for smooth transitions
        document.documentElement.style.setProperty("--left-width", `${newWidth}px`)
      }
    }

    const stopResizing = () => {
      setIsResizingLeft(false)
      document.body.style.cursor = ""
    }

    if (isResizingLeft) {
      window.addEventListener("mousemove", handleResize)
      window.addEventListener("mouseup", stopResizing)
    }

    return () => {
      window.removeEventListener("mousemove", handleResize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [isResizingLeft])

  // Set initial CSS variable for left sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty("--left-width", `${leftWidth}px`)
  }, [])

  // Toggle left sidebar with animation
  const toggleLeftSidebar = () => {
    if (leftSidebarOpen) {
      // Store the current width before closing
      initialLeftWidthRef.current = leftWidth
      setLeftSidebarOpen(false)
    } else {
      // Restore the previous width when opening
      setLeftSidebarOpen(true)
      // We'll let the CSS transition handle the animation
    }
  }

  return (
    <div className="flex h-full" style={{zIndex: 100}}>
      {/* Left Sidebar */}
      <div
        ref={leftSidebarRef}
        style={{
          width: leftSidebarOpen ? `var(--left-width)` : "0px",
          opacity: leftSidebarOpen ? 1 : 0,
          visibility: leftSidebarOpen ? "visible" : "hidden",
        }}
        className="relative flex flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out"
      >
        <div className="h-full overflow-auto">
          <ChatHistory chatHistory={chatHistory!} />
        </div>
        {/* Right resize handle for left sidebar */}
        <div
          onMouseDown={startResizingLeft}
          className={`group absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize ${
            isResizingLeft ? "bg-gray-400" : "hover:bg-gray-300"
          }`}
        >
          <div
            className={`absolute inset-0 -right-1.5 w-4 group-hover:bg-gray-300/20 ${
              isResizingLeft ? "bg-gray-300/20" : ""
            }`}
          ></div>
          <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-400 opacity-0 group-hover:opacity-100"></div>
        </div>
      </div>

      {/* Left sidebar toggle button */}
      <button
        onClick={toggleLeftSidebar}
        className={`absolute left-0 top-1/2 z-20 -translate-y-1/2 transform rounded-r-md border border-gray-200 bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none transition-all duration-300 ${
          leftSidebarOpen ? "" : "translate-x-0"
        }`}
        style={{
          left: leftSidebarOpen ? `var(--left-width)` : "0",
        }}
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
    </div>
  )
}
