"use client"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function PerformanceMonitor() {
  const pathname = usePathname()
  const navigationStart = useRef<number>(0)
  const lastPath = useRef<string>("")

  useEffect(() => {
    // Track navigation performance
    if (lastPath.current && lastPath.current !== pathname) {
      const duration = performance.now() - navigationStart.current
      
      // Log performance metrics
      console.log(`🚀 Route change: ${lastPath.current} → ${pathname}`)
      console.log(`⏱️  Navigation time: ${duration.toFixed(2)}ms`)
      
      // Send performance data to analytics (if needed)
      if (duration > 100) {
        console.warn(`⚠️  Slow navigation detected: ${duration.toFixed(2)}ms`)
      }
    }

    // Start timing for next navigation
    navigationStart.current = performance.now()
    lastPath.current = pathname

    // Preload next likely routes
    preloadNextRoutes(pathname)
  }, [pathname])

  // Preload routes based on current location
  const preloadNextRoutes = (currentPath: string) => {
    const routeMap: Record<string, string[]> = {
      "/admin/dashboard": [
        "/admin/dashboard/user-analytics",
        "/admin/dashboard/reports",
        "/admin/dashboard/products"
      ],
      "/admin/dashboard/user-analytics": [
        "/admin/dashboard/reports",
        "/admin/dashboard/products",
        "/admin/dashboard/notifications"
      ],
      "/admin/dashboard/reports": [
        "/admin/dashboard/user-analytics",
        "/admin/dashboard/products",
        "/admin/dashboard/gemini"
      ],
      "/admin/dashboard/products": [
        "/admin/dashboard/reports",
        "/admin/dashboard/user-analytics",
        "/admin/dashboard/notifications"
      ]
    }

    const nextRoutes = routeMap[currentPath] || []
    
    // Preload next routes
    nextRoutes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  }

  return null
}

// Performance optimization utilities
export const performanceUtils = {
  // Measure function execution time
  measureTime: <T>(fn: () => T, label: string): T => {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start
    console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`)
    return result
  },

  // Debounce function calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }
}
