"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type Report } from "@/lib/api"
import Link from "next/link"
import { FileText, AlertTriangle, MapPin, Calendar, Search, Filter, Eye, Stethoscope, Bot, Brain } from "lucide-react"

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [diagnosisData, setDiagnosisData] = useState({
    diagnosis: "",
    solution: "",
    recommendedProducts: "",
  })
  const [diagnosisLoading, setDiagnosisLoading] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await ApiService.getAdminReports()
        setReports(reportsData)
        setFilteredReports(reportsData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  useEffect(() => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchTerm, statusFilter])

  const handleDiagnose = async (report: Report) => {
    setSelectedReport(report)
    setDiagnosisData({
      diagnosis: report.diagnosis || "",
      solution: report.solution || "",
      recommendedProducts: report.recommendedProducts?.join(", ") || "",
    })
  }

  const submitDiagnosis = async () => {
    if (!selectedReport) return

    setDiagnosisLoading(true)
    try {
      const recommendedProductsArray = diagnosisData.recommendedProducts
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p)

      await ApiService.diagnoseReport(selectedReport._id, {
        diagnosis: diagnosisData.diagnosis,
        solution: diagnosisData.solution,
        recommendedProducts: recommendedProductsArray,
      })

      // Refresh reports
      const updatedReports = await ApiService.getAdminReports()
      setReports(updatedReports)
      setSelectedReport(null)
      setDiagnosisData({ diagnosis: "", solution: "", recommendedProducts: "" })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDiagnosisLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Solved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Report Management">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title="Report Management">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by crop, region, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Solved">Solved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>All Reports ({filteredReports.length})</CardTitle>
              <CardDescription>Manage and diagnose crop issue reports</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">No reports found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== "all" ? "Try adjusting your filters" : "No reports submitted yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div
                      key={report._id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{report.crop}</h4>
                          {report.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Urgent
                            </Badge>
                          )}
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {report.region}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                          {report.images.length > 0 && (
                            <div className="flex items-center">
                              <Eye className="mr-1 h-3 w-3" />
                              {report.images.length} image(s)
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <Link href={`/admin/dashboard/gemini/analysis/${report._id}`}>
                          <Button size="sm" variant="outline">
                            <Brain className="mr-1 h-3 w-3" />
                            AI Analysis
                          </Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => handleDiagnose(report)}>
                              <Stethoscope className="mr-1 h-3 w-3" />
                              {report.diagnosis ? "Update" : "Diagnose"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Diagnose Report: {report.crop}</DialogTitle>
                              <DialogDescription>
                                Provide diagnosis, solution, and product recommendations for this crop issue.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="diagnosis">Diagnosis</Label>
                                <Textarea
                                  id="diagnosis"
                                  placeholder="Describe the identified problem..."
                                  value={diagnosisData.diagnosis}
                                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label htmlFor="solution">Solution</Label>
                                <Textarea
                                  id="solution"
                                  placeholder="Provide treatment recommendations..."
                                  value={diagnosisData.solution}
                                  onChange={(e) => setDiagnosisData((prev) => ({ ...prev, solution: e.target.value }))}
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label htmlFor="products">Recommended Products</Label>
                                <Input
                                  id="products"
                                  placeholder="Product names separated by commas..."
                                  value={diagnosisData.recommendedProducts}
                                  onChange={(e) =>
                                    setDiagnosisData((prev) => ({ ...prev, recommendedProducts: e.target.value }))
                                  }
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={submitDiagnosis} disabled={diagnosisLoading} className="flex-1">
                                  {diagnosisLoading ? "Saving..." : "Save Diagnosis"}
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedReport(null)} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
