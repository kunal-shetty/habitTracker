"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, Flame, Star, Users, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar: string
  level: number
  streak: number
  xp: number
  isCurrentUser?: boolean
}

// Dummy leaderboard data
const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", rank: 1, name: "Sarah Chen", avatar: "S", level: 42, streak: 156, xp: 28450 },
  { id: "2", rank: 2, name: "Alex Rivera", avatar: "A", level: 38, streak: 89, xp: 24200 },
  { id: "3", rank: 3, name: "Jordan Kim", avatar: "J", level: 35, streak: 72, xp: 21800 },
  { id: "4", rank: 4, name: "Taylor Swift", avatar: "T", level: 32, streak: 65, xp: 19500 },
  { id: "5", rank: 5, name: "Morgan Lee", avatar: "M", level: 30, streak: 58, xp: 17200 },
  { id: "6", rank: 6, name: "Casey Jones", avatar: "C", level: 28, streak: 45, xp: 15800 },
  { id: "7", rank: 7, name: "You", avatar: "Y", level: 12, streak: 14, xp: 4250, isCurrentUser: true },
  { id: "8", rank: 8, name: "Riley Park", avatar: "R", level: 25, streak: 38, xp: 13400 },
  { id: "9", rank: 9, name: "Jamie Wu", avatar: "J", level: 22, streak: 31, xp: 11200 },
  { id: "10", rank: 10, name: "Sam Patel", avatar: "S", level: 20, streak: 28, xp: 9800 },
]

type LeaderboardTab = "global" | "friends" | "weekly"

export function LeaderboardView() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("global")

  const tabs = [
    { id: "global" as const, label: "Global", icon: Trophy },
    { id: "friends" as const, label: "Friends", icon: Users },
    { id: "weekly" as const, label: "Weekly", icon: Flame },
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-amber-500/20 to-amber-500/5"
    if (rank === 2) return "bg-gradient-to-r from-slate-400/20 to-slate-400/5"
    if (rank === 3) return "bg-gradient-to-r from-amber-700/20 to-amber-700/5"
    return ""
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <motion.div
        className="flex items-end justify-center gap-2 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-slate-400/20 text-xl font-bold">
            {DUMMY_LEADERBOARD[1].avatar}
          </div>
          <div className="flex h-20 w-20 flex-col items-center justify-end rounded-t-xl bg-gradient-to-t from-slate-400/30 to-transparent pb-2">
            <Medal className="h-6 w-6 text-slate-400" />
            <span className="text-xs font-bold">2nd</span>
          </div>
          <p className="mt-1 text-xs font-medium">{DUMMY_LEADERBOARD[1].name.split(" ")[0]}</p>
          <p className="text-[10px] text-muted-foreground">{DUMMY_LEADERBOARD[1].xp.toLocaleString()} XP</p>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-2xl font-bold ring-2 ring-amber-500">
              {DUMMY_LEADERBOARD[0].avatar}
            </div>
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Crown className="h-6 w-6 text-amber-500" fill="currentColor" />
            </motion.div>
          </div>
          <div className="flex h-28 w-24 flex-col items-center justify-end rounded-t-xl bg-gradient-to-t from-amber-500/30 to-transparent pb-2">
            <Trophy className="h-8 w-8 text-amber-500" />
            <span className="text-sm font-bold">1st</span>
          </div>
          <p className="mt-1 text-sm font-bold">{DUMMY_LEADERBOARD[0].name.split(" ")[0]}</p>
          <p className="text-xs text-muted-foreground">{DUMMY_LEADERBOARD[0].xp.toLocaleString()} XP</p>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-700/20 text-xl font-bold">
            {DUMMY_LEADERBOARD[2].avatar}
          </div>
          <div className="flex h-16 w-20 flex-col items-center justify-end rounded-t-xl bg-gradient-to-t from-amber-700/30 to-transparent pb-2">
            <Medal className="h-5 w-5 text-amber-700" />
            <span className="text-xs font-bold">3rd</span>
          </div>
          <p className="mt-1 text-xs font-medium">{DUMMY_LEADERBOARD[2].name.split(" ")[0]}</p>
          <p className="text-[10px] text-muted-foreground">{DUMMY_LEADERBOARD[2].xp.toLocaleString()} XP</p>
        </div>
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {DUMMY_LEADERBOARD.slice(3).map((entry, index) => (
          <motion.div
            key={entry.id}
            className={cn(
              "flex items-center gap-3 rounded-xl p-3 transition-colors",
              entry.isCurrentUser ? "bg-primary/10 ring-1 ring-primary/30" : "bg-card hover:bg-muted/50",
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Rank */}
            <div className="flex w-8 items-center justify-center">{getRankIcon(entry.rank)}</div>

            {/* Avatar */}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                entry.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {entry.avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={cn("font-medium", entry.isCurrentUser && "text-primary")}>{entry.name}</p>
                {entry.isCurrentUser && (
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">You</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Lv. {entry.level}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  {entry.streak}
                </span>
              </div>
            </div>

            {/* XP */}
            <div className="text-right">
              <p className="font-bold">{entry.xp.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">XP</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Your Position Card (if not in top 10) */}
      <motion.div
        className="rounded-xl bg-gradient-to-r from-primary/20 to-chart-2/20 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="mb-2 text-sm text-muted-foreground">Your current position</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">#7</span>
            <div>
              <p className="font-medium">Keep going!</p>
              <p className="text-xs text-muted-foreground">2,950 XP to reach #6</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </motion.div>
    </div>
  )
}
