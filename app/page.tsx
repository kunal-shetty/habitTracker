"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { HabitDashboard } from "@/components/habits/habit-dashboard"
import { AuthScreen } from "@/components/auth/auth-screen"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useAuth } from "@/hooks/use-auth"
import { ThemeProvider } from "@/components/theme-provider"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const { onboarding, isLoaded, completeOnboarding } = useOnboarding()
  const { isLoading: authLoading } = useAuth()

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleOnboardingComplete = () => {
    setShowAuth(true)
  }

  const handleAuthComplete = () => {
    completeOnboarding()
    setShowAuth(false)
  }

  if (!isLoaded || authLoading) {
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
      ) : !onboarding.completed && !showAuth ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : showAuth ? (
        <AuthScreen onComplete={handleAuthComplete} />
      ) : (
        <HabitDashboard />
      )}
    </ThemeProvider>
  )
}
