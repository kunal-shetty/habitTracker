"use client"

import { motion } from "framer-motion"

interface StreakFlameProps {
  streak: number
  size?: "sm" | "md" | "lg"
}

export function StreakFlame({ streak, size = "md" }: StreakFlameProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  // Calculate flame intensity based on streak
  const intensity = Math.min(streak / 30, 1) // Max intensity at 30 days

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        {/* Base flame */}
        <motion.svg
          viewBox="0 0 24 24"
          className={sizeClasses[size]}
          animate={{
            scale: [1, 1.05, 1],
            y: [0, -1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.path
            d="M12 2C12 2 4 9 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 9 12 2 12 2Z"
            fill={`rgb(${251 - intensity * 50}, ${146 - intensity * 50}, 60)`}
            animate={{
              fill: [
                `rgb(${251 - intensity * 50}, ${146 - intensity * 50}, 60)`,
                `rgb(${239 - intensity * 50}, ${68 - intensity * 20}, 68)`,
                `rgb(${251 - intensity * 50}, ${146 - intensity * 50}, 60)`,
              ],
            }}
            transition={{
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Inner flame */}
          <motion.path
            d="M12 8C12 8 8 12 8 15C8 17.2091 9.79086 19 12 19C14.2091 19 16 17.2091 16 15C16 12 12 8 12 8Z"
            fill="#fcd34d"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 0.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.svg>

        {/* Glow effect for high streaks */}
        {streak >= 7 && (
          <motion.div
            className="absolute inset-0 -z-10 rounded-full bg-accent/30 blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      <span className={`font-bold text-accent ${textSizes[size]}`}>{streak}</span>
    </div>
  )
}
