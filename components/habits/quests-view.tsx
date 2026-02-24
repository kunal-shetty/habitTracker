"use client"

import { motion } from "framer-motion"
import { Scroll, Trophy, Calendar, Star, Shield, Zap, Crown } from "lucide-react"
import type { Quest } from "@/lib/types"
import { QuestCard } from "./quest-card"
import { GraceTokenIndicator } from "./grace-token-indicator"
import { EmptyState } from "./empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface QuestsViewProps {
  dailyQuests: Quest[]
  weeklyChallenge?: Quest
  monthlyTheme?: Quest
  onClaimReward: (questId: string) => void
  questsCompleted: number
  graceTokens: number
}

export function QuestsView({
  dailyQuests,
  weeklyChallenge,
  monthlyTheme,
  onClaimReward,
  questsCompleted,
  graceTokens,
}: QuestsViewProps) {
  return (
    <div className="space-y-6">
      {/* Quest stats header */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{questsCompleted}</p>
            <p className="text-xs text-muted-foreground">Quests Done</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <Shield className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{graceTokens}</p>
            <p className="text-xs text-muted-foreground">Grace Tokens</p>
          </div>
        </motion.div>
      </div>

      {/* Daily Quests */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="mb-3 flex items-center gap-2">
          <Scroll className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Daily Quests</h2>
        </div>
        <div className="space-y-3">
          {dailyQuests.length > 0 ? (
            dailyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onClaim={() => onClaimReward(quest.id)} />
            ))
          ) : (
            <EmptyState
              title="Quest Board Empty"
              description="New daily quests will appear here to help you earn extra XP and rewards!"
              icon={Scroll}
              onAction={() => window.location.hash = "#home"}
              actionLabel="Go to Habits"
            />
          )}
        </div>
      </motion.div>

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Weekly Challenge</h2>
          </div>
          <QuestCard quest={weeklyChallenge} onClaim={() => onClaimReward(weeklyChallenge.id)} />
        </motion.div>
      )}

      {/* Monthly Theme */}
      {monthlyTheme && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold">Monthly Theme</h2>
          </div>
          <QuestCard quest={monthlyTheme} onClaim={() => onClaimReward(monthlyTheme.id)} />
        </motion.div>
      )}

      {/* Monthly Leaderboard Rewards Notice */}
      <motion.div
        className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Crown className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="font-bold text-amber-800 dark:text-amber-400">Monthly Series Reward</h3>
        </div>
        <p className="text-sm text-balance text-muted-foreground">
          Finish in the <span className="font-bold text-foreground">Top 3</span> of the Monthly Global Leaderboard to unlock the exclusive <span className="font-bold text-primary">"Legendary Hero"</span> theme and earn <span className="font-bold text-amber-600">500 Bonus XP</span>!
        </p>
        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-700 bg-amber-500/10 uppercase font-bold tracking-tight">Ends in 6 days</Badge>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-700 hover:text-amber-800 font-bold" onClick={() => window.location.hash = "#stats"}>View Standings</Button>
        </div>
      </motion.div>

      {/* Grace Token info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GraceTokenIndicator count={graceTokens} />
        <p className="mt-2 text-xs text-muted-foreground">
          Grace Tokens protect your streak when you miss a day. Earn them by completing quests and leveling up.
        </p>
      </motion.div>

      {/* Motivational section */}
      <motion.div
        className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Zap className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-2 font-medium text-foreground">Keep the momentum going!</p>
        <p className="text-sm text-muted-foreground">Complete quests to earn XP bonuses and unlock rewards.</p>
      </motion.div>
    </div>
  )
}
