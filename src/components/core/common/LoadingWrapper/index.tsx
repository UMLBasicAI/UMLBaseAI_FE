"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface LoadWrapperProps {
  children: React.ReactNode
  onLoad: () => void
  scrollContainerRef: React.RefObject<HTMLDivElement>
}

export default function LoadWrapper({ children, onLoad, scrollContainerRef }: LoadWrapperProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!targetRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoad()
        }
      },
      { threshold: 0.1 },
    )

    observerRef.current.observe(targetRef.current)

    return () => {
      if (observerRef.current && targetRef.current) {
        observerRef.current.unobserve(targetRef.current)
      }
    }
  }, [onLoad])

  return (
    <motion.div
      ref={targetRef}
      className="flex justify-center py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-6 w-6 border-2 border-gray-300 border-t-gray-800 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      {children}
    </motion.div>
  )
}
