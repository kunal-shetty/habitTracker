import type { Habit, HabitCompletion, UserStats, Quest, EvolutionStage } from "./types"
import {
  BASE_XP_PER_COMPLETION,
  DIFFICULTY_CONFIG,
  MAX_STREAK_MULTIPLIER,
  HABIT_DAMAGE_PER_MISS,
  HABIT_HEAL_PER_COMPLETION,
  HABIT_XP_PER_COMPLETION,
  STREAK_MILESTONES,
  QUEST_TEMPLATES,
  LEVEL_THRESHOLDS,
  ACHIEVEMENTS,
} from "./constants"
import { generateId, getTodayString } from "./habit-utils"
import { parseISO, differenceInDays, startOfWeek, endOfWeek } from "date-fns"

// XP Calculation with streak multiplier and difficulty
export function calculateXpForCompletion(
  habit: Habit,
  streak: number,
): { baseXp: number; streakMultiplier: number; totalXp: number; bonusXp: number } {
  const difficultyMultiplier = DIFFICULTY_CONFIG[habit.difficulty].xpMultiplier
  const baseXp = Math.round(BASE_XP_PER_COMPLETION * difficultyMultiplier)

  // Streak multiplier: 1.0 base + 0.1 per streak day, capped at MAX_STREAK_MULTIPLIER
  const streakMultiplier = Math.min(1 + streak * 0.1, MAX_STREAK_MULTIPLIER)

  // Time consistency bonus (completing at similar times)
  const bonusXp = 0 // Could be calculated based on completion time patterns

  const totalXp = Math.round(baseXp * streakMultiplier) + bonusXp

  return { baseXp, streakMultiplier, totalXp, bonusXp }
}

// Calculate habit level from experience
export function calculateHabitLevel(experience: number): number {
  // Every 100 XP is a new level
  return Math.floor(experience / 100) + 1
}

// Get evolution stage based on habit level
export function getEvolutionStage(level: number): EvolutionStage {
  if (level >= 50) return "transcend"
  if (level >= 30) return "flourish"
  if (level >= 15) return "bloom"
  if (level >= 5) return "sprout"
  return "seed"
}

// Check if habit should evolve
export function shouldHabitEvolve(habit: Habit): { shouldEvolve: boolean; newStage: EvolutionStage } {
  const newStage = getEvolutionStage(habit.level)
  return {
    shouldEvolve: newStage !== habit.evolutionStage,
    newStage,
  }
}

// Calculate habit health after missing a day
export function calculateHabitDamage(habit: Habit, daysMissed: number): number {
  const damage = daysMissed * HABIT_DAMAGE_PER_MISS
  return Math.max(0, habit.health - damage)
}

// Heal habit after completion
export function calculateHabitHeal(habit: Habit): number {
  return Math.min(habit.maxHealth, habit.health + HABIT_HEAL_PER_COMPLETION)
}

// Check if habit is "dead" (needs revival)
export function isHabitDead(habit: Habit): boolean {
  return habit.health <= 0
}

// Calculate habit power based on level and streak
export function calculateHabitPower(level: number, streak: number): number {
  return level * 10 + streak * 2
}

// Update habit after completion
export function updateHabitAfterCompletion(habit: Habit, streak: number): Habit {
  const newExperience = habit.experience + HABIT_XP_PER_COMPLETION
  const newLevel = calculateHabitLevel(newExperience)
  const newHealth = calculateHabitHeal(habit)
  const newPower = calculateHabitPower(newLevel, streak)
  const { shouldEvolve, newStage } = shouldHabitEvolve({ ...habit, level: newLevel })

  return {
    ...habit,
    experience: newExperience,
    level: newLevel,
    health: newHealth,
    power: newPower,
    evolutionStage: shouldEvolve ? newStage : habit.evolutionStage,
    lastCompletedDate: getTodayString(),
    isMastered: newStage === "transcend",
  }
}

// Check for missed days and apply damage
export function checkHabitHealth(habit: Habit, completions: HabitCompletion[]): Habit {
  if (!habit.lastCompletedDate) return habit

  const lastCompleted = parseISO(habit.lastCompletedDate)
  const today = new Date()
  const daysMissed = differenceInDays(today, lastCompleted) - 1

  if (daysMissed > 0) {
    const newHealth = calculateHabitDamage(habit, daysMissed)
    return { ...habit, health: newHealth }
  }

  return habit
}

// Generate daily quests
export function generateDailyQuests(currentQuests: Quest[]): Quest[] {
  const today = getTodayString()
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // Filter out expired quests
  const validQuests = currentQuests.filter((q) => q.type === "daily" && q.expiresAt > today && !q.isCompleted)

  if (validQuests.length >= 3) return currentQuests

  const templates = QUEST_TEMPLATES.daily
  const newQuests: Quest[] = []
  const neededCount = 3 - validQuests.length

  // Randomly select quests
  const shuffled = [...templates].sort(() => Math.random() - 0.5)
  for (let i = 0; i < neededCount && i < shuffled.length; i++) {
    const template = shuffled[i]
    newQuests.push({
      id: generateId(),
      title: template.title,
      description: template.description,
      type: "daily",
      difficulty: "medium",
      requirement: template.requirement,
      xpReward: template.xpReward,
      graceTokenReward: template.graceTokenReward,
      progress: 0,
      isCompleted: false,
      expiresAt: todayEnd.toISOString(),
      createdAt: new Date().toISOString(),
    })
  }

  return [...currentQuests.filter((q) => q.type !== "daily" || q.expiresAt > today), ...newQuests]
}

// Generate weekly challenge
export function generateWeeklyChallenge(): Quest {
  const templates = QUEST_TEMPLATES.weekly
  const template = templates[Math.floor(Math.random() * templates.length)]
  const weekEnd = endOfWeek(new Date())

  return {
    id: generateId(),
    title: template.title,
    description: template.description,
    type: "weekly",
    difficulty: "hard",
    requirement: template.requirement,
    xpReward: template.xpReward,
    graceTokenReward: template.graceTokenReward,
    progress: 0,
    isCompleted: false,
    expiresAt: weekEnd.toISOString(),
    createdAt: new Date().toISOString(),
  }
}

// Check quest progress
export function updateQuestProgress(
  quest: Quest,
  habits: Habit[],
  completions: HabitCompletion[],
  stats: UserStats,
): Quest {
  const today = getTodayString()
  let newProgress = 0

  switch (quest.requirement.type) {
    case "complete_habits":
      newProgress = completions.filter((c) => c.date === today).length
      break
    case "maintain_streak":
      newProgress = stats.currentOverallStreak
      break
    case "earn_xp":
      // Calculate XP earned today
      const todayCompletions = completions.filter((c) => c.date === today)
      newProgress = todayCompletions.reduce((sum, c) => sum + (c.xpEarned || 0), 0)
      break
    case "perfect_day":
      const activeHabits = habits.filter((h) => !h.archived)
      const completedToday = activeHabits.filter((h) =>
        completions.some((c) => c.habitId === h.id && c.date === today && c.count >= h.targetCount),
      )
      newProgress = completedToday.length === activeHabits.length && activeHabits.length > 0 ? 1 : 0
      break
    case "try_new_habit":
      // Check if a new habit was created this week
      const weekStart = startOfWeek(new Date())
      newProgress = habits.filter((h) => new Date(h.createdAt) >= weekStart).length
      break
    default:
      newProgress = quest.progress
  }

  const isCompleted = newProgress >= quest.requirement.count

  return {
    ...quest,
    progress: newProgress,
    isCompleted,
  }
}

// Calculate streak multiplier
export function getStreakMultiplier(streak: number): number {
  return Math.min(1 + streak * 0.1, MAX_STREAK_MULTIPLIER)
}

// Check for streak milestone rewards
export function checkStreakMilestone(streak: number): (typeof STREAK_MILESTONES)[number] | null {
  return STREAK_MILESTONES.find((m) => m.days === streak) || null
}

// Calculate user level from total XP
export function calculateUserLevel(totalXp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

// Get XP progress to next level
export function getXpProgressToNextLevel(
  totalXp: number,
  level: number,
): { current: number; required: number; percentage: number } {
  const currentLevelXp = LEVEL_THRESHOLDS[level - 1] || 0
  const nextLevelXp = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const current = totalXp - currentLevelXp
  const required = nextLevelXp - currentLevelXp
  const percentage = Math.min((current / required) * 100, 100)

  return { current, required, percentage }
}

// Check for comeback mode
export function checkComebackStatus(lastActiveDate: string): { isComeback: boolean; daysMissed: number } {
  const last = parseISO(lastActiveDate)
  const today = new Date()
  const daysMissed = differenceInDays(today, last)

  return {
    isComeback: daysMissed >= 3,
    daysMissed,
  }
}

// Generate comeback quests
export function generateComebackQuests(daysMissed: number): Quest[] {
  const quests: Quest[] = []
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // Easy quest to get started
  quests.push({
    id: generateId(),
    title: "Welcome Back",
    description: "Complete just one habit to get back on track",
    type: "daily",
    difficulty: "easy",
    requirement: { type: "complete_habits", count: 1 },
    xpReward: 50,
    progress: 0,
    isCompleted: false,
    expiresAt: todayEnd.toISOString(),
    createdAt: new Date().toISOString(),
  })

  if (daysMissed >= 7) {
    // Grace token reward for returning after long absence
    quests.push({
      id: generateId(),
      title: "Streak Recovery",
      description: "Complete 3 habits to earn a Grace Token",
      type: "daily",
      difficulty: "medium",
      requirement: { type: "complete_habits", count: 3 },
      xpReward: 100,
      graceTokenReward: 1,
      progress: 0,
      isCompleted: false,
      expiresAt: todayEnd.toISOString(),
      createdAt: new Date().toISOString(),
    })
  }

  return quests
}

// Create default habit with RPG attributes
export function createDefaultHabit(
  habitData: Omit<
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
    | "difficulty"
  >,
): Omit<Habit, "id" | "createdAt" | "archived"> {
  return {
    ...habitData,
    difficulty: "medium",
    level: 1,
    experience: 0,
    health: 100,
    maxHealth: 100,
    power: 10,
    evolutionStage: "seed",
    isMastered: false,
  }
}
// Check for new achievements
export function checkAchievements(
  stats: UserStats,
  unlockedIds: string[],
): (typeof ACHIEVEMENTS)[number][] {
  const newUnlocks: (typeof ACHIEVEMENTS)[number][] = []

  ACHIEVEMENTS.forEach((achievement) => {
    if (unlockedIds.includes(achievement.id)) return

    let isUnlocked = false
    switch (achievement.type) {
      case "habits":
        // This needs current active habits count, might need to be passed in
        break
      case "completions":
        if (stats.totalCompletions >= achievement.requirement) isUnlocked = true
        break
      case "streak":
        if (stats.currentOverallStreak >= achievement.requirement) isUnlocked = true
        break
      case "level":
        if (stats.level >= achievement.requirement) isUnlocked = true
        break
      case "quest":
        if (stats.questsCompleted >= achievement.requirement) isUnlocked = true
        break
    }

    if (isUnlocked) {
      newUnlocks.push(achievement)
    }
  })

  return newUnlocks
}
