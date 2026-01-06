"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { Habit, HabitCompletion } from "@/lib/types"
import { HabitCard } from "./habit-card"
import { EmptyState } from "./empty-state"
import { getTodayString } from "@/lib/habit-utils"

interface HabitListProps {
  habits: Habit[]
  completions: HabitCompletion[]
  onToggleCompletion: (habitId: string, date?: string) => void
  onDeleteHabit: (habitId: string) => void
  onAddHabit: () => void
}

export function HabitList({ habits, completions, onToggleCompletion, onDeleteHabit, onAddHabit }: HabitListProps) {
  const today = getTodayString()

  if (habits.length === 0) {
    return <EmptyState onAddHabit={onAddHabit} />
  }

  const completedCount = habits.filter((h) => {
    const completion = completions.find((c) => c.habitId === h.id && c.date === today)
    return completion && completion.count >= h.targetCount
  }).length

  const allComplete = completedCount === habits.length && habits.length > 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Today&apos;s Habits</h2>
        <motion.span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            allComplete ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          }`}
          animate={allComplete ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {completedCount}/{habits.length}
        </motion.span>
      </div>

      {/* All complete celebration */}
      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-3 text-primary">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-xl"
              >
                🎉
              </motion.span>
              <span className="font-medium">All habits completed!</span>
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-xl"
              >
                🎉
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
            transition={{ delay: index * 0.05 }}
          >
            <HabitCard
              habit={habit}
              completions={completions}
              onToggle={() => onToggleCompletion(habit.id, today)}
              onDelete={() => onDeleteHabit(habit.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
