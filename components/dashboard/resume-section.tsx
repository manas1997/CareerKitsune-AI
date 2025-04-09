"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { FileText, Linkedin } from "lucide-react"

interface ResumeSectionProps {
  userId: string
}

export function ResumeSection({ userId }: ResumeSectionProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [atsScore, setAtsScore] = useState<number | null>(null)

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `resumes/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Update user's profile with resume path
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_path: filePath })
        .eq('auth_users_id', userId)

      if (updateError) throw updateError

      // TODO: Call AI service to analyze resume and get ATS score
      // This is a placeholder - you'll need to implement the actual AI analysis
      const mockAtsScore = Math.floor(Math.random() * 100)
      setAtsScore(mockAtsScore)

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleLinkedInImport = async () => {
    try {
      setIsUploading(true)
      // TODO: Implement LinkedIn OAuth flow
      // This is a placeholder - you'll need to implement the actual LinkedIn integration
      toast({
        title: "Coming Soon",
        description: "LinkedIn integration will be available soon",
      })
    } catch (error) {
      console.error("Error importing LinkedIn profile:", error)
      toast({
        title: "Error",
        description: "Failed to import LinkedIn profile",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume & LinkedIn</CardTitle>
        <CardDescription>
          Upload your resume or import your LinkedIn profile to get ATS compatibility scores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume">Upload Resume</Label>
          <div className="flex items-center gap-2">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleLinkedInImport}
              disabled={isUploading}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {atsScore !== null && (
          <div className="space-y-2">
            <Label>ATS Compatibility Score</Label>
            <div className="flex items-center gap-2">
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${atsScore}%` }}
                />
              </div>
              <span className="text-sm font-medium">{atsScore}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This score indicates how well your resume matches ATS requirements
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 