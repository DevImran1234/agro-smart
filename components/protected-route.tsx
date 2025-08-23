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
    if (!isLoading) {
      if (!user) {
        console.log("[v0] No user found, redirecting to login")
        router.push("/login")
        return
      }

      if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
        console.log("[v0] User role not allowed, redirecting to unauthorized")
        router.push("/unauthorized")
        return
      }
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role as Role))) {
    return null
  }

  return <>{children}</>
}
