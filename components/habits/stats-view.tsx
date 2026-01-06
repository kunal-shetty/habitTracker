"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Flame, Target, TrendingUp, Calendar, Award, Zap } from "lucide-react"
import { format, subDays } from "date-fns"
import type { Habit, HabitCompletion, UserStats } from "@/lib/types"
import { ACHIEVEMENTS, LEVEL_THRESHOLDS } from "@/lib/constants"
import {
  formatDate,
  calculateStreak,
  calculateLongestStreak,
  getCompletionRate,
  isHabitCompletedForDate,
} from "@/lib/habit-utils"

interface StatsViewProps {
  habits: Habit[]
  completions: HabitCompletion[]
  stats: UserStats
}

export function StatsView({ habits, completions, stats }: StatsViewProps) {
  const activeHabits = habits.filter((h) => !h.archived)

  // Calculate weekly completion data for chart
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

  // Calculate best habit (highest completion rate)
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

  // Unlocked achievements
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => stats.achievements.includes(a.id))

  // Level progress
  const currentLevelThreshold = LEVEL_THRESHOLDS[stats.level - 1] || 0
  const nextLevelThreshold = LEVEL_THRESHOLDS[stats.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const levelProgress = (stats.totalPoints - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <p className="text-2xl font-bold">{stats.currentOverallStreak}</p>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </motion.div>

        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">{stats.totalCompletions}</p>
          <p className="text-xs text-muted-foreground">Total Completions</p>
        </motion.div>

        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
            <TrendingUp className="h-5 w-5 text-chart-3" />
          </div>
          <p className="text-2xl font-bold">{stats.longestOverallStreak}</p>
          <p className="text-xs text-muted-foreground">Longest Streak</p>
        </motion.div>

        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
            <Calendar className="h-5 w-5 text-chart-4" />
          </div>
          <p className="text-2xl font-bold">{activeHabits.length}</p>
          <p className="text-xs text-muted-foreground">Active Habits</p>
        </motion.div>
      </div>

      {/* Level progress */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold">Level {stats.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">{stats.totalPoints} points</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress * 100}%` }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {nextLevelThreshold - stats.totalPoints} points to level {stats.level + 1}
        </p>
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

      {/* Habit breakdown */}
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
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.habit.name}</p>
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
                <div className="flex items-center gap-1 text-xs text-accent">
                  <Flame className="h-3 w-3" />
                  {item.streak}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Achievements</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = stats.achievements.includes(achievement.id)
            return (
              <motion.div
                key={achievement.id}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 ${
                  unlocked ? "bg-accent/20" : "bg-muted opacity-40"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    unlocked ? "bg-accent" : "bg-muted-foreground/20"
                  }`}
                >
                  <Award className={`h-5 w-5 ${unlocked ? "text-accent-foreground" : "text-muted-foreground"}`} />
                </div>
                <p className="text-center text-[10px] font-medium leading-tight">{achievement.name}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
