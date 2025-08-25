"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Leaf, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("[Login] Form submitted, attempting login...")
      console.log("[Login] Email:", email, "Password length:", password.length)
      await login(email, password)
      console.log("[Login] Login successful, processing redirect...")

      // get user from localStorage after login
      const storedUser = localStorage.getItem("user")
      console.log("[Login] Stored user from localStorage:", storedUser)
      
      if (storedUser) {
        const user = JSON.parse(storedUser)
        console.log("[Login] Parsed user object:", user)
        console.log("[Login] User role:", user.role)

        switch (user.role) {
          case "admin":
            console.log("[Login] Redirecting admin to /admin/dashboard")
            // Add a small delay to ensure user data is properly stored
            setTimeout(() => {
              console.log("[Login] Executing admin redirect...")
              try {
                router.push("/admin/dashboard")
                console.log("[Login] Router.push called for admin")
              } catch (error) {
                console.error("[Login] Router error, using window.location:", error)
                window.location.href = "/admin/dashboard"
              }
            }, 100)
            break
          case "employee":
            console.log("[Login] Redirecting employee to /employee/dashboard")
            setTimeout(() => {
              try {
                router.push("/employee/dashboard")
              } catch (error) {
                console.error("[Login] Router error, using window.location:", error)
                window.location.href = "/employee/dashboard"
              }
            }, 100)
            break
          case "farmer":
            console.log("[Login] Redirecting farmer to /dashboard")
            setTimeout(() => {
              try {
                router.push("/dashboard")
              } catch (error) {
                console.error("[Login] Router error, using window.location:", error)
                window.location.href = "/dashboard"
              }
            }, 100)
            break
          default:
            console.log("[Login] Unknown role, redirecting to /unauthorized")
            setTimeout(() => {
              try {
                router.push("/unauthorized")
              } catch (error) {
                console.error("[Login] Router error, using window.location:", error)
                window.location.href = "/unauthorized"
              }
            }, 100)
        }
      } else {
        console.log("[Login] No stored user found, redirecting to /dashboard")
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">AgriManage</h1>
          <p className="text-muted-foreground">Sign in to your agricultural management account</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="farmer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
