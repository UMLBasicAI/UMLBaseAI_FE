"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import CodePreviewComponent from "./code-preview"


export default function CodePreview() {
  // Default width for the right sidebar
  const defaultRightWidth = 400
  const minRightWidth = 200
  const maxRightWidth = 800

  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const [rightWidth, setRightWidth] = useState(defaultRightWidth)
  const rightSidebarRef = useRef<HTMLDivElement>(null)
  const initialRightWidthRef = useRef(defaultRightWidth)
  const initialClientXRef = useRef(0)

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

  // Start resizing the right sidebar
  const startResizingRight = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingRight(true)
    initialRightWidthRef.current = rightWidth
    initialClientXRef.current = e.clientX
    document.body.style.cursor = "col-resize"
  }

  // Handle resizing logic
  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (isResizingRight) {
        const deltaX = initialClientXRef.current - e.clientX
        const newWidth = Math.min(Math.max(initialRightWidthRef.current + deltaX, minRightWidth), maxRightWidth)
        setRightWidth(newWidth)

        // Update CSS variable for smooth transitions
        document.documentElement.style.setProperty("--right-width", `${newWidth}px`)
      }
    }

    const stopResizing = () => {
      setIsResizingRight(false)
      document.body.style.cursor = ""
    }

    if (isResizingRight) {
      window.addEventListener("mousemove", handleResize)
      window.addEventListener("mouseup", stopResizing)
    }

    return () => {
      window.removeEventListener("mousemove", handleResize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [isResizingRight])

  // Set initial CSS variable for right sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty("--right-width", `${rightWidth}px`)
  }, [])

  // Toggle right sidebar with animation
  const toggleRightSidebar = () => {
    if (rightSidebarOpen) {
      // Store the current width before closing
      initialRightWidthRef.current = rightWidth
      setRightSidebarOpen(false)
    } else {
      // Restore the previous width when opening
      setRightSidebarOpen(true)
      // We'll let the CSS transition handle the animation
    }
  }

  return (
    <div className="flex h-full">
      <div
        onMouseDown={startResizingRight}
        className={`group relative z-10 h-full w-1.5 cursor-col-resize ${
          isResizingRight ? "bg-gray-400" : "hover:bg-gray-300"
        }`}
      >
        <div
          className={`absolute inset-0 -left-1.5 w-4 group-hover:bg-gray-300/20 ${
            isResizingRight ? "bg-gray-300/20" : ""
          }`}
        ></div>
        <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-400 opacity-0 group-hover:opacity-100"></div>
      </div>

      {/* Right Sidebar - Code Preview */}
      <div
        ref={rightSidebarRef}
        style={{
          width: rightSidebarOpen ? `var(--right-width)` : "0px",
          opacity: rightSidebarOpen ? 1 : 0,
          visibility: rightSidebarOpen ? "visible" : "hidden",
        }}
        className="relative overflow-hidden border-l border-gray-200 bg-white transition-all duration-300 ease-in-out"
      >
        <div className="h-full overflow-auto">
          <CodePreviewComponent code={currentCode} />
        </div>
      </div>

      {/* Right sidebar toggle button */}
      <button
        onClick={toggleRightSidebar}
        className={`absolute right-0 top-1/2 z-20 -translate-y-1/2 transform rounded-l-md border border-gray-200 bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none transition-all duration-300 ${
          rightSidebarOpen ? "" : "translate-x-0"
        }`}
        style={{
          right: rightSidebarOpen ? `var(--right-width)` : "0",
        }}
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
    </div>
  )
}
