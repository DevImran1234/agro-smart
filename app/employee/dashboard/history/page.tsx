"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type Report } from "@/lib/api"
import { FileText, MapPin, Calendar, CheckCircle, Award, TrendingUp } from "lucide-react"

export default function EmployeeHistoryPage() {
  const [history, setHistory] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await ApiService.getEmployeeHistory()
        setHistory(historyData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const stats = {
    totalSubmitted: history.length,
    solved: history.filter((r) => r.status === "Solved").length,
    thisMonth: history.filter((r) => {
      const reportDate = new Date(r.createdAt)
      const now = new Date()
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
    }).length,
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["employee"]}>
        <DashboardLayout title="Work History">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <DashboardLayout title="Work History">
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">Work History</h2>
            <p className="text-muted-foreground">Track your completed work and performance metrics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submitted</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubmitted}</div>
                <p className="text-xs text-muted-foreground">Reports submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successfully Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.solved}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalSubmitted > 0 ? Math.round((stats.solved / stats.totalSubmitted) * 100) : 0}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">Reports this month</p>
              </CardContent>
            </Card>
          </div>

          {/* History List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Completed Work
              </CardTitle>
              <CardDescription>Your submitted reports and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">No work history yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your submitted reports will appear here once you start helping farmers.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((report) => (
                    <div
                      key={report._id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{report.crop}</h4>
                          <Badge
                            className={
                              report.status === "Solved"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : report.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {report.status}
                          </Badge>
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
                        </div>
                      </div>
                      {report.status === "Solved" && (
                        <div className="ml-4">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      )}
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
