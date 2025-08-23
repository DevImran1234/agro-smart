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

    console.log("[v0] Auth context initialization:", { token: !!token, savedUser })

    if (token && savedUser) {
      setUser(savedUser)
      console.log("[v0] User loaded from localStorage:", savedUser)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password })
      console.log("[v0] Login response:", response)

      AuthService.setToken(response.token)
      AuthService.setUser(response.user)
      setUser(response.user)

      console.log("[v0] User set after login:", response.user)
    } catch (error) {
      console.log("[v0] Login error:", error)
      throw error
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
    console.log("[v0] User logged out")
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
