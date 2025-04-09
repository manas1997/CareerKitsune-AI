"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { motion } from "framer-motion"
import { KitsuneLogo } from "@/public/logo"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <KitsuneLogo size={40} />
            <h1 className="text-xl font-bold">CareerKitsune-AI</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-12 items-center">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Apply to Jobs with Zero Hassle</h2>
          <p className="text-xl text-muted-foreground mb-6">
            CareerKitsune-AI is your intelligent voice assistant that helps you find and apply to jobs effortlessly.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Upload your resume or LinkedIn profile",
              "Get personalized job matches based on your skills",
              "Apply to jobs with just your voice",
              "Track all your applications in one place",
            ].map((feature, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
              >
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">✓</div>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="w-full md:w-[400px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CareerKitsune-AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
