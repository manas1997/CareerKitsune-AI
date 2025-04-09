export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string | null
  role?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
  created_at: string
  updated_at: string
  auth_users_id?: string | null
}
