"use client"
import { useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"

// Route preloader for instant navigation
export function RoutePreloader() {
  const router = useRouter()
  const preloadedRoutes = useRef(new Set<string>())

  // Preload critical routes
  const preloadRoute = useCallback((path: string) => {
    if (preloadedRoutes.current.has(path)) return

    // Mark as preloaded
    preloadedRoutes.current.add(path)

    // Preload route data
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = path
    document.head.appendChild(link)

    // Preload critical data
    fetch(path, { method: 'HEAD' })
      .catch(() => {}) // Ignore errors
  }, [])

  // Preload all critical routes
  useEffect(() => {
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

    // Preload routes with slight delay to avoid blocking initial load
    const timer = setTimeout(() => {
      criticalRoutes.forEach(preloadRoute)
    }, 100)

    return () => clearTimeout(timer)
  }, [preloadRoute])

  return null
}

// Fast navigation hook
export function useFastNavigation() {
  const router = useRouter()
  const navigationStart = useRef<number>(0)

  const fastNavigate = useCallback((path: string) => {
    // Start timing
    navigationStart.current = performance.now()
    
    // Navigate immediately
    router.push(path)
    
    // Log performance
    setTimeout(() => {
      const duration = performance.now() - navigationStart.current
      console.log(`🚀 Navigation to ${path} took ${duration.toFixed(2)}ms`)
    }, 100)
  }, [router])

  return { fastNavigate }
}

// Optimized link component
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
