"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Clock, DollarSign, Star, Building, ChevronDown, ChevronUp } from "lucide-react"
import { useVoice } from "@/context/voice-context"
import type { Job } from "@/types/job"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { speak } = useVoice()

  const handleApply = () => {
    speak(
      `To apply for the ${job.title} position at ${job.companies?.name || "this company"}, please say "Apply on my behalf" and I'll guide you through the process.`,
    )
  }

  const handleSaveJob = () => {
    // Logic to save job
  }

  const handleReadJob = () => {
    const jobDescription = `Job Title: ${job.title}. Company: ${job.companies?.name || "Unknown"}. Location: ${job.location || "Not specified"}. Salary: ${formatSalary(job.salary_min, job.salary_max)}. Job Type: ${job.job_type}. Description: ${job.description}`
    speak(jobDescription)
  }

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Not specified"
    if (min && !max) return `$${min.toLocaleString()}`
    if (!min && max) return `Up to $${max.toLocaleString()}`
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <Building className="h-4 w-4" />
              <span>{job.companies?.name || "Unknown Company"}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSaveJob}>
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-y-2 mb-3">
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{job.location || (job.is_remote ? "Remote" : "Not specified")}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{job.job_type}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {job.job_skills?.map((skillItem) => (
            <Badge key={skillItem.skill_id} variant="secondary">
              {skillItem.skills.name}
            </Badge>
          ))}
        </div>

        {expanded ? (
          <div className="text-sm mt-2">
            <p>{job.description}</p>
            <Button variant="ghost" size="sm" className="mt-2 h-8 px-2 text-xs" onClick={() => setExpanded(false)}>
              Show Less <ChevronUp className="ml-1 h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="mt-2 h-8 px-2 text-xs" onClick={() => setExpanded(true)}>
            Show More <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleReadJob}>
          Read Job
        </Button>
        <Button size="sm" onClick={handleApply}>
          Apply
        </Button>
      </CardFooter>
    </Card>
  )
}
