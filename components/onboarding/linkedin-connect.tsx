"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, CheckCircle2 } from "lucide-react"

interface LinkedInConnectProps {
  onConnect: () => void
  isConnected: boolean
}

export function LinkedInConnect({ onConnect, isConnected }: LinkedInConnectProps) {
  const handleConnect = () => {
    // In a real app, you would redirect to LinkedIn OAuth here
    onConnect()
  }

  if (isConnected) {
    return (
      <Card className="bg-muted">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">LinkedIn Connected</h3>
            <p className="text-sm text-muted-foreground">Your LinkedIn profile has been connected successfully</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-12 w-12 rounded-full bg-[#0077B5]/20 flex items-center justify-center">
            <Linkedin className="h-6 w-6 text-[#0077B5]" />
          </div>
          <div>
            <h3 className="font-medium">Connect with LinkedIn</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              We'll import your work history, skills, and education to create your profile
            </p>
          </div>
          <Button className="bg-[#0077B5] hover:bg-[#0077B5]/90" onClick={handleConnect}>
            <Linkedin className="mr-2 h-4 w-4" />
            Connect LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
