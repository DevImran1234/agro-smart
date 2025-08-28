"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type EmployeeLocation, type LocationStats } from "@/lib/api"
import { 
  MapPin, 
  Users, 
  Clock, 
  Wifi, 
  WifiOff, 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowLeft, 
  Eye,
  Map,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  Navigation
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function EmployeeLocationsPage() {
  const [locations, setLocations] = useState<EmployeeLocation[]>([])
  const [stats, setStats] = useState<LocationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLocations, setTotalLocations] = useState(0)
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    region: ""
  })
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [employeeHistory, setEmployeeHistory] = useState<any>(null)
  const [showMap, setShowMap] = useState(false)
  const { user, isAuthenticated } = useAuth()

  console.log("[EmployeeLocationsPage] Rendering with user:", user?.role, "isAuthenticated:", isAuthenticated)

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("[EmployeeLocationsPage] User authenticated, fetching data")
      fetchLocations()
      fetchStats()
    } else {
      console.log("[EmployeeLocationsPage] User not authenticated yet, skipping fetch")
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchLocations()
    }
  }, [currentPage, filters])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      setError("")
      console.log("[EmployeeLocationsPage] Fetching employee locations...")
      
      const params: any = { 
        page: currentPage, 
        limit: 20,
        ...filters
      }
      
      const data = await ApiService.getEmployeeLocations(params)
      console.log("[EmployeeLocationsPage] Locations fetched:", data)
      
      setLocations(data.locations)
      setCurrentPage(data.pagination.currentPage)
      setTotalPages(data.pagination.totalPages)
      setTotalLocations(data.pagination.totalLocations)
    } catch (err: any) {
      console.error("[EmployeeLocationsPage] Error fetching locations:", err)
      setError(err.message || "Failed to fetch employee locations")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await ApiService.getLocationStats()
      setStats(data)
    } catch (err: any) {
      console.error("[EmployeeLocationsPage] Error fetching stats:", err)
    }
  }

  const fetchEmployeeHistory = async (employeeId: string) => {
    try {
      const data = await ApiService.getEmployeeLocation(employeeId, true)
      setEmployeeHistory(data)
      setSelectedEmployee(employeeId)
    } catch (err: any) {
      console.error("[EmployeeLocationsPage] Error fetching employee history:", err)
      setError(err.message || "Failed to fetch employee history")
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "busy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "offline":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDeviceIcon = (device: any) => {
    if (!device) return <Monitor className="h-4 w-4" />
    
    const deviceType = device.deviceType?.toLowerCase() || ""
    if (deviceType.includes("mobile") || deviceType.includes("phone")) {
      return <Smartphone className="h-4 w-4" />
    } else if (deviceType.includes("tablet")) {
      return <Tablet className="h-4 w-4" />
    } else {
      return <Monitor className="h-4 w-4" />
    }
  }

  const formatLastActivity = (lastActivity: string) => {
    const now = new Date()
    const activity = new Date(lastActivity)
    const diffMs = now.getTime() - activity.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getActivityStatus = (lastActivity: string) => {
    const now = new Date()
    const activity = new Date(lastActivity)
    const diffMs = now.getTime() - activity.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 5) return "recent"
    if (diffMins < 30) return "moderate"
    return "old"
  }

  if (!isAuthenticated || !user) {
    console.log("[EmployeeLocationsPage] User not authenticated, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Employee Locations">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (loading && !stats) {
    console.log("[EmployeeLocationsPage] Still loading, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Employee Locations">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  console.log("[EmployeeLocationsPage] Rendering main content")

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title="Employee Locations">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Employee Location Tracking</h1>
              <p className="text-muted-foreground">Monitor employee locations and activity in real-time</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => { fetchLocations(); fetchStats(); }} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => setShowMap(!showMap)}>
                <Map className="mr-2 h-4 w-4" />
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{stats.overview.totalEmployees}</p>
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.overview.onlineEmployees}</p>
                      <p className="text-sm text-muted-foreground">Online ({stats.overview.onlinePercentage}%)</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
              {/* <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <WifiOff className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">{stats.overview.offlineEmployees}</p>
                      <p className="text-sm text-muted-foreground">Offline</p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {currentPage} / {totalPages}
                      </p>
                      <p className="text-sm text-muted-foreground">Page</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="busy">Busy</option>
                    <option value="available">Available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Filter by city..."
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <input
                    type="text"
                    placeholder="Filter by region..."
                    value={filters.region}
                    onChange={(e) => handleFilterChange("region", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-destructive">
                  <Activity className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employee Locations List */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Locations</CardTitle>
              <CardDescription>
                {locations.length} of {totalLocations} employee{locations.length !== 1 ? "s" : ""} tracked
              </CardDescription>
            </CardHeader>
            <CardContent>
              {locations.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    {totalLocations === 0 ? "No employees tracked" : "No employees match your filters"}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {totalLocations === 0 
                      ? "Employee location tracking will appear here once employees start using the system."
                      : "Try adjusting your filter criteria."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {locations.map((location) => {
                    const activityStatus = getActivityStatus(location.lastActivity)
                    return (
                      <div
                        key={location.id}
                        className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                          activityStatus === "recent" ? "bg-green-50 border-green-200" :
                          activityStatus === "moderate" ? "bg-yellow-50 border-yellow-200" :
                          "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {getDeviceIcon(location.device)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-medium text-foreground">
                              {location.employee.username}
                            </h3>
                            <Badge className={`text-xs ${getStatusColor(location.status)}`}>
                              {location.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {location.employee.email}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{location.address.formatted}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatLastActivity(location.lastActivity)}</span>
                            </div>
                            {location.isRecent && (
                              <Badge variant="secondary" className="text-xs">
                                Recent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="text-xs text-muted-foreground">
                              <strong>Coordinates:</strong> {location.location.latitude.toFixed(6)}, {location.location.longitude.toFixed(6)}
                            </div>
                            {location.location.accuracy && (
                              <div className="text-xs text-muted-foreground">
                                <strong>Accuracy:</strong> ±{location.location.accuracy}m
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchEmployeeHistory(location.employee.id)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            History
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Open in Google Maps
                              const url = `https://www.google.com/maps?q=${location.location.latitude},${location.location.longitude}`
                              window.open(url, '_blank')
                            }}
                            className="text-xs"
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Map
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employee History Modal */}
          {selectedEmployee && employeeHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Location History</CardTitle>
                <CardDescription>
                  Location history for {employeeHistory.employee?.username || 'Employee'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.isArray(employeeHistory.locations) ? (
                    employeeHistory.locations.map((loc: any, index: number) => (
                      <div key={loc.id || index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {new Date(loc.lastActivity || loc.createdAt).toLocaleString()}
                            </span>
                            <Badge className={`text-xs ${getStatusColor(loc.status)}`}>
                              {loc.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {loc.address} • {loc.location.latitude.toFixed(6)}, {loc.location.longitude.toFixed(6)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const url = `https://www.google.com/maps?q=${loc.location.latitude},${loc.location.longitude}`
                            window.open(url, '_blank')
                          }}
                          className="text-xs"
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Map
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No location history available
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEmployee(null)
                      setEmployeeHistory(null)
                    }}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{status}</span>
                        <Badge className={`text-xs ${getStatusColor(status)}`}>
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Cities */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.topCities.map((city) => (
                      <div key={city._id} className="flex items-center justify-between">
                        <span className="text-sm">{city._id}</span>
                        <Badge variant="outline" className="text-xs">
                          {city.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
