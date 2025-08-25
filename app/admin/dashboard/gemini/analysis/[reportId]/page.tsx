"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type Report, type GeminiAnalysis } from "@/lib/api"
import { 
  Bot, 
  Brain, 
  ArrowLeft, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  FileText,
  Clock,
  TrendingUp,
  Zap,
  User,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function GeminiAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string
  
  const [report, setReport] = useState<Report | null>(null)
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [customSolution, setCustomSolution] = useState("")
  const [showCustomSolution, setShowCustomSolution] = useState(false)
  const { user, isAuthenticated } = useAuth()

  console.log("[GeminiAnalysisPage] Rendering with reportId:", reportId, "user:", user?.role, "isAuthenticated:", isAuthenticated)

  useEffect(() => {
    if (isAuthenticated && user && reportId) {
      console.log("[GeminiAnalysisPage] User authenticated, fetching report and analysis")
      fetchReport()
      fetchAnalysis()
    } else {
      console.log("[GeminiAnalysisPage] User not authenticated yet, skipping fetch")
    }
  }, [isAuthenticated, user, reportId])

  const fetchReport = async () => {
    try {
      const reports = await ApiService.getAdminReports()
      const foundReport = reports.find(r => r._id === reportId)
      if (foundReport) {
        setReport(foundReport)
      } else {
        setError("Report not found")
      }
    } catch (err: any) {
      console.error("[GeminiAnalysisPage] Error fetching report:", err)
      setError(err.message || "Failed to fetch report")
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalysis = async () => {
    try {
      const data = await ApiService.getGeminiRecommendations(reportId)
      // Convert recommendations to analysis format
      setAnalysis({
        reportId,
        analysis: {
          diagnosis: "AI Analysis",
          confidence: data.confidence,
          recommendations: data.recommendations,
          severity: data.priority,
          suggestedProducts: [],
          treatmentPlan: data.suggestedActions.join(" ")
        },
        createdAt: new Date().toISOString()
      })
    } catch (err: any) {
      console.error("[GeminiAnalysisPage] Error fetching analysis:", err)
      // Don't set error here as analysis might not exist yet
    }
  }

  const analyzeWithGemini = async () => {
    try {
      setAnalyzing(true)
      setError("")
      const data = await ApiService.analyzeReportWithGemini(reportId)
      setAnalysis(data)
    } catch (err: any) {
      console.error("[GeminiAnalysisPage] Error analyzing with Gemini:", err)
      setError(err.message || "Failed to analyze with Gemini")
    } finally {
      setAnalyzing(false)
    }
  }

  const applySolution = async (solution: any) => {
    try {
      setLoading(true)
      setError("")
      await ApiService.applyGeminiSolution(reportId, solution)
      router.push("/admin/dashboard/reports")
    } catch (err: any) {
      console.error("[GeminiAnalysisPage] Error applying solution:", err)
      setError(err.message || "Failed to apply solution")
    } finally {
      setLoading(false)
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!isAuthenticated || !user) {
    console.log("[GeminiAnalysisPage] User not authenticated, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Gemini Analysis">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (loading) {
    console.log("[GeminiAnalysisPage] Still loading, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Gemini Analysis">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!report) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Report Not Found">
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Report Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The report you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link href="/admin/dashboard/reports">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Button>
            </Link>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  console.log("[GeminiAnalysisPage] Rendering main content")

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title={`Gemini Analysis - ${report.crop}`}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gemini AI Analysis</h1>
              <p className="text-muted-foreground">AI-powered analysis and solution for agricultural issues</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={analyzeWithGemini}
                disabled={analyzing}
              >
                {analyzing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="mr-2 h-4 w-4" />
                )}
                {analyzing ? "Analyzing..." : "Re-analyze"}
              </Button>
              <Link href="/admin/dashboard/reports">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Reports
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Report Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Crop</label>
                    <p className="text-sm font-medium">{report.crop}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                      {report.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Farmer</label>
                    <p className="text-sm">{report.farmer?.username || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="text-sm">{formatDate(report.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1">{report.description}</p>
                </div>

                {report.images && report.images.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Images</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {report.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Report image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Analysis</span>
                  {analysis && (
                    <Badge className={`text-xs ${getSeverityColor(analysis.analysis.severity)}`}>
                      {analysis.analysis.severity.toUpperCase()}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Gemini AI-powered analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!analysis ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Click "Analyze with Gemini" to get AI-powered insights
                    </p>
                    <Button onClick={analyzeWithGemini} disabled={analyzing}>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze with Gemini
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Solution Application */}
          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Apply Solution</span>
                </CardTitle>
                <CardDescription>
                  Apply the AI-generated solution to resolve this report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => applySolution({
                      diagnosis: analysis.analysis.diagnosis,
                      solution: analysis.analysis.recommendations.join(" "),
                      recommendedProducts: analysis.analysis.suggestedProducts,
                      treatmentPlan: analysis.analysis.treatmentPlan
                    })}
                    disabled={loading}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Apply AI Solution
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomSolution(!showCustomSolution)}
                    className="w-full"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Custom Solution
                  </Button>
                </div>

                {showCustomSolution && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Custom Solution</label>
                      <Textarea
                        value={customSolution}
                        onChange={(e) => setCustomSolution(e.target.value)}
                        placeholder="Enter your custom solution..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={() => applySolution({
                        diagnosis: "Custom Solution",
                        solution: customSolution,
                        recommendedProducts: [],
                        treatmentPlan: customSolution
                      })}
                      disabled={loading || !customSolution.trim()}
                      className="w-full"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Apply Custom Solution
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
