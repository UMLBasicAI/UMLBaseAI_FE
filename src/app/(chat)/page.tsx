"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import webStorageClient from "@/utils/webStorageClient"

// Define UML element types for background animations
type UMLElement = {
  id: number
  type: "class" | "arrow" | "connection" | "entity"
  x: number
  y: number
  size: number
  rotation: number
  opacity: number
  delay: number
}

export default function RootPage() {
  const router = useRouter()
  const [umlElements, setUmlElements] = useState<UMLElement[]>([])

  const userToken = webStorageClient.getToken()
  if (userToken) {
    router.push("/chat")
  }

  const handleStart = () => {
    if (userToken) {
      router.push("/chat")
    } else {
      router.push("/sign-in")
    }
  }

  // Generate random UML elements for the background
  useEffect(() => {
    const elements: UMLElement[] = []
    const types: ("class" | "arrow" | "connection" | "entity")[] = ["class", "arrow", "connection", "entity"]

    for (let i = 0; i < 25; i++) { // Increased number of elements
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
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* UML Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {umlElements.map((element) => (
          <BackgroundElement key={element.id} element={element} />
        ))}

        {/* Connecting lines animation */}
        <svg className="absolute inset-0 w-full h-full">
          <ConnectingLines />
        </svg>
      </div>

      {/* Original background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gray-200 opacity-20"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 0.2, 0.15],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: Math.random() * 5 + 5,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative max-w-[1440px] overflow-hidden rounded-xl bg-white bg-opacity-15 backdrop-blur-sm p-10 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundImage: "radial-gradient(circle at 100% 100%, rgba(229, 231, 235, 0.4) 0%, transparent 50%)",
        }}
      >
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gray-100 opacity-50" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gray-100 opacity-30" />

        <div className="relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <motion.h1
              className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            >
              UMLBasicAI
            </motion.h1>
            <motion.div
              className="mt-3 h-1 w-20 bg-gradient-to-r from-gray-700 to-gray-400"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
            <motion.p
              className="mt-4 text-xl font-light text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              UML Diagram Generator with AI Assistance
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <p className="text-lg leading-relaxed text-gray-700">
              Create, manage, and generate code from UML diagrams with intelligent AI assistance. Simplify your software
              design process and boost productivity with our intuitive tools.
            </p>
          </motion.div>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Key Features</h2>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Intuitive UML diagram creation",
                "AI-powered code generation",
                "Real-time collaboration",
                "Multiple export formats",
                "Version control integration",
                "Smart diagram suggestions",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start rounded-lg p-3 transition-colors hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            <motion.button
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gray-800 to-gray-600 px-10 py-4 text-lg font-medium text-white shadow-lg transition-all"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStart()}
            >
              <span className="relative z-10">Get Started</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-500 opacity-0 transition-opacity group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ type: "tween", duration: 0.4 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
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
        rotate: { duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        x: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        y: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }}
    >
      {element.type === "class" && (
        <div
          className="border-2 border-gray-400 rounded-md bg-gray-100 shadow-sm"
          style={{ width: `${element.size * 2}px`, height: `${element.size}px` }}
        />
      )}
      {element.type === "entity" && (
        <div
          className="border-2 border-gray-400 rounded-full bg-gray-100 shadow-sm"
          style={{ width: `${element.size}px`, height: `${element.size}px` }}
        />
      )}
      {element.type === "arrow" && (
        <div
          className="border-t-2 border-gray-400"
          style={{ width: `${element.size * 2}px`, height: "2px", transform: "rotate(45deg)" }}
        >
          <div className="border-t-2 border-r-2 border-gray-400 w-4 h-4 transform rotate-45" />
        </div>
      )}
      {element.type === "connection" && (
        <div
          className="border-dashed border-2 border-gray-400"
          style={{ width: `${element.size * 3}px`, height: "2px" }}
        />
      )}
    </motion.div>
  )
}

// Connecting lines animation
function ConnectingLines() {
  const [points, setPoints] = useState<{ x: number; y: number; vx: number; vy: number }[]>([])

  useEffect(() => {
    // Create random points
    const newPoints = Array.from({ length: 18 }, () => ({ // Increased number of points
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6, // Increased speed
      vy: (Math.random() - 0.5) * 0.6, // Increased speed
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
            stroke={`rgba(160, 160, 160, ${opacity * 0.7})`} // Darker color and higher opacity
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
        <circle key={index} cx={point.x} cy={point.y} r="3" fill="rgba(140, 140, 140, 0.7)" /> // Larger and darker points
      ))}
    </>
  )
}
