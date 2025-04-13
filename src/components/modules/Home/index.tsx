'use client'

import Header from '@/components/core/common/Header'
import CodePreview from '@/components/core/elements/CodePreview'
import MessageBox from '@/components/core/elements/MessageBox'
import Slider from '@/components/core/elements/SliderChat'
import { useEffect, useRef, useState } from 'react'

export default function Home({ chatId }: { chatId: string }) {
    // // Default widths for the panels
    // const [leftWidth, setLeftWidth] = useState(260) // 260px default width
    // const [rightWidth, setRightWidth] = useState(380) // 380px default width

    // // Track resizing state
    // const [isResizingLeft, setIsResizingLeft] = useState(false)
    // const [isResizingRight, setIsResizingRight] = useState(false)

    // Refs for resize handling
    const containerRef = useRef<HTMLDivElement>(null)

    // const stopResizing = () => {
    //     setIsResizingLeft(false)
    //     setIsResizingRight(false)
    // }

    // // Resize panels based on mouse movement
    // const resize = (e: MouseEvent) => {
    //     if (isResizingLeft && containerRef.current) {
    //         const containerRect = containerRef.current.getBoundingClientRect()
    //         const newWidth = Math.max(
    //             200,
    //             Math.min(
    //                 e.clientX - containerRect.left,
    //                 containerRect.width * 0.3,
    //             ),
    //         )
    //         setLeftWidth(newWidth)
    //     }

    //     if (isResizingRight && containerRef.current) {
    //         const containerRect = containerRef.current.getBoundingClientRect()
    //         const newWidth = Math.max(
    //             300,
    //             Math.min(
    //                 containerRect.right - e.clientX,
    //                 containerRect.width * 0.7,
    //             ),
    //         )
    //         setRightWidth(newWidth)
    //     }
    // }

    // // Set up event listeners for resizing
    // useEffect(() => {
    //     if (isResizingLeft || isResizingRight) {
    //         document.body.style.cursor = 'col-resize'
    //         document.body.style.userSelect = 'none'

    //         const handleResize = (e: MouseEvent) => {
    //             // Use requestAnimationFrame for smoother resizing
    //             window.requestAnimationFrame(() => resize(e))
    //         }

    //         window.addEventListener('mousemove', handleResize)
    //         window.addEventListener('mouseup', stopResizing)

    //         return () => {
    //             window.removeEventListener('mousemove', handleResize)
    //             window.removeEventListener('mouseup', stopResizing)
    //         }
    //     } else {
    //         document.body.style.removeProperty('cursor')
    //         document.body.style.removeProperty('user-select')
    //     }
    // }, [isResizingLeft, isResizingRight])
    return (
        <main
            ref={containerRef}
            className="flex h-screen overflow-hidden bg-gray-50"
            // style={
            //     {
            //         // Use CSS variables for smoother transitions
            //         '--left-width': `${leftWidth}px`,
            //         '--right-width': `${rightWidth}px`,
            //     } as React.CSSProperties
            // }
        >
            <Slider />
            <>
                <MessageBox chatId={chatId} />
                <CodePreview />
            </>
        </main>
    )
}
