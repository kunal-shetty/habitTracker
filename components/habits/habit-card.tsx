"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Habit, HabitCompletion } from "@/lib/types"
import {
  getCompletionForHabitOnDate,
  getTodayString,
  calculateStreak,
  getHabitCompletionProgress,
} from "@/lib/habit-utils"
import { HabitIcon } from "./habit-icon"
import { ProgressRing } from "./progress-ring"
import { CompletionCelebration } from "./completion-celebration"
import { StreakFlame } from "./streak-flame"

interface HabitCardProps {
  habit: Habit
  completions: HabitCompletion[]
  onToggle: () => void
  onDelete: () => void
}

export function HabitCard({ habit, completions, onToggle, onDelete }: HabitCardProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [wasCompleted, setWasCompleted] = useState(false)
  const today = getTodayString()
  const completion = getCompletionForHabitOnDate(completions, habit.id, today)
  const progress = getHabitCompletionProgress(completions, habit, today)
  const isCompleted = progress >= 1
  const streak = calculateStreak(completions, habit)
  const currentCount = completion?.count || 0

  // Track completion state changes for celebration
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

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border bg-card shadow-sm transition-colors ${
        isCompleted ? "border-primary/30 bg-primary/5" : "border-border"
      }`}
      layout
      whileTap={{ scale: 0.98 }}
    >
      {/* Progress background */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-primary/10"
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      <div className="relative flex items-center gap-3 p-4">
        {/* Completion button with progress ring */}
        <div className="relative">
          {habit.targetCount > 1 ? (
            <ProgressRing progress={progress} size={48} strokeWidth={3} color={habit.color}>
              <motion.button
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
                style={{ backgroundColor: isCompleted ? habit.color : undefined }}
                onClick={handleToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="h-5 w-5 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <motion.span key="count" className="text-xs font-bold" style={{ color: habit.color }}>
                      {currentCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </ProgressRing>
          ) : (
            <motion.button
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                isCompleted ? "bg-primary" : "bg-muted"
              }`}
              style={{ backgroundColor: isCompleted ? habit.color : undefined }}
              onClick={handleToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isCompleted ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                ) : (
                  <motion.div key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <HabitIcon name={habit.icon} className="h-6 w-6" style={{ color: habit.color }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}

          {/* Celebration particles */}
          <CompletionCelebration isActive={showCelebration} color={habit.color} />
        </div>

        {/* Habit info */}
        <div className="min-w-0 flex-1">
          <h3 className={`font-medium ${isCompleted ? "text-foreground/70 line-through" : "text-foreground"}`}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {habit.targetCount > 1 && (
              <span className="tabular-nums">
                {currentCount}/{habit.targetCount}
              </span>
            )}
            {streak > 0 && <StreakFlame streak={streak} size="sm" />}
          </div>
        </div>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
