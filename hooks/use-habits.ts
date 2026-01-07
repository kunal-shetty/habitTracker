"use client"

import { useState, useEffect, useCallback } from "react"
import type { Habit, HabitCompletion, UserStats, Quest, GraceToken } from "@/lib/types"
import { getHabits, saveHabits, getCompletions, saveCompletions, getStats, saveStats } from "@/lib/storage"
import {
  calculateOverallStreak,
  calculatePoints,
  generateId,
  getTodayString,
  getCompletionForHabitOnDate,
  calculateStreak,
} from "@/lib/habit-utils"
import {
  calculateXpForCompletion,
  updateHabitAfterCompletion,
  generateDailyQuests,
  generateWeeklyChallenge,
  updateQuestProgress,
  checkStreakMilestone,
  calculateUserLevel,
  checkComebackStatus,
  generateComebackQuests,
  createDefaultHabit,
} from "@/lib/gamification-utils"
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
    totalXp: 0,
    prestigeLevel: 0,
    streakMultiplier: 1,
    graceTokens: [],
    availableGraceTokens: 0,
    questsCompleted: 0,
    perfectDays: 0,
    currentDailyQuests: [],
    currentWeeklyChallenge: undefined,
    currentMonthlyTheme: undefined,
    unlockedRewards: [],
    selectedTheme: "default",
    selectedAvatar: "default",
    selectedStreakEffect: "default",
    comebackData: {
      lastActiveDate: new Date().toISOString(),
      missedDays: 0,
      isInComebackMode: false,
      comebackQuestsCompleted: 0,
      welcomeBackRewardClaimed: false,
    },
    notificationPreferences: {
      enabled: true,
      streakReminders: true,
      questReminders: true,
      achievementAlerts: true,
      gentleNudges: true,
      preferredTimes: ["09:00", "21:00"],
    },
    friends: [],
    weeklyRank: undefined,
    socialFeaturesEnabled: false,
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null)
  const [streakMilestone, setStreakMilestone] = useState<(typeof ACHIEVEMENTS)[number] | null>(null)
  const [xpGained, setXpGained] = useState<{ amount: number; habitId: string } | null>(null)
  const [questCompleted, setQuestCompleted] = useState<Quest | null>(null)
  const [habitEvolution, setHabitEvolution] = useState<{ habit: Habit; newStage: string } | null>(null)

  // Load data from localStorage
  useEffect(() => {
    const loadedHabits = getHabits()
    const loadedCompletions = getCompletions()
    const loadedStats = getStats()

    const updatedQuests = generateDailyQuests(loadedStats.currentDailyQuests)

    let weeklyChallenge = loadedStats.currentWeeklyChallenge
    if (!weeklyChallenge || new Date(weeklyChallenge.expiresAt) < new Date()) {
      weeklyChallenge = generateWeeklyChallenge()
    }

    const { isComeback, daysMissed } = checkComebackStatus(loadedStats.comebackData.lastActiveDate)

    const finalStats = {
      ...loadedStats,
      currentDailyQuests: updatedQuests,
      currentWeeklyChallenge: weeklyChallenge,
      comebackData: {
        ...loadedStats.comebackData,
        isInComebackMode: isComeback,
        missedDays: daysMissed,
      },
    }

    if (isComeback && !loadedStats.comebackData.isInComebackMode) {
      finalStats.currentDailyQuests = [
        ...generateComebackQuests(daysMissed),
        ...finalStats.currentDailyQuests.slice(0, 1),
      ]
    }

    setHabits(loadedHabits)
    setCompletions(loadedCompletions)
    setStats(finalStats)
    saveStats(finalStats)
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
          case "quest":
            unlocked = currentStats.questsCompleted >= achievement.requirement
            break
          case "special":
            if (achievement.id === "habit-master") {
              unlocked = currentHabits.some((h) => h.isMastered)
            }
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

  const updateStats = useCallback(
    (newHabits: Habit[], newCompletions: HabitCompletion[], xpEarned?: number) => {
      const overallStreak = calculateOverallStreak(newHabits, newCompletions)
      const points = calculatePoints(newCompletions, overallStreak)
      const newTotalXp = stats.totalXp + (xpEarned || 0)
      const newLevel = calculateUserLevel(newTotalXp)
      const oldLevel = stats.level

      if (newLevel > oldLevel) {
        setLevelUpData({ oldLevel, newLevel })
      }

      const milestone = checkStreakMilestone(overallStreak)
      if (milestone && overallStreak === milestone.days) {
        setStreakMilestone(ACHIEVEMENTS.find((a) => a.id === milestone.achievement) || null)
      }

      const updatedQuests = stats.currentDailyQuests.map((q) =>
        updateQuestProgress(q, newHabits, newCompletions, stats),
      )

      // Check for newly completed quests
      const newlyCompleted = updatedQuests.find(
        (q) => q.isCompleted && !stats.currentDailyQuests.find((oq) => oq.id === q.id)?.isCompleted,
      )
      if (newlyCompleted) {
        setQuestCompleted(newlyCompleted)
      }

      const today = getTodayString()
      const activeHabits = newHabits.filter((h) => !h.archived)
      const allCompletedToday = activeHabits.every((h) =>
        newCompletions.some((c) => c.habitId === h.id && c.date === today && c.count >= h.targetCount),
      )
      const newPerfectDays = allCompletedToday && activeHabits.length > 0 ? stats.perfectDays + 1 : stats.perfectDays

      const updatedStats: UserStats = {
        ...stats,
        totalCompletions: newCompletions.length,
        currentOverallStreak: overallStreak,
        longestOverallStreak: Math.max(stats.longestOverallStreak, overallStreak),
        totalPoints: points,
        level: newLevel,
        totalXp: newTotalXp,
        streakMultiplier: Math.min(1 + overallStreak * 0.1, 5),
        perfectDays: newPerfectDays,
        currentDailyQuests: updatedQuests,
        questsCompleted: stats.questsCompleted + (newlyCompleted ? 1 : 0),
        comebackData: {
          ...stats.comebackData,
          lastActiveDate: new Date().toISOString(),
          isInComebackMode: false,
        },
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
    (
      habitInput: Omit<
        Habit,
        | "id"
        | "createdAt"
        | "archived"
        | "level"
        | "experience"
        | "health"
        | "maxHealth"
        | "power"
        | "evolutionStage"
        | "isMastered"
      >,
    ) => {
      const habitWithDefaults = createDefaultHabit(habitInput)
      const newHabit: Habit = {
        ...habitWithDefaults,
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
      const streak = calculateStreak(completions, habit)

      let newCompletions: HabitCompletion[]
      let xpEarned = 0
      let updatedHabit = habit

      if (existingCompletion) {
        if (existingCompletion.count >= habit.targetCount) {
          // Reset to 0
          newCompletions = completions.filter((c) => c.id !== existingCompletion.id)
        } else {
          // Increment count
          const { totalXp, streakMultiplier, bonusXp } = calculateXpForCompletion(habit, streak)
          xpEarned = totalXp

          newCompletions = completions.map((c) =>
            c.id === existingCompletion.id
              ? {
                  ...c,
                  count: c.count + 1,
                  completedAt: new Date().toISOString(),
                  xpEarned: totalXp,
                  streakMultiplier,
                  bonusXp,
                }
              : c,
          )

          if (existingCompletion.count + 1 >= habit.targetCount) {
            updatedHabit = updateHabitAfterCompletion(habit, streak)
            if (updatedHabit.evolutionStage !== habit.evolutionStage) {
              setHabitEvolution({ habit: updatedHabit, newStage: updatedHabit.evolutionStage })
            }
          }
        }
      } else {
        // Create new completion
        const { totalXp, streakMultiplier, bonusXp } = calculateXpForCompletion(habit, streak)
        xpEarned = totalXp

        const newCompletion: HabitCompletion = {
          id: generateId(),
          habitId,
          date: targetDate,
          count: 1,
          completedAt: new Date().toISOString(),
          xpEarned: totalXp,
          streakMultiplier,
          bonusXp,
        }
        newCompletions = [...completions, newCompletion]

        if (habit.targetCount === 1) {
          updatedHabit = updateHabitAfterCompletion(habit, streak)
          if (updatedHabit.evolutionStage !== habit.evolutionStage) {
            setHabitEvolution({ habit: updatedHabit, newStage: updatedHabit.evolutionStage })
          }
        }
      }

      if (xpEarned > 0) {
        setXpGained({ amount: xpEarned, habitId })
        setTimeout(() => setXpGained(null), 2000)
      }

      // Update habit if it changed
      const newHabits = habits.map((h) => (h.id === habitId ? updatedHabit : h))

      setCompletions(newCompletions)
      setHabits(newHabits)
      saveCompletions(newCompletions)
      saveHabits(newHabits)
      updateStats(newHabits, newCompletions, xpEarned)
    },
    [habits, completions, updateStats],
  )

  const useGraceToken = useCallback(() => {
    if (stats.availableGraceTokens <= 0) return false

    const newStats = {
      ...stats,
      availableGraceTokens: stats.availableGraceTokens - 1,
      graceTokens: stats.graceTokens.map((t, i) =>
        i === stats.graceTokens.findIndex((token) => !token.usedAt) ? { ...t, usedAt: new Date().toISOString() } : t,
      ),
    }

    setStats(newStats)
    saveStats(newStats)
    return true
  }, [stats])

  const claimQuestReward = useCallback(
    (questId: string) => {
      const quest = stats.currentDailyQuests.find((q) => q.id === questId)
      if (!quest || !quest.isCompleted) return

      const newStats = { ...stats }

      // Award XP
      newStats.totalXp += quest.xpReward
      newStats.level = calculateUserLevel(newStats.totalXp)

      // Award grace tokens if any
      if (quest.graceTokenReward) {
        const newTokens: GraceToken[] = Array(quest.graceTokenReward)
          .fill(null)
          .map(() => ({
            id: generateId(),
            earnedAt: new Date().toISOString(),
            source: "quest" as const,
          }))
        newStats.graceTokens = [...newStats.graceTokens, ...newTokens]
        newStats.availableGraceTokens += quest.graceTokenReward
      }

      // Remove claimed quest and generate new one
      newStats.currentDailyQuests = newStats.currentDailyQuests.filter((q) => q.id !== questId)
      newStats.currentDailyQuests = generateDailyQuests(newStats.currentDailyQuests)

      setStats(newStats)
      saveStats(newStats)
    },
    [stats],
  )

  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null)
  }, [])

  const clearLevelUpData = useCallback(() => {
    setLevelUpData(null)
  }, [])

  const clearStreakMilestone = useCallback(() => {
    setStreakMilestone(null)
  }, [])

  const clearQuestCompleted = useCallback(() => {
    setQuestCompleted(null)
  }, [])

  const clearHabitEvolution = useCallback(() => {
    setHabitEvolution(null)
  }, [])

  return {
    habits,
    completions,
    stats,
    isLoaded,
    newAchievement,
    levelUpData,
    streakMilestone,
    xpGained,
    questCompleted,
    habitEvolution,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    useGraceToken,
    claimQuestReward,
    clearNewAchievement,
    clearLevelUpData,
    clearStreakMilestone,
    clearQuestCompleted,
    clearHabitEvolution,
  }
}
