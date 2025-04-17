"use client"
import { motion } from "framer-motion"

interface LoadingOverlayProps {
  isLoading?: boolean
  message?: string
  opacity?: number
  showSpinner?: boolean
  zIndex?: number
}

export default function LoadingOverlay({
  isLoading = true,
  message,
  opacity = 0.7,
  showSpinner = true,
  zIndex = 50,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        zIndex,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {showSpinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SpinnerAnimation />
          </motion.div>
        )}

        {message && (
          <motion.div
            className="text-white text-center max-w-xs px-4 py-2 rounded-md bg-black bg-opacity-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {message}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function SpinnerAnimation() {
  return (
    <div className="relative h-16 w-16">
      {/* Outer spinner */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-t-gray-100 border-r-gray-100 border-b-gray-100 border-l-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Inner spinner */}
      <motion.div
        className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-gray-300 border-b-gray-300 border-l-gray-300"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Center dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0.8, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="h-2 w-2 rounded-full bg-white" />
      </motion.div>
    </div>
  )
}
