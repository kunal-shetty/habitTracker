"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { HabitDashboard } from "@/components/habits/habit-dashboard"
import { useOnboarding } from "@/hooks/use-onboarding"
import { ThemeProvider } from "@/components/theme-provider"

export default function HomePage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { onboarding, isLoaded, completeOnboarding } = useOnboarding()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleOnboardingComplete = () => {
    completeOnboarding()
    // The state update to onboarding.completed will happen on next render
    // But we can also proactively push to login
    router.push("/login")
  }

  if (!mounted || !isLoaded) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex h-dvh items-center justify-center bg-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-foreground border-t-transparent" />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : !onboarding.completed ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <HabitDashboard />
      )}
    </ThemeProvider>
  )
}
