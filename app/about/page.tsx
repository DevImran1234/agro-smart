"use client"
import { WebsiteLayout } from "@/components/website-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Leaf } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description: "We believe in building strong relationships with farmers and agricultural communities."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Innovation Driven",
      description: "Leveraging cutting-edge technology to solve real agricultural challenges."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "Committed to delivering the highest quality solutions and support."
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Promoting sustainable farming practices for future generations."
    }
  ]

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Agricultural Scientist",
      description: "Leading expert in crop disease detection with 15+ years of experience."
    },
    {
      name: "Michael Chen",
      role: "Technology Director",
      description: "Specialist in AI and machine learning applications for agriculture."
    },
    {
      name: "Dr. Rajesh Patel",
      role: "Field Operations",
      description: "Expert in field management and agricultural best practices."
    }
  ]

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#041f1e] to-[#064e3b]">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            About Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Revolutionizing <span className="text-emerald-400">Agricultural</span> Technology
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Smart  Agro is at the forefront of agricultural innovation, combining cutting-edge technology 
            with deep agricultural expertise to create solutions that empower farmers and transform the industry.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-[#041f1e]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Our Mission
              </h2>
              <p className="text-lg text-emerald-100 mb-6 leading-relaxed">
                To bridge the gap between traditional farming practices and modern technology, 
                ensuring that every farmer has access to the tools and knowledge needed to 
                maximize their productivity and sustainability.
              </p>
              <p className="text-lg text-emerald-100 leading-relaxed">
                We believe that by empowering farmers with real-time data, AI-driven insights, 
                and comprehensive support systems, we can create a more efficient, sustainable, 
                and profitable agricultural sector.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl p-8 border border-emerald-500/30">
              <h3 className="text-2xl font-bold mb-4 text-white">Key Objectives</h3>
              <ul className="space-y-3 text-emerald-100">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Increase crop yield through smart monitoring
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Reduce resource waste with precision agriculture
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Improve farmer profitability and sustainability
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Build resilient agricultural communities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#064e3b]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Our Core Values
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-[#041f1e]/50 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-full p-4 w-fit">
                    <div className="text-emerald-400">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle className="text-white">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-emerald-100 text-center">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#041f1e]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Dedicated professionals committed to advancing agricultural technology and supporting farmers worldwide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-[#064e3b]/50 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-white">{member.name}</CardTitle>
                  <CardDescription className="text-emerald-400 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-emerald-100 text-center">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-emerald-100">Farmers Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-emerald-100">Expert Team</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-emerald-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-emerald-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
