import type { Habit, HabitCompletion, UserStats, OnboardingState, AuthState } from "./types"

const STORAGE_KEYS = {
  HABITS: "habit-tracker-habits",
  COMPLETIONS: "habit-tracker-completions",
  STATS: "habit-tracker-stats",
  ONBOARDING: "habit-tracker-onboarding",
  THEME: "habit-tracker-theme",
  AUTH: "habit-tracker-auth",
}

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error("Failed to save to localStorage:", e)
  }
}

// Habits
export function getHabits(): Habit[] {
  return safeGetItem<Habit[]>(STORAGE_KEYS.HABITS, [])
}

export function saveHabits(habits: Habit[]): void {
  safeSetItem(STORAGE_KEYS.HABITS, habits)
}

export function addHabit(habit: Habit): void {
  const habits = getHabits()
  habits.push(habit)
  saveHabits(habits)
}

export function updateHabit(updatedHabit: Habit): void {
  const habits = getHabits()
  const index = habits.findIndex((h) => h.id === updatedHabit.id)
  if (index !== -1) {
    habits[index] = updatedHabit
    saveHabits(habits)
  }
}

export function deleteHabit(habitId: string): void {
  const habits = getHabits().filter((h) => h.id !== habitId)
  saveHabits(habits)
  // Also delete completions for this habit
  const completions = getCompletions().filter((c) => c.habitId !== habitId)
  saveCompletions(completions)
}

// Completions
export function getCompletions(): HabitCompletion[] {
  return safeGetItem<HabitCompletion[]>(STORAGE_KEYS.COMPLETIONS, [])
}

export function saveCompletions(completions: HabitCompletion[]): void {
  safeSetItem(STORAGE_KEYS.COMPLETIONS, completions)
}

export function addCompletion(completion: HabitCompletion): void {
  const completions = getCompletions()
  completions.push(completion)
  saveCompletions(completions)
}

export function getCompletionsForDate(date: string): HabitCompletion[] {
  return getCompletions().filter((c) => c.date === date)
}

export function getCompletionsForHabit(habitId: string): HabitCompletion[] {
  return getCompletions().filter((c) => c.habitId === habitId)
}

// Stats
export function getStats(): UserStats {
  return safeGetItem<UserStats>(STORAGE_KEYS.STATS, {
    totalCompletions: 0,
    currentOverallStreak: 0,
    longestOverallStreak: 0,
    totalPoints: 0,
    level: 1,
    achievements: [],
  })
}

export function saveStats(stats: UserStats): void {
  safeSetItem(STORAGE_KEYS.STATS, stats)
}

// Onboarding
export function getOnboardingState(): OnboardingState {
  return safeGetItem<OnboardingState>(STORAGE_KEYS.ONBOARDING, {
    completed: false,
    currentStep: 0,
  })
}

export function saveOnboardingState(state: OnboardingState): void {
  safeSetItem(STORAGE_KEYS.ONBOARDING, state)
}

// Theme
export function getTheme(): "light" | "dark" | "system" {
  return safeGetItem<"light" | "dark" | "system">(STORAGE_KEYS.THEME, "system")
}

export function saveTheme(theme: "light" | "dark" | "system"): void {
  safeSetItem(STORAGE_KEYS.THEME, theme)
}

// Auth
export function getAuthState(): AuthState {
  return safeGetItem<AuthState>(STORAGE_KEYS.AUTH, {
    user: null,
    isAuthenticated: false,
    token: null,
  })
}

export function saveAuthState(state: AuthState): void {
  safeSetItem(STORAGE_KEYS.AUTH, state)
}

export function clearAuthState(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH)
  } catch (e) {
    console.error("Failed to clear auth state:", e)
  }
}
