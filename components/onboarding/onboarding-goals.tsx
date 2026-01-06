"use client"

import { motion } from "framer-motion"
import { Apple, BookOpen, Brain, Dumbbell, Moon, Target } from "lucide-react"

const suggestedHabits = [
  { icon: Dumbbell, label: "Exercise daily", color: "bg-chart-1" },
  { icon: BookOpen, label: "Read 30 minutes", color: "bg-chart-2" },
  { icon: Brain, label: "Meditate", color: "bg-chart-3" },
  { icon: Apple, label: "Eat healthy", color: "bg-chart-4" },
  { icon: Moon, label: "Sleep 8 hours", color: "bg-chart-5" },
  { icon: Target, label: "Set daily goals", color: "bg-primary" },
]

export function OnboardingGoals() {
  return (
    <div className="flex h-full flex-col justify-center">
      <motion.h2
        className="mb-2 text-center text-2xl font-bold text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        What will you achieve?
      </motion.h2>

      <motion.p
        className="mb-8 text-center text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Popular habits to get you started
      </motion.p>

      <div className="grid grid-cols-2 gap-3">
        {suggestedHabits.map((habit, index) => (
          <motion.div
            key={habit.label}
            className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.08, type: "spring" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${habit.color}`}>
              <habit.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-center text-sm font-medium text-foreground">{habit.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
