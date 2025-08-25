import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import { AuthWrapper } from "@/components/auth-wrapper"
import { PerformanceMonitor } from "@/components/performance-monitor"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "AgriManage - Agricultural Management System",
  description: "Professional agricultural management system for farmers, employees, and administrators",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <body>
        <PerformanceMonitor />
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  )
}
