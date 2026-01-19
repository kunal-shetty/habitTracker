import type { HabitCategory, HabitDifficulty } from "./types"

export interface HabitTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: HabitCategory
  difficulty: HabitDifficulty
  targetCount: number
  reminderTime?: string
  tips: string[]
  popularityScore: number
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health
  {
    id: "drink-water",
    name: "Drink Water",
    description: "Stay hydrated throughout the day",
    icon: "Droplet",
    color: "#06b6d4",
    category: "health",
    difficulty: "easy",
    targetCount: 8,
    reminderTime: "09:00",
    tips: [
      "Keep a water bottle nearby",
      "Set hourly reminders",
      "Track with marks or apps",
    ],
    popularityScore: 95,
  },
  {
    id: "sleep-early",
    name: "Sleep 8 Hours",
    description: "Get quality sleep every night",
    icon: "Moon",
    color: "#8b5cf6",
    category: "health",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "21:00",
    tips: [
      "Set a bedtime routine",
      "Avoid screens 1 hour before bed",
      "Keep bedroom cool and dark",
    ],
    popularityScore: 92,
  },
  {
    id: "healthy-meal",
    name: "Eat Healthy Meal",
    description: "Consume nutritious, balanced meals",
    icon: "Apple",
    color: "#22c55e",
    category: "health",
    difficulty: "medium",
    targetCount: 3,
    reminderTime: "08:00",
    tips: [
      "Meal prep on weekends",
      "Include vegetables in every meal",
      "Avoid processed foods",
    ],
    popularityScore: 88,
  },
  
  // Fitness
  {
    id: "exercise",
    name: "Exercise",
    description: "30 minutes of physical activity",
    icon: "Dumbbell",
    color: "#f97316",
    category: "fitness",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "07:00",
    tips: [
      "Start with short sessions",
      "Find activities you enjoy",
      "Track your progress",
    ],
    popularityScore: 90,
  },
  {
    id: "walk",
    name: "Daily Walk",
    description: "Take a 10,000 step walk",
    icon: "Footprints",
    color: "#84cc16",
    category: "fitness",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "17:00",
    tips: [
      "Walk during lunch breaks",
      "Take the stairs",
      "Park farther away",
    ],
    popularityScore: 85,
  },
  {
    id: "stretch",
    name: "Stretching",
    description: "10 minutes of stretching exercises",
    icon: "Activity",
    color: "#10b981",
    category: "fitness",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "08:00",
    tips: [
      "Focus on major muscle groups",
      "Hold each stretch 30 seconds",
      "Breathe deeply",
    ],
    popularityScore: 78,
  },

  // Mindfulness
  {
    id: "meditate",
    name: "Meditation",
    description: "Practice mindfulness meditation",
    icon: "Brain",
    color: "#8b5cf6",
    category: "mindfulness",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "06:30",
    tips: [
      "Start with 5 minutes",
      "Use guided meditations",
      "Find a quiet space",
    ],
    popularityScore: 82,
  },
  {
    id: "gratitude",
    name: "Gratitude Journal",
    description: "Write 3 things you're grateful for",
    icon: "Heart",
    color: "#ec4899",
    category: "mindfulness",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "21:00",
    tips: [
      "Be specific and detailed",
      "Reflect on why you're grateful",
      "Include small things",
    ],
    popularityScore: 86,
  },
  {
    id: "no-phone",
    name: "Phone-Free Time",
    description: "1 hour without phone distractions",
    icon: "PhoneOff",
    color: "#6366f1",
    category: "mindfulness",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "19:00",
    tips: [
      "Put phone in another room",
      "Use app blockers",
      "Replace with meaningful activities",
    ],
    popularityScore: 75,
  },

  // Productivity
  {
    id: "deep-work",
    name: "Deep Work Session",
    description: "2 hours of focused, uninterrupted work",
    icon: "Target",
    color: "#3b82f6",
    category: "productivity",
    difficulty: "hard",
    targetCount: 1,
    reminderTime: "09:00",
    tips: [
      "Block calendar time",
      "Eliminate distractions",
      "Use Pomodoro technique",
    ],
    popularityScore: 80,
  },
  {
    id: "plan-day",
    name: "Plan Your Day",
    description: "Review and plan tomorrow's tasks",
    icon: "Calendar",
    color: "#06b6d4",
    category: "productivity",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "20:00",
    tips: [
      "Do it the night before",
      "Prioritize top 3 tasks",
      "Time-block your schedule",
    ],
    popularityScore: 83,
  },
  {
    id: "inbox-zero",
    name: "Inbox Zero",
    description: "Clear your email inbox",
    icon: "Mail",
    color: "#f59e0b",
    category: "productivity",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "16:00",
    tips: [
      "Use 2-minute rule",
      "Archive or delete immediately",
      "Unsubscribe from newsletters",
    ],
    popularityScore: 70,
  },

  // Learning
  {
    id: "read",
    name: "Read",
    description: "Read for 30 minutes",
    icon: "BookOpen",
    color: "#10b981",
    category: "learning",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "20:00",
    tips: [
      "Keep book visible",
      "Read before bed",
      "Set page goals",
    ],
    popularityScore: 87,
  },
  {
    id: "learn-language",
    name: "Language Practice",
    description: "Practice a new language for 20 minutes",
    icon: "Languages",
    color: "#a855f7",
    category: "learning",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "07:30",
    tips: [
      "Use language learning apps",
      "Practice speaking out loud",
      "Immerse with media",
    ],
    popularityScore: 76,
  },
  {
    id: "podcast",
    name: "Educational Podcast",
    description: "Listen to educational content",
    icon: "Headphones",
    color: "#f97316",
    category: "learning",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "08:00",
    tips: [
      "Listen during commute",
      "Take notes on key points",
      "Queue episodes in advance",
    ],
    popularityScore: 72,
  },

  // Social
  {
    id: "connect",
    name: "Connect with Loved Ones",
    description: "Meaningful conversation with family/friends",
    icon: "Users",
    color: "#ec4899",
    category: "social",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "18:00",
    tips: [
      "Schedule regular calls",
      "Ask open-ended questions",
      "Give full attention",
    ],
    popularityScore: 81,
  },
  {
    id: "compliment",
    name: "Give Compliments",
    description: "Genuinely compliment someone",
    icon: "Heart",
    color: "#f59e0b",
    category: "social",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "12:00",
    tips: [
      "Be specific and sincere",
      "Notice small achievements",
      "Spread positivity",
    ],
    popularityScore: 68,
  },

  // Creativity
  {
    id: "journal",
    name: "Creative Writing",
    description: "Write or journal for 15 minutes",
    icon: "Pencil",
    color: "#f59e0b",
    category: "creativity",
    difficulty: "easy",
    targetCount: 1,
    reminderTime: "21:00",
    tips: [
      "Don't edit while writing",
      "Use prompts for inspiration",
      "Keep journal accessible",
    ],
    popularityScore: 79,
  },
  {
    id: "draw",
    name: "Sketch or Draw",
    description: "Practice drawing or sketching",
    icon: "Palette",
    color: "#ef4444",
    category: "creativity",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "19:00",
    tips: [
      "Start with simple subjects",
      "Practice daily for improvement",
      "Don't judge your work",
    ],
    popularityScore: 65,
  },
  {
    id: "music",
    name: "Practice Music",
    description: "Play an instrument for 30 minutes",
    icon: "Music",
    color: "#8b5cf6",
    category: "creativity",
    difficulty: "medium",
    targetCount: 1,
    reminderTime: "17:00",
    tips: [
      "Warm up before practice",
      "Focus on problem areas",
      "Record yourself playing",
    ],
    popularityScore: 62,
  },
]

export function getTemplatesByCategory(category: HabitCategory): HabitTemplate[] {
  return HABIT_TEMPLATES.filter(t => t.category === category).sort(
    (a, b) => b.popularityScore - a.popularityScore
  )
}

export function getPopularTemplates(limit = 6): HabitTemplate[] {
  return [...HABIT_TEMPLATES]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

export function searchTemplates(query: string): HabitTemplate[] {
  const lowerQuery = query.toLowerCase()
  return HABIT_TEMPLATES.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
  ).sort((a, b) => b.popularityScore - a.popularityScore)
}
