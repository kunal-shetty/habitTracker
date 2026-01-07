"use client"

import { motion } from "framer-motion"
import { Flame, TrendingUp } from "lucide-react"

interface StreakMultiplierProps {
  multiplier: number
  streak: number
}

export function StreakMultiplier({ multiplier, streak }: StreakMultiplierProps) {
  const isMaxed = multiplier >= 5
  const intensity = Math.min(multiplier / 5, 1)

  return (
    <motion.div
      className="flex items-center gap-2 rounded-lg border px-3 py-2"
      style={{
        borderColor: `rgba(249, 115, 22, ${intensity})`,
        backgroundColor: `rgba(249, 115, 22, ${intensity * 0.1})`,
      }}
      animate={{
        scale: isMaxed ? [1, 1.02, 1] : 1,
      }}
      transition={{ duration: 1, repeat: isMaxed ? Number.POSITIVE_INFINITY : 0 }}
    >
      <div className="relative">
        <Flame
          className="h-5 w-5"
          style={{
            color: `rgb(${234 - intensity * 100}, ${88 - intensity * 50}, 12)`,
          }}
        />
        {isMaxed && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Flame className="h-5 w-5 text-amber-400" />
          </motion.div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-orange-600">{multiplier.toFixed(1)}x</span>
          <TrendingUp className="h-3 w-3 text-orange-500" />
        </div>
        <p className="text-xs text-muted-foreground">{streak} day streak</p>
      </div>
      {isMaxed && <span className="ml-1 rounded bg-orange-500 px-1.5 py-0.5 text-xs font-bold text-white">MAX</span>}
    </motion.div>
  )
}
