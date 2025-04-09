"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar, Clock } from "lucide-react"
import type { Application } from "@/types/application"

interface ApplicationCardProps {
  application: Application
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "interview":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "offer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{application.title}</CardTitle>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <Building className="h-4 w-4" />
              <span>{application.jobs?.companies?.name || "Unknown Company"}</span>
            </div>
          </div>
          <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-y-2 mb-3">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Last Updated: {new Date(application.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {application.message && (
          <div className="text-sm mt-2 p-2 bg-muted rounded-md">
            <p className="font-medium">Notes:</p>
            <p>{application.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button variant="outline" size="sm">
          Update Status
        </Button>
      </CardFooter>
    </Card>
  )
}
