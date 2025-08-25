"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService } from "@/lib/api"
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  LineChart,
  Smartphone,
  Globe,
  Clock,
  Target,
  Award,
  Shield,
  Eye,
  Download,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart as RechartsLineChart, Line, CartesianGrid, Tooltip, Legend } from "recharts"

const COLORS = ["#164e63", "#f59e0b", "#dc2626", "#059669", "#7c3aed", "#7c2d12", "#be185d", "#0891b2"]

interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisMonth: number
  newUsersLastMonth: number
  userGrowthRate: number
  farmers: number
  employees: number
  admins: number
  verifiedUsers: number
  unverifiedUsers: number
}

interface UserActivity {
  date: string
  activeUsers: number
  newRegistrations: number
  loginCount: number
  reportSubmissions: number
}

interface UserLocation {
  region: string
  userCount: number
  percentage: number
}

interface DeviceStats {
  device: string
  count: number
  percentage: number
}

interface UserEngagement {
  metric: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
}

export default function UserAnalytics() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [userLocations, setUserLocations] = useState<UserLocation[]>([])
  const [deviceStats, setDeviceStats] = useState<DeviceStats[]>([])
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - replace with actual API calls
        const mockUserStats: UserStats = {
          totalUsers: 1247,
          activeUsers: 892,
          inactiveUsers: 355,
          newUsersThisMonth: 89,
          newUsersLastMonth: 76,
          userGrowthRate: 17.1,
          farmers: 1023,
          employees: 198,
          admins: 26,
          verifiedUsers: 1189,
          unverifiedUsers: 58,
        }

        const mockUserActivity: UserActivity[] = [
          { date: "2024-01-01", activeUsers: 156, newRegistrations: 12, loginCount: 234, reportSubmissions: 45 },
          { date: "2024-01-02", activeUsers: 162, newRegistrations: 8, loginCount: 245, reportSubmissions: 52 },
          { date: "2024-01-03", activeUsers: 158, newRegistrations: 15, loginCount: 238, reportSubmissions: 48 },
          { date: "2024-01-04", activeUsers: 165, newRegistrations: 11, loginCount: 251, reportSubmissions: 55 },
          { date: "2024-01-05", activeUsers: 172, newRegistrations: 9, loginCount: 267, reportSubmissions: 61 },
          { date: "2024-01-06", activeUsers: 168, newRegistrations: 7, loginCount: 259, reportSubmissions: 58 },
          { date: "2024-01-07", activeUsers: 175, newRegistrations: 13, loginCount: 273, reportSubmissions: 64 },
        ]

        const mockUserLocations: UserLocation[] = [
          { region: "Punjab", userCount: 456, percentage: 36.6 },
          { region: "Sindh", userCount: 234, percentage: 18.8 },
          { region: "Khyber Pakhtunkhwa", userCount: 189, percentage: 15.2 },
          { region: "Balochistan", userCount: 123, percentage: 9.9 },
          { region: "Islamabad", userCount: 98, percentage: 7.9 },
          { region: "Other", userCount: 147, percentage: 11.8 },
        ]

        const mockDeviceStats: DeviceStats[] = [
          { device: "Mobile", count: 892, percentage: 71.5 },
          { device: "Desktop", count: 298, percentage: 23.9 },
          { device: "Tablet", count: 57, percentage: 4.6 },
        ]

        const mockUserEngagement: UserEngagement[] = [
          { metric: "Daily Active Users", value: 175, change: 12.3, trend: "up" },
          { metric: "Weekly Active Users", value: 892, change: 8.7, trend: "up" },
          { metric: "Monthly Active Users", value: 1247, change: 17.1, trend: "up" },
          { metric: "Session Duration", value: 24, change: -2.1, trend: "down" },
          { metric: "Pages per Session", value: 8.5, change: 5.2, trend: "up" },
          { metric: "Bounce Rate", value: 32, change: -8.5, trend: "down" },
        ]

        setUserStats(mockUserStats)
        setUserActivity(mockUserActivity)
        setUserLocations(mockUserLocations)
        setDeviceStats(mockDeviceStats)
        setUserEngagement(mockUserEngagement)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading user analytics...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Alert variant="destructive">
            <AlertDescription>Error loading user analytics: {error}</AlertDescription>
          </Alert>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive insights into user behavior, growth, and engagement
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("7d")}
              >
                7D
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30d")}
              >
                30D
              </Button>
              <Button
                variant={timeRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("90d")}
              >
                90D
              </Button>
              <Button
                variant={timeRange === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1y")}
              >
                1Y
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{userStats?.userGrowthRate}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {userStats ? Math.round((userStats.activeUsers / userStats.totalUsers) * 100) : 0}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.newUsersThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  This month ({userStats ? Math.round((userStats.newUsersThisMonth / userStats.totalUsers) * 100) : 0}% growth)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.verifiedUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {userStats ? Math.round((userStats.verifiedUsers / userStats.totalUsers) * 100) : 0}% verification rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Growth Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>User Growth & Activity</CardTitle>
              <CardDescription>User registration and activity trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer>
                <RechartsLineChart data={userActivity} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activeUsers" stroke="#164e63" strokeWidth={2} />
                  <Line type="monotone" dataKey="newRegistrations" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="loginCount" stroke="#059669" strokeWidth={2} />
                  <Line type="monotone" dataKey="reportSubmissions" stroke="#dc2626" strokeWidth={2} />
                </RechartsLineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Types Distribution</CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "Farmers", value: userStats?.farmers || 0 },
                        { name: "Employees", value: userStats?.employees || 0 },
                        { name: "Admins", value: userStats?.admins || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userLocations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="userCount" fill="#164e63" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Device Usage & Engagement */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>How users access the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceStats.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{device.count} users</span>
                        <Badge variant="secondary">{device.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userEngagement.map((metric) => (
                    <div key={metric.metric} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{metric.value}</span>
                        <div className="flex items-center space-x-1">
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : metric.trend === "down" ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <Activity className="h-4 w-4 text-gray-600" />
                          )}
                          <span
                            className={`text-xs ${
                              metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-gray-600"
                            }`}
                          >
                            {metric.change > 0 ? "+" : ""}{metric.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Activity Insights */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity Insights</CardTitle>
              <CardDescription>Detailed analysis of user behavior patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Peak Usage Times</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>Morning: 8:00 AM - 11:00 AM</div>
                    <div>Afternoon: 2:00 PM - 5:00 PM</div>
                    <div>Evening: 7:00 PM - 9:00 PM</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Most Active Days</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>Monday: 18% of weekly activity</div>
                    <div>Wednesday: 16% of weekly activity</div>
                    <div>Friday: 15% of weekly activity</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">User Retention</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>Day 1: 85%</div>
                    <div>Day 7: 62%</div>
                    <div>Day 30: 41%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
