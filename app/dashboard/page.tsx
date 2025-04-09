"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useVoice } from "@/context/voice-context"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import VoiceAssistant from "@/components/voice/voice-assistant"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { JobCard } from "@/components/jobs/job-card"
import { ApplicationCard } from "@/components/applications/application-card"
import { getJobs, getUserApplications, getUserSkills, getJobsBySkills } from "@/lib/data-service"
import type { Job } from "@/types/job"
import type { Application } from "@/types/application"
import type { Skill } from "@/types/skill"

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "jobs"
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { speak } = useVoice()
  const { toast } = useToast()
  const [hasWelcomed, setHasWelcomed] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [userSkills, setUserSkills] = useState<Skill[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && !hasWelcomed) {
      // Welcome the user with voice after a short delay
      const timer = setTimeout(() => {
        speak(
          `Welcome back, ${user.profile?.full_name || "there"}. I'm CareerKitsune, your AI job application assistant. How can I help you today?`,
        )
        setHasWelcomed(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [user, hasWelcomed, speak])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setIsLoadingData(true)
        setError(null)

        const [jobsData, applicationsData, skillsData] = await Promise.all([
          getJobs(),
          getUserApplications(user.id),
          getUserSkills(user.id),
        ])

        setJobs(jobsData)
        setApplications(applicationsData)
        setUserSkills(skillsData)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [user, toast])

  if (isLoading || isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading dashboard...</p>
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
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="jobs">Recommended Jobs</TabsTrigger>
                <TabsTrigger value="applications">My Applications</TabsTrigger>
                <TabsTrigger value="profile">My Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-4 mt-4">
                {isLoadingData ? (
                  <div className="text-center py-8">Loading jobs...</div>
                ) : jobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p>No jobs found. Try updating your skills in your profile.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="applications" className="space-y-4 mt-4">
                {isLoadingData ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : applications.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {applications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p>You haven't applied to any jobs yet.</p>
                      <Button className="mt-4" onClick={() => setActiveTab("jobs")}>
                        Browse Jobs
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal and professional information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Name</h3>
                        <p>{user?.profile?.full_name || "Not set"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p>{user?.email || "Not set"}</p>
                      </div>
                      {user?.profile?.location && (
                        <div>
                          <h3 className="font-medium">Location</h3>
                          <p>{user?.profile?.location}</p>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">Skills</h3>
                        {userSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {userSkills.map((skill) => (
                              <div
                                key={skill.id}
                                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                              >
                                {skill.name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No skills added yet</p>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Resume</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Button variant="outline" size="sm" onClick={() => router.push("/profile/resume")}>
                            Upload Resume
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => router.push("/profile/linkedin")}>
                            Connect LinkedIn
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full md:w-1/4">
            <VoiceAssistant />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
