const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Report {
  _id: string
  farmer: string
  crop: string
  description: string
  region: string
  voiceNotes?: string
  status: "Pending" | "In Progress" | "Solved"
  urgent?: boolean
  images: string[]
  diagnosis?: string
  solution?: string
  recommendedProducts?: string[]
  createdAt: string
  location?: { lat: number; lng: number }
}

export interface Notification {
  _id: string
  userId: string
  message: string
  createdAt: string
  read?: boolean
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

export class ApiService {
  static getAuthHeaders() {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      Authorization: token || "",
    }
  }

  // Farmer API methods
  static async getFarmerReports(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/farmer/reports`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch reports")
    return response.json()
  }

  static async createFarmerReport(reportData: {
    crop: string
    description: string
    region: string
    voiceNotes?: string
  }): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/farmer/reports`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reportData),
    })
    if (!response.ok) throw new Error("Failed to create report")
    return response.json()
  }

  static async uploadReportFile(reportId: string, file: File): Promise<Report> {
    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem("auth_token")
    const response = await fetch(`${API_BASE_URL}/farmer/reports/${reportId}/upload`, {
      method: "POST",
      headers: {
        Authorization: token || "",
      },
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to upload file")
    return response.json()
  }

  static async getReportStatus(
    reportId: string,
  ): Promise<{ status: string; diagnosis?: string; solution?: string; recommendedProducts?: string[] }> {
    const response = await fetch(`${API_BASE_URL}/farmer/reports/${reportId}/status`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch report status")
    return response.json()
  }

  static async getReportDiagnosis(
    reportId: string,
  ): Promise<{ diagnosis?: string; solution?: string; recommendedProducts?: string[] }> {
    const response = await fetch(`${API_BASE_URL}/farmer/reports/${reportId}/diagnosis`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch diagnosis")
    return response.json()
  }

  static async getFarmerNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/farmer/notifications`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch notifications")
    return response.json()
  }

  static async getFarmerHistory(farmerId: string): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/farmer/${farmerId}/history`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch farmer history")
    return response.json()
  }

  // Employee API methods
  static async getEmployeeReports(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/employee/reports`, {
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
    const response = await fetch(`${API_BASE_URL}/employee/reports`, {
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
    const response = await fetch(`${API_BASE_URL}/employee/reports/${reportId}/upload`, {
      method: "POST",
      headers: {
        Authorization: token || "",
      },
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to upload file")
    return response.json()
  }

  static async updateReportLocation(reportId: string, location: { lat: number; lng: number }): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/employee/reports/${reportId}/location`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(location),
    })
    if (!response.ok) throw new Error("Failed to update location")
    return response.json()
  }

  static async getEmployeeReportStatus(reportId: string): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/employee/reports/${reportId}/status`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch report status")
    return response.json()
  }

  static async getEmployeeHistory(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/employee/history`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee history")
    return response.json()
  }

  static async markReportUrgent(reportId: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/employee/reports/${reportId}/urgent`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to mark report as urgent")
    return response.json()
  }

  static async getEmployeeNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/employee/notifications`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee notifications")
    return response.json()
  }

  static async getAllReports(filters?: {
    status?: string
    region?: string
    crop?: string
  }): Promise<Report[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.region) params.append("region", filters.region)
    if (filters?.crop) params.append("crop", filters.crop)

    const response = await fetch(`${API_BASE_URL}/reports?${params.toString()}`, {
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
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    })
    if (!response.ok) throw new Error("Failed to update report status")
    return response.json()
  }

  // Admin API methods
  static async getAdminNotifications(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch admin notifications")
    return response.json()
  }

  static async getAdminReports(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/reports/${reportId}/diagnose`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(diagnosisData),
    })
    if (!response.ok) throw new Error("Failed to diagnose report")
    return response.json()
  }

  static async getRegionStats(): Promise<RegionStats[]> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/regions`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch region stats")
    return response.json()
  }

  static async getEmployeePerformance(): Promise<EmployeePerformance[]> {
    const response = await fetch(`${API_BASE_URL}/admin/employees/performance`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch employee performance")
    return response.json()
  }

  static async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    })
    if (!response.ok) throw new Error("Failed to create product")
    return response.json()
  }

  static async deleteProduct(productId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete product")
    return response.json()
  }
}
