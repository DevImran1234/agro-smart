"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Users,
  BarChart3,
  Shield,
  Camera,
  MapPin,
  Bell,
  CheckCircle,
  ArrowRight,
  Sprout,
  Tractor,
  UserCheck,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-full p-2">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AgriManage</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Professional Agricultural Management
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Revolutionize Your <span className="text-primary">Agricultural</span> Operations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline crop management, enhance field operations, and boost productivity with our comprehensive
              agricultural management system designed for farmers, field workers, and administrators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Complete Agricultural Management Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your agricultural operations efficiently, from crop monitoring to team
              coordination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-full p-3 w-fit">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Crop Issue Reporting</CardTitle>
                <CardDescription>
                  Capture and report crop problems with photos, location data, and detailed descriptions for quick
                  diagnosis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-secondary/10 rounded-full p-3 w-fit">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>GPS Location Tracking</CardTitle>
                <CardDescription>
                  Precise field location mapping and tracking for accurate problem identification and resource
                  allocation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-full p-3 w-fit">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Comprehensive dashboards with crop performance metrics, regional analysis, and productivity insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-secondary/10 rounded-full p-3 w-fit">
                  <Bell className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Real-time Notifications</CardTitle>
                <CardDescription>
                  Instant alerts for urgent issues, status updates, and important agricultural advisories.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 rounded-full p-3 w-fit">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Seamless coordination between farmers, field employees, and administrators with role-based access.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-secondary/10 rounded-full p-3 w-fit">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Secure Data Management</CardTitle>
                <CardDescription>
                  Enterprise-grade security with encrypted data storage and secure authentication protocols.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Role-based Solutions */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tailored for Every Role</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized dashboards and tools designed for farmers, field employees, and administrators.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto">
                  <Sprout className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">For Farmers</CardTitle>
                <CardDescription>Direct crop issue reporting and monitoring tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Submit crop problem reports
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Upload field photos and videos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Track issue resolution status
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Receive expert recommendations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Access historical data
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-secondary/10 rounded-full p-4 w-fit mx-auto">
                  <Tractor className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">For Field Employees</CardTitle>
                <CardDescription>Field operations and farmer support tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-3" />
                    Assist farmers with reporting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-3" />
                    GPS location tagging
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-3" />
                    Mark urgent issues
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-3" />
                    Track work history
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-3" />
                    Mobile-optimized interface
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">For Administrators</CardTitle>
                <CardDescription>Complete system oversight and management</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Comprehensive analytics dashboard
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Diagnose and resolve issues
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Manage product recommendations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Monitor team performance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-3" />
                    Generate detailed reports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Agricultural Operations?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of farmers and agricultural professionals who trust AgriManage for their crop management
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Access Your Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary rounded-full p-2">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">AgriManage</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Professional agricultural management system designed to streamline crop monitoring, enhance field
                operations, and boost agricultural productivity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/forgot-password"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reset Password
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center">
            <p className="text-muted-foreground">© 2024 AgriManage. Professional Agricultural Management System.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
