export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: string | null
          bio: string | null
          location: string | null
          website: string | null
          created_at: string
          updated_at: string
          auth_users_id: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          auth_users_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          auth_users_id?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string
          requirements: string
          responsibilities: string
          job_type: string
          experience_level: string
          salary_min: number | null
          salary_max: number | null
          location: string | null
          is_remote: boolean
          is_active: boolean
          posted_by: string
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
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
          is_remote?: boolean
          is_active?: boolean
          posted_by: string
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          description?: string
          requirements?: string
          responsibilities?: string
          job_type?: string
          experience_level?: string
          salary_min?: number | null
          salary_max?: number | null
          location?: string | null
          is_remote?: boolean
          is_active?: boolean
          posted_by?: string
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          user_id: string
          title: string
          message: string | null
          is_read: boolean
          created_at: string
          status: string
          cover_letter: string | null
          resume_url: string | null
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          title: string
          message?: string | null
          is_read?: boolean
          created_at?: string
          status?: string
          cover_letter?: string | null
          resume_url?: string | null
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          title?: string
          message?: string | null
          is_read?: boolean
          created_at?: string
          status?: string
          cover_letter?: string | null
          resume_url?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website: string | null
          industry: string | null
          size: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          size?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      candidate_skills: {
        Row: {
          candidate_id: string
          skill_id: string
        }
        Insert: {
          candidate_id: string
          skill_id: string
        }
        Update: {
          candidate_id?: string
          skill_id?: string
        }
      }
      job_skills: {
        Row: {
          job_id: string
          skill_id: string
        }
        Insert: {
          job_id: string
          skill_id: string
        }
        Update: {
          job_id?: string
          skill_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
