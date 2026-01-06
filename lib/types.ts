export type HabitFrequency = "daily" | "weekly" | "custom"

export type HabitCategory =
  | "health"
  | "fitness"
  | "mindfulness"
  | "productivity"
  | "learning"
  | "social"
  | "creativity"
  | "other"

export interface Habit {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  category: HabitCategory
  frequency: HabitFrequency
  targetDays?: number[] // 0-6 for Sunday-Saturday
  targetCount: number // times per day/week
  reminderTime?: string // HH:mm format
  reminderEnabled: boolean
  createdAt: string
  archived: boolean
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: string // YYYY-MM-DD format
  count: number
  completedAt: string
}

export interface UserStats {
  totalCompletions: number
  currentOverallStreak: number
  longestOverallStreak: number
  totalPoints: number
  level: number
  achievements: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  type: "streak" | "completions" | "habits" | "level"
}

export interface OnboardingState {
  completed: boolean
  currentStep: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}
