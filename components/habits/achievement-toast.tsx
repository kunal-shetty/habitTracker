"use client"

import type React from "react"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Flame, Trophy, Star, Rocket, Zap, Medal, Crown, Layers, TrendingUp, X } from "lucide-react"
import { ACHIEVEMENTS } from "@/lib/constants"

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Rocket,
  Flame,
  Zap,
  Trophy,
  Medal,
  Star,
  Crown,
  Layers,
  TrendingUp,
  Award,
}

interface AchievementToastProps {
  achievementId: string | null
  onClose: () => void
}

export function AchievementToast({ achievementId, onClose }: AchievementToastProps) {
  const achievement = achievementId ? ACHIEVEMENTS.find((a) => a.id === achievementId) : null

  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const Icon = iconMap[achievement.icon] || Award

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed inset-x-4 top-4 z-50 overflow-hidden rounded-2xl bg-accent shadow-xl"
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Confetti background effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{
                  backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: "-10%",
                }}
                animate={{
                  y: ["0%", "500%"],
                  rotate: [0, 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <div className="relative flex items-center gap-4 p-4">
            {/* Icon */}
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-foreground/10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Icon className="h-8 w-8 text-accent-foreground" />
            </motion.div>

            {/* Text */}
            <div className="flex-1">
              <motion.p
                className="text-xs font-medium uppercase tracking-wider text-accent-foreground/70"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Achievement Unlocked!
              </motion.p>
              <motion.h3
                className="text-lg font-bold text-accent-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {achievement.name}
              </motion.h3>
              <motion.p
                className="text-sm text-accent-foreground/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {achievement.description}
              </motion.p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-2 top-2 rounded-full p-1 text-accent-foreground/60 hover:bg-accent-foreground/10 hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
