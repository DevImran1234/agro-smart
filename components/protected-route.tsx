"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

type Role = "farmer" | "employee" | "admin"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("[ProtectedRoute] Effect triggered:", { user, isLoading, allowedRoles })
    
    if (!isLoading) {
      if (!user) {
        console.log("[ProtectedRoute] No user found, redirecting to login")
        router.push("/login")
        return
      }

      if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
        console.log("[ProtectedRoute] User role not allowed, redirecting to unauthorized")
        console.log("[ProtectedRoute] User role:", user.role, "Allowed roles:", allowedRoles)
        router.push("/unauthorized")
        return
      }
      
      console.log("[ProtectedRoute] User authenticated and authorized:", user.role)
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading) {
    console.log("[ProtectedRoute] Still loading, showing spinner")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role as Role))) {
    console.log("[ProtectedRoute] User not authenticated or not authorized, returning null")
    console.log("[ProtectedRoute] User:", user, "Allowed roles:", allowedRoles)
    return null
  }
  
  console.log("[ProtectedRoute] Rendering protected content for user:", user.role)

  return <>{children}</>
}
