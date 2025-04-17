'use client'
import {
    Mic,
    SendHorizontal,
    Plus,
    Globe,
    Lightbulb,
    MoreHorizontal,
} from 'lucide-react'
import type React from 'react'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePromptToAIMutation } from '@/store/feature/ai/aiAPI'
import { useDispatch } from 'react-redux'
import { setStart } from '@/store/feature/start/start'
import LoadingOverlay from '@/components/core/common/LoadingOverlay'

// Define UML element types for background animations
type UMLElement = {
    id: number
    type: 'class' | 'arrow' | 'connection' | 'entity'
    x: number
    y: number
    size: number
    rotation: number
    opacity: number
    delay: number
}

const examplePrompts = [
    {
        icon: <Globe className="h-5 w-5" />,
        text: 'Create a database schema for a social media platform',
        delay: 0.7,
    },
    {
        icon: <Lightbulb className="h-5 w-5" />,
        text: 'Generate a sequence diagram for user authentication',
        delay: 0.8,
    },
    {
        icon: <MoreHorizontal className="h-5 w-5" />,
        text: 'Design a class hierarchy for a vehicle rental system',
        delay: 0.9,
    },
    {
        icon: <Mic className="h-5 w-5" />,
        text: 'Create API endpoints for a blog platform',
        delay: 1.0,
    },
]

export default function UMLChatEntry() {
    const router = useRouter()
    const [umlElements, setUmlElements] = useState<UMLElement[]>([])
    const [messageContent, setMessageContent] = useState<string>('')

    const [promptToAi, { isLoading }] = usePromptToAIMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setStart(false))
    }, [])

    const handleSubmit = async () => {
        if (messageContent.trim()) {
            const data = await promptToAi({ prompt: messageContent }).unwrap()
            dispatch(setStart(true))
            router.push('/chat/' + data?.body?.historyId)
        }
    }

    
    const handleSubmitExample = async ({ message }: { message: string }) => {
        const data = await promptToAi({ prompt: message }).unwrap()
        dispatch(setStart(true))
        router.push('/chat/' + data?.body?.historyId)
    }

    // Generate random UML elements for the background
    useEffect(() => {
        const elements: UMLElement[] = []
        const types: ('class' | 'arrow' | 'connection' | 'entity')[] = [
            'class',
            'arrow',
            'connection',
            'entity',
        ]

        for (let i = 0; i < 30; i++) {
            elements.push({
                id: i,
                type: types[Math.floor(Math.random() * types.length)],
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 40 + 25, // Increased size
                rotation: Math.random() * 360,
                opacity: Math.random() * 0.25 + 0.15, // Increased opacity
                delay: Math.random() * 5,
            })
        }

        setUmlElements(elements)
    }, [])

    return (
        <>
            <LoadingOverlay
                isLoading={isLoading}
                message="On the way you go with me..."
                opacity={0.6}
                showSpinner={true}
                zIndex={100}
            />
            <div className="relative z-10 flex min-h-full flex-col items-center justify-center overflow-hidden bg-white text-gray-800">
                {/* Animated background elements */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    {umlElements.map((element) => (
                        <BackgroundElement key={element.id} element={element} />
                    ))}

                    {/* Animated gradient overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-gray-50/20 to-gray-100/20"
                        animate={{
                            background: [
                                'linear-gradient(to bottom right, rgba(249, 250, 251, 0.2), rgba(243, 244, 246, 0.2))',
                                'linear-gradient(to bottom right, rgba(243, 244, 246, 0.2), rgba(249, 250, 251, 0.2))',
                                'linear-gradient(to bottom right, rgba(249, 250, 251, 0.2), rgba(243, 244, 246, 0.2))',
                            ],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                        }}
                    />

                    {/* Connecting lines animation */}
                    <svg className="absolute inset-0 h-full w-full">
                        <ConnectingLines />
                    </svg>
                </div>

                {/* Main content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="z-10"
                >
                    <h1 className="mb-8 text-center text-4xl font-bold">
                        What can I help with?
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex w-full max-w-3xl items-center gap-4 rounded-2xl border border-gray-300 bg-white/80 px-6 py-4 shadow-md backdrop-blur-sm"
                    >
                        <Plus className="cursor-pointer text-gray-800" />

                        <input
                            type="text"
                            placeholder="Ask anything about UML diagrams or code generation..."
                            className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 outline-none"
                            onChange={(e) => setMessageContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault(); 
                                  handleSubmit();
                                }
                              }}
                        />

                        <button
                            onClick={() => {
                                handleSubmit()
                            }}
                            className="rounded-full p-2 transition hover:bg-gray-200"
                        >
                            <SendHorizontal className="text-gray-800" />
                        </button>
                    </motion.div>

                    {/* Example prompts */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-8 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2"
                    >
                        {examplePrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    handleSubmitExample({
                                        message: prompt.text,
                                    })
                                }
                                className="cursor-pointer"
                            >
                                <ExamplePrompt
                                    icon={prompt.icon}
                                    text={prompt.text}
                                    delay={prompt.delay}
                                />
                            </button>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}

// Background UML element component
function BackgroundElement({ element }: { element: UMLElement }) {
    return (
        <motion.div
            className="absolute"
            style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
            }}
            initial={{ opacity: 0, scale: 0.5, rotate: element.rotation }}
            animate={{
                opacity: element.opacity,
                scale: 1,
                rotate: element.rotation + 360,
                x: [0, 25, 0, -25, 0], // Increased movement range
                y: [0, -25, 0, 25, 0], // Increased movement range
            }}
            transition={{
                opacity: { duration: 1, delay: element.delay },
                scale: { duration: 1, delay: element.delay },
                rotate: {
                    duration: 40,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                },
                x: {
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                },
                y: {
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                },
            }}
        >
            {element.type === 'class' && (
                <div
                    className="rounded-md border-2 border-gray-400 bg-gray-100 shadow-sm"
                    style={{
                        width: `${element.size * 2}px`,
                        height: `${element.size}px`,
                    }}
                />
            )}
            {element.type === 'entity' && (
                <div
                    className="rounded-full border-2 border-gray-400 bg-gray-100 shadow-sm"
                    style={{
                        width: `${element.size}px`,
                        height: `${element.size}px`,
                    }}
                />
            )}
            {element.type === 'arrow' && (
                <div
                    className="border-t-2 border-gray-400"
                    style={{
                        width: `${element.size * 2}px`,
                        height: '2px',
                        transform: 'rotate(45deg)',
                    }}
                >
                    <div className="h-4 w-4 rotate-45 transform border-r-2 border-t-2 border-gray-400" />
                </div>
            )}
            {element.type === 'connection' && (
                <div
                    className="border-2 border-dashed border-gray-400"
                    style={{ width: `${element.size * 3}px`, height: '2px' }}
                />
            )}
        </motion.div>
    )
}

// Connecting lines animation
function ConnectingLines() {
    const [points, setPoints] = useState<
        { x: number; y: number; vx: number; vy: number }[]
    >([])

    useEffect(() => {
        // Create random points
        const newPoints = Array.from({ length: 20 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.7, // Increased speed
            vy: (Math.random() - 0.5) * 0.7, // Increased speed
        }))

        setPoints(newPoints)

        // Animation loop for moving points
        const interval = setInterval(() => {
            setPoints((prevPoints) =>
                prevPoints.map((point) => {
                    const newX = point.x + point.vx
                    const newY = point.y + point.vy

                    // Bounce off edges
                    if (newX < 0 || newX > window.innerWidth) point.vx *= -1
                    if (newY < 0 || newY > window.innerHeight) point.vy *= -1

                    return {
                        ...point,
                        x: point.x + point.vx,
                        y: point.y + point.vy,
                    }
                }),
            )
        }, 50)

        return () => clearInterval(interval)
    }, [])

    // Generate lines between points that are close to each other
    const lines = []
    const maxDistance = 250 // Increased connection distance

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x
            const dy = points[i].y - points[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < maxDistance) {
                const opacity = 1 - distance / maxDistance
                lines.push(
                    <line
                        key={`${i}-${j}`}
                        x1={points[i].x}
                        y1={points[i].y}
                        x2={points[j].x}
                        y2={points[j].y}
                        stroke={`rgba(180, 180, 180, ${opacity * 0.7})`} // Darker color and higher opacity
                        strokeWidth="1.5" // Thicker lines
                    />,
                )
            }
        }
    }

    return (
        <>
            {lines}
            {points.map((point, index) => (
                <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="rgba(160, 160, 160, 0.7)"
                /> // Larger and darker points
            ))}
        </>
    )
}

// Example prompt component
function ExamplePrompt({
    icon,
    text,
    delay,
}: {
    icon: React.ReactNode
    text: string
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white/70 p-3 backdrop-blur-sm transition hover:bg-gray-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="rounded-full bg-gray-100 p-2">{icon}</div>
            <p className="text-sm text-gray-700">{text}</p>
        </motion.div>
    )
}
