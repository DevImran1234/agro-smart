export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
        <a href="/dashboard" className="text-primary hover:text-primary/80 underline">
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}
