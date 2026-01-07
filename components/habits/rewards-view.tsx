"use client"

import { motion } from "framer-motion"
import { Gift, Lock, Check, Sparkles, Palette, Flame, Volume2, User } from "lucide-react"
import { REWARDS, RARITY_CONFIG } from "@/lib/constants"
import type { Reward, UserStats } from "@/lib/types"

interface RewardsViewProps {
  stats: UserStats
  onSelectReward?: (rewardId: string) => void
}

const typeIcons = {
  theme: Palette,
  icon_pack: Gift,
  animation: Sparkles,
  sound_pack: Volume2,
  avatar: User,
  streak_effect: Flame,
}

function RewardCard({
  reward,
  isUnlocked,
  isSelected,
  onSelect,
}: {
  reward: Reward
  isUnlocked: boolean
  isSelected: boolean
  onSelect?: () => void
}) {
  const Icon = typeIcons[reward.type]
  const rarityConfig = RARITY_CONFIG[reward.rarity]

  return (
    <motion.button
      className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
        isUnlocked
          ? isSelected
            ? "border-primary bg-primary/10"
            : "border-border bg-card hover:border-primary/50"
          : "border-border bg-muted/50 opacity-60"
      }`}
      onClick={isUnlocked ? onSelect : undefined}
      whileHover={isUnlocked ? { scale: 1.02 } : undefined}
      whileTap={isUnlocked ? { scale: 0.98 } : undefined}
    >
      {/* Rarity indicator */}
      <div
        className="absolute right-0 top-0 rounded-bl-lg px-2 py-1 text-[10px] font-bold uppercase text-white"
        style={{ backgroundColor: rarityConfig.color }}
      >
        {reward.rarity}
      </div>

      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${rarityConfig.color}20` }}
        >
          {isUnlocked ? (
            <Icon className="h-6 w-6" style={{ color: rarityConfig.color }} />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 pr-12">
          <h3 className="font-semibold text-foreground">{reward.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{reward.description}</p>
        </div>
      </div>

      {/* Unlock condition */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {reward.unlockCondition.type === "level" && `Level ${reward.unlockCondition.requirement}`}
          {reward.unlockCondition.type === "streak" && `${reward.unlockCondition.requirement} day streak`}
          {reward.unlockCondition.type === "completions" && `${reward.unlockCondition.requirement} completions`}
        </span>
        {isUnlocked && (
          <span className="flex items-center gap-1 text-green-600">
            <Check className="h-3 w-3" />
            Unlocked
          </span>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="h-4 w-4 text-primary-foreground" />
        </motion.div>
      )}
    </motion.button>
  )
}

export function RewardsView({ stats, onSelectReward }: RewardsViewProps) {
  const themes = REWARDS.filter((r) => r.type === "theme")
  const streakEffects = REWARDS.filter((r) => r.type === "streak_effect")
  const animations = REWARDS.filter((r) => r.type === "animation")

  const isRewardUnlocked = (reward: Reward): boolean => {
    if (stats.unlockedRewards.includes(reward.id)) return true

    switch (reward.unlockCondition.type) {
      case "level":
        return stats.level >= (reward.unlockCondition.requirement as number)
      case "streak":
        return stats.longestOverallStreak >= (reward.unlockCondition.requirement as number)
      case "completions":
        return stats.totalCompletions >= (reward.unlockCondition.requirement as number)
      default:
        return false
    }
  }

  const unlockedCount = REWARDS.filter((r) => isRewardUnlocked(r)).length

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <motion.div
        className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{unlockedCount}</p>
            <p className="text-sm text-muted-foreground">Rewards Unlocked</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Available</p>
          <p className="text-lg font-semibold">{REWARDS.length}</p>
        </div>
      </motion.div>

      {/* Themes section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Themes</h2>
        </div>
        <div className="grid gap-3">
          {themes.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              isUnlocked={isRewardUnlocked(reward)}
              isSelected={stats.selectedTheme === reward.id}
              onSelect={() => onSelectReward?.(reward.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Streak Effects section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Streak Effects</h2>
        </div>
        <div className="grid gap-3">
          {streakEffects.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              isUnlocked={isRewardUnlocked(reward)}
              isSelected={stats.selectedStreakEffect === reward.id}
              onSelect={() => onSelectReward?.(reward.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Animations section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Celebration Effects</h2>
        </div>
        <div className="grid gap-3">
          {animations.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              isUnlocked={isRewardUnlocked(reward)}
              isSelected={false}
              onSelect={() => onSelectReward?.(reward.id)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
