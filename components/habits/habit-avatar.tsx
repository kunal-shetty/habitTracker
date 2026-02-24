"use client"

import { motion } from "framer-motion"
import type { EvolutionStage } from "@/lib/types"
import { EVOLUTION_CONFIG } from "@/lib/constants"
import { Sprout, Leaf, Flower, TreesIcon, Sparkles, Heart } from "lucide-react"
import * as Icons from "lucide-react"

interface HabitAvatarProps {
  stage: EvolutionStage
  health: number
  maxHealth: number
  level: number
  power: number
  color: string
  iconName?: string // New prop
  isAnimating?: boolean
  size?: "sm" | "md" | "lg"
}

const stageIcons = {
  seed: Sprout,
  sprout: Leaf,
  bloom: Flower,
  flourish: TreesIcon,
  transcend: Sparkles,
}

export function HabitAvatar({
  stage,
  health,
  maxHealth,
  level,
  power,
  color,
  iconName,
  isAnimating = false,
  size = "md",
}: HabitAvatarProps) {
  const config = EVOLUTION_CONFIG[stage]

  // Prioritize custom iconName, then stage-based icon
  const Icon = (iconName && Icons[iconName as keyof typeof Icons] ? Icons[iconName as keyof typeof Icons] : stageIcons[stage]) as any
  const healthPercent = (health / maxHealth) * 100
  const isDead = health <= 0

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  }

  return (
    <div className="relative">
      {/* Glow effect for transcended habits */}
      {stage === "transcend" && (
        <motion.div
          className="absolute inset-0 rounded-full blur-md"
          style={{ backgroundColor: color }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}

      {/* Main avatar */}
      <motion.div
        className={`relative flex items-center justify-center rounded-full ${sizeClasses[size]} ${isDead ? "grayscale" : ""}`}
        style={{ backgroundColor: `${color}20` }}
        animate={
          isAnimating
            ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }
            : undefined
        }
        transition={{ duration: 0.5 }}
      >
        <Icon className={iconSizes[size]} style={{ color }} />

        {/* Health bar */}
        <div className="absolute -bottom-1 left-1/2 h-1.5 w-3/4 -translate-x-1/2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: healthPercent > 50 ? "#22c55e" : healthPercent > 25 ? "#f59e0b" : "#ef4444",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Level badge */}
        <div
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {level}
        </div>
      </motion.div>

      {/* Dead overlay */}
      {isDead && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Heart className="h-4 w-4 text-red-500" />
        </motion.div>
      )}
    </div>
  )
}
