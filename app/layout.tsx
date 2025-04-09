import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { VoiceProvider } from "@/context/voice-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CareerKitsune-AI | Your AI Job Application Assistant",
  description: "Apply to jobs with zero hassle using our AI voice assistant",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <VoiceProvider>
              {children}
              <Toaster />
            </VoiceProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'