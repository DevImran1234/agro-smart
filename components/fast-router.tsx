"use client"
import { useEffect, useCallback, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { create } from "zustand"

// Route cache store for instant navigation
interface RouteCache {
  routes: Map<string, any>
  preloaded: Set<string>
  addRoute: (path: string, data: any) => void
  getRoute: (path: string) => any
  isPreloaded: (path: string) => boolean
  markPreloaded: (path: string) => void
}

const useRouteCache = create<RouteCache>((set, get) => ({
  routes: new Map(),
  preloaded: new Set(),
  addRoute: (path, data) => {
    set((state) => {
      const newRoutes = new Map(state.routes)
      newRoutes.set(path, data)
      return { routes: newRoutes }
    })
  },
  getRoute: (path) => get().routes.get(path),
  isPreloaded: (path) => get().preloaded.has(path),
  markPreloaded: (path) => {
    set((state) => {
      const newPreloaded = new Set(state.preloaded)
      newPreloaded.add(path)
      return { preloaded: newPreloaded }
    })
  },
}))

// Fast navigation hook
export function useFastNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { addRoute, getRoute, isPreloaded, markPreloaded } = useRouteCache()

  // Preload critical routes
  const preloadRoutes = useCallback(() => {
    const criticalRoutes = [
      "/admin/dashboard",
      "/admin/dashboard/user-analytics",
      "/admin/dashboard/reports",
      "/admin/dashboard/products",
      "/admin/dashboard/notifications",
      "/admin/dashboard/gemini",
      "/admin/dashboard/employee-locations",
      "/admin/dashboard/location-search",
    ]

    criticalRoutes.forEach((route) => {
      if (!isPreloaded(route)) {
        // Preload the route data
        fetch(route, { method: "HEAD" })
          .then(() => markPreloaded(route))
          .catch(() => {})
      }
    })
  }, [isPreloaded, markPreloaded])

  // Fast navigation with preloading
  const fastNavigate = useCallback((path: string) => {
    // Check if route is cached
    const cachedData = getRoute(path)
    
    // Start navigation immediately
    router.push(path)
    
    // Preload data in background if not cached
    if (!cachedData && !isPreloaded(path)) {
      markPreloaded(path)
    }
  }, [router, getRoute, isPreloaded, markPreloaded])

  // Preload routes on mount
  useEffect(() => {
    preloadRoutes()
  }, [preloadRoutes])

  return { fastNavigate, preloadRoutes }
}

// Route preloader component
export function RoutePreloader() {
  const { preloadRoutes } = useFastNavigation()

  useEffect(() => {
    // Preload routes when component mounts
    preloadRoutes()
    
    // Preload on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        preloadRoutes()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [preloadRoutes])

  return null
}

// Fast link component
export function FastLink({ 
  href, 
  children, 
  className = "", 
  onClick,
  ...props 
}: {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}) {
  const { fastNavigate } = useFastNavigation()

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    
    // Call custom onClick if provided
    if (onClick) onClick()
    
    // Fast navigation
    fastNavigate(href)
  }, [href, onClick, fastNavigate])

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}
