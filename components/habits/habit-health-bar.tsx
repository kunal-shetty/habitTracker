"use client"

import { motion } from "framer-motion"
import { Heart, HeartCrack, AlertTriangle } from "lucide-react"

interface HabitHealthBarProps {
  health: number
  maxHealth: number
  showWarning?: boolean
}

export function HabitHealthBar({ health, maxHealth, showWarning = true }: HabitHealthBarProps) {
  const percentage = (health / maxHealth) * 100
  const isLow = percentage < 30
  const isCritical = percentage < 10
  const isDead = health <= 0

  const getColor = () => {
    if (isDead) return "#6b7280"
    if (isCritical) return "#ef4444"
    if (isLow) return "#f59e0b"
    return "#22c55e"
  }

  return (
    <div className="flex items-center gap-2">
      {/* Heart icon */}
      <motion.div
        animate={isLow && !isDead ? { scale: [1, 1.2, 1] } : undefined}
        transition={{ duration: 0.5, repeat: isLow ? Number.POSITIVE_INFINITY : 0 }}
      >
        {isDead ? (
          <HeartCrack className="h-4 w-4 text-gray-400" />
        ) : (
          <Heart className="h-4 w-4" style={{ color: getColor() }} />
        )}
      </motion.div>

      {/* Health bar */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: getColor() }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Health text */}
      <span className="text-xs font-medium tabular-nums" style={{ color: getColor() }}>
        {health}/{maxHealth}
      </span>

      {/* Warning icon for low health */}
      {showWarning && isLow && !isDead && (
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </motion.div>
      )}
    </div>
  )
}
