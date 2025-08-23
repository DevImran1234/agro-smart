"use client"
import { WebsiteLayout } from "@/components/website-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Globe
} from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "info@agrimedhub.com",
      subtitle: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "+1 (555) 123-4567",
      subtitle: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      description: "123 Agriculture St, Farm City, FC 12345",
      subtitle: "Schedule a meeting in advance"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Support Hours",
      description: "24/7 Available",
      subtitle: "Emergency support always available"
    }
  ]

  const socialLinks = [
    {
      icon: <Globe className="h-5 w-5" />,
      name: "Website",
      url: "https://agrimedhub.com"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      name: "Live Chat",
      url: "#"
    }
  ]

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#041f1e] to-[#064e3b]">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Let's <span className="text-emerald-400">Connect</span> Today
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Have questions about our agricultural solutions? Want to schedule a demo? 
            Our team is here to help you transform your farming operations.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-[#041f1e]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-emerald-100 mb-2">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="bg-[#064e3b]/50 border-emerald-500/30 text-white placeholder:text-emerald-300 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-emerald-100 mb-2">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="bg-[#064e3b]/50 border-emerald-500/30 text-white placeholder:text-emerald-300 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-emerald-100 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="bg-[#064e3b]/50 border-emerald-500/30 text-white placeholder:text-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-emerald-100 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="bg-[#064e3b]/50 border-emerald-500/30 text-white placeholder:text-emerald-300 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-emerald-100 mb-2">
                    Company/Farm Name
                  </label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Green Acres Farm"
                    className="bg-[#064e3b]/50 border-emerald-500/30 text-white placeholder:text-emerald-300 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-emerald-100 mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="General Inquiry"
                    className="bg-[#064e3b]/50 border-emerald-500/30 text-white placeholder:text-emerald-300 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-emerald-100 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your agricultural needs and how we can help..."
                    rows={5}
                    className="bg-[#064e3b]/50 border-emerald-500/30 text-white placeholder:text-emerald-300 focus:border-emerald-500 resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="bg-[#064e3b]/50 border-emerald-500/20">
                    <CardHeader className="flex flex-row items-center gap-4 pb-3">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-full p-3">
                        <div className="text-emerald-400">
                          {info.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{info.title}</CardTitle>
                        <CardDescription className="text-emerald-100 font-medium">
                          {info.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-emerald-200 text-sm">{info.subtitle}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Connect With Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="flex items-center gap-2 bg-[#064e3b]/50 border border-emerald-500/30 rounded-lg px-4 py-2 text-emerald-100 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-colors"
                    >
                      {social.icon}
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#064e3b]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Find quick answers to common questions about our agricultural solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[#041f1e]/50 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-white">How quickly can I get started?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-emerald-100">
                  You can start using our platform within 24 hours of signing up. Our team will guide you through the setup process and provide training.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#041f1e]/50 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-white">Do you offer training and support?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-emerald-100">
                  Yes! We provide comprehensive training, documentation, and 24/7 support to ensure you get the most out of our platform.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#041f1e]/50 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-white">Can I integrate with existing systems?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-emerald-100">
                  Absolutely! Our platform is designed to integrate seamlessly with most existing agricultural equipment and management systems.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[#041f1e]/50 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-white">What about data security?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-emerald-100">
                  We use enterprise-grade security measures to protect your data. All information is encrypted and stored securely in the cloud.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#041f1e]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Find Us</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Visit our headquarters or schedule a virtual meeting to discuss your agricultural needs.
            </p>
          </div>
          <div className="bg-[#064e3b]/50 border border-emerald-500/30 rounded-lg p-8 text-center">
            <MapPin className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">AgriMed Hub Headquarters</h3>
            <p className="text-emerald-100 mb-4">
              123 Agriculture Street<br />
              Farm City, FC 12345<br />
              United States
            </p>
            <Button 
              variant="outline" 
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
