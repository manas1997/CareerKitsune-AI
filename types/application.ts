export interface Application {
  id: string
  job_id: string
  user_id: string
  title: string
  message?: string | null
  is_read: boolean
  created_at: string
  status: string
  cover_letter?: string | null
  resume_url?: string | null
  jobs?: {
    id: string
    title: string
    companies: {
      id: string
      name: string
      logo_url?: string | null
    }
  }
}

export interface ApplicationEvent {
  id: string
  date: string
  type: string
  description: string
}
