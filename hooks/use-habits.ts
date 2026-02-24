"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import type { Habit, HabitCompletion, UserStats, Quest, GraceToken } from "@/lib/types"
import {
  calculateOverallStreak,
  calculatePoints,
  generateId,
  getTodayString,
  getCompletionForHabitOnDate,
  calculateStreak,
  formatDate,
} from "@/lib/habit-utils"
import {
  calculateXpForCompletion,
  updateHabitAfterCompletion,
  generateDailyQuests,
  generateWeeklyChallenge,
  updateQuestProgress,
  calculateUserLevel,
  checkAchievements,
  createDefaultHabit,
} from "@/lib/gamification-utils"
import { ACHIEVEMENTS } from "@/lib/constants"

const DEFAULT_STATS: UserStats = {
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
  socialFeaturesEnabled: false,
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS)
  const [isLoaded, setIsLoaded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [xpGained, setXpGained] = useState<{ amount: number; habitId: string } | null>(null)
  const [habitEvolution, setHabitEvolution] = useState<{ habit: Habit; newStage: string } | null>(null)

  // Map database (snake_case) to frontend (camelCase)
  const mapHabit = (h: any): Habit => ({
    ...h,
    targetCount: h.target_count ?? 1,
    targetDays: h.target_days ?? [0, 1, 2, 3, 4, 5, 6],
    reminderTime: h.reminder_time ?? null,
    reminderEnabled: h.reminder_enabled ?? false,
    isMastered: h.is_mastered ?? false,
    createdAt: h.created_at ?? new Date().toISOString(),
    evolutionStage: h.evolution_stage ?? "seed",
    level: h.current_level ?? h.level ?? 1,
    experience: h.current_experience ?? h.experience ?? 0,
    health: h.health ?? 100,
    maxHealth: h.max_health ?? 100,
  })

  const mapLog = (l: any): HabitCompletion => ({
    ...l,
    habitId: l.habit_id,
    date: l.date || formatDate(new Date(l.completed_at)),
    completedAt: l.completed_at ?? new Date().toISOString(),
    xpEarned: l.xp_earned ?? 0,
    streakMultiplier: l.streak_multiplier ?? 1,
    bonusXp: l.bonus_xp ?? 0,
    photoUrl: l.photo_url ?? null,
    count: l.count ?? 1,
  })

  // Load data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [habitsRes, statsRes] = await Promise.all([
          fetch('/api/habits'),
          fetch('/api/stats')
        ])

        if (habitsRes.ok && statsRes.ok) {
          const habitsData = await habitsRes.json()
          const statsData = await statsRes.json()

          const mappedHabits = habitsData.map(mapHabit)
          const allCompletions = habitsData.flatMap((h: any) => (h.logs ?? []).map(mapLog))

          setHabits(mappedHabits)
          setCompletions(allCompletions)

          // transform stats as needed
          setStats({
            ...DEFAULT_STATS,
            ...statsData,
            totalCompletions: statsData.total_completions ?? statsData.totalCompletions ?? 0,
            currentOverallStreak: statsData.current_overall_streak ?? statsData.currentOverallStreak ?? 0,
            longestOverallStreak: statsData.longest_overall_streak ?? statsData.longestOverallStreak ?? 0,
            availableGraceTokens: statsData.available_grace_tokens ?? statsData.availableGraceTokens ?? 0,
            perfectDays: statsData.perfect_days ?? statsData.perfectDays ?? 0,
            selectedTheme: statsData.selected_theme ?? statsData.selectedTheme ?? "default",
            selectedAvatar: statsData.selected_avatar ?? statsData.selectedAvatar ?? "default",
            selectedStreakEffect: statsData.selected_streak_effect ?? statsData.selectedStreakEffect ?? "default",
            notificationPreferences: statsData.notification_preferences ?? statsData.notificationPreferences ?? DEFAULT_STATS.notificationPreferences,
            comebackData: statsData.comeback_data ?? statsData.comebackData ?? DEFAULT_STATS.comebackData,
            currentDailyQuests: statsData.currentDailyQuests ?? [],
            currentWeeklyChallenge: statsData.currentWeeklyChallenge,
            currentMonthlyTheme: statsData.currentMonthlyTheme,
          })
        }
      } catch (error) {
        console.error("Failed to fetch habits data:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchData()
  }, [])

  const addHabit = useCallback(
    async (
      habitInput: Omit<Habit, "id" | "createdAt" | "archived" | "level" | "experience" | "health" | "maxHealth" | "power" | "evolutionStage" | "isMastered">
    ) => {
      const habitWithDefaults = createDefaultHabit(habitInput)

      // Optimistic Update
      const tempId = `temp-${Date.now()}`
      const optimisticHabit: Habit = {
        ...habitWithDefaults,
        id: tempId,
        createdAt: new Date().toISOString(),
        archived: false,
      }

      setHabits(prev => [optimisticHabit, ...prev])

      try {
        const res = await fetch('/api/habits', {
          method: 'POST',
          body: JSON.stringify({
            ...habitInput,
            target_count: habitInput.targetCount,
            target_days: habitInput.targetDays,
          })
        })

        if (res.ok) {
          const actualHabit = mapHabit(await res.json())
          setHabits(prev => prev.map(h => h.id === tempId ? actualHabit : h))
          return actualHabit
        } else {
          throw new Error("Failed to add habit")
        }
      } catch (error) {
        setHabits(prev => prev.filter(h => h.id !== tempId))
        console.error(error)
      }
    },
    [habits]
  )

  const xpRef = useRef<number>(0)
  const completionsRef = useRef<HabitCompletion[]>([])
  const totalCompletionsRef = useRef<number>(0)

  // Update refs when state changes
  useEffect(() => {
    if (stats) {
      xpRef.current = stats.totalXp
      totalCompletionsRef.current = stats.totalCompletions
    }
  }, [stats?.totalXp, stats?.totalCompletions])

  useEffect(() => {
    completionsRef.current = completions
  }, [completions])

  const toggleCompletion = useCallback(
    async (habitId: string, date?: string) => {
      const targetDate = date || getTodayString()
      const habit = habits.find((h) => h.id === habitId)
      if (!habit || !stats) return

      // Use Ref for completion check to handle rapid clicks
      const existingCompletion = getCompletionForHabitOnDate(completionsRef.current, habitId, targetDate)
      const currentCount = existingCompletion?.count || 0

      if (currentCount >= habit.targetCount) {
        console.log("Habit already completed for today.")
        return
      }

      const streak = calculateStreak(completionsRef.current, habit)
      const xpData = calculateXpForCompletion(habit, streak)
      const updatedHabit = updateHabitAfterCompletion(habit, streak)

      // Atomic-like XP Calculation using Ref
      const nextTotalXp = xpRef.current + xpData.totalXp
      xpRef.current = nextTotalXp
      const newLevel = calculateUserLevel(nextTotalXp)

      const tempLog: HabitCompletion = {
        id: `temp-${Date.now()}`,
        habitId,
        date: targetDate,
        completedAt: new Date(targetDate).toISOString(),
        xpEarned: xpData.totalXp,
        streakMultiplier: xpData.streakMultiplier,
        bonusXp: xpData.bonusXp,
        count: 1
      }

      // Update ref immediately for next rapid click
      completionsRef.current = [...completionsRef.current, tempLog]

      const updatedQuests = stats.currentDailyQuests.map(q =>
        updateQuestProgress(q,
          habits.map(h => h.id === habitId ? updatedHabit : h),
          completionsRef.current,
          { ...stats, totalXp: nextTotalXp, level: newLevel }
        )
      )

      // 4. Update state (Optimistic UI)
      setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h))
      
      const nextStats = {
        ...stats,
        totalXp: nextTotalXp,
        level: newLevel,
        totalCompletions: stats.totalCompletions + 1,
        currentDailyQuests: updatedQuests,
      }

      setStats(nextStats)
      setCompletions(prev => [...prev, tempLog])

      // Check for New Achievements
      const unlockedAchIds = stats.achievements || []
      const newAch = checkAchievements(nextStats, unlockedAchIds)
      
      if (newAch.length > 0) {
        setNewAchievement(newAch[0].id)
        // Persist achievements
        newAch.forEach((a) => {
          fetch('/api/users/achievements', {
            method: 'POST',
            body: JSON.stringify({ achievement_id: a.id })
          })
        })
      }

      if (xpData.totalXp > 0) {
        setXpGained({ amount: xpData.totalXp, habitId })
        setTimeout(() => setXpGained(null), 2000)
      }

      if (updatedHabit.evolutionStage !== habit.evolutionStage) {
        setHabitEvolution({ habit: updatedHabit, newStage: updatedHabit.evolutionStage })
      }

      try {
        // 5. Persist to Server (Using Ref-based values for correctness)
        const [logRes, habitRes, statsRes] = await Promise.all([
          fetch(`/api/habits/${habitId}/logs`, {
            method: 'POST',
            body: JSON.stringify({
              date: targetDate,
              xp_earned: xpData.totalXp,
              streak_multiplier: xpData.streakMultiplier,
              bonus_xp: xpData.bonusXp,
            })
          }),
          fetch(`/api/habits/${habitId}`, {
            method: 'PATCH',
            body: JSON.stringify({
              current_experience: updatedHabit.experience,
              current_level: updatedHabit.level,
              evolution_stage: updatedHabit.evolutionStage,
              is_mastered: updatedHabit.isMastered,
              health: updatedHabit.health,
            })
          }),
          fetch(`/api/stats`, {
            method: 'PATCH',
            body: JSON.stringify({
              total_xp: nextTotalXp,
              level: newLevel,
              total_completions: totalCompletionsRef.current + 1,
            })
          })
        ])

        // Update the ref after the successful increment is planned
        totalCompletionsRef.current += 1

        if (logRes.ok) {
          const actualLog = mapLog(await logRes.json())
          setCompletions(prev => prev.map(l => l.id === tempLog.id ? actualLog : l))
        }

        // 6. Persist Quest Progress
        await Promise.all(
          updatedQuests.map(q =>
            fetch(`/api/quests/${q.id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                progress: q.progress,
                completed: q.isCompleted
              })
            })
          )
        )
      } catch (error) {
        console.error("Failed to toggle completion:", error)
        // Rollback on error? (Simplified for now)
      }
    },
    [habits, completions, stats]
  )

  const deleteHabit = useCallback(
    async (habitId: string) => {
      const originalHabits = [...habits]
      setHabits(prev => prev.filter(h => h.id !== habitId))

      try {
        const res = await fetch(`/api/habits/${habitId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error("Delete failed")
      } catch (error) {
        setHabits(originalHabits)
        console.error(error)
      }
    },
    [habits]
  )

  return {
    habits,
    completions,
    stats,
    isLoaded,
    newAchievement,
    xpGained,
    habitEvolution,
    addHabit,
    deleteHabit,
    toggleCompletion,
    claimQuestReward: async (questId: string) => {
      if (!stats) return

      const quest = stats.currentDailyQuests.find(q => q.id === questId) ||
        (stats.currentWeeklyChallenge?.id === questId ? stats.currentWeeklyChallenge : null)

      if (!quest || !quest.isCompleted || quest.isClaimed) return

      // 1. Calculate new stats
      const newTotalXp = stats.totalXp + quest.xpReward
      const newLevel = calculateUserLevel(newTotalXp)
      const newGraceTokens = (stats.availableGraceTokens || 0) + (quest.graceTokenReward || 0)

      const nextStats = {
        ...stats,
        totalXp: newTotalXp,
        level: newLevel,
        availableGraceTokens: newGraceTokens,
        questsCompleted: stats.questsCompleted + 1,
        currentDailyQuests: stats.currentDailyQuests.map(q => q.id === questId ? { ...q, isClaimed: true } : q),
        currentWeeklyChallenge: stats.currentWeeklyChallenge?.id === questId
          ? { ...stats.currentWeeklyChallenge, isClaimed: true }
          : stats.currentWeeklyChallenge
      }

      // 2. Optimistic Update
      setStats(nextStats)

      // Check for New Achievements
      const unlockedAchIds = stats.achievements || []
      const newAch = checkAchievements(nextStats, unlockedAchIds)

      if (newAch.length > 0) {
        setNewAchievement(newAch[0].id)
        // Persist achievements
        newAch.forEach((a) => {
          fetch('/api/users/achievements', {
            method: 'POST',
            body: JSON.stringify({ achievement_id: a.id })
          })
        })
      }

      try {
        // 3. Persist to Server
        await Promise.all([
          fetch(`/api/quests/${questId}`, {
            method: 'PATCH',
            body: JSON.stringify({ claimed: true })
          }),
          fetch(`/api/stats`, {
            method: 'PATCH',
            body: JSON.stringify({
              total_xp: newTotalXp,
              level: newLevel,
              available_grace_tokens: newGraceTokens,
              quests_completed: stats.questsCompleted + 1
            })
          })
        ])
      } catch (error) {
        console.error("Failed to claim quest reward:", error)
      }
    },
    clearNewAchievement: () => setNewAchievement(null),
    clearHabitEvolution: () => setHabitEvolution(null),
  }
}
