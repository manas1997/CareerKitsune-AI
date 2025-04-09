"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserApplications } from "@/lib/data-service"
import type { Application } from "@/types/application"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, Calendar, Clock } from "lucide-react"

export default function ApplicationsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return

      try {
        setIsLoadingData(true)
        setError(null)
        const userApplications = await getUserApplications(user.id)
        setApplications(userApplications)
      } catch (err) {
        console.error("Failed to fetch applications:", err)
        setError("Failed to load applications. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchApplications()
  }, [user, toast])

  if (isLoading || isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your job applications
          </p>
        </div>

        <div className="grid gap-4">
          {applications.length > 0 ? (
            applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{application.job?.title}</CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{application.job?.company?.name}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant={
                      application.status === "applied" ? "default" :
                      application.status === "interview" ? "secondary" :
                      application.status === "offer" ? "success" :
                      application.status === "rejected" ? "destructive" :
                      "outline"
                    }>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Applied on {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last updated {new Date(application.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardContent>
                  <Button asChild>
                    <a href={`/jobs/${application.job_id}`} target="_blank" rel="noopener noreferrer">
                      <Briefcase className="mr-2 h-4 w-4" />
                      View Job
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
                <Button className="mt-4" onClick={() => router.push("/jobs")}>
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 