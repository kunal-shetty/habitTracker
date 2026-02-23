"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { Button } from "@/components/ui/button"
import type { Habit, HabitCompletion } from "@/lib/types"
import { formatDate, isHabitCompletedForDate } from "@/lib/habit-utils"
import { EmptyState } from "./empty-state"
import { Target } from "lucide-react"

interface CalendarViewProps {
  habits: Habit[]
  completions: HabitCompletion[]
  onToggleCompletion: (habitId: string, date: string) => void
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarView({ habits, completions, onToggleCompletion }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [direction, setDirection] = useState(0)

  const activeHabits = habits.filter((h) => !h.archived)

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Calculate completion data for each day
  const getDayCompletionRate = (date: Date) => {
    if (activeHabits.length === 0) return 0
    const dateStr = formatDate(date)
    const completedCount = activeHabits.filter((habit) => isHabitCompletedForDate(completions, habit, dateStr)).length
    return completedCount / activeHabits.length
  }

  const getHabitsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return activeHabits.map((habit) => ({
      habit,
      completed: isHabitCompletedForDate(completions, habit, dateStr),
    }))
  }

  const navigateMonth = (dir: number) => {
    setDirection(dir)
    setCurrentMonth(dir > 0 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1))
  }

  const today = new Date()

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentMonth.toISOString()}
          custom={direction}
          initial={{ x: direction * 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -50, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isToday = isSameDay(day, today)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const completionRate = getDayCompletionRate(day)
            const hasCompletions = completionRate > 0

            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-lg p-1 transition-colors ${!isCurrentMonth
                  ? "text-muted-foreground/40"
                  : isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted"
                  }`}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm">{format(day, "d")}</span>

                {/* Completion indicator */}
                {isCurrentMonth && hasCompletions && !isSelected && (
                  <div className="mt-0.5 flex gap-0.5">
                    {completionRate >= 1 ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    ) : completionRate >= 0.5 ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                    )}
                  </div>
                )}

                {/* Full completion ring */}
                {isCurrentMonth && completionRate >= 1 && !isSelected && (
                  <div className="absolute inset-1 rounded-lg border-2 border-primary/30" />
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Selected date details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{format(selectedDate, "EEEE, MMMM d")}</h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round(getDayCompletionRate(selectedDate) * 100)}% complete
                </span>
              </div>

              {activeHabits.length === 0 ? (
                <EmptyState
                  title="No habits to track"
                  description="Add some habits to see your completion calendar!"
                  icon={Target}
                  actionLabel="Go to Dashboard"
                  onAction={() => window.location.hash = "#home"}
                />
              ) : (
                <div className="space-y-2">
                  {getHabitsForDate(selectedDate).map(({ habit, completed }) => (
                    <motion.button
                      key={habit.id}
                      onClick={() => onToggleCompletion(habit.id, formatDate(selectedDate))}
                      className={`flex w-full items-center gap-3 rounded-lg p-2 transition-colors ${completed ? "bg-primary/10" : "bg-muted hover:bg-muted/80"
                        }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${completed ? "bg-primary" : "bg-background"
                          }`}
                        style={{ backgroundColor: completed ? habit.color : undefined }}
                      >
                        {completed && (
                          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${completed ? "text-foreground/70 line-through" : "text-foreground"}`}>
                        {habit.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span>All done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary/60" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary/30" />
          <span>Started</span>
        </div>
      </div>
    </div>
  )
}
