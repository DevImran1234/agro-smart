"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, AuthService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = AuthService.getToken()
    const savedUser = AuthService.getUser()

    if (token && savedUser) {
      setUser(savedUser)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password })
      AuthService.setToken(response.token)
      AuthService.setUser(response.user)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
