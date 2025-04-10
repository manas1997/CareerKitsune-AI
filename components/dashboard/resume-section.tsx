"use client"

import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { FileText, Linkedin, Trash2 } from "lucide-react"

interface ResumeSectionProps {
  userId: string
}

interface Resume {
  id: string
  name: string
  path: string
  uploaded_at: string
  ats_score: number | null
}

export const ResumeSection = memo(function ResumeSection({ userId }: ResumeSectionProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)

  useEffect(() => {
    fetchResumes()
  }, [userId])

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setResumes(data || [])
      if (data && data.length > 0) {
        setSelectedResume(data[0])
      }
    } catch (error) {
      console.error("Error fetching resumes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch resumes",
        variant: "destructive",
      })
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const fileName = file.name
      const filePath = `${userId}/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) throw uploadError

      // Store resume metadata in database
      const { data, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          name: fileName,
          path: filePath,
          uploaded_at: new Date().toISOString(),
          ats_score: null
        })
        .select()
        .single()

      if (dbError) throw dbError

      // TODO: Call AI service to analyze resume and get ATS score
      const mockAtsScore = Math.floor(Math.random() * 100)
      
      // Update the ATS score
      const { error: updateError } = await supabase
        .from('resumes')
        .update({ ats_score: mockAtsScore })
        .eq('id', data.id)

      if (updateError) throw updateError

      await fetchResumes()
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

  const handleDeleteResume = async (resume: Resume) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([resume.path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id)

      if (dbError) throw dbError

      await fetchResumes()
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      })
    }
  }

  const handleLinkedInImport = async () => {
    try {
      setIsUploading(true)
      // TODO: Implement LinkedIn OAuth flow
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

        {resumes.length > 0 && (
          <div className="space-y-4">
            <Label>Your Resumes</Label>
            <div className="space-y-2">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{resume.name}</span>
                    {resume.ats_score !== null && (
                      <span className="text-sm text-muted-foreground">
                        ATS Score: {resume.ats_score}%
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteResume(resume)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}) 