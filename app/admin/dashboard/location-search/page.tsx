"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService } from "@/lib/api"
import { 
  MapPin, 
  Search, 
  Navigation, 
  Users, 
  Map, 
  ArrowLeft, 
  RefreshCw,
  Globe,
  Clock,
  Wifi
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function LocationSearchPage() {
  const [searchParams, setSearchParams] = useState({
    latitude: "",
    longitude: "",
    radius: "10"
  })
  const [searchResults, setSearchResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, isAuthenticated } = useAuth()

  console.log("[LocationSearchPage] Rendering with user:", user?.role, "isAuthenticated:", isAuthenticated)

  const handleSearch = async () => {
    if (!searchParams.latitude || !searchParams.longitude) {
      setError("Please enter both latitude and longitude")
      return
    }

    try {
      setLoading(true)
      setError("")
      console.log("[LocationSearchPage] Searching employees by location...")
      
      const data = await ApiService.searchEmployeesByLocation({
        latitude: parseFloat(searchParams.latitude),
        longitude: parseFloat(searchParams.longitude),
        radius: parseFloat(searchParams.radius),
        limit: 50
      })
      
      console.log("[LocationSearchPage] Search results:", data)
      setSearchResults(data)
    } catch (err: any) {
      console.error("[LocationSearchPage] Error searching locations:", err)
      setError(err.message || "Failed to search locations")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchParams(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }))
        },
        (error) => {
          console.error("Error getting current location:", error)
          setError("Failed to get current location. Please enter coordinates manually.")
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
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

  if (!isAuthenticated || !user) {
    console.log("[LocationSearchPage] User not authenticated, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout title="Location Search">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  console.log("[LocationSearchPage] Rendering main content")

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title="Location Search">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Location Search</h1>
              <p className="text-muted-foreground">Find employees within a specific radius of coordinates</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Parameters</span>
              </CardTitle>
              <CardDescription>
                Enter coordinates and radius to find nearby employees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g., 40.7128"
                    value={searchParams.latitude}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, latitude: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g., -74.0060"
                    value={searchParams.longitude}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, longitude: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Radius (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    placeholder="10"
                    value={searchParams.radius}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, radius: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleSearch} 
                  disabled={loading || !searchParams.latitude || !searchParams.longitude}
                  className="flex-1"
                >
                  {loading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search Employees
                </Button>
                <Button 
                  variant="outline" 
                  onClick={getCurrentLocation}
                  disabled={loading}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Use My Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-destructive">
                  <MapPin className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {searchResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Search Results</span>
                </CardTitle>
                <CardDescription>
                  Found {searchResults.totalFound} employee{searchResults.totalFound !== 1 ? "s" : ""} within {searchResults.searchLocation.radius}km of {searchResults.searchLocation.latitude.toFixed(6)}, {searchResults.searchLocation.longitude.toFixed(6)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchResults.employees.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No employees found</h3>
                    <p className="mt-2 text-muted-foreground">
                      No employees were found within the specified radius. Try increasing the radius or checking different coordinates.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.employees.map((employee: any, index: number) => (
                      <div
                        key={employee.employee.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border transition-colors hover:bg-muted/50"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-medium text-foreground">
                              {employee.employee.username}
                            </h3>
                            <Badge className={`text-xs ${getStatusColor(employee.status)}`}>
                              {employee.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {employee.location.distance}km away
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{employee.address}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatLastActivity(employee.lastActivity)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="text-xs text-muted-foreground">
                              <strong>Coordinates:</strong> {employee.location.latitude.toFixed(6)}, {employee.location.longitude.toFixed(6)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <strong>Email:</strong> {employee.employee.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Open in Google Maps
                              const url = `https://www.google.com/maps?q=${employee.location.latitude},${employee.location.longitude}`
                              window.open(url, '_blank')
                            }}
                            className="text-xs"
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Map
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Open directions from search location to employee
                              const url = `https://www.google.com/maps/dir/${searchResults.searchLocation.latitude},${searchResults.searchLocation.longitude}/${employee.location.latitude},${employee.location.longitude}`
                              window.open(url, '_blank')
                            }}
                            className="text-xs"
                          >
                            <Map className="h-3 w-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Search Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Search Examples</CardTitle>
              <CardDescription>
                Common locations for quick testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({
                    latitude: "40.7128",
                    longitude: "-74.0060",
                    radius: "10"
                  })}
                  className="justify-start"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  New York City
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({
                    latitude: "34.0522",
                    longitude: "-118.2437",
                    radius: "10"
                  })}
                  className="justify-start"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Los Angeles
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({
                    latitude: "51.5074",
                    longitude: "-0.1278",
                    radius: "10"
                  })}
                  className="justify-start"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  London
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({
                    latitude: "48.8566",
                    longitude: "2.3522",
                    radius: "10"
                  })}
                  className="justify-start"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Paris
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({
                    latitude: "35.6762",
                    longitude: "139.6503",
                    radius: "10"
                  })}
                  className="justify-start"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Tokyo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({
                    latitude: "-33.8688",
                    longitude: "151.2093",
                    radius: "10"
                  })}
                  className="justify-start"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Sydney
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
