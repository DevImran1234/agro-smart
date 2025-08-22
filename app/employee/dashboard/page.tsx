"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type Report, type Notification } from "@/lib/api"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  TrendingUp,
  MapPin,
  Calendar,
  Bell,
  Users,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function EmployeeDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [history, setHistory] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, notificationsData, historyData] = await Promise.all([
          ApiService.getEmployeeReports(),
          ApiService.getEmployeeNotifications(),
          ApiService.getEmployeeHistory(),
        ])
        setReports(reportsData)
        setNotifications(notificationsData)
        setHistory(historyData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleMarkUrgent = async (reportId: string) => {
    try {
      await ApiService.markReportUrgent(reportId)
      // Refresh reports
      const updatedReports = await ApiService.getEmployeeReports()
      setReports(updatedReports)
    } catch (err: any) {
      setError(err.message)
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

  const stats = {
    totalAssigned: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    inProgress: reports.filter((r) => r.status === "In Progress").length,
    completed: history.filter((r) => r.status === "Solved").length,
    urgent: reports.filter((r) => r.urgent).length,
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["employee"]}>
        <DashboardLayout title="Employee Dashboard">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <DashboardLayout title="Employee Dashboard">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/employee/dashboard/reports/new" className="flex-1">
              <Button className="w-full h-12">
                <Plus className="mr-2 h-4 w-4" />
                Submit Report for Farmer
              </Button>
            </Link>
            <Link href="/employee/dashboard/reports" className="flex-1">
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
                <CardTitle className="text-sm font-medium">Assigned Reports</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssigned}</div>
                <p className="text-xs text-muted-foreground">Currently assigned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
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
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Successfully resolved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
                <p className="text-xs text-muted-foreground">Requires immediate attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Assigned Reports */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Reports</CardTitle>
                  <CardDescription>Reports assigned to you and available for assignment</CardDescription>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-semibold text-foreground">No reports assigned</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Check back later for new assignments or help farmers submit reports.
                      </p>
                      <div className="mt-6">
                        <Link href="/employee/dashboard/reports/new">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Submit Report for Farmer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports.slice(0, 5).map((report) => (
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
                              {report.farmer && (
                                <div className="flex items-center">
                                  <Users className="mr-1 h-3 w-3" />
                                  Farmer ID: {report.farmer}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex items-center space-x-2">
                            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                            {!report.urgent && report.status === "Pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkUrgent(report._id)}
                                className="text-xs"
                              >
                                Mark Urgent
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {reports.length > 5 && (
                        <div className="text-center pt-4">
                          <Link href="/employee/dashboard/reports">
                            <Button variant="outline">View All Reports</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notifications & Quick Stats */}
            <div className="space-y-6">
              {/* Notifications */}
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
                          <Link href="/employee/dashboard/notifications">
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

              {/* Work History Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Work History</CardTitle>
                  <CardDescription>Your recent completed work</CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No completed work yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <p className="text-sm text-muted-foreground">Reports completed this month</p>
                      <Link href="/employee/dashboard/history">
                        <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                          View Full History
                        </Button>
                      </Link>
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
