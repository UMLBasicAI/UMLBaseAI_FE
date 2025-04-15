'use client'

import Header from '@/components/core/common/Header'
import CodePreview from '@/components/core/elements/CodePreview'
import MessageBox from '@/components/core/elements/MessageBox'
import Slider from '@/components/core/elements/SliderChat'
import { useEffect, useRef, useState } from 'react'

export default function Home({ chatId }: { chatId: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    return (
        <main
            ref={containerRef}
            className="flex h-screen overflow-hidden bg-gray-50"
        >
            <Slider />
            <>
                <MessageBox chatId={chatId} />
                <CodePreview />
            </>
        </main>
    )
}
