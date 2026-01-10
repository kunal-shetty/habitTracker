"use client"

import { useState, useEffect, useCallback } from "react"
import { getIsPremium, setIsPremium as saveIsPremium } from "@/lib/storage"

export const FREE_HABIT_LIMIT = 5

export function usePremium() {
  const [isPremium, setIsPremiumState] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsPremiumState(getIsPremium())
    setIsLoaded(true)
  }, [])

  const upgradeToPremium = useCallback(() => {
    setIsPremiumState(true)
    saveIsPremium(true)
  }, [])

  const downgradeToFree = useCallback(() => {
    setIsPremiumState(false)
    saveIsPremium(false)
  }, [])

  const canAddHabit = useCallback(
    (currentHabitCount: number) => {
      if (isPremium) return true
      return currentHabitCount < FREE_HABIT_LIMIT
    },
    [isPremium],
  )

  return {
    isPremium,
    isLoaded,
    upgradeToPremium,
    downgradeToFree,
    canAddHabit,
    habitLimit: isPremium ? Number.POSITIVE_INFINITY : FREE_HABIT_LIMIT,
  }
}
