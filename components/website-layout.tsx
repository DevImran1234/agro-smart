"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { X, Menu, BarChart3 } from "lucide-react"

export function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const [openNav, setOpenNav] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    )
  }, [])

  const isActive = (path: string) => pathname === path

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/solutions", label: "Solutions" },
    { path: "/contact", label: "Contact" },
  ]

  return (
    <div className="min-h-screen bg-[#041f1e]">
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 border-b border-[#00b894]/10"
        style={{
          background: "linear-gradient(to right, rgba(4, 31, 30, 0.85), rgba(6, 78, 59, 0.85))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="mr-4 cursor-pointer py-1.5 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Logo />
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              {navItems.map(({ path, label }) => (
                <li key={path} className="relative group">
                  <Link
                    href={path}
                    className={`block py-2 px-3 text-base font-medium transition-all duration-300 rounded-lg
                      ${isActive(path) 
                        ? "text-white bg-emerald-600/30" 
                        : "text-emerald-100 hover:text-white hover:bg-emerald-600/20"
                      }`}
                  >
                    {label}
                    {isActive(path) && (
                      <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-emerald-100 hover:text-white hover:bg-emerald-600/20 font-medium normal-case text-base px-6"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 font-medium normal-case text-base px-6 shadow-lg hover:shadow-emerald-500/25"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 font-medium normal-case text-base px-6"
                >
                  <BarChart3 className="h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-6 w-6 text-white hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden p-0"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {openNav && (
          <div className="lg:hidden px-4 pb-4">
            <ul className="mt-2 mb-4 flex flex-col gap-2">
              {navItems.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className={`block py-2 px-3 text-base font-medium transition-all duration-300 rounded-lg
                      ${isActive(path) 
                        ? "text-white bg-emerald-600/30" 
                        : "text-emerald-100 hover:text-white hover:bg-emerald-600/20"
                      }`}
                    onClick={() => setOpenNav(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="w-full">
                <Button 
                  variant="ghost" 
                  className="w-full text-emerald-100 hover:text-white hover:bg-emerald-600/20 normal-case text-base font-medium"
                  onClick={() => setOpenNav(false)}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 normal-case text-base px-6 shadow-lg hover:shadow-emerald-500/25"
                  onClick={() => setOpenNav(false)}
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <Button 
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 normal-case text-base px-6"
                  onClick={() => setOpenNav(false)}
                >
                  <BarChart3 className="h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Added a spacer div to prevent content from going under navbar */}
      <div className="h-[72px]"></div>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h6 className="text-lg font-semibold mb-4">
                AgriMed Hub
              </h6>
              <p className="text-sm text-gray-300">
                Revolutionizing agricultural education and smart farming
              </p>
            </div>
            <div>
              <h6 className="text-lg font-semibold mb-4">
                Quick Links
              </h6>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/solutions" className="text-gray-300 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="text-lg font-semibold mb-4">
                Resources
              </h6>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-300 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="text-lg font-semibold mb-4">
                Contact Us
              </h6>
              <p className="text-sm text-gray-300 mb-2">
                Email: info@agrimedhub.com
              </p>
              <p className="text-sm text-gray-300">
                Phone: +1 234 567 890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} AgriMed Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
