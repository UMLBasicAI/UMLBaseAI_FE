'use client'
import type { IUserInfo } from '@/store/feature/auth/auth'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
    user: IUserInfo | null
    login: (userData: IUserInfo) => void
    logout: () => void
}

// Tạo context mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const router = useRouter()
    const [user, setUser] = useState<IUserInfo | null>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = (userData: IUserInfo) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        router.push('/')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
