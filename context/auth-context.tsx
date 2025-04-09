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
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        setError(null)
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
        setError("Failed to check authentication status")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await getProfile(session.user.id)
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          profile,
        })
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await signIn(email, password)
    } catch (error) {
      console.error("Login failed:", error)
      setError("Failed to login. Please check your credentials and try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await signUp(email, password, name)
    } catch (error) {
      console.error("Signup failed:", error)
      setError("Failed to create account. Please try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      setError("Failed to logout. Please try again.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

