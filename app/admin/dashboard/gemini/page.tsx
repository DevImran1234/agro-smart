"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type Report, type GeminiAnalysis } from "@/lib/api"
import { 
  Bot, 
  Send, 
  FileText, 
  MessageSquare, 
  Lightbulb, 
  Brain, 
  ArrowLeft, 
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function GeminiAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [insights, setInsights] = useState<any>(null)
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useAuth()

  console.log("[GeminiAIPage] Rendering with user:", user?.role, "isAuthenticated:", isAuthenticated)

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("[GeminiAIPage] User authenticated, fetching data")
      fetchReports()
      fetchInsights()
    } else {
      console.log("[GeminiAIPage] User not authenticated yet, skipping fetch")
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchReports = async () => {
    try {
      const data = await ApiService.getAdminReports()
      setReports(data.filter(r => r.status === "Pending" || r.status === "In Progress"))
    } catch (err: any) {
      console.error("[GeminiAIPage] Error fetching reports:", err)
    }
  }

  const fetchInsights = async () => {
    try {
      const data = await ApiService.getGeminiInsights()
      setInsights(data)
    } catch (err: any) {
      console.error("[GeminiAIPage] Error fetching insights:", err)
    }
  }

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setLoading(true)
    setError("")

    try {
      // Create context if a report is selected
      let context = ""
      if (selectedReport) {
        context = `Context: Analyzing report for ${selectedReport.crop} in ${selectedReport.region}. Description: ${selectedReport.description}`
      }

      const response = await ApiService.sendGeminiMessage(message, context)
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      console.error("[GeminiAIPage] Error sending message:", err)
      setError(err.message || "Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  const analyzeReport = async (report: Report) => {
    try {
      setLoading(true)
      setError("")
      const analysis = await ApiService.analyzeReportWithGemini(report)
      setAnalysis(analysis)
      setShowAnalysis(true)
    } catch (err: any) {
      console.error("[GeminiAIPage] Error analyzing report:", err)
      setError(err.message || "Failed to analyze report")
    } finally {
      setLoading(false)
    }
  }

  const applySolution = async (reportId: string, solution: any) => {
    try {
      setLoading(true)
      setError("")
      await ApiService.applyGeminiSolution(reportId, solution)
      setShowAnalysis(false)
      setAnalysis(null)
      fetchReports() // Refresh reports
    } catch (err: any) {
      console.error("[GeminiAIPage] Error applying solution:", err)
      setError(err.message || "Failed to apply solution")
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setSelectedReport(null)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  if (!isAuthenticated || !user) {
    console.log("[GeminiAIPage] User not authenticated, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Gemini AI Assistant">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  console.log("[GeminiAIPage] Rendering main content")

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title="Gemini AI Assistant">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gemini AI Assistant</h1>
              <p className="text-muted-foreground">AI-powered agricultural issue resolution and analysis</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => { fetchReports(); fetchInsights(); }} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Insights */}
          {insights && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{insights.totalAnalyses}</p>
                      <p className="text-sm text-muted-foreground">Total Analyses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{insights.averageConfidence}%</p>
                      <p className="text-sm text-muted-foreground">Avg Confidence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                      <p className="text-sm text-muted-foreground">Messages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{reports.length}</p>
                      <p className="text-sm text-muted-foreground">Pending Reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Reports */}
            <div className="space-y-6">
              {/* Pending Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Pending Reports</span>
                  </CardTitle>
                  <CardDescription>
                    Select a report to analyze with AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.slice(0, 5).map((report) => (
                      <div
                        key={report._id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedReport?._id === report._id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{report.crop}</h4>
                          <Badge variant={report.status === "Pending" ? "secondary" : "default"}>
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              analyzeReport(report)
                            }}
                            disabled={loading}
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            Analyze
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedReport(report)
                              setMessage(`Please analyze this report about ${report.crop}: ${report.description}`)
                            }}
                            disabled={loading}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No pending reports
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setMessage("What are common crop diseases and their treatments?")}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Crop Diseases
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setMessage("What are the best practices for organic farming?")}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Organic Farming
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setMessage("How to identify nutrient deficiencies in plants?")}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Nutrient Issues
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={clearChat}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>
                      {selectedReport 
                        ? `AI Assistant - ${selectedReport.crop}`
                        : "AI Assistant"
                      }
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about agricultural issues, crop diseases, or farming practices
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                        <p className="text-muted-foreground mb-4">
                          Ask about agricultural issues, crop diseases, or farming practices
                        </p>
                        <div className="space-y-2">
                          <Button 
                            onClick={() => setMessage("Hello! I'm an admin. Can you help me with agricultural issues?")}
                            className="w-full"
                          >
                            <Bot className="h-4 w-4 mr-2" />
                            Start Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                {msg.role === "user" ? (
                                  <User className="h-3 w-3" />
                                ) : (
                                  <Bot className="h-3 w-3" />
                                )}
                                <span className="text-xs opacity-70">
                                  {formatTimestamp(msg.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {loading && (
                          <div className="flex justify-start">
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Bot className="h-3 w-3" />
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                <span className="text-sm">AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Message Input */}
                      <div className="flex space-x-2">
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Ask about agricultural issues, crop diseases, or farming practices..."
                          className="flex-1"
                          rows={2}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              sendMessage()
                            }
                          }}
                        />
                        <Button 
                          onClick={sendMessage} 
                          disabled={!message.trim() || loading}
                          className="self-end"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Modal */}
          {showAnalysis && analysis && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Analysis Results</span>
                  <Badge className={`text-xs ${getSeverityColor(analysis.analysis.severity)}`}>
                    {analysis.analysis.severity.toUpperCase()}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  AI-powered analysis for Report {analysis.reportId.slice(-6)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Diagnosis</h4>
                  <p className="text-sm text-muted-foreground">{analysis.analysis.diagnosis}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Confidence</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${analysis.analysis.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analysis.analysis.confidence}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {analysis.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {analysis.analysis.suggestedProducts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Suggested Products</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.analysis.suggestedProducts.map((product, index) => (
                        <Badge key={index} variant="outline">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Treatment Plan</h4>
                  <p className="text-sm text-muted-foreground">{analysis.analysis.treatmentPlan}</p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => applySolution(analysis.reportId, {
                      diagnosis: analysis.analysis.diagnosis,
                      solution: analysis.analysis.recommendations.join(" "),
                      recommendedProducts: analysis.analysis.suggestedProducts,
                      treatmentPlan: analysis.analysis.treatmentPlan
                    })}
                    disabled={loading}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Solution
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAnalysis(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
