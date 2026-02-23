"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy,
  Flame,
  Star,
  Target,
  Edit2,
  Camera,
  ChevronRight,
  Zap,
  Crown,
  Medal,
  Share2,
  Rocket,
  Footprints,
  Gem,
  Sparkles,
  Layers,
  Compass,
  TrendingUp,
  Award,
  Shield,
  Sword,
  Scroll,
  Calendar,
  Sunrise,
  Moon,
  RotateCcw,
  Map,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import type { Achievement, UserStats } from "@/lib/types"
import { ACHIEVEMENTS, RARITY_COLORS } from "@/lib/constants"

interface ProfileViewProps {
  stats: UserStats
  unlockedAchievements: Achievement[]
}

export function ProfileView({ stats, unlockedAchievements }: ProfileViewProps) {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || "")
  const [showShareModal, setShowShareModal] = useState(false)

  const safeLevel = Number.isNaN(stats.level) ? 1 : stats.level || 1
  const safeTotalXp = Number.isNaN(stats.totalXp) ? 0 : stats.totalXp || 0
  const safeCurrentStreak = Number.isNaN(stats.currentOverallStreak) ? 0 : stats.currentOverallStreak || 0
  const safeLongestStreak = Number.isNaN(stats.longestOverallStreak) ? 0 : stats.longestOverallStreak || 0
  const safeTotalCompletions = Number.isNaN(stats.totalCompletions) ? 0 : stats.totalCompletions || 0

  const handleSave = async () => {
    if (editName.trim()) {
      await updateProfile({ name: editName.trim() })
      setIsEditing(false)
    }
  }

  const getRankTitle = () => {
    if (safeLevel >= 50) return { title: "Legendary Master", icon: Crown, color: "text-amber-500" }
    if (safeLevel >= 30) return { title: "Elite Champion", icon: Trophy, color: "text-purple-500" }
    if (safeLevel >= 20) return { title: "Habit Hero", icon: Medal, color: "text-blue-500" }
    if (safeLevel >= 10) return { title: "Rising Star", icon: Star, color: "text-emerald-500" }
    return { title: "Habit Starter", icon: Target, color: "text-muted-foreground" }
  }

  const rank = getRankTitle()
  const totalAchievements = ACHIEVEMENTS.length
  const completionRate =
    safeTotalCompletions > 0 ? Math.round((safeTotalCompletions / (safeTotalCompletions + 50)) * 100) : 0

  const profileStats = [
    { label: "Current Streak", value: safeCurrentStreak, icon: Flame, color: "text-orange-500" },
    { label: "Best Streak", value: safeLongestStreak, icon: Zap, color: "text-amber-500" },
    { label: "Total XP", value: safeTotalXp.toLocaleString(), icon: Star, color: "text-purple-500" },
    { label: "Completions", value: safeTotalCompletions, icon: Target, color: "text-emerald-500" },
  ]

  const ACHIEVEMENT_ICON_MAP = {
    Rocket,
    Footprints,
    Flame,
    Crown,
    Zap,
    Trophy,
    Medal,
    Star,
    Gem,
    Sparkles,
    Layers,
    Compass,
    TrendingUp,
    Award,
    Shield,
    Sword,
    Scroll,
    Map,
    Calendar,
    Sunrise,
    Moon,
    RotateCcw,
  } as const

  const generateAchievementIcon = (iconName: string) => {
    const Icon = ACHIEVEMENT_ICON_MAP[iconName as keyof typeof ACHIEVEMENT_ICON_MAP]
    if (!Icon) return null
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header Card */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-chart-2/10 blur-2xl" />

        <div className="relative flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-chart-2 text-3xl font-bold text-primary-foreground shadow-lg">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md">
              <Camera className="h-4 w-4 text-muted-foreground" />
            </button>
            {/* Level badge */}
            <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-chart-1 text-xs font-bold text-white shadow-md">
              {safeLevel}
            </div>
          </div>

          {/* Name and rank */}
          <div className="flex-1">
            {isEditing ? (
              <div className="flex gap-2">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" autoFocus />
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user?.name || "Habit Hero"}</h2>
                <button onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
            <div className={`mt-1 flex items-center gap-1.5 text-sm ${rank.color}`}>
              <rank.icon className="h-4 w-4" />
              <span className="font-medium">{rank.title}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {profileStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="rounded-xl bg-card p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements Showcase */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Achievements</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedAchievements.length}/{totalAchievements}
          </span>
        </div>

        {/* Achievement progress bar */}
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-chart-1 to-chart-2"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedAchievements.length / totalAchievements) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Recent achievements */}
        <div className="space-y-2">
          {unlockedAchievements.slice(0, 3).map((achievement) => {
            const colors = RARITY_COLORS[achievement.rarity] || RARITY_COLORS.common
            return (
              <div key={achievement.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                  style={{ backgroundColor: `${colors.bg}20` }}
                >
                  {generateAchievementIcon(achievement.icon)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                <span className="text-xs font-medium" style={{ color: colors.text }}>
                  +{(achievement as any).xpReward || 50} XP
                </span>
              </div>
            )
          })}
        </div>

        {unlockedAchievements.length > 3 && (
          <Button variant="ghost" className="mt-2 w-full justify-between">
            View all achievements
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </motion.div>

      {/* Activity Summary */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="mb-4 font-semibold">Activity Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Days active this month</span>
            <span className="font-semibold">{Math.min(safeCurrentStreak, 30)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Consistency rate</span>
            <span className="font-semibold">{completionRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Habits evolved</span>
            <span className="font-semibold">{Math.floor(safeLevel / 5)}</span>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-background p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-bold">Share Your Progress</h3>

              {/* Shareable card preview */}
              <div className="mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-bold">{user?.name || "Habit Hero"}</p>
                    <p className="text-xs text-muted-foreground">
                      Level {safeLevel} {rank.title}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-background/80 p-2">
                    <p className="text-lg font-bold text-orange-500">{safeCurrentStreak}</p>
                    <p className="text-[10px] text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-2">
                    <p className="text-lg font-bold text-purple-500">{safeTotalXp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Total XP</p>
                  </div>
                  <div className="rounded-lg bg-background/80 p-2">
                    <p className="text-lg font-bold text-emerald-500">{unlockedAchievements.length}</p>
                    <p className="text-[10px] text-muted-foreground">Achievements</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowShareModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
