"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Flame, Trophy, Zap, Shield, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import type { UserStats } from "@/lib/types"
import { LEVEL_THRESHOLDS } from "@/lib/constants"
import { StreakFlame } from "./streak-flame"
import { LevelUpModal } from "./level-up-modal"
import { GraceTokenIndicator } from "./grace-token-indicator"

interface DashboardHeaderProps {
  stats: UserStats
  onOpenLeaderboard?: () => void
}

export function DashboardHeader({ stats, onOpenLeaderboard }: DashboardHeaderProps) {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const prevLevelRef = useRef(stats.level)
  const today = new Date()
  const greeting = getGreeting()
  const progressToNextLevel = getProgressToNextLevel(stats.totalXp, stats.level)

  useEffect(() => {
    if (stats.level > prevLevelRef.current) {
      setShowLevelUp(true)
    }
    prevLevelRef.current = stats.level
  }, [stats.level])

  function getGreeting() {
    const hour = today.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  function getProgressToNextLevel(xp: number, level: number) {
    const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] || 0
    const nextLevelThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
    const progressPoints = xp - currentLevelThreshold
    const neededPoints = nextLevelThreshold - currentLevelThreshold
    return Math.min(progressPoints / neededPoints, 1)
  }

  const nextLevelXp = LEVEL_THRESHOLDS[stats.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const xpToNextLevel = nextLevelXp - stats.totalXp

  return (
    <>
      <header className="border-b border-border bg-background px-4 py-8">
        {/* Date and greeting */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{format(today, "EEEE, MMMM d")}</p>
            <h1 className="text-2xl font-bold text-foreground">{greeting}</h1>
          </div>
          <div className="flex items-center gap-2">
            <GraceTokenIndicator count={stats.availableGraceTokens} compact />
            {onOpenLeaderboard && (
              <motion.button
                onClick={onOpenLeaderboard}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 transition-colors hover:bg-amber-500/20"
                whileTap={{ scale: 0.95 }}
              >
                <Trophy className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          {/* Streak card with multiplier */}
          <motion.div
            className="flex flex-1 flex-col gap-2 rounded-xl bg-accent/20 p-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Flame className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <StreakFlame streak={stats.currentOverallStreak} size="md" />
                </div>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </div>
            {stats.currentOverallStreak > 0 && (
              <div className="flex items-center gap-1 rounded bg-accent/30 px-2 py-1 text-xs">
                <TrendingUp className="h-3 w-3 text-orange-500" />
                <span className="font-semibold text-orange-600">{stats.streakMultiplier.toFixed(1)}x</span>
                <span className="text-muted-foreground">XP bonus</span>
              </div>
            )}
          </motion.div>

          {/* Level card */}
          <motion.div
            className="flex flex-1 items-center gap-3 rounded-xl bg-primary/10 p-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground">{stats.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
                {stats.prestigeLevel > 0 && (
                  <span className="rounded bg-amber-500 px-1 text-xs font-bold text-white">P{stats.prestigeLevel}</span>
                )}
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">{stats.totalXp.toLocaleString()} XP</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {xpToNextLevel.toLocaleString()} to level {stats.level + 1}
          </span>
        </motion.div>

        {stats.comebackData.isInComebackMode && (
          <motion.div
            className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Welcome back! Complete quests to rebuild your streak.</span>
          </motion.div>
        )}
      </header>

      <LevelUpModal level={stats.level} isOpen={showLevelUp} onClose={() => setShowLevelUp(false)} />
    </>
  )
}
