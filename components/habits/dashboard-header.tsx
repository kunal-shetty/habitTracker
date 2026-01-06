"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Flame, Trophy, Zap } from "lucide-react"
import { format } from "date-fns"
import type { UserStats } from "@/lib/types"
import { LEVEL_THRESHOLDS } from "@/lib/constants"
import { StreakFlame } from "./streak-flame"
import { LevelUpModal } from "./level-up-modal"

interface DashboardHeaderProps {
  stats: UserStats
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const prevLevelRef = useRef(stats.level)
  const today = new Date()
  const greeting = getGreeting()
  const progressToNextLevel = getProgressToNextLevel(stats.totalPoints, stats.level)

  // Check for level up
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

  function getProgressToNextLevel(points: number, level: number) {
    const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] || 0
    const nextLevelThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
    const progressPoints = points - currentLevelThreshold
    const neededPoints = nextLevelThreshold - currentLevelThreshold
    return Math.min(progressPoints / neededPoints, 1)
  }

  return (
    <>
      <header className="border-b border-border bg-background px-4 pb-4 pt-8">
        {/* Date and greeting */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{format(today, "EEEE, MMMM d")}</p>
          <h1 className="text-2xl font-bold text-foreground">{greeting}</h1>
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          {/* Streak card */}
          <motion.div
            className="flex flex-1 items-center gap-3 rounded-xl bg-accent/20 p-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Flame className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <StreakFlame streak={stats.currentOverallStreak} size="md" />
              </div>
              <p className="text-xs text-muted-foreground">Day streak</p>
            </div>
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

        {/* Points indicator */}
        <motion.div
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-muted/50 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">{stats.totalPoints} points</span>
          <span className="text-xs text-muted-foreground">
            ({LEVEL_THRESHOLDS[stats.level] - stats.totalPoints} to next level)
          </span>
        </motion.div>
      </header>

      {/* Level up modal */}
      <LevelUpModal level={stats.level} isOpen={showLevelUp} onClose={() => setShowLevelUp(false)} />
    </>
  )
}
