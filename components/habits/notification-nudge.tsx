"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Flame, Target, Clock } from "lucide-react"
import { MOTIVATIONAL_MESSAGES } from "@/lib/constants"

interface NotificationNudgeProps {
  type: "streak" | "almostDone" | "reminder"
  streak?: number
  habitsLeft?: number
  onDismiss: () => void
}

export function NotificationNudge({ type, streak = 0, habitsLeft = 0, onDismiss }: NotificationNudgeProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 8000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const getMessage = () => {
    if (type === "almostDone" && habitsLeft > 0) {
      return MOTIVATIONAL_MESSAGES.almostDone[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.almostDone.length)]
    }
    if (type === "streak") {
      return MOTIVATIONAL_MESSAGES.streakSafe[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.streakSafe.length)]
    }
    return MOTIVATIONAL_MESSAGES.streakReminder[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.streakReminder.length)]
  }

  const getIcon = () => {
    if (type === "streak") return <Flame className="h-5 w-5 text-orange-500" />
    if (type === "almostDone") return <Target className="h-5 w-5 text-green-500" />
    return <Clock className="h-5 w-5 text-blue-500" />
  }

  const getColor = () => {
    if (type === "streak") return "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950"
    if (type === "almostDone") return "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
    return "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed left-4 right-4 top-4 z-50 rounded-xl border p-4 shadow-lg ${getColor()}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{getMessage()}</p>
              {type === "almostDone" && habitsLeft > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {habitsLeft} habit{habitsLeft > 1 ? "s" : ""} remaining
                </p>
              )}
              {type === "streak" && streak > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">{streak} day streak protected</p>
              )}
            </div>
            <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
