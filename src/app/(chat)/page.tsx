'use client'
import React from 'react'
import { Metadata } from 'next'
import { motion } from "framer-motion"
import webLocalStorage from '@/utils/webLocalStorage'
import { useRouter } from 'next/navigation'

export default function RootPage() {
    const router = useRouter()
    const user = webLocalStorage.get('user')
    if (user) {
        router.push('/chat')
    }
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
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
        className="relative max-w-[1440px] overflow-hidden rounded-xl bg-white p-10 shadow-xl"
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
