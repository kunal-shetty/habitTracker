"use client"

import { motion } from "framer-motion"
import { Clock, Zap, Shield, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Quest } from "@/lib/types"
import { DIFFICULTY_CONFIG } from "@/lib/constants"
import { formatDistanceToNow } from "date-fns"

interface QuestCardProps {
  quest: Quest
  onClaim?: () => void
}

export function QuestCard({ quest, onClaim }: QuestCardProps) {
  const difficultyConfig = DIFFICULTY_CONFIG[quest.difficulty] || DIFFICULTY_CONFIG.medium
  const safeProgress = Number.isNaN(quest.progress) ? 0 : quest.progress || 0
  const safeRequirement = Number.isNaN(quest.requirement.count) ? 1 : quest.requirement.count || 1
  const progressPercent = Math.min((safeProgress / safeRequirement) * 100, 100)
  const safeXpReward = Number.isNaN(quest.xpReward) ? 0 : quest.xpReward || 0

  let timeLeft = "soon"
  try {
    timeLeft = formatDistanceToNow(new Date(quest.expiresAt), { addSuffix: true })
  } catch {
    timeLeft = "soon"
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border p-4 ${quest.isCompleted ? "border-green-500/30 bg-green-500/5" : "border-border bg-card"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Difficulty indicator */}
      <div
        className="absolute right-0 top-0 rounded-bl-lg px-2 py-1 text-xs font-medium text-white"
        style={{ backgroundColor: difficultyConfig.color }}
      >
        {difficultyConfig.label}
      </div>

      <div className="pr-16">
        <h3 className="font-semibold text-foreground">{quest.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{quest.description}</p>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {safeProgress}/{safeRequirement}
          </span>
          <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Rewards and timer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* XP reward */}
          <div className="flex items-center gap-1 text-sm">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-amber-600">{safeXpReward}</span>
          </div>

          {/* Grace token reward */}
          {quest.graceTokenReward && quest.graceTokenReward > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-600">{quest.graceTokenReward}</span>
            </div>
          )}
        </div>

        {/* Timer or claim button */}
        {quest.isCompleted ? (
          <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={onClaim}>
            <Gift className="h-4 w-4" />
            Claim
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {timeLeft}
          </div>
        )}
      </div>
    </motion.div>
  )
}
