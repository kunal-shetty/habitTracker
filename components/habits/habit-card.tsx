"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, MoreVertical, Trash2, Sword } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Habit, HabitCompletion } from "@/lib/types"
import {
  getCompletionForHabitOnDate,
  getTodayString,
  calculateStreak,
  getHabitCompletionProgress,
} from "@/lib/habit-utils"
import { CompletionCelebration } from "./completion-celebration"
import { StreakFlame } from "./streak-flame"
import { HabitAvatar } from "./habit-avatar"
import { XpPopup } from "./xp-popup"
import { HabitHealthBar } from "./habit-health-bar"
import { EVOLUTION_CONFIG } from "@/lib/constants"

interface HabitCardProps {
  habit: Habit
  completions: HabitCompletion[]
  onToggle: () => void
  onDelete: () => void
  xpGained?: { amount: number; habitId: string } | null
}

export function HabitCard({ habit, completions, onToggle, onDelete, xpGained }: HabitCardProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [wasCompleted, setWasCompleted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const today = getTodayString()
  const completion = getCompletionForHabitOnDate(completions, habit.id, today)
  const progress = getHabitCompletionProgress(completions, habit, today)
  const isCompleted = progress >= 1
  const streak = calculateStreak(completions, habit)
  const currentCount = completion?.count || 0
  const evolutionConfig = EVOLUTION_CONFIG[habit.evolutionStage]
  const showXp = xpGained?.habitId === habit.id

  useEffect(() => {
    if (isCompleted && !wasCompleted) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 800)
      return () => clearTimeout(timer)
    }
    setWasCompleted(isCompleted)
  }, [isCompleted, wasCompleted])

  const handleToggle = () => {
    onToggle()
  }

  const isDead = habit.health <= 0

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border bg-card shadow-sm transition-colors ${
        isCompleted
          ? "border-primary/30 bg-primary/5"
          : isDead
            ? "border-red-300 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30"
            : "border-border"
      }`}
      layout
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Progress background */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-primary/10"
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* XP Popup */}
      <XpPopup amount={xpGained?.amount || 0} isVisible={showXp} />

      <div className="relative flex items-center gap-3 p-4">
        <div className="relative">
          <HabitAvatar
            stage={habit.evolutionStage}
            health={habit.health}
            maxHealth={habit.maxHealth}
            level={habit.level}
            power={habit.power}
            color={habit.color}
            isAnimating={showCelebration}
            size="md"
          />

          {/* Tap to complete overlay */}
          <motion.button
            className={`absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity hover:opacity-100 ${
              isCompleted ? "bg-primary/80" : "bg-muted/80"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleToggle()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCompleted ? (
              <Check className="h-5 w-5 text-primary-foreground" />
            ) : (
              <span className="text-xs font-bold" style={{ color: habit.color }}>
                {habit.targetCount > 1 ? currentCount : "+"}
              </span>
            )}
          </motion.button>

          <CompletionCelebration isActive={showCelebration} color={habit.color} />
        </div>

        {/* Habit info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${isCompleted ? "text-foreground/70 line-through" : "text-foreground"}`}>
              {habit.name}
            </h3>
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: `${evolutionConfig.color}20`, color: evolutionConfig.color }}
            >
              {evolutionConfig.label}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            {habit.targetCount > 1 && (
              <span className="tabular-nums">
                {currentCount}/{habit.targetCount}
              </span>
            )}
            {streak > 0 && <StreakFlame streak={streak} size="sm" />}
            <span className="flex items-center gap-1 text-xs">
              <Sword className="h-3 w-3 text-amber-500" />
              {habit.power}
            </span>
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete habit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-3 p-4 pt-3">
              <HabitHealthBar health={habit.health} maxHealth={habit.maxHealth} />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{habit.experience} XP</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Longest Streak</span>
                <span className="font-medium">{streak} days</span>
              </div>
              {habit.isMastered && (
                <div className="rounded-lg bg-amber-500/10 p-2 text-center text-sm font-medium text-amber-600">
                  Mastered Habit
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion glow effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ backgroundColor: habit.color }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
