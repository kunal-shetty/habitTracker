import { format, subDays, parseISO, isBefore, startOfDay } from "date-fns"
import type { Habit, HabitCompletion } from "./types"
import { LEVEL_THRESHOLDS, POINTS_PER_COMPLETION, STREAK_BONUS_MULTIPLIER } from "./constants"

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function getTodayString(): string {
  return formatDate(new Date())
}

export function getCompletionForHabitOnDate(
  completions: HabitCompletion[],
  habitId: string,
  date: string,
): HabitCompletion | undefined {
  const matching = completions.filter((c) => c.habitId === habitId && c.date === date)
  if (matching.length === 0) return undefined

  // Return the first one as base but sum the counts
  const totalCount = matching.reduce((acc, curr) => acc + (curr.count || 1), 0)
  return {
    ...matching[0],
    count: totalCount
  }
}

export function isHabitCompletedForDate(completions: HabitCompletion[], habit: Habit, date: string): boolean {
  const completion = getCompletionForHabitOnDate(completions, habit.id, date)
  return completion ? completion.count >= habit.targetCount : false
}

export function getHabitCompletionProgress(completions: HabitCompletion[], habit: Habit, date: string): number {
  const completion = getCompletionForHabitOnDate(completions, habit.id, date)
  if (!completion) return 0
  return Math.min(completion.count / habit.targetCount, 1)
}

export function calculateStreak(completions: HabitCompletion[], habit: Habit): number {
  let streak = 0
  let currentDate = new Date()

  // Check if today is completed
  const todayCompleted = isHabitCompletedForDate(completions, habit, formatDate(currentDate))

  // If today isn't completed, start checking from yesterday
  if (!todayCompleted) {
    currentDate = subDays(currentDate, 1)
  }

  // Count consecutive days
  while (true) {
    const dateStr = formatDate(currentDate)
    const dayOfWeek = currentDate.getDay()

    // Check if this day is a target day for the habit
    const isTargetDay =
      habit.frequency === "daily" ||
      (habit.frequency === "weekly" && habit.targetDays?.includes(dayOfWeek)) ||
      (habit.frequency === "custom" && habit.targetDays?.includes(dayOfWeek))

    if (isTargetDay) {
      if (isHabitCompletedForDate(completions, habit, dateStr)) {
        streak++
      } else {
        break
      }
    }

    currentDate = subDays(currentDate, 1)

    // Don't go back more than a year
    if (streak > 365) break
  }

  return streak
}

export function calculateLongestStreak(completions: HabitCompletion[], habit: Habit): number {
  if (completions.length === 0) return 0

  const habitCompletions = completions
    .filter((c) => c.habitId === habit.id && c.count >= habit.targetCount)
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

  if (habitCompletions.length === 0) return 0

  let longestStreak = 1
  let currentStreak = 1

  for (let i = 1; i < habitCompletions.length; i++) {
    const prevDate = parseISO(habitCompletions[i - 1].date)
    const currDate = parseISO(habitCompletions[i].date)
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return longestStreak
}

export function calculateOverallStreak(habits: Habit[], completions: HabitCompletion[]): number {
  if (habits.length === 0) return 0

  let streak = 0
  let currentDate = new Date()

  // Check if today all habits are completed
  const allCompletedToday = habits
    .filter((h) => !h.archived)
    .every((habit) => isHabitCompletedForDate(completions, habit, formatDate(currentDate)))

  if (!allCompletedToday) {
    currentDate = subDays(currentDate, 1)
  }

  while (true) {
    const dateStr = formatDate(currentDate)
    const activeHabits = habits.filter((h) => !h.archived)

    const allCompleted = activeHabits.every((habit) => {
      const dayOfWeek = currentDate.getDay()
      const isTargetDay = habit.frequency === "daily" || habit.targetDays?.includes(dayOfWeek)

      // If not a target day, consider it completed
      if (!isTargetDay) return true

      return isHabitCompletedForDate(completions, habit, dateStr)
    })

    if (allCompleted && activeHabits.length > 0) {
      streak++
    } else {
      break
    }

    currentDate = subDays(currentDate, 1)
    if (streak > 365) break
  }

  return streak
}

export function calculatePoints(completions: HabitCompletion[], streak: number): number {
  const basePoints = completions.length * POINTS_PER_COMPLETION
  const streakBonus = Math.floor(streak * STREAK_BONUS_MULTIPLIER * POINTS_PER_COMPLETION)
  return basePoints + streakBonus
}

export function calculateLevel(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export function getPointsForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  return LEVEL_THRESHOLDS[level]
}

export function getCompletionRate(completions: HabitCompletion[], habit: Habit, days = 30): number {
  let targetDays = 0
  let completedDays = 0

  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i)
    const dayOfWeek = date.getDay()
    const dateStr = formatDate(date)

    const isTargetDay = habit.frequency === "daily" || habit.targetDays?.includes(dayOfWeek)

    // Only count days after habit creation
    if (isBefore(date, startOfDay(parseISO(habit.createdAt)))) continue

    if (isTargetDay) {
      targetDays++
      if (isHabitCompletedForDate(completions, habit, dateStr)) {
        completedDays++
      }
    }
  }

  return targetDays > 0 ? completedDays / targetDays : 0
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
