"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Lock, Mail, Globe } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    job_alerts: true,
    application_updates: true,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        setIsLoadingData(true)
        setError(null)
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_users_id", user.id)
          .single()

        if (error) throw error

        if (data) {
          setProfile({
            full_name: data.full_name || "",
            email: user.email || "",
            phone: data.phone || "",
            location: data.location || "",
            bio: data.bio || "",
          })
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setError("Failed to load profile settings. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load profile settings",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchProfile()
  }, [user, toast])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_users_id", user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (err) {
      console.error("Failed to update profile:", err)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleNotificationUpdate = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          notification_settings: notifications,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_users_id", user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      })
    } catch (err) {
      console.error("Failed to update notification settings:", err)
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    }
  }

  if (isLoading || isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading settings...</p>
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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about your account
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email_notifications}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, email_notifications: checked })
                      handleNotificationUpdate()
                    }}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Job Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new job opportunities
                    </p>
                  </div>
                  <Switch
                    checked={notifications.job_alerts}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, job_alerts: checked })
                      handleNotificationUpdate()
                    }}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Application Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your job applications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.application_updates}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, application_updates: checked })
                      handleNotificationUpdate()
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Change Email
                </Button>
                <Button variant="outline" className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 