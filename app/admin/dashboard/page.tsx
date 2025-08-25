"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  ApiService,
  type Report,
  type Notification,
  type RegionStats,
  type EmployeePerformance,
  type Product,
} from "@/lib/api"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  MapPin,
  Bell,
  BarChart3,
  Package,
  Target,
  Award,
} from "lucide-react"
import Link from "next/link"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const COLORS = ["#164e63", "#f59e0b", "#dc2626", "#059669", "#7c3aed"]

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [regionStats, setRegionStats] = useState<RegionStats[]>([])
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, notificationsData, regionData, performanceData, productsData] = await Promise.all([
          ApiService.getAdminReports(),
          ApiService.getAdminNotifications(),
          ApiService.getRegionStats(),
          ApiService.getEmployeePerformance(),
          ApiService.getProducts(),
        ])
        setReports(reportsData)
        setNotifications(notificationsData)
        setRegionStats(regionData)
        setEmployeePerformance(performanceData)
        setProducts(productsData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
    totalReports: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    inProgress: reports.filter((r) => r.status === "In Progress").length,
    solved: reports.filter((r) => r.status === "Solved").length,
    urgent: reports.filter((r) => r.urgent).length,
    totalProducts: products.length,
    totalEmployees: employeePerformance.length,
    avgResolutionRate:
      employeePerformance.length > 0
        ? Math.round(
            (employeePerformance.reduce((acc, emp) => acc + emp.solvedReports, 0) / employeePerformance.length) * 100,
          ) / 100
        : 0,
  }

  const statusData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { name: "Solved", value: stats.solved, color: "#10b981" },
  ]

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Admin Dashboard">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title="Admin Dashboard">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/admin/dashboard/reports" className="flex-1">
              <Button className="w-full h-12">
                <FileText className="mr-2 h-4 w-4" />
                Manage Reports
              </Button>
            </Link>
            <Link href="/admin/dashboard/products" className="flex-1">
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/dashboard/user-analytics" className="flex-1">
              <Button variant="outline" className="w-full h-12 bg-transparent">
                <BarChart3 className="mr-2 h-4 w-4" />
                User Analytics
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
                <div className="text-2xl font-bold">{stats.totalReports}</div>
                <p className="text-xs text-muted-foreground">System-wide submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting diagnosis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
                <p className="text-xs text-muted-foreground">Field workers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.avgResolutionRate}</div>
                <p className="text-xs text-muted-foreground">Avg per employee</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">1,247</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Status Distribution</CardTitle>
                  <CardDescription>Current status breakdown of all reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        status: {
                          label: "Status",
                          color: "#8884d8"
                        },
                        value: {
                          label: "Count",
                          color: "#82ca9d"
                        }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {statusData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm text-muted-foreground">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Regional Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Reports by Region</CardTitle>
                  <CardDescription>Geographic distribution of crop issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        _id: {
                          label: "Region",
                          color: "#164e63"
                        },
                        count: {
                          label: "Report Count",
                          color: "#164e63"
                        }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionStats.slice(0, 8)}>
                          <XAxis dataKey="_id" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="#164e63" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Recent Urgent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                    Urgent Reports
                  </CardTitle>
                  <CardDescription>Reports requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {reports.filter((r) => r.urgent).length === 0 ? (
                    <div className="text-center py-4">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
                      <p className="mt-2 text-sm text-muted-foreground">No urgent reports</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reports
                        .filter((r) => r.urgent)
                        .slice(0, 3)
                        .map((report) => (
                          <div key={report._id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-foreground">{report.crop}</h4>
                              <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{report.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {report.region}
                            </div>
                          </div>
                        ))}
                      <Link href="/admin/dashboard/reports?filter=urgent">
                        <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                          View All Urgent
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Performing Employees */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-4 w-4 text-secondary" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Employees with most resolved reports</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeePerformance.length === 0 ? (
                    <div className="text-center py-4">
                      <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">No performance data</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {employeePerformance
                        .sort((a, b) => b.solvedReports - a.solvedReports)
                        .slice(0, 5)
                        .map((employee, index) => (
                          <div key={employee._id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {index + 1}
                              </div>
                              <span className="text-sm font-medium">Employee {employee._id}</span>
                            </div>
                            <Badge variant="secondary">{employee.solvedReports} solved</Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    System Notifications
                  </CardTitle>
                  <CardDescription>Recent system alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-4">
                      <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.slice(0, 3).map((notification) => (
                        <div key={notification._id} className="p-3 border border-border rounded-lg bg-card">
                          <p className="text-sm text-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      <Link href="/admin/dashboard/notifications">
                        <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                          View All
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
