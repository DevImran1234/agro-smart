"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Leaf, Home, FileText, Bell, Settings, LogOut, Menu, X, User, History, Users, MapPin, Search, Bot } from "lucide-react"
import { RoutePreloader, FastLink } from "@/components/route-optimizer"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  console.log("[DashboardLayout] Rendering with user:", user?.role, "title:", title)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

 const getNavigation = () => {
  console.log("[DashboardLayout] Getting navigation for user role:", user?.role)

  let baseNav = []

  if (user?.role === "farmer") {
    baseNav = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]
  } else if (user?.role === "employee") {
    baseNav = [
      { name: "Dashboard", href: "/employee/dashboard", icon: Home },
      { name: "Reports", href: "/employee/dashboard/reports", icon: FileText },
      { name: "History", href: "/employee/dashboard/history", icon: History },
      { name: "Notifications", href: "/employee/dashboard/notifications", icon: Bell },
      { name: "Settings", href: "/employee/dashboard/settings", icon: Settings },
    ]
  } else if (user?.role === "admin") {
    baseNav = [
      { name: "Dashboard", href: "/admin/dashboard", icon: Home },
      { name: "Reports", href: "/admin/dashboard/reports", icon: FileText },
      { name: "User Analytics", href: "/admin/dashboard/user-analytics", icon: Users },
      { name: "Employee Locations", href: "/admin/dashboard/employee-locations", icon: MapPin },
      { name: "Location Search", href: "/admin/dashboard/location-search", icon: Search },
      { name: "Gemini AI", href: "/admin/dashboard/gemini", icon: Bot },
      { name: "Notifications", href: "/admin/dashboard/notifications", icon: Bell },
      { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
    ]
  }

  console.log("[DashboardLayout] Final navigation:", baseNav)
  return baseNav
}

  const navigation = getNavigation()

  return (
    <div className="min-h-screen bg-background">
      <RoutePreloader />
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-full p-2">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Smart Agro</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-card lg:border-r lg:border-border lg:block">
        <div className="flex items-center space-x-2 p-4 border-b border-border">
          <div className="bg-primary rounded-full p-2">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Smart Agro</span>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-background border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user?.username} ({user?.role})
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
