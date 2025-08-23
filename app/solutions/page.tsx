"use client"
import { WebsiteLayout } from "@/components/website-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  MapPin, 
  Users, 
  BarChart3, 
  Shield, 
  Cloud,
  Smartphone,
  Leaf,
  Target,
  Zap
} from "lucide-react"

export default function SolutionsPage() {
  const solutions = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Smart Crop Monitoring",
      description: "AI-powered image analysis for early disease detection and crop health assessment.",
      features: [
        "Real-time crop health monitoring",
        "Early disease detection",
        "Automated alert system",
        "Historical data tracking"
      ]
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "GPS Field Management",
      description: "Precise location tracking and field mapping for optimal resource management.",
      features: [
        "Real-time GPS tracking",
        "Field boundary mapping",
        "Resource optimization",
        "Weather integration"
      ]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Coordination",
      description: "Streamlined communication and task management for field workers.",
      features: [
        "Task assignment & tracking",
        "Real-time communication",
        "Performance analytics",
        "Schedule management"
      ]
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Data Analytics",
      description: "Comprehensive insights and reporting for informed decision-making.",
      features: [
        "Yield prediction models",
        "Resource usage analysis",
        "Performance metrics",
        "Custom reporting"
      ]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality Assurance",
      description: "Ensuring product quality through systematic monitoring and validation.",
      features: [
        "Quality standards compliance",
        "Audit trail management",
        "Certification support",
        "Risk assessment"
      ]
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud Integration",
      description: "Seamless data synchronization and access across all devices.",
      features: [
        "Multi-device access",
        "Automatic backups",
        "Real-time sync",
        "Secure storage"
      ]
    }
  ]

  const benefits = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Increased Yield",
      description: "Improve crop productivity by up to 30% through smart monitoring and timely interventions."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Efficiency Boost",
      description: "Reduce operational costs by 25% through optimized resource management and automation."
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Promote eco-friendly farming practices with precision agriculture and reduced waste."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Easy Access",
      description: "Access your farm data anywhere, anytime through our mobile-first platform."
    }
  ]

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#041f1e] to-[#064e3b]">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            Our Solutions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Comprehensive <span className="text-emerald-400">Agricultural</span> Solutions
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Discover how our integrated platform addresses every aspect of modern farming, 
            from crop monitoring to team management, helping you achieve maximum productivity and sustainability.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-[#041f1e]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Complete Solution Suite
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Every tool you need to modernize your agricultural operations and boost productivity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-[#064e3b]/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-full p-4 w-fit">
                    <div className="text-emerald-400">
                      {solution.icon}
                    </div>
                  </div>
                  <CardTitle className="text-white">{solution.title}</CardTitle>
                  <CardDescription className="text-emerald-100">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-emerald-100">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#064e3b]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose Our Solutions?
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Proven benefits that transform agricultural operations and drive success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-[#041f1e]/50 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-full p-3">
                    <div className="text-emerald-400">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-white">{benefit.title}</CardTitle>
                    <CardDescription className="text-emerald-100">
                      {benefit.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-[#041f1e]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Seamless Integration
              </h2>
              <p className="text-lg text-emerald-100 mb-6 leading-relaxed">
                Our platform integrates seamlessly with your existing agricultural equipment and systems, 
                providing a unified solution that works with what you already have.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-100">Compatible with major IoT devices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-100">API integration capabilities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-100">Mobile and desktop support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-100">Offline functionality</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl p-8 border border-emerald-500/30">
              <h3 className="text-2xl font-bold mb-4 text-white">Technical Specifications</h3>
              <div className="space-y-3 text-emerald-100">
                <div className="flex justify-between">
                  <span>Platform:</span>
                  <span className="font-medium">Web, iOS, Android</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Storage:</span>
                  <span className="font-medium">Cloud + Local</span>
                </div>
                <div className="flex justify-between">
                  <span>Security:</span>
                  <span className="font-medium">Enterprise-grade</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Support:</span>
                  <span className="font-medium">24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who have already modernized their operations with our comprehensive solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="inline-block">
              <button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                Start Free Trial
              </button>
            </a>
            <a href="/contact" className="inline-block">
              <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-3 px-8 rounded-lg transition-colors">
                Schedule Demo
              </button>
            </a>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
