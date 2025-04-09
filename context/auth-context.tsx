"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { signIn, signUp, signOut, getCurrentUser, getProfile } from "@/lib/data-service"
import type { Profile } from "@/types/profile"

type User = {
  id: string
  email: string
  profile?: Profile | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()

        if (currentUser) {
          const profile = await getProfile(currentUser.id)

          setUser({
            id: currentUser.id,
            email: currentUser.email || "",
            profile,
          })
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        try {
          const profile = await getProfile(session.user.id)

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            profile,
          })
        } catch (error) {
          console.error("Failed to get profile:", error)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    checkAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const { user: authUser } = await signIn(email, password)

      if (authUser) {
        const profile = await getProfile(authUser.id)

        setUser({
          id: authUser.id,
          email: authUser.email || "",
          profile,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      await signUp(email, password, name)
      // After signup, we'll redirect to login
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
