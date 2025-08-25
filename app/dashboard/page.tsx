"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type Report, type Notification } from "@/lib/api"
import { FileText, Clock, CheckCircle, AlertTriangle, Plus, TrendingUp, MapPin, Calendar, Bell, Image } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function FarmerDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user, isAuthenticated } = useAuth()
  
  console.log("[FarmerDashboard] Rendering with user:", user?.role, "isAuthenticated:", isAuthenticated)

    useEffect(() => {
    console.log("[Dashboard] useEffect triggered:", { isAuthenticated, user: user?.role })
    
    // Only fetch data when user is authenticated
    if (isAuthenticated && user) {
      console.log("[Dashboard] User authenticated, fetching data")
      const fetchData = async () => {
        try {
          console.log("[Dashboard] Fetching data for user:", user)
          
          const [reportsData, notificationsData] = await Promise.all([
            ApiService.getFarmerReports(),
            ApiService.getFarmerNotifications(),
          ])
          
          console.log("[Dashboard] Data fetched successfully:", { reports: reportsData, notifications: notificationsData })
          setReports(reportsData)
          setNotifications(notificationsData)
        } catch (err: any) {
          console.error("[Dashboard] Error fetching data:", err)
          setError(err.message || "Failed to fetch dashboard data")
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    } else {
      console.log("[Dashboard] User not authenticated yet, skipping data fetch")
    }
  }, [isAuthenticated, user])

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

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    inProgress: reports.filter((r) => r.status === "In Progress").length,
    solved: reports.filter((r) => r.status === "Solved").length,
    urgent: reports.filter((r) => r.urgent).length,
    withImages: reports.filter((r) => r.images && r.images.length > 0).length,
  }
  
  console.log("[Dashboard] Stats calculated:", stats)

  if (!isAuthenticated || !user) {
    console.log("[Dashboard] User not authenticated, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["farmer"]}>
        <DashboardLayout title="Dashboard">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (loading) {
    console.log("[Dashboard] Still loading data, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["farmer"]}>
        <DashboardLayout title="Dashboard">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }
  
  console.log("[Dashboard] Rendering main dashboard content")

  return (
    <ProtectedRoute allowedRoles={["farmer"]}>
      <DashboardLayout title="Farmer Dashboard">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
                <br />
                <small className="text-xs">Check the browser console for more details</small>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/reports/new" className="flex-1">
              <Button className="w-full h-12">
                <Plus className="mr-2 h-4 w-4" />
                Submit New Report
              </Button>
            </Link>
            <Link href="/dashboard/reports" className="flex-1">
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                View All Reports
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Being processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.solved}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">With Images</CardTitle>
                <Image className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.withImages}</div>
                <p className="text-xs text-muted-foreground">Visual evidence</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Reports */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Your latest crop issue submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-semibold text-foreground">No reports yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Get started by submitting your first crop issue report.
                      </p>
                      <div className="mt-6">
                        <Link href="/dashboard/reports/new">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Submit Report
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports.slice(0, 5).map((report) => (
                        <div
                          key={report._id}
                          className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
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
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{report.description}</p>
                            
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
                            
                            {/* Display images if they exist */}
                            {report.images && report.images.length > 0 && (
                              <div className="mb-3">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                  {report.images.map((image, index) => (
                                    <div key={index} className="flex-shrink-0">
                                      <img
                                        src={image}
                                        alt={`Crop issue ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded-md border border-border hover:scale-105 transition-transform cursor-pointer"
                                        onClick={() => window.open(image, '_blank')}
                                        title="Click to view full size"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {report.images.length} image{report.images.length !== 1 ? 's' : ''} attached
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {report.region}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(report.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          </div>
                        </div>
                      ))}
                      {reports.length > 5 && (
                        <div className="text-center pt-4">
                          <Link href="/dashboard/reports">
                            <Button variant="outline">View All Reports</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notifications */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Latest updates and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.slice(0, 5).map((notification) => (
                        <div key={notification._id} className="p-3 border border-border rounded-lg bg-card">
                          <p className="text-sm text-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {notifications.length > 5 && (
                        <div className="text-center pt-2">
                          <Link href="/dashboard/notifications">
                            <Button variant="outline" size="sm">
                              View All
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
