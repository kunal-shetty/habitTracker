"use client"

import { useState, useEffect, useCallback } from "react"
import type { OnboardingState } from "@/lib/types"
import { getOnboardingState, saveOnboardingState } from "@/lib/storage"

export function useOnboarding() {
  const [onboarding, setOnboarding] = useState<OnboardingState>({
    completed: false,
    currentStep: 0,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const state = getOnboardingState()
    setOnboarding(state)
    setIsLoaded(true)
  }, [])

  const nextStep = useCallback(() => {
    const newState = {
      ...onboarding,
      currentStep: onboarding.currentStep + 1,
    }
    setOnboarding(newState)
    saveOnboardingState(newState)
  }, [onboarding])

  const prevStep = useCallback(() => {
    const newState = {
      ...onboarding,
      currentStep: Math.max(0, onboarding.currentStep - 1),
    }
    setOnboarding(newState)
    saveOnboardingState(newState)
  }, [onboarding])

  const completeOnboarding = useCallback(() => {
    const newState = {
      completed: true,
      currentStep: onboarding.currentStep,
    }
    setOnboarding(newState)
    saveOnboardingState(newState)
  }, [onboarding])

  const resetOnboarding = useCallback(() => {
    const newState = {
      completed: false,
      currentStep: 0,
    }
    setOnboarding(newState)
    saveOnboardingState(newState)
  }, [])

  return {
    onboarding,
    isLoaded,
    nextStep,
    prevStep,
    completeOnboarding,
    resetOnboarding,
  }
}
