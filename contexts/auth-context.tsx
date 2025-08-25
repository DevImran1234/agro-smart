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
      console.log("[Auth] Attempting login for:", email)
      const response = await AuthService.login({ email, password })
      console.log("[Auth] Login response:", response)

      AuthService.setToken(response.token)
      AuthService.setUser(response.user)
      setUser(response.user)

      console.log("[Auth] User set after login:", response.user)
      console.log("[Auth] Token stored:", !!response.token)
      console.log("[Auth] Auth context user state updated:", response.user)
      
      // Verify the user was stored correctly
      const storedUser = AuthService.getUser()
      const storedToken = AuthService.getToken()
      console.log("[Auth] Verification - Stored user:", storedUser)
      console.log("[Auth] Verification - Stored token:", !!storedToken)
    } catch (error) {
      console.error("[Auth] Login error:", error)
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
