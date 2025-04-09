import type { Company } from "./company"
import type { Skill } from "./skill"

export interface Job {
  id: string
  company_id: string
  title: string
  description: string
  requirements: string
  responsibilities: string
  job_type: string
  experience_level: string
  salary_min?: number | null
  salary_max?: number | null
  location?: string | null
  is_remote: boolean
  is_active: boolean
  posted_by: string
  created_at: string
  updated_at: string
  expires_at?: string | null
  companies?: Company
  job_skills?: { skill_id: string; skills: Skill }[]
  matchScore?: number
}
