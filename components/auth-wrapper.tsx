"use client"

import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
