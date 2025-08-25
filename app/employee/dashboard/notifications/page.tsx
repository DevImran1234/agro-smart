"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiService, type Notification } from "@/lib/api"
import { Bell, Clock, CheckCircle, AlertTriangle, ArrowLeft, RefreshCw, Filter, Search, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function EmployeeNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">("all")
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()

  console.log("[EmployeeNotificationsPage] Rendering with user:", user?.role, "isAuthenticated:", isAuthenticated)

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("[EmployeeNotificationsPage] User authenticated, fetching notifications")
      fetchNotifications()
      fetchUnreadCount()
    } else {
      console.log("[EmployeeNotificationsPage] User not authenticated yet, skipping fetch")
    }
  }, [isAuthenticated, user])

  const fetchNotifications = async (page = 1, status?: 'read' | 'unread') => {
    try {
      setLoading(true)
      setError("")
      console.log("[EmployeeNotificationsPage] Fetching notifications...")
      
      const params: any = { page, limit: 20 }
      if (status) params.status = status
      
      const data = await ApiService.getEmployeeNotificationsWithStatus(params)
      console.log("[EmployeeNotificationsPage] Notifications fetched:", data)
      
      setNotifications(data.notifications)
      setFilteredNotifications(data.notifications)
      setCurrentPage(data.pagination.currentPage)
      setTotalPages(data.pagination.totalPages)
      setTotalNotifications(data.pagination.totalNotifications)
    } catch (err: any) {
      console.error("[EmployeeNotificationsPage] Error fetching notifications:", err)
      setError(err.message || "Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const data = await ApiService.getEmployeeUnreadNotificationsCount()
      setUnreadCount(data.unreadCount)
    } catch (err: any) {
      console.error("[EmployeeNotificationsPage] Error fetching unread count:", err)
    }
  }

  // Filter notifications based on search term and read status
  useEffect(() => {
    let filtered = notifications

    // Filter by read status
    if (filterRead === "read") {
      filtered = filtered.filter(n => n.isRead || n.read)
    } else if (filterRead === "unread") {
      filtered = filtered.filter(n => !(n.isRead || n.read))
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, filterRead])

  const markAsRead = async (notificationId: string) => {
    try {
      setLoadingAction(notificationId)
      console.log("[EmployeeNotificationsPage] Marking notification as read:", notificationId)
      
      await ApiService.markEmployeeNotificationAsRead(notificationId)
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true, read: true, readAt: new Date().toISOString() } : n
        )
      )
      
      // Refresh unread count
      fetchUnreadCount()
    } catch (err: any) {
      console.error("[EmployeeNotificationsPage] Error marking as read:", err)
      setError(err.message || "Failed to mark notification as read")
    } finally {
      setLoadingAction(null)
    }
  }

  const markAsUnread = async (notificationId: string) => {
    try {
      setLoadingAction(notificationId)
      console.log("[EmployeeNotificationsPage] Marking notification as unread:", notificationId)
      
      await ApiService.markEmployeeNotificationAsUnread(notificationId)
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: false, read: false, readAt: undefined } : n
        )
      )
      
      // Refresh unread count
      fetchUnreadCount()
    } catch (err: any) {
      console.error("[EmployeeNotificationsPage] Error marking as unread:", err)
      setError(err.message || "Failed to mark notification as unread")
    } finally {
      setLoadingAction(null)
    }
  }

  const markAllAsRead = async () => {
    try {
      setLoadingAction("mark-all")
      console.log("[EmployeeNotificationsPage] Marking all notifications as read")
      
      const result = await ApiService.markAllEmployeeNotificationsAsRead()
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, read: true, readAt: new Date().toISOString() }))
      )
      
      // Refresh unread count
      fetchUnreadCount()
      
      console.log("[EmployeeNotificationsPage] Marked", result.modifiedCount, "notifications as read")
    } catch (err: any) {
      console.error("[EmployeeNotificationsPage] Error marking all as read:", err)
      setError(err.message || "Failed to mark all notifications as read")
    } finally {
      setLoadingAction(null)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      setLoadingAction(notificationId)
      console.log("[EmployeeNotificationsPage] Deleting notification:", notificationId)
      
      await ApiService.deleteEmployeeNotification(notificationId)
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      
      // Refresh unread count
      fetchUnreadCount()
    } catch (err: any) {
      console.error("[EmployeeNotificationsPage] Error deleting notification:", err)
      setError(err.message || "Failed to delete notification")
    } finally {
      setLoadingAction(null)
    }
  }

  const clearReadNotifications = async () => {
    try {
      setLoadingAction("clear-read")
      console.log("[EmployeeNotificationsPage] Clearing read notifications")
      
      const result = await ApiService.clearEmployeeReadNotifications()
      
      // Remove read notifications from local state
      setNotifications(prev => prev.filter(n => !(n.isRead || n.read)))
      
      console.log("[EmployeeNotificationsPage] Cleared", result.deletedCount, "read notifications")
    } catch (err: any) {
      console.error("[EmployeeNotificationsPage] Error clearing read notifications:", err)
      setError(err.message || "Failed to clear read notifications")
    } finally {
      setLoadingAction(null)
    }
  }

  const handleFilterChange = (newFilter: "all" | "read" | "unread") => {
    setFilterRead(newFilter)
    setCurrentPage(1)
    fetchNotifications(1, newFilter === "all" ? undefined : newFilter)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchNotifications(page, filterRead === "all" ? undefined : filterRead)
  }

  const getNotificationIcon = (notification: Notification) => {
    const isRead = notification.isRead || notification.read
    if (isRead) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <Bell className="h-4 w-4 text-primary" />
  }

  const getNotificationPriority = (notification: Notification) => {
    // You can add logic here to determine priority based on notification content
    if (notification.message.toLowerCase().includes("urgent")) {
      return "high"
    }
    if (notification.message.toLowerCase().includes("warning")) {
      return "medium"
    }
    return "low"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  if (!isAuthenticated || !user) {
    console.log("[EmployeeNotificationsPage] User not authenticated, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["employee"]}>
        <DashboardLayout title="Notifications">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (loading) {
    console.log("[EmployeeNotificationsPage] Still loading, showing loading state")
    return (
      <ProtectedRoute allowedRoles={["employee"]}>
        <DashboardLayout title="Notifications">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  console.log("[EmployeeNotificationsPage] Rendering main content")

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <DashboardLayout title="Employee Notifications">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Employee Notifications</h1>
              <p className="text-muted-foreground">Stay updated with assigned reports and system alerts</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => fetchNotifications(currentPage, filterRead === "all" ? undefined : filterRead)} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/employee/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{totalNotifications}</p>
                    <p className="text-sm text-muted-foreground">Total Notifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{unreadCount}</p>
                    <p className="text-sm text-muted-foreground">Unread</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {totalNotifications - unreadCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Read</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={filterRead}
                    onChange={(e) => handleFilterChange(e.target.value as "all" | "read" | "unread")}
                    className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Notifications</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                  {unreadCount > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={markAllAsRead}
                      disabled={loadingAction === "mark-all"}
                    >
                      {loadingAction === "mark-all" ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Mark All as Read
                    </Button>
                  )}
                  {totalNotifications - unreadCount > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={clearReadNotifications}
                      disabled={loadingAction === "clear-read"}
                    >
                      {loadingAction === "clear-read" ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Clear Read
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length} of {totalNotifications} notification{filteredNotifications.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium text-foreground">
                    {totalNotifications === 0 ? "No notifications yet" : "No notifications match your filters"}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {totalNotifications === 0 
                      ? "You're all caught up! Check back later for updates."
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => {
                    const priority = getNotificationPriority(notification)
                    const isRead = notification.isRead || notification.read
                    return (
                      <div
                        key={notification._id}
                        className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                          isRead ? "bg-muted/50" : "bg-background"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getNotificationIcon(notification)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-foreground">{notification.message}</p>
                            <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                              {priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                              <span className="text-xs">
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            {!isRead && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                            {notification.relatedReport && (
                              <Badge variant="outline" className="text-xs">
                                Report: {notification.relatedReport.crop}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          {!isRead ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification._id)}
                              disabled={loadingAction === notification._id}
                              className="text-xs"
                            >
                              {loadingAction === notification._id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                              Mark as read
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsUnread(notification._id)}
                              disabled={loadingAction === notification._id}
                              className="text-xs"
                            >
                              {loadingAction === notification._id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <EyeOff className="h-3 w-3" />
                              )}
                              Mark as unread
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification._id)}
                            disabled={loadingAction === notification._id}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            {loadingAction === notification._id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Delete
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
