import React from 'react'
import Link from 'next/link'
import { FiHome, FiAlertCircle } from 'react-icons/fi'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md border border-gray-200 hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-center mb-6">
                    <FiAlertCircle className="w-20 h-20 text-gray-800 animate-pulse" />
                </div>
                <h1 className="text-7xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 text-transparent bg-clip-text mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    The page you are looking for might have been removed, 
                    had its name changed, or is temporarily unavailable.
                </p>
                <Link 
                    href="/" 
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <FiHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
    )
}
