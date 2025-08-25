"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminTestPage() {
  console.log("[AdminTestPage] Component rendered")
  
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout title="Admin Test Page">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Route Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you can see this page, the admin route is working correctly!</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This is a test page to verify admin routing functionality.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

