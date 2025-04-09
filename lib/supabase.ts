import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = "https://tdonwvibavaizghahhuz.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb253dmliYXZhaXpnaGFoaHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjYwOTYsImV4cCI6MjA1OTQ0MjA5Nn0.Bn23V2DevZ56r91wEMXPFi6okRbApDjGQZsTADOHYGU"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
