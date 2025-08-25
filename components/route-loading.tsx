"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface RouteLoadingProps {
  children: React.ReactNode
}

export function RouteLoading({ children }: RouteLoadingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPath, setLoadingPath] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    // Show loading state for route changes
    if (loadingPath !== pathname) {
      setIsLoading(true)
      setLoadingPath(pathname)
      
      // Hide loading after a short delay for perceived performance
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 150) // Reduced from default 300ms for faster feel

      return () => clearTimeout(timer)
    }
  }, [pathname, loadingPath])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            {/* Optimized loading spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary/40 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
            </div>
            
            {/* Loading text with skeleton effect */}
            <div className="text-center space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-muted/60 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Skeleton loading components for faster perceived performance
export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
      <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
      <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
      <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg">
          <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="h-6 w-1/3 bg-muted rounded animate-pulse mb-4"></div>
      <div className="h-64 bg-muted rounded animate-pulse"></div>
    </div>
  )
}
