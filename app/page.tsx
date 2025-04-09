import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import LandingPage from "@/components/landing-page"

export default function Home() {
  const cookieStore = cookies()
  const authToken = cookieStore.get("auth-token")

  // If user is already logged in, redirect to dashboard
  if (authToken) {
    redirect("/dashboard")
  }

  return <LandingPage />
}
