import { supabase } from "./supabase"
import type { Application } from "@/types/application"
import type { Profile } from "@/types/profile"

// Auth functions
export async function signUp(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.error("Error signing up:", error)
      throw error
    }

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
  } catch (error) {
    console.error("Failed to sign up:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in:", error)
      throw error
    }

    if (data.user) {
      // Ensure profile exists
      await getProfile(data.user.id)
    }

    return data
  } catch (error) {
    console.error("Failed to sign in:", error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
      throw error
    }
  } catch (error) {
    console.error("Failed to sign out:", error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error("Error getting current user:", error)
      throw error
    }
    return data.user
  } catch (error) {
    console.error("Failed to get current user:", error)
    throw error
  }
}

// Profile functions
export async function createProfile(profile: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{
        ...profile,
        auth_users_id: profile.id,
      }])
      .select()
      .single()

    if (error) {
      console.error("Error creating profile:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Failed to create profile:", error)
    throw error
  }
}

export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_users_id", userId)
      .single()

    if (error) {
      // If no profile exists, create one
      if (error.code === "PGRST116") {
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          return createProfile({
            id: userId,
            email: userData.user.email || "",
            full_name: userData.user.user_metadata?.full_name || "",
            auth_users_id: userId,
          })
        }
      }
      console.error("Error getting profile:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Failed to get profile:", error)
    throw error
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("auth_users_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Failed to update profile:", error)
    throw error
  }
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...application, user_id: user.id }])
    .select()

  if (error) throw error
  return data[0]
}

export async function getUserApplications(userId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")
  if (user.id !== userId) throw new Error("Unauthorized")

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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .select()

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
