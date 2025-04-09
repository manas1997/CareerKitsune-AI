"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, MapPin, Building2, Clock } from "lucide-react"
import type { Job } from "@/types/job"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{job.company?.name}</span>
              </div>
            </CardDescription>
          </div>
          <Badge variant="secondary">{job.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {job.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {job.skills?.slice(0, 3).map((skill) => (
            <Badge key={skill.id} variant="outline">
              {skill.name}
            </Badge>
          ))}
          {job.skills && job.skills.length > 3 && (
            <Badge variant="outline">+{job.skills.length - 3} more</Badge>
          )}
        </div>
        <Button asChild>
          <Link href={`/jobs/${job.id}`}>
            <Briefcase className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
