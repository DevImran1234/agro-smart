const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface Report {
  _id: string
  farmer: string | { _id: string; username: string; email: string; role: string }
  crop: string
  description: string
  region: string
  voiceNotes?: string
  status: "Pending" | "In Progress" | "Solved"
  urgent?: boolean
  images: string[]
  diagnosis?: string
  solution?: string
  recommendedProducts?: Array<{
    name: string
    dosage?: string
    applicationGuide?: string
    _id: string
  }>
  createdAt: string
  updatedAt?: string
  location?: { lat: number; lng: number }
}

export interface Notification {
  _id: string
  userId: string
  message: string
  createdAt: string
  read?: boolean
  isRead?: boolean
  readAt?: string
  receiver?: string
  relatedReport?: {
    _id: string
    crop: string
    description: string
    status: string
  }
}

export interface Product {
  _id: string
  name: string
  description: string
  category: string
  price: number
  manufacturer: string
  createdAt: string
}

export interface RegionStats {
  _id: string
  count: number
}

export interface EmployeePerformance {
  _id: string
  solvedReports: number
}

export interface EmployeeLocation {
  id: string
  employee: {
    id: string
    username: string
    email: string
    role: string
  }
  location: {
    latitude: number
    longitude: number
    accuracy?: number
  }
  address: {
    formatted: string
    city: string
    region: string
    country: string
  }
  status: string
  lastActivity: string
  isRecent: boolean
  device: any
  ipAddress: string
}

export interface LocationStats {
  overview: {
    totalEmployees: number
    onlineEmployees: number
    offlineEmployees: number
    onlinePercentage: number
  }
  statusBreakdown: Record<string, number>
  topCities: Array<{ _id: string; count: number }>
  deviceBreakdown: Record<string, number>
  lastUpdated: string
}

export interface GeminiMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface GeminiChat {
  id: string
  reportId?: string
  messages: GeminiMessage[]
  createdAt: string
  updatedAt: string
}

export interface GeminiAnalysis {
  reportId: string
  analysis: {
    diagnosis: string
    confidence: number
    recommendations: string[]
    severity: "low" | "medium" | "high" | "critical"
    suggestedProducts: string[]
    treatmentPlan: string[]
  }
  createdAt: string
}

export class ApiService {
  static getAuthHeaders() {
    const token = localStorage.getItem("auth_token")
    console.log("[API] Getting auth headers, token exists:", !!token)
    console.log("[API] Token value:", token ? `${token.substring(0, 20)}...` : "none")
    
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }
    
    console.log("[API] Final headers:", headers)
    return headers
  }

  // Farmer API methods
  static async getFarmerReports(): Promise<Report[]> {
    console.log("[API] Fetching farmer reports from:", `${API_BASE_URL}/api/farmers/farmer/reports`)
    console.log("[API] Auth headers:", this.getAuthHeaders())
    
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/reports`, {
      headers: this.getAuthHeaders(),
    })
    
    console.log("[API] Response status:", response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[API] Error response:", errorText)
      throw new Error(`Failed to fetch reports: ${response.status} ${errorText}`)
    }
    
    const data = await response.json()
    console.log("[API] Reports data:", data)
    return data
  }

  static async createFarmerReport(reportData: {
    crop: string
    description: string
    region: string
    voiceNotes?: string
  }): Promise<Report> {
    console.log("[API] Creating farmer report with data:", reportData)
    console.log("[API] Sending to endpoint:", `${API_BASE_URL}/api/farmers/farmer/reports`)
    
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/reports`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reportData),
    })
    
    console.log("[API] Create report response status:", response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[API] Create report error response:", errorText)
      throw new Error(`Failed to create report: ${response.status} ${errorText}`)
    }
    
    const data = await response.json()
    console.log("[API] Report created successfully:", data)
    return data
  }

  static async uploadReportFile(reportId: string, file: File): Promise<Report> {
    console.log("[API] Uploading file for report:", reportId)
    console.log("[API] File details:", { name: file.name, size: file.size, type: file.type })
    
    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem("auth_token")
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/reports/${reportId}/upload`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    })
    
    console.log("[API] File upload response status:", response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[API] File upload error response:", errorText)
      throw new Error(`Failed to upload file: ${response.status} ${errorText}`)
    }
    
    const data = await response.json()
    console.log("[API] File uploaded successfully:", data)
    return data
  }

  static async getReportStatus(
    reportId: string,
  ): Promise<{ status: string; diagnosis?: string; solution?: string; recommendedProducts?: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/reports/${reportId}/status`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch report status")
    return response.json()
  }

  static async getReportDiagnosis(
    reportId: string,
  ): Promise<{ diagnosis?: string; solution?: string; recommendedProducts?: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/reports/${reportId}/diagnosis`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch diagnosis")
    return response.json()
  }

  static async getFarmerNotifications(): Promise<Notification[]> {
    console.log("[API] Fetching farmer notifications from:", `${API_BASE_URL}/api/farmers/farmer/notifications`)
    console.log("[API] Auth headers:", this.getAuthHeaders())
    
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications`, {
      headers: this.getAuthHeaders(),
    })
    
    console.log("[API] Notifications response status:", response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[API] Notifications error response:", errorText)
      throw new Error(`Failed to fetch notifications: ${response.status} ${errorText}`)
    }
    
    const data = await response.json()
    console.log("[API] Notifications data:", data)
    return data
  }

  // New comprehensive notification methods for farmers
  static async markFarmerNotificationAsRead(notificationId: string): Promise<{ message: string; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark notification as read")
    return response.json()
  }

  static async markFarmerNotificationAsUnread(notificationId: string): Promise<{ message: string; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications/${notificationId}/unread`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark notification as unread")
    return response.json()
  }

  static async markAllFarmerNotificationsAsRead(): Promise<{ message: string; modifiedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications/read-all`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark all notifications as read")
    return response.json()
  }

  static async getFarmerUnreadNotificationsCount(): Promise<{ unreadCount: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications/unread-count`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to get unread notifications count")
    return response.json()
  }

  static async getFarmerNotificationsWithStatus(params?: {
    page?: number
    limit?: number
    status?: 'read' | 'unread'
  }): Promise<{
    notifications: Notification[]
    pagination: {
      currentPage: number
      totalPages: number
      totalNotifications: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)

    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications/with-status?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch notifications with status")
    return response.json()
  }

  static async deleteFarmerNotification(notificationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications/${notificationId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete notification")
    return response.json()
  }

  static async clearFarmerReadNotifications(): Promise<{ message: string; deletedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/notifications/clear-read`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to clear read notifications")
    return response.json()
  }

  static async getFarmerHistory(farmerId: string): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/farmer/${farmerId}/history`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch farmer history")
    return response.json()
  }

  // Employee API methods
  static async getEmployeeReports(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/reports`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee reports")
    return response.json()
  }

  static async createEmployeeReport(reportData: {
    farmerId: string
    crop: string
    description: string
    region: string
  }): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/reports`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reportData),
    })
    if (!response.ok) throw new Error("Failed to create employee report")
    return response.json()
  }

  static async uploadEmployeeReportFile(reportId: string, file: File): Promise<Report> {
    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem("auth_token")
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/reports/${reportId}/upload`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to upload file")
    return response.json()
  }

  static async updateReportLocation(reportId: string, location: { lat: number; lng: number }): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/reports/${reportId}/location`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(location),
    })
    if (!response.ok) throw new Error("Failed to update location")
    return response.json()
  }

  static async getEmployeeReportStatus(reportId: string): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/reports/${reportId}/status`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch report status")
    return response.json()
  }

  static async getEmployeeHistory(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/history`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee history")
    return response.json()
  }

  static async markReportUrgent(reportId: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/reports/${reportId}/urgent`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark report as urgent")
    return response.json()
  }

  static async getEmployeeNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee notifications")
    return response.json()
  }

  // New comprehensive notification methods for employees (similar to farmers)
  static async markEmployeeNotificationAsRead(notificationId: string): Promise<{ message: string; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark notification as read")
    return response.json()
  }

  static async markEmployeeNotificationAsUnread(notificationId: string): Promise<{ message: string; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications/${notificationId}/unread`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark notification as unread")
    return response.json()
  }

  static async markAllEmployeeNotificationsAsRead(): Promise<{ message: string; modifiedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications/read-all`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark all notifications as read")
    return response.json()
  }

  static async getEmployeeUnreadNotificationsCount(): Promise<{ unreadCount: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications/unread-count`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to get unread notifications count")
    return response.json()
  }

  static async getEmployeeNotificationsWithStatus(params?: {
    page?: number
    limit?: number
    status?: 'read' | 'unread'
  }): Promise<{
    notifications: Notification[]
    pagination: {
      currentPage: number
      totalPages: number
      totalNotifications: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)

    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications/with-status?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch notifications with status")
    return response.json()
  }

  static async deleteEmployeeNotification(notificationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications/${notificationId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete notification")
    return response.json()
  }

  static async clearEmployeeReadNotifications(): Promise<{ message: string; deletedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/employee/notifications/clear-read`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to clear read notifications")
    return response.json()
  }

  // General report methods (from /api/farmers/reports)
  static async getAllReports(filters?: {
    status?: string
    region?: string
    crop?: string
  }): Promise<Report[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.region) params.append("region", filters.region)
    if (filters?.crop) params.append("crop", filters.crop)

    const response = await fetch(`${API_BASE_URL}/api/farmers/reports?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch all reports")
    return response.json()
  }

  static async updateReportStatus(
    reportId: string,
    updateData: {
      status: string
      diagnosis?: string
      solution?: string
      recommendedProducts?: string[]
    },
  ): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/api/farmers/reports/${reportId}/status`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    })
    if (!response.ok) throw new Error("Failed to update report status")
    return response.json()
  }

  // Admin API methods (these would be in /api/reports routes)
  static async getAdminNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch admin notifications")
    return response.json()
  }

  // New comprehensive notification methods for admins
  static async markAdminNotificationAsRead(notificationId: string): Promise<{ message: string; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark notification as read")
    return response.json()
  }

  static async markAdminNotificationAsUnread(notificationId: string): Promise<{ message: string; notification: any }> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications/${notificationId}/unread`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark notification as unread")
    return response.json()
  }

  static async markAllAdminNotificationsAsRead(): Promise<{ message: string; modifiedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications/read-all`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark all notifications as read")
    return response.json()
  }

  static async getAdminUnreadNotificationsCount(): Promise<{ unreadCount: number; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications/unread-count`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to get unread notifications count")
    return response.json()
  }

  static async getAdminNotificationsWithStatus(params?: {
    page?: number
    limit?: number
    status?: 'read' | 'unread'
  }): Promise<{
    notifications: Notification[]
    pagination: {
      currentPage: number
      totalPages: number
      totalNotifications: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)

    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications/with-status?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch notifications with status")
    return response.json()
  }

  static async deleteAdminNotification(notificationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications/${notificationId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete notification")
    return response.json()
  }

  static async clearAdminReadNotifications(): Promise<{ message: string; deletedCount: number }> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/notifications/clear-read`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to clear read notifications")
    return response.json()
  }

  // User Analytics API methods
  static async getUserAnalytics(timeRange: "7d" | "30d" | "90d" | "1y" = "30d"): Promise<{
    userStats: {
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
    userActivity: Array<{
      date: string
      activeUsers: number
      newRegistrations: number
      loginCount: number
      reportSubmissions: number
    }>
    userLocations: Array<{
      region: string
      userCount: number
      percentage: number
    }>
    deviceStats: Array<{
      device: string
      count: number
      percentage: number
    }>
    userEngagement: Array<{
      metric: string
      value: number
      change: number
      trend: "up" | "down" | "stable"
    }>
  }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/users?timeRange=${timeRange}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch user analytics")
    return response.json()
  }

  static async getUserGrowthData(timeRange: "7d" | "30d" | "90d" | "1y" = "30d"): Promise<{
    dates: string[]
    newUsers: number[]
    activeUsers: number[]
    totalUsers: number[]
  }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/users/growth?timeRange=${timeRange}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch user growth data")
    return response.json()
  }

  static async getUserRetentionData(): Promise<{
    day1: number
    day7: number
    day30: number
    day90: number
    day180: number
  }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/users/retention`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch user retention data")
    return response.json()
  }

  static async exportUserAnalytics(timeRange: "7d" | "30d" | "90d" | "1y" = "30d"): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/users/export?timeRange=${timeRange}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to export user analytics")
    return response.blob()
  }

  // Employee Location Tracking APIs for Admin
  static async getEmployeeLocations(params?: {
    status?: string
    city?: string
    region?: string
    limit?: number
    page?: number
  }): Promise<{
    locations: EmployeeLocation[]
    pagination: {
      currentPage: number
      totalPages: number
      totalLocations: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.city) searchParams.append('city', params.city)
    if (params?.region) searchParams.append('region', params.region)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.page) searchParams.append('page', params.page.toString())

    const response = await fetch(`${API_BASE_URL}/api/location/admin/employee-locations?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee locations")
    return response.json()
  }

  static async getEmployeeLocation(employeeId: string, history?: boolean): Promise<{
    employee: {
      id: string
      username: string
      email: string
      role: string
    }
    location: {
      latitude: number
      longitude: number
      accuracy?: number
    }
    address: string
    status: string
    lastActivity: string
    isRecent: boolean
    device: any
    ipAddress: string
  } | {
    employeeId: string
    locations: Array<{
      id: string
      location: {
        latitude: number
        longitude: number
        accuracy?: number
      }
      address: string
      status: string
      lastActivity: string
      createdAt: string
    }>
  }> {
    const searchParams = new URLSearchParams()
    if (history) searchParams.append('history', 'true')

    const response = await fetch(`${API_BASE_URL}/api/location/admin/employee-locations/${employeeId}?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee location")
    return response.json()
  }

  static async getLocationStats(): Promise<LocationStats> {
    const response = await fetch(`${API_BASE_URL}/api/location/admin/employee-locations/stats`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch location statistics")
    return response.json()
  }

  static async searchEmployeesByLocation(params: {
    latitude: number
    longitude: number
    radius?: number
    limit?: number
  }): Promise<{
    searchLocation: {
      latitude: number
      longitude: number
      radius: number
    }
    employees: Array<{
      employee: {
        id: string
        username: string
        email: string
        role: string
      }
      location: {
        latitude: number
        longitude: number
        distance: number
      }
      address: string
      status: string
      lastActivity: string
    }>
    totalFound: number
  }> {
    const searchParams = new URLSearchParams()
    searchParams.append('latitude', params.latitude.toString())
    searchParams.append('longitude', params.longitude.toString())
    if (params.radius) searchParams.append('radius', params.radius.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(`${API_BASE_URL}/api/location/admin/employee-locations/search?${searchParams.toString()}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to search employees by location")
    return response.json()
  }

  // Direct Gemini AI Integration (Frontend Only)
  static async sendGeminiMessage(message: string, context?: string): Promise<string> {
    try {
      // You'll need to set up your Gemini API key in environment variables
      const GEMINI_API_KEY = 'AIzaSyAMHnXYhBKD5jVzj5idyYtLB_-niU_hySY'
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured")
      }

      const prompt = context 
        ? `Context: ${context}\n\nUser Question: ${message}\n\nPlease provide a helpful response about agricultural issues, crop diseases, or farming practices.`
        : `You are an agricultural expert AI assistant. Please help with this question: ${message}`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      throw new Error('Failed to get response from Gemini AI')
    }
  }

  static async analyzeReportWithGemini(report: Report): Promise<GeminiAnalysis> {
    try {
      const prompt = `Analyze this agricultural report and provide a comprehensive analysis:

Crop: ${report.crop}
Region: ${report.region}
Description: ${report.description}
Images: ${report.images.length} image(s) provided

Please provide:
1. Diagnosis of the problem
2. Confidence level (0-100)
3. Severity level (low/medium/high/critical)
4. Specific recommendations
5. Suggested products
6. Treatment plan

CRITICAL: You must respond with ONLY a valid JSON object. Do not include any text, headers, markdown formatting, or code blocks. Your response must start with { and end with }. Do not include words like "Recommendations" or "Treatment Plan" before the JSON.

Format your response as JSON with the following structure:
{
  "diagnosis": "detailed diagnosis",
  "confidence": 85,
  "severity": "medium",
  "recommendations": ["rec1", "rec2", "rec3"],
  "suggestedProducts": ["product1", "product2"],
  "treatmentPlan": ["step1", "step2", "step3"]
}

IMPORTANT: The treatmentPlan should be an array of strings, each representing a numbered step in the treatment process. Do not include the numbers in the strings - just the step descriptions.`

      const response = await this.sendGeminiMessage(prompt)
      
      // Extract JSON from the response (remove markdown formatting if present)
      let jsonString = response.trim()
      
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Remove any text before the first { and after the last }
      const firstBrace = jsonString.indexOf('{')
      const lastBrace = jsonString.lastIndexOf('}')
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1)
      } else {
        // If no braces found, try to find JSON-like content
        const jsonMatch = jsonString.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)
        if (jsonMatch) {
          jsonString = jsonMatch[0]
        }
      }
      
      // Additional cleanup: remove any remaining text that's not JSON
      jsonString = jsonString.replace(/^[^{]*/, '').replace(/[^}]*$/, '')
      
      // Try to parse JSON response
      try {
        const analysisData = JSON.parse(jsonString)
        return {
          reportId: report._id,
          analysis: {
            diagnosis: analysisData.diagnosis || "AI Analysis",
            confidence: analysisData.confidence || 75,
            recommendations: analysisData.recommendations || ["General recommendation"],
            severity: analysisData.severity || "medium",
            suggestedProducts: analysisData.suggestedProducts || [],
            treatmentPlan: analysisData.treatmentPlan || ["Standard treatment plan"]
          },
          createdAt: new Date().toISOString()
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        console.error('Attempted to parse:', jsonString)
        
        // If JSON parsing fails, create a structured response from text
        return {
          reportId: report._id,
          analysis: {
            diagnosis: "AI Analysis - Parsing Error",
            confidence: 75,
            recommendations: ["Please review the raw response for analysis"],
            severity: "medium",
            suggestedProducts: [],
            treatmentPlan: ["Unable to parse AI response. Please contact support."]
          },
          createdAt: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Error analyzing report with Gemini:', error)
      throw new Error('Failed to analyze report with Gemini AI')
    }
  }

  static async getGeminiRecommendations(report: Report): Promise<{
    recommendations: string[]
    confidence: number
    suggestedActions: string[]
    priority: "low" | "medium" | "high" | "critical"
  }> {
    try {
      const prompt = `Based on this agricultural report, provide recommendations:

Crop: ${report.crop}
Description: ${report.description}

Please provide:
1. 3-5 specific recommendations
2. Confidence level (0-100)
3. Suggested actions
4. Priority level (low/medium/high/critical)

CRITICAL: You must respond with ONLY a valid JSON object. Do not include any text, headers, markdown formatting, or code blocks. Your response must start with { and end with }. Do not include words like "Recommendations" or "Treatment Plan" before the JSON.

Format as JSON:
{
  "recommendations": ["rec1", "rec2", "rec3"],
  "confidence": 85,
  "suggestedActions": ["action1", "action2"],
  "priority": "medium"
}`

      const response = await this.sendGeminiMessage(prompt)
      
      // Extract JSON from the response (remove markdown formatting if present)
      let jsonString = response.trim()
      
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Remove any text before the first { and after the last }
      const firstBrace = jsonString.indexOf('{')
      const lastBrace = jsonString.lastIndexOf('}')
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1)
      } else {
        // If no braces found, try to find JSON-like content
        const jsonMatch = jsonString.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)
        if (jsonMatch) {
          jsonString = jsonMatch[0]
        }
      }
      
      // Additional cleanup: remove any remaining text that's not JSON
      jsonString = jsonString.replace(/^[^{]*/, '').replace(/[^}]*$/, '')
      
      try {
        const data = JSON.parse(jsonString)
        return {
          recommendations: data.recommendations || ["General recommendation"],
          confidence: data.confidence || 75,
          suggestedActions: data.suggestedActions || ["Monitor the situation"],
          priority: data.priority || "medium"
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)
        console.error('Attempted to parse:', jsonString)
        
        return {
          recommendations: ["Unable to parse AI recommendations"],
          confidence: 75,
          suggestedActions: ["Please review the raw response"],
          priority: "medium"
        }
      }
    } catch (error) {
      console.error('Error getting Gemini recommendations:', error)
      throw new Error('Failed to get recommendations from Gemini AI')
    }
  }

  static async applyGeminiSolution(reportId: string, solution: {
    diagnosis: string
    solution: string
    recommendedProducts: string[]
    treatmentPlan: string[]
  }): Promise<Report> {
    // This would typically update the report in your backend
    // For now, we'll just return a mock updated report
    return {
      _id: reportId,
      crop: "Updated Crop",
      region: "Updated Region",
      description: "Updated description",
      status: "Solved",
      diagnosis: solution.diagnosis,
      solution: solution.solution,
      recommendedProducts: solution.recommendedProducts.map(product => ({
        name: product,
        _id: product
      })),
      images: [],
      urgent: false,
      farmer: { _id: "1", username: "farmer", email: "farmer@example.com", role: "farmer" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  static async getGeminiInsights(): Promise<{
    totalAnalyses: number
    averageConfidence: number
    topIssues: Array<{ issue: string; count: number }>
    recentAnalyses: GeminiAnalysis[]
  }> {
    // Mock insights data
    return {
      totalAnalyses: 25,
      averageConfidence: 82,
      topIssues: [
        { issue: "Fungal Diseases", count: 8 },
        { issue: "Nutrient Deficiency", count: 6 },
        { issue: "Pest Infestation", count: 5 },
        { issue: "Water Stress", count: 4 },
        { issue: "Soil Issues", count: 2 }
      ],
      recentAnalyses: []
    }
  }

  static async getAdminReports(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/reports`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch admin reports")
    return response.json()
  }

  static async diagnoseReport(
    reportId: string,
    diagnosisData: {
      diagnosis: string
      solution: string
      recommendedProducts: string[]
    },
  ): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/reports/${reportId}/diagnose`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(diagnosisData),
    })
    if (!response.ok) throw new Error("Failed to diagnose report")
    return response.json()
  }

  static async getRegionStats(): Promise<RegionStats[]> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/dashboard/regions`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch region stats")
    return response.json()
  }

  static async getEmployeePerformance(): Promise<EmployeePerformance[]> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/employees/performance`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee performance")
    return response.json()
  }

  static async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/products`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch products")
    return response.json()
  }

  static async createProduct(productData: {
    name: string
    description: string
    category: string
    price: number
    manufacturer: string
  }): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/products`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    })
    if (!response.ok) throw new Error("Failed to create product")
    return response.json()
  }

  static async deleteProduct(productId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/reports/admin/products/${productId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete product")
    return response.json()
  }
}
