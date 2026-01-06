import type { Achievement, HabitCategory } from "./types"

export const CATEGORY_CONFIG: Record<HabitCategory, { label: string; icon: string; color: string }> = {
  health: { label: "Health", icon: "Heart", color: "#ef4444" },
  fitness: { label: "Fitness", icon: "Dumbbell", color: "#f97316" },
  mindfulness: { label: "Mindfulness", icon: "Brain", color: "#8b5cf6" },
  productivity: { label: "Productivity", icon: "Target", color: "#3b82f6" },
  learning: { label: "Learning", icon: "BookOpen", color: "#10b981" },
  social: { label: "Social", icon: "Users", color: "#ec4899" },
  creativity: { label: "Creativity", icon: "Palette", color: "#f59e0b" },
  other: { label: "Other", icon: "Star", color: "#6b7280" },
}

export const HABIT_ICONS = [
  "Heart",
  "Dumbbell",
  "Brain",
  "Target",
  "BookOpen",
  "Users",
  "Palette",
  "Star",
  "Coffee",
  "Moon",
  "Sun",
  "Droplet",
  "Apple",
  "Bike",
  "Music",
  "Pencil",
  "Camera",
  "Phone",
  "Laptop",
  "Briefcase",
]

export const HABIT_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
]

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-habit",
    name: "Getting Started",
    description: "Create your first habit",
    icon: "Rocket",
    requirement: 1,
    type: "habits",
  },
  {
    id: "streak-3",
    name: "On a Roll",
    description: "Maintain a 3-day streak",
    icon: "Flame",
    requirement: 3,
    type: "streak",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "Flame",
    requirement: 7,
    type: "streak",
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "Flame",
    requirement: 30,
    type: "streak",
  },
  {
    id: "streak-100",
    name: "Habit Legend",
    description: "Maintain a 100-day streak",
    icon: "Crown",
    requirement: 100,
    type: "streak",
  },
  {
    id: "completions-10",
    name: "Momentum",
    description: "Complete 10 habit entries",
    icon: "Zap",
    requirement: 10,
    type: "completions",
  },
  {
    id: "completions-50",
    name: "Consistent",
    description: "Complete 50 habit entries",
    icon: "Trophy",
    requirement: 50,
    type: "completions",
  },
  {
    id: "completions-100",
    name: "Dedicated",
    description: "Complete 100 habit entries",
    icon: "Medal",
    requirement: 100,
    type: "completions",
  },
  {
    id: "completions-500",
    name: "Unstoppable",
    description: "Complete 500 habit entries",
    icon: "Star",
    requirement: 500,
    type: "completions",
  },
  {
    id: "habits-5",
    name: "Habit Builder",
    description: "Create 5 habits",
    icon: "Layers",
    requirement: 5,
    type: "habits",
  },
  {
    id: "level-5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "TrendingUp",
    requirement: 5,
    type: "level",
  },
  {
    id: "level-10",
    name: "Habit Pro",
    description: "Reach level 10",
    icon: "Award",
    requirement: 10,
    type: "level",
  },
]

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000, 6500, 8000, 10000, 12500, 15000, 18000, 22000, 27000,
  33000, 40000,
]

export const POINTS_PER_COMPLETION = 10
export const STREAK_BONUS_MULTIPLIER = 0.5
