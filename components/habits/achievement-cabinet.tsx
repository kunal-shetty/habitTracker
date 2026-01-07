"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Award, Lock, Share2, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ACHIEVEMENTS, RARITY_CONFIG } from "@/lib/constants"
import type { Achievement, UserStats } from "@/lib/types"

interface AchievementCabinetProps {
  stats: UserStats
}

function AchievementDetailModal({
  achievement,
  isUnlocked,
  isOpen,
  onClose,
}: {
  achievement: Achievement | null
  isUnlocked: boolean
  isOpen: boolean
  onClose: () => void
}) {
  if (!achievement) return null

  const rarityConfig = RARITY_CONFIG[achievement.rarity]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm overflow-hidden border-0 p-0">
        <DialogTitle className="sr-only">{achievement.name}</DialogTitle>
        {/* Header with rarity color */}
        <div className="relative p-6 pb-4" style={{ backgroundColor: `${rarityConfig.color}15` }}>
          {/* Particles for legendary/epic */}
          {(achievement.rarity === "legendary" || achievement.rarity === "epic") && isUnlocked && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full"
                  style={{ backgroundColor: rarityConfig.color }}
                  animate={{
                    x: [Math.random() * 100, Math.random() * 100],
                    y: [Math.random() * 100, Math.random() * 100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              ))}
            </div>
          )}

          <div className="relative flex flex-col items-center">
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: isUnlocked ? rarityConfig.color : "hsl(var(--muted))",
              }}
              animate={isUnlocked ? { scale: [1, 1.05, 1] } : undefined}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {isUnlocked ? (
                <Award className="h-10 w-10 text-white" />
              ) : (
                <Lock className="h-10 w-10 text-muted-foreground" />
              )}
            </motion.div>
            <span
              className="mt-3 rounded-full px-3 py-1 text-xs font-bold uppercase text-white"
              style={{ backgroundColor: rarityConfig.color }}
            >
              {achievement.rarity}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 text-center">
          <h2 className="text-xl font-bold">{achievement.name}</h2>
          <p className="mt-2 text-muted-foreground">{achievement.description}</p>

          {!isUnlocked && (
            <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
              <p className="text-muted-foreground">
                {achievement.type === "streak" && `Reach a ${achievement.requirement}-day streak`}
                {achievement.type === "completions" && `Complete ${achievement.requirement} habits`}
                {achievement.type === "level" && `Reach level ${achievement.requirement}`}
                {achievement.type === "habits" && `Create ${achievement.requirement} habits`}
                {achievement.type === "quest" && `Complete ${achievement.requirement} quests`}
              </p>
            </div>
          )}

          {isUnlocked && (
            <Button variant="outline" className="mt-4 gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share Achievement
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AchievementCabinet({ stats }: AchievementCabinetProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => stats.achievements.includes(a.id))
  const visibleAchievements = ACHIEVEMENTS.filter((a) => !a.isHidden || stats.achievements.includes(a.id))

  // Group by rarity
  const byRarity = {
    legendary: visibleAchievements.filter((a) => a.rarity === "legendary"),
    epic: visibleAchievements.filter((a) => a.rarity === "epic"),
    rare: visibleAchievements.filter((a) => a.rarity === "rare"),
    uncommon: visibleAchievements.filter((a) => a.rarity === "uncommon"),
    common: visibleAchievements.filter((a) => a.rarity === "common"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Completion</p>
          <p className="text-lg font-semibold">
            {Math.round((unlockedAchievements.length / visibleAchievements.length) * 100)}%
          </p>
        </div>
      </motion.div>

      {/* Rarity sections */}
      {(["legendary", "epic", "rare", "uncommon", "common"] as const).map(
        (rarity) =>
          byRarity[rarity].length > 0 && (
            <motion.div
              key={rarity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: RARITY_CONFIG[rarity].color }} />
                <h3 className="font-semibold capitalize" style={{ color: RARITY_CONFIG[rarity].color }}>
                  {rarity}
                </h3>
                <span className="text-xs text-muted-foreground">
                  ({byRarity[rarity].filter((a) => stats.achievements.includes(a.id)).length}/{byRarity[rarity].length})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {byRarity[rarity].map((achievement) => {
                  const isUnlocked = stats.achievements.includes(achievement.id)
                  return (
                    <motion.button
                      key={achievement.id}
                      className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-colors ${
                        isUnlocked ? "hover:bg-muted" : "opacity-40"
                      }`}
                      style={{
                        backgroundColor: isUnlocked ? `${RARITY_CONFIG[rarity].color}10` : undefined,
                      }}
                      onClick={() => setSelectedAchievement(achievement)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: isUnlocked ? RARITY_CONFIG[rarity].color : "hsl(var(--muted))",
                        }}
                      >
                        {isUnlocked ? (
                          <Award className="h-5 w-5 text-white" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-center text-[10px] font-medium leading-tight">{achievement.name}</p>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ),
      )}

      {/* Achievement detail modal */}
      <AchievementDetailModal
        achievement={selectedAchievement}
        isUnlocked={selectedAchievement ? stats.achievements.includes(selectedAchievement.id) : false}
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  )
}
