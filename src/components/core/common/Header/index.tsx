'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
    const router = useRouter()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen)

    //
    const { user, logout } = useAuth()
    const handleLogin = () => {
        router.push('/signIn')
    }
    return (
        <nav className="relative z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
            <div className="flex items-center">
                <div className="flex items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-800"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="text-lg font-semibold text-gray-800">
                        UMLBasicAI
                    </span>
                </div>
            </div>

            <div className="hidden items-center space-x-4 md:flex">
                <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800">
                    Home
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800">
                    About
                </button>
            </div>

            <div className="flex items-center">
                {user != null ? (
                    <div className="relative">
                        <button
                            onClick={toggleUserDropdown}
                            className="flex items-center space-x-2 focus:outline-none"
                            aria-expanded={isUserDropdownOpen}
                            aria-haspopup="true"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                                {user?.avatarUrl ? (
                                    <img
                                        src={
                                            user?.avatarUrl ||
                                            '/placeholder.svg'
                                        }
                                        alt={user?.displayName}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-medium">
                                        {user?.displayName?.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <span className="hidden text-sm font-medium text-gray-700 sm:inline-block">
                                {user?.displayName}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        {isUserDropdownOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                                <div className="border-b border-gray-100 px-4 py-3">
                                    <p className="text-sm font-medium text-gray-800">
                                        {user?.displayName}
                                    </p>
                                    <p className="truncate text-xs text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>

                                <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 text-gray-500"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle
                                                cx="12"
                                                cy="7"
                                                r="4"
                                            ></circle>
                                        </svg>
                                        Your Profile
                                    </div>
                                </button>
                                <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 text-gray-500"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                            ></circle>
                                            <path d="M12 8v4"></path>
                                            <path d="M12 16h.01"></path>
                                        </svg>
                                        Help & Support
                                    </div>
                                </button>
                                <div className="my-1 border-t border-gray-100"></div>
                                <button
                                    onClick={logout}
                                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 text-red-500"
                                        >
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line
                                                x1="21"
                                                y1="12"
                                                x2="9"
                                                y2="12"
                                            ></line>
                                        </svg>
                                        Sign Out
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <button
                            className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                            onClick={handleLogin}
                        >
                            Sign In
                        </button>
                        <button className="rounded-md bg-gray-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700">
                            Sign Up
                        </button>
                    </div>
                )}

                <div className="relative ml-2 md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="rounded-md p-1.5 text-gray-700 hover:bg-gray-100"
                        aria-expanded={isMenuOpen}
                        aria-haspopup="true"
                    >
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
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                Home
                            </button>
                            <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                About
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
