export interface Company {
  id: string
  name: string
  description?: string | null
  logo_url?: string | null
  website?: string | null
  industry?: string | null
  size?: string | null
  location?: string | null
  created_at: string
  updated_at: string
}
