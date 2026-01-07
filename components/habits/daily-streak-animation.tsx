"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Calendar, Star } from "lucide-react"

interface DailyStreakAnimationProps {
  streak: number
  isNewDay: boolean
  onComplete: () => void
}

export function DailyStreakAnimation({ streak, isNewDay, onComplete }: DailyStreakAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isNewDay && streak > 0) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isNewDay, streak, onComplete])

  const getMilestoneMessage = () => {
    if (streak === 7) return "One Week Strong!"
    if (streak === 14) return "Two Weeks Champion!"
    if (streak === 30) return "Monthly Master!"
    if (streak === 50) return "Incredible Dedication!"
    if (streak === 100) return "Century Club!"
    if (streak % 10 === 0) return `${streak} Days!`
    return `${streak} Day Streak!`
  }

  const isMilestone = [7, 14, 30, 50, 100].includes(streak) || streak % 10 === 0

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsVisible(false)
            onComplete()
          }}
        >
          {/* Floating particles for milestones */}
          {isMilestone && (
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -50],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 1,
                    repeat: 1,
                  }}
                >
                  <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="relative flex flex-col items-center p-8"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Animated flame */}
            <motion.div
              className="relative mb-4"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-500/30 blur-xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
                <Flame className="h-12 w-12 text-white" fill="currentColor" />
              </div>
            </motion.div>

            {/* Streak count */}
            <motion.div
              className="mb-2 text-5xl font-bold text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {streak}
            </motion.div>

            {/* Message */}
            <motion.p
              className="mb-4 text-xl font-semibold text-white drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {getMilestoneMessage()}
            </motion.p>

            {/* Calendar icon with days */}
            <motion.div
              className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Calendar className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Keep it going!</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
