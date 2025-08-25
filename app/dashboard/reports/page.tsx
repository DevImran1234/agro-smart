"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  FileText,
  AlertTriangle,
  MapPin,
  Calendar,
  Search,
  Filter,
  Eye,
  Plus,
  Clock,
  CheckCircle,
  Image,
} from "lucide-react"
import Link from "next/link"

export default function FarmerReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await ApiService.getFarmerReports()
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "In Progress":
        return <AlertTriangle className="h-4 w-4" />
      case "Solved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["farmer"]}>
        <DashboardLayout title="My Reports">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["farmer"]}>
      <DashboardLayout title="My Reports">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">My Crop Reports</h2>
              <p className="text-muted-foreground">Track your submitted crop issue reports and their status</p>
            </div>
            <Link href="/dashboard/reports/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </Link>
          </div>

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
          <div className="grid gap-6">
            {filteredReports.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">No reports found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by submitting your first crop issue report"}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <div className="mt-6">
                      <Link href="/dashboard/reports/new">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Submit Report
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card key={report._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-xl">{report.crop}</CardTitle>
                          {report.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Urgent
                            </Badge>
                          )}
                                                        {report.images && report.images.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Image className="mr-1 h-3 w-3" />
                                  {report.images.length}
                                </Badge>
                              )}
                              {report.status === "Solved" && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Solved
                                </Badge>
                              )}
                            </div>
                        
                        {/* Display solution, diagnosis, and recommended products for solved reports */}
                        {report.status === "Solved" && (report.diagnosis || report.solution || (report.recommendedProducts && report.recommendedProducts.length > 0)) && (
                          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">Expert Solution</span>
                            </div>
                            
                            {report.diagnosis && (
                              <div className="mb-2">
                                <p className="text-xs font-medium text-green-700 mb-1">Diagnosis:</p>
                                <p className="text-xs text-green-700">{report.diagnosis}</p>
                              </div>
                            )}
                            
                            {report.solution && (
                              <div className="mb-2">
                                <p className="text-xs font-medium text-green-700 mb-1">Solution:</p>
                                <p className="text-xs text-green-700">{report.solution}</p>
                              </div>
                            )}
                            
                            {report.recommendedProducts && report.recommendedProducts.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-green-700 mb-1">Recommended Products:</p>
                                <div className="space-y-1">
                                  {report.recommendedProducts.map((product, index) => (
                                    <div key={index} className="text-xs text-green-700">
                                      <span className="font-medium">• {product.name}</span>
                                      {product.dosage && <span className="ml-2">({product.dosage})</span>}
                                      {product.applicationGuide && (
                                        <p className="ml-4 text-xs text-green-600">{product.applicationGuide}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Display images prominently if they exist */}
                        {report.images && report.images.length > 0 && (
                          <div className="mb-3">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {report.images.map((image, index) => (
                                <div key={index} className="flex-shrink-0">
                                  <img
                                    src={image}
                                    alt={`Crop issue ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-md border border-border hover:scale-105 transition-transform cursor-pointer"
                                    onClick={() => window.open(image, '_blank')}
                                    title="Click to view full size"
                                  />
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {report.images.length} image{report.images.length !== 1 ? 's' : ''} attached
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                              <Image className="mr-1 h-3 w-3" />
                              {report.images.length} image(s)
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{report.status}</span>
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                              <Eye className="mr-1 h-3 w-3" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Report Details: {report.crop}</DialogTitle>
                              <DialogDescription>
                                Submitted on {new Date(report.createdAt).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Description</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                              </div>
                              {report.voiceNotes && (
                                <div>
                                  <Label>Voice Notes</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{report.voiceNotes}</p>
                                </div>
                              )}
                              {report.images.length > 0 && (
                                <div>
                                  <Label>Images ({report.images.length})</Label>
                                  <div className="grid grid-cols-2 gap-3 mt-2">
                                    {report.images.map((image, index) => (
                                      <div key={index} className="relative group">
                                        <img
                                          src={image || "/placeholder.svg"}
                                          alt={`Report image ${index + 1}`}
                                          className="w-full h-32 object-cover rounded-lg border border-border hover:scale-105 transition-transform cursor-pointer"
                                          onClick={() => window.open(image, '_blank')}
                                          title="Click to view full size"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Eye className="h-6 w-6 text-white" />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Click on any image to view it in full size
                                  </p>
                                </div>
                              )}
                              {report.diagnosis && (
                                <div>
                                  <Label>Diagnosis</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{report.diagnosis}</p>
                                </div>
                              )}
                              {report.solution && (
                                <div>
                                  <Label>Recommended Solution</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{report.solution}</p>
                                </div>
                              )}
                              {report.recommendedProducts && report.recommendedProducts.length > 0 && (
                                <div>
                                  <Label>Recommended Products</Label>
                                  <div className="space-y-2 mt-2">
                                    {report.recommendedProducts.map((product, index) => (
                                      <div key={index} className="p-2 border border-border rounded-lg bg-muted/50">
                                        <div className="font-medium text-sm">{product.name}</div>
                                        {product.dosage && (
                                          <div className="text-xs text-muted-foreground">Dosage: {product.dosage}</div>
                                        )}
                                        {product.applicationGuide && (
                                          <div className="text-xs text-muted-foreground">Guide: {product.applicationGuide}</div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{report.description}</p>
                    {report.status === "Solved" && report.diagnosis && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">Expert Diagnosis</h4>
                        <p className="text-sm text-green-700">{report.diagnosis}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
