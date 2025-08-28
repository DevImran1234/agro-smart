"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WebsiteLayout } from "@/components/website-layout"
import {
  ShieldCheck,
  Cloud,
  Smartphone,
  Leaf,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sprout,
  Tractor,
  UserCheck,
  Camera,
} from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />, 
      title: "GPS Employee Tracking",
      description: "Monitor field staff locations in real-time to ensure effective on-ground support."
    },
    {
      icon: <Cloud className="h-6 w-6" />, 
      title: "AI Disease Detection",
      description: "Identify crop diseases early using AI technology for faster solutions."
    },
    {
      icon: <Smartphone className="h-6 w-6" />, 
      title: "Farmer Issue Reporting",
      description: "Farmers can report problems directly through the app for immediate assistance."
    }
  ]

  const stats = [
    { value: "95%", label: "Faster Issue Resolution" },
    { value: "24/7", label: "Expert Consultations" },
    { value: "100%", label: "Farmer Satisfaction" }
  ]

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-gradient-to-r from-[#00b894] to-[#0984e3] text-white shadow-lg">
               Smart  Agro  v1.0
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                <span className="text-[#d1fae5] drop-shadow-md">Smart Agro Monitoring</span>
                <br />
                <span className="bg-gradient-to-r from-[#00b894] to-[#0984e3] bg-clip-text text-transparent drop-shadow-sm">
                  & Assistance System
                </span>
              </h1>
              <p className="text-xl text-[#d1fae5]/90 mb-8 leading-relaxed">
                The Smart Agro Monitoring & Assistance System bridges the communication gap between pesticide companies and farmers by offering real-time monitoring, AI-powered disease detection, GPS employee tracking, and direct farmer issue reporting to boost agricultural productivity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#00b894] to-[#0984e3] hover:from-[#00cec9] hover:to-[#74b9ff] shadow-lg hover:shadow-[#00ffcc]/50 transition-all duration-300"
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center p-4 rounded-lg bg-[#041f1e]/50 backdrop-blur-sm border border-[#00b894]/20"
                  >
                    <div className="text-2xl text-[#d1fae5] font-bold drop-shadow-md">
                      {stat.value}
                    </div>
                    <div className="text-[#d1fae5]/80 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#041f1e]/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-[#d1fae5]">
              Complete Agricultural Management Solution
            </h2>
            <p className="text-xl text-[#d1fae5]/80 max-w-2xl mx-auto">
              Everything you need to manage your agricultural operations efficiently, from crop monitoring to team
              coordination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-[#00b894]/20 hover:shadow-lg transition-shadow bg-[#041f1e]/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="bg-gradient-to-r from-[#00b894]/20 to-[#0984e3]/20 rounded-full p-3 w-fit">
                    <div className="text-[#00b894]">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-[#d1fae5]">{feature.title}</CardTitle>
                  <CardDescription className="text-[#d1fae5]/80">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-[#041f1e]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-[#00b894]/20 hover:shadow-lg transition-shadow bg-[#041f1e]/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-[#00b894]/20 to-[#0984e3]/20 rounded-full p-3 w-fit">
                  <Camera className="h-6 w-6 text-[#00b894]" />
                </div>
                <CardTitle className="text-[#d1fae5]">Crop Issue Reporting</CardTitle>
                <CardDescription className="text-[#d1fae5]/80">
                  Capture and report crop problems with photos, location data, and detailed descriptions for quick
                  diagnosis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[#00b894]/20 hover:shadow-lg transition-shadow bg-[#041f1e]/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-[#00b894]/20 to-[#0984e3]/20 rounded-full p-3 w-fit">
                  <Users className="h-6 w-6 text-[#00b894]" />
                </div>
                <CardTitle className="text-[#d1fae5]">Team Management</CardTitle>
                <CardDescription className="text-[#d1fae5]/80">
                  Coordinate field workers, assign tasks, and track performance with comprehensive team management tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[#00b894]/20 hover:shadow-lg transition-shadow bg-[#041f1e]/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-[#00b894]/20 to-[#0984e3]/20 rounded-full p-3 w-fit">
                  <BarChart3 className="h-6 w-6 text-[#00b894]" />
                </div>
                <CardTitle className="text-[#d1fae5]">Analytics & Insights</CardTitle>
                <CardDescription className="text-[#d1fae5]/80">
                  Get detailed analytics and insights into your agricultural operations, crop health, and team performance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00b894]/10 to-[#0984e3]/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#d1fae5]">
            Ready to Transform Your Agricultural Operations?
          </h2>
          <p className="text-xl text-[#d1fae5]/80 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and agricultural professionals who are already using our system to improve productivity and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-[#00b894] to-[#0984e3] hover:from-[#00cec9] hover:to-[#74b9ff] shadow-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-[#00b894] text-[#d1fae5] hover:bg-[#00b894]/20">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
