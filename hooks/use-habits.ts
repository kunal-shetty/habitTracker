"use client"

import { useState, useEffect, useCallback } from "react"
import type { Habit, HabitCompletion, UserStats } from "@/lib/types"
import { getHabits, saveHabits, getCompletions, saveCompletions, getStats, saveStats } from "@/lib/storage"
import {
  calculateOverallStreak,
  calculatePoints,
  calculateLevel,
  generateId,
  getTodayString,
  getCompletionForHabitOnDate,
} from "@/lib/habit-utils"
import { ACHIEVEMENTS } from "@/lib/constants"

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalCompletions: 0,
    currentOverallStreak: 0,
    longestOverallStreak: 0,
    totalPoints: 0,
    level: 1,
    achievements: [],
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  // Load data from localStorage
  useEffect(() => {
    setHabits(getHabits())
    setCompletions(getCompletions())
    setStats(getStats())
    setIsLoaded(true)
  }, [])

  // Check for new achievements
  const checkAchievements = useCallback(
    (currentHabits: Habit[], currentCompletions: HabitCompletion[], currentStats: UserStats): string[] => {
      const newAchievements: string[] = []

      ACHIEVEMENTS.forEach((achievement) => {
        if (currentStats.achievements.includes(achievement.id)) return

        let unlocked = false

        switch (achievement.type) {
          case "habits":
            unlocked = currentHabits.filter((h) => !h.archived).length >= achievement.requirement
            break
          case "completions":
            unlocked = currentCompletions.length >= achievement.requirement
            break
          case "streak":
            unlocked = currentStats.currentOverallStreak >= achievement.requirement
            break
          case "level":
            unlocked = currentStats.level >= achievement.requirement
            break
        }

        if (unlocked) {
          newAchievements.push(achievement.id)
        }
      })

      return newAchievements
    },
    [],
  )

  // Update stats when habits or completions change
  const updateStats = useCallback(
    (newHabits: Habit[], newCompletions: HabitCompletion[]) => {
      const overallStreak = calculateOverallStreak(newHabits, newCompletions)
      const points = calculatePoints(newCompletions, overallStreak)
      const level = calculateLevel(points)

      const updatedStats: UserStats = {
        ...stats,
        totalCompletions: newCompletions.length,
        currentOverallStreak: overallStreak,
        longestOverallStreak: Math.max(stats.longestOverallStreak, overallStreak),
        totalPoints: points,
        level,
      }

      // Check for new achievements
      const newAchievements = checkAchievements(newHabits, newCompletions, updatedStats)
      if (newAchievements.length > 0) {
        updatedStats.achievements = [...updatedStats.achievements, ...newAchievements]
        setNewAchievement(newAchievements[0])
      }

      setStats(updatedStats)
      saveStats(updatedStats)
    },
    [stats, checkAchievements],
  )

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "createdAt" | "archived">) => {
      const newHabit: Habit = {
        ...habit,
        id: generateId(),
        createdAt: new Date().toISOString(),
        archived: false,
      }
      const newHabits = [...habits, newHabit]
      setHabits(newHabits)
      saveHabits(newHabits)
      updateStats(newHabits, completions)
      return newHabit
    },
    [habits, completions, updateStats],
  )

  const updateHabit = useCallback(
    (updatedHabit: Habit) => {
      const newHabits = habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
      setHabits(newHabits)
      saveHabits(newHabits)
    },
    [habits],
  )

  const deleteHabit = useCallback(
    (habitId: string) => {
      const newHabits = habits.filter((h) => h.id !== habitId)
      const newCompletions = completions.filter((c) => c.habitId !== habitId)
      setHabits(newHabits)
      setCompletions(newCompletions)
      saveHabits(newHabits)
      saveCompletions(newCompletions)
      updateStats(newHabits, newCompletions)
    },
    [habits, completions, updateStats],
  )

  const toggleCompletion = useCallback(
    (habitId: string, date?: string) => {
      const targetDate = date || getTodayString()
      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return

      const existingCompletion = getCompletionForHabitOnDate(completions, habitId, targetDate)

      let newCompletions: HabitCompletion[]

      if (existingCompletion) {
        if (existingCompletion.count >= habit.targetCount) {
          // Reset to 0
          newCompletions = completions.filter((c) => c.id !== existingCompletion.id)
        } else {
          // Increment count
          newCompletions = completions.map((c) =>
            c.id === existingCompletion.id ? { ...c, count: c.count + 1, completedAt: new Date().toISOString() } : c,
          )
        }
      } else {
        // Create new completion
        const newCompletion: HabitCompletion = {
          id: generateId(),
          habitId,
          date: targetDate,
          count: 1,
          completedAt: new Date().toISOString(),
        }
        newCompletions = [...completions, newCompletion]
      }

      setCompletions(newCompletions)
      saveCompletions(newCompletions)
      updateStats(habits, newCompletions)
    },
    [habits, completions, updateStats],
  )

  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null)
  }, [])

  return {
    habits,
    completions,
    stats,
    isLoaded,
    newAchievement,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    clearNewAchievement,
  }
}
