"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, CheckCircle2 } from "lucide-react"

interface FileUploadProps {
  onUpload: () => void
  isUploaded: boolean
}

export function FileUpload({ onUpload, isUploaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is PDF or DOCX
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file")
      return
    }

    setFileName(file.name)
    // In a real app, you would upload the file to your server here
    onUpload()
  }

  if (isUploaded) {
    return (
      <Card className="bg-muted">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{fileName || "Resume uploaded"}</h3>
            <p className="text-sm text-muted-foreground">Your resume has been uploaded successfully</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium">Upload your resume</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Drag and drop your resume file here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX</p>
        <div className="mt-4">
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInput}
          />
          <Button variant="outline" onClick={() => document.getElementById("resume-upload")?.click()}>
            <FileText className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
      </div>
    </div>
  )
}
