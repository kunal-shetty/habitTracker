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

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

export type HabitDifficulty = "easy" | "medium" | "hard" | "extreme"

export type EvolutionStage = "seed" | "sprout" | "bloom" | "flourish" | "transcend"

export interface Habit {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  category: HabitCategory
  frequency: HabitFrequency
  targetDays?: number[]
  targetCount: number
  reminderTime?: string
  reminderEnabled: boolean
  createdAt: string
  archived: boolean
  // RPG attributes
  difficulty: HabitDifficulty
  level: number
  experience: number
  health: number
  maxHealth: number
  power: number
  evolutionStage: EvolutionStage
  lastCompletedDate?: string
  isMastered: boolean
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: string
  count: number
  completedAt: string
  xpEarned?: number
  streakMultiplier?: number
  bonusXp?: number
  note?: string
  photoUrl?: string
  timeSpent?: number // in minutes
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  type: "streak" | "completions" | "habits" | "level" | "quest" | "social" | "special"
  rarity: Rarity
  isHidden?: boolean
  category?: string
  unlockedAt?: string
}

export interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly"
  difficulty: HabitDifficulty
  requirement: {
    type: "complete_habits" | "maintain_streak" | "earn_xp" | "complete_before_time" | "try_new_habit" | "perfect_day"
    count: number
    timeLimit?: string // HH:mm format
    habitCategory?: HabitCategory
  }
  xpReward: number
  graceTokenReward?: number
  progress: number
  isCompleted: boolean
  isClaimed: boolean
  expiresAt: string
  createdAt: string
}

export interface GraceToken {
  id: string
  earnedAt: string
  usedAt?: string
  source: "quest" | "achievement" | "level_up" | "comeback" | "purchased"
}

export interface Reward {
  id: string
  name: string
  description: string
  type: "theme" | "icon_pack" | "animation" | "sound_pack" | "avatar" | "streak_effect"
  rarity: Rarity
  unlockCondition: {
    type: "level" | "achievement" | "streak" | "completions" | "purchase"
    requirement: number | string
  }
  isUnlocked: boolean
  unlockedAt?: string
  previewImage?: string
}

export interface Friend {
  id: string
  name: string
  avatar?: string
  currentStreak: number
  level: number
  addedAt: string
  isAccountabilityPartner: boolean
}

export interface ComebackData {
  lastActiveDate: string
  missedDays: number
  isInComebackMode: boolean
  comebackQuestsCompleted: number
  welcomeBackRewardClaimed: boolean
}

export interface NotificationPreferences {
  enabled: boolean
  streakReminders: boolean
  questReminders: boolean
  achievementAlerts: boolean
  gentleNudges: boolean
  preferredTimes: string[]
}

export interface UserStats {
  totalCompletions: number
  currentOverallStreak: number
  longestOverallStreak: number
  totalPoints: number
  level: number
  achievements: string[]
  // Extended gamification stats
  totalXp: number
  prestigeLevel: number
  streakMultiplier: number
  graceTokens: GraceToken[]
  availableGraceTokens: number
  questsCompleted: number
  perfectDays: number
  currentDailyQuests: Quest[]
  currentWeeklyChallenge?: Quest
  currentMonthlyTheme?: Quest
  unlockedRewards: string[]
  selectedTheme: string
  selectedAvatar: string
  selectedStreakEffect: string
  comebackData: ComebackData
  notificationPreferences: NotificationPreferences
  friends: Friend[]
  weeklyRank?: number
  socialFeaturesEnabled: boolean
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

export interface LevelUpReward {
  level: number
  xpRequired: number
  rewards: {
    graceTokens?: number
    achievement?: string
    reward?: string
    title?: string
  }
}

export interface StreakMilestone {
  days: number
  name: string
  icon: string
  xpBonus: number
  achievement?: string
}
