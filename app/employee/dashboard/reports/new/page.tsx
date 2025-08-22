"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService } from "@/lib/api"
import { Upload, FileText, MapPin, Users, Navigation } from "lucide-react"

export default function NewEmployeeReportPage() {
  const [formData, setFormData] = useState({
    farmerId: "",
    crop: "",
    description: "",
    region: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationLoading(false)
        },
        (error) => {
          setError("Failed to get location: " + error.message)
          setLocationLoading(false)
        },
      )
    } else {
      setError("Geolocation is not supported by this browser")
      setLocationLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Create the report first
      const report = await ApiService.createEmployeeReport(formData)

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          await ApiService.uploadEmployeeReportFile(report._id, file)
        }
      }

      // Add location if available
      if (location) {
        await ApiService.updateReportLocation(report._id, location)
      }

      setSuccess("Report submitted successfully!")
      setTimeout(() => {
        router.push("/employee/dashboard/reports")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <DashboardLayout title="Submit Report for Farmer">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Field Report Submission
              </CardTitle>
              <CardDescription>Submit a crop issue report on behalf of a farmer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="farmerId">Farmer ID *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="farmerId"
                      placeholder="Enter farmer's ID or identifier"
                      value={formData.farmerId}
                      onChange={(e) => handleInputChange("farmerId", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crop">Crop Type *</Label>
                  <Input
                    id="crop"
                    placeholder="e.g., Wheat, Rice, Corn, Tomatoes"
                    value={formData.crop}
                    onChange={(e) => handleInputChange("crop", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region/Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="region"
                      placeholder="e.g., North Field, Sector A, Village Name"
                      value={formData.region}
                      onChange={(e) => handleInputChange("region", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Problem Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail - symptoms, affected area, when it started, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* GPS Location */}
                <div className="space-y-2">
                  <Label>GPS Location</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="flex-1 bg-transparent"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      {locationLoading ? "Getting Location..." : "Get Current Location"}
                    </Button>
                  </div>
                  {location && (
                    <div className="text-sm text-muted-foreground">
                      Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">Upload Photos/Videos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Upload images or videos of the affected crops</p>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Selected files: {files.map((f) => f.name).join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit Report"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
