import { supabase } from "./supabase"
import type { Application } from "@/types/application"
import type { Profile } from "@/types/profile"

// Auth functions
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  if (data.user) {
    // Create a profile for the new user
    await createProfile({
      id: data.user.id,
      email,
      full_name: fullName,
      auth_users_id: data.user.id,
    })
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

// Profile functions
export async function createProfile(profile: Partial<Profile>) {
  const { data, error } = await supabase.from("profiles").insert([profile]).select()

  if (error) throw error
  return data[0]
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select()

  if (error) throw error
  return data[0]
}

// Job functions
export async function getJobs(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function getJobById(jobId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url,
        website,
        industry,
        location
      ),
      job_skills (
        skill_id,
        skills (
          id,
          name
        )
      )
    `)
    .eq("id", jobId)
    .single()

  if (error) throw error
  return data
}

export async function getJobsBySkills(skillIds: string[], limit = 10) {
  // This is a more complex query that finds jobs matching user skills
  const { data, error } = await supabase
    .from("job_skills")
    .select(`
      job_id,
      jobs (
        *,
        companies (
          id,
          name,
          logo_url
        )
      )
    `)
    .in("skill_id", skillIds)
    .limit(limit)

  if (error) throw error

  // Deduplicate jobs and format the response
  const jobMap = new Map()
  data.forEach((item) => {
    if (item.jobs) {
      jobMap.set(item.jobs.id, item.jobs)
    }
  })

  return Array.from(jobMap.values())
}

// Application functions
export async function createApplication(application: Partial<Application>) {
  const { data, error } = await supabase.from("applications").insert([application]).select()

  if (error) throw error
  return data[0]
}

export async function getUserApplications(userId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      jobs (
        id,
        title,
        companies (
          id,
          name,
          logo_url
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const { data, error } = await supabase.from("applications").update({ status }).eq("id", applicationId).select()

  if (error) throw error
  return data[0]
}

// Skills functions
export async function getAllSkills() {
  const { data, error } = await supabase.from("skills").select("*").order("name")

  if (error) throw error
  return data
}

export async function getUserSkills(userId: string) {
  const { data, error } = await supabase
    .from("candidate_skills")
    .select(`
      skill_id,
      skills (
        id,
        name
      )
    `)
    .eq("candidate_id", userId)

  if (error) throw error
  return data.map((item) => item.skills)
}

export async function addUserSkill(userId: string, skillId: string) {
  const { data, error } = await supabase.from("candidate_skills").insert([{ candidate_id: userId, skill_id: skillId }])

  if (error) throw error
  return data
}

export async function removeUserSkill(userId: string, skillId: string) {
  const { data, error } = await supabase
    .from("candidate_skills")
    .delete()
    .eq("candidate_id", userId)
    .eq("skill_id", skillId)

  if (error) throw error
  return data
}

// Company functions
export async function getCompanyById(companyId: string) {
  const { data, error } = await supabase.from("companies").select("*").eq("id", companyId).single()

  if (error) throw error
  return data
}

export async function getCompanies(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}
