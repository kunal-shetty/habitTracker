"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Flame, Target, Award, Zap, Crown, Sparkles, Shield } from "lucide-react"
import { format, subDays } from "date-fns"
import type { Habit, HabitCompletion, UserStats } from "@/lib/types"
import { ACHIEVEMENTS, RARITY_CONFIG, EVOLUTION_CONFIG } from "@/lib/constants"
import {
  formatDate,
  calculateStreak,
  calculateLongestStreak,
  getCompletionRate,
  isHabitCompletedForDate,
} from "@/lib/habit-utils"
import { getXpProgressToNextLevel } from "@/lib/gamification-utils"
import { EmptyState } from "./empty-state"

interface StatsViewProps {
  habits: Habit[]
  completions: HabitCompletion[]
  stats: UserStats
}

export function StatsView({ habits, completions, stats }: StatsViewProps) {
  const activeHabits = habits.filter((h) => !h.archived)

  if (activeHabits.length === 0) {
    return (
      <EmptyState
        title="No Stats Yet"
        description="Complete your first habit to see your progress and stats here!"
        icon={Target}
        actionLabel="Go to Dashboard"
        onAction={() => window.location.hash = "#home"} // Simple way to suggest going home
      />
    )
  }

  const weeklyData = useMemo(() => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = formatDate(date)
      const completed = activeHabits.filter((h) => isHabitCompletedForDate(completions, h, dateStr)).length
      data.push({
        day: format(date, "EEE"),
        completed,
        total: activeHabits.length,
        percentage: activeHabits.length > 0 ? (completed / activeHabits.length) * 100 : 0,
      })
    }
    return data
  }, [activeHabits, completions])

  const habitStats = useMemo(() => {
    return activeHabits
      .map((habit) => ({
        habit,
        streak: calculateStreak(completions, habit),
        longestStreak: calculateLongestStreak(completions, habit),
        completionRate: getCompletionRate(completions, habit, 30),
      }))
      .sort((a, b) => b.completionRate - a.completionRate)
  }, [activeHabits, completions])

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => stats.achievements.includes(a.id))
  const xpProgress = getXpProgressToNextLevel(stats.totalXp, stats.level)

  // Count habits by evolution stage
  const evolutionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    activeHabits.forEach((h) => {
      counts[h.evolutionStage] = (counts[h.evolutionStage] || 0) + 1
    })
    return counts
  }, [activeHabits])

  return (
    <div className="space-y-6">
      {/* Overview cards - extended */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">{stats.currentOverallStreak}</p>
          <p className="text-xs text-muted-foreground">Current Streak</p>
          <p className="mt-1 text-xs font-medium text-orange-500">{stats.streakMultiplier.toFixed(1)}x multiplier</p>
        </motion.div>

        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold">{stats.totalXp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total XP</p>
        </motion.div>

        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
            <Target className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{stats.perfectDays}</p>
          <p className="text-xs text-muted-foreground">Perfect Days</p>
        </motion.div>

        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{stats.questsCompleted}</p>
          <p className="text-xs text-muted-foreground">Quests Done</p>
        </motion.div>
      </div>

      {/* XP Progress */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-semibold">Level {stats.level}</span>
            {stats.prestigeLevel > 0 && (
              <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-bold text-white">
                Prestige {stats.prestigeLevel}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{stats.totalXp.toLocaleString()} XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress.percentage}%` }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {xpProgress.current.toLocaleString()} / {xpProgress.required.toLocaleString()} XP to level {stats.level + 1}
        </p>
      </motion.div>

      {/* Habit Evolution Overview */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span className="font-semibold">Habit Evolution</span>
        </div>
        <div className="flex justify-between gap-2">
          {Object.entries(EVOLUTION_CONFIG).map(([stage, config]) => (
            <div key={stage} className="flex flex-col items-center gap-1">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  backgroundColor: `${config.color}20`,
                  color: config.color,
                }}
              >
                {evolutionCounts[stage] || 0}
              </div>
              <span className="text-[10px] text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly chart */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="mb-4 font-semibold">This Week</h3>
        <div className="flex items-end justify-between gap-2">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative h-24 w-full rounded-lg bg-muted">
                <motion.div
                  className="absolute bottom-0 w-full rounded-lg bg-primary"
                  initial={{ height: 0 }}
                  animate={{ height: `${day.percentage}%` }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Habit breakdown with RPG stats */}
      {habitStats.length > 0 && (
        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="mb-4 font-semibold">Habit Performance</h3>
          <div className="space-y-3">
            {habitStats.slice(0, 5).map((item, index) => (
              <div key={item.habit.id} className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: item.habit.color }}
                >
                  <span className="text-xs font-bold text-white">L{item.habit.level}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{item.habit.name}</p>
                    <span
                      className="rounded px-1 py-0.5 text-[10px]"
                      style={{
                        backgroundColor: `${EVOLUTION_CONFIG[item.habit.evolutionStage].color}20`,
                        color: EVOLUTION_CONFIG[item.habit.evolutionStage].color,
                      }}
                    >
                      {EVOLUTION_CONFIG[item.habit.evolutionStage].label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.habit.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.completionRate * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.round(item.completionRate * 100)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-500">
                  <Flame className="h-3 w-3" />
                  {item.streak}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements with rarity */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Achievements</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedAchievements.length}/{ACHIEVEMENTS.filter((a) => !a.isHidden).length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ACHIEVEMENTS.filter((a) => !a.isHidden || stats.achievements.includes(a.id)).map((achievement) => {
            const unlocked = stats.achievements.includes(achievement.id)
            const rarityConfig = RARITY_CONFIG[achievement.rarity]
            return (
              <motion.div
                key={achievement.id}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 ${unlocked ? "" : "opacity-40 grayscale"}`}
                style={{
                  backgroundColor: unlocked ? `${rarityConfig.color}15` : undefined,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: unlocked ? rarityConfig.color : "hsl(var(--muted))",
                  }}
                >
                  <Award className={`h-5 w-5 ${unlocked ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <p className="text-center text-[10px] font-medium leading-tight">{achievement.name}</p>
                <span
                  className="text-[8px] font-semibold uppercase"
                  style={{ color: unlocked ? rarityConfig.color : "hsl(var(--muted-foreground))" }}
                >
                  {achievement.rarity}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
