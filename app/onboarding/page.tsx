"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/onboarding/file-upload"
import { LinkedInConnect } from "@/components/onboarding/linkedin-connect"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [linkedInConnected, setLinkedInConnected] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
      setProgress((step + 1) * 25)
    } else {
      // Complete onboarding
      toast({
        title: "Onboarding complete!",
        description: "You're all set to start using CareerKitsune-AI.",
      })
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setProgress((step - 1) * 25)
    }
  }

  const handleResumeUpload = () => {
    // Mock resume upload
    setResumeUploaded(true)
    toast({
      title: "Resume uploaded",
      description: "Your resume has been successfully uploaded.",
    })
  }

  const handleLinkedInConnect = () => {
    // Mock LinkedIn connection
    setLinkedInConnected(true)
    toast({
      title: "LinkedIn connected",
      description: "Your LinkedIn profile has been successfully connected.",
    })
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to CareerKitsune-AI</CardTitle>
          <CardDescription>Let's set up your profile to help you find and apply to the perfect jobs</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Your Resume or Connect LinkedIn</h2>
              <p className="text-muted-foreground">
                To help you find the best job matches and apply seamlessly, we need your professional information. You
                can either upload your resume or connect your LinkedIn profile.
              </p>

              <Tabs defaultValue="resume" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="resume">Upload Resume</TabsTrigger>
                  <TabsTrigger value="linkedin">Connect LinkedIn</TabsTrigger>
                </TabsList>
                <TabsContent value="resume" className="mt-4">
                  <FileUpload onUpload={handleResumeUpload} isUploaded={resumeUploaded} />
                </TabsContent>
                <TabsContent value="linkedin" className="mt-4">
                  <LinkedInConnect onConnect={handleLinkedInConnect} isConnected={linkedInConnected} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Job Preferences</h2>
              <p className="text-muted-foreground">
                Tell us about your job preferences so we can find the best matches for you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Desired Job Title</Label>
                  <Input id="job-title" placeholder="e.g., Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Location</Label>
                  <Input id="location" placeholder="e.g., San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-type">Job Type</Label>
                  <Input id="job-type" placeholder="e.g., Full-time, Contract" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Expected Salary</Label>
                  <Input id="salary" placeholder="e.g., $100,000 - $120,000" />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="skills">Key Skills</Label>
                <Textarea id="skills" placeholder="e.g., JavaScript, React, Node.js" />
                <p className="text-xs text-muted-foreground">Separate skills with commas</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Job Board Accounts</h2>
              <p className="text-muted-foreground">
                Connect your job board accounts to allow CareerKitsune-AI to apply on your behalf.
              </p>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">LinkedIn</h3>
                    <p className="text-sm text-muted-foreground">Connect to apply to jobs on LinkedIn</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Indeed</h3>
                    <p className="text-sm text-muted-foreground">Connect to apply to jobs on Indeed</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Glassdoor</h3>
                    <p className="text-sm text-muted-foreground">Connect to apply to jobs on Glassdoor</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                You can skip this step and connect your accounts later from your profile settings.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-xl font-semibold text-center">You're All Set!</h2>
                <p className="text-muted-foreground text-center max-w-md mt-2">
                  CareerKitsune-AI is ready to help you find and apply to jobs with zero hassle. Your AI assistant will
                  guide you through the entire process.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">What's Next?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs mt-0.5">
                      1
                    </div>
                    <p>Browse recommended jobs based on your profile</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs mt-0.5">
                      2
                    </div>
                    <p>Say "Apply on my behalf" to have CareerKitsune-AI apply for you</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs mt-0.5">
                      3
                    </div>
                    <p>Track your applications and get status updates</p>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={handleNext}>{step < 4 ? "Next" : "Go to Dashboard"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
