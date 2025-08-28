"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, User, Bell, Shield, Save, MapPin, Clock, Target } from "lucide-react"
import Link from "next/link"

export default function EmployeeSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [locationSharing, setLocationSharing] = useState(true)

  const handleSave = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <DashboardLayout title="Employee Settings">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Employee Settings</h1>
              <p className="text-muted-foreground">Manage your employee account and work preferences</p>
            </div>
            <Link href="/employee/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Employee Profile</span>
              </CardTitle>
              <CardDescription>Your employee account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={user.username} disabled />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} disabled />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={user.firstName || ""} disabled />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={user.lastName || ""} disabled />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={user.role || "employee"} disabled />
                  </div>
                  <div>
                    <Label htmlFor="region">Assigned Region</Label>
                    <Input id="region" value={user.region || ""} disabled />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" value={user._id || ""} disabled />
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Loading profile...</p>
              )}
            </CardContent>
          </Card>

          {/* Work Preferences */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Work Preferences</span>
              </CardTitle>
              <CardDescription>Manage your work-related settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="locationSharing">Location Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share your location for field assignments</p>
                </div>
                <input
                  type="checkbox"
                  id="locationSharing"
                  checked={locationSharing}
                  onChange={(e) => setLocationSharing(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Get work assignments and updates via email</p>
                </div>
                <input
                  type="checkbox"
                  id="emailUpdates"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsAlerts">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive urgent work alerts via SMS</p>
                </div>
                <input
                  type="checkbox"
                  id="smsAlerts"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Notification Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose how you want to receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                </div>
                <input
                  type="checkbox"
                  id="notifications"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Security Settings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Login History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Device Management
              </Button>
            </CardContent>
          </Card> */}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
