"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, BarChart3, Settings, Home, Scroll, User, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/use-habits"
import { useOnboarding } from "@/hooks/use-onboarding"
import { usePremium, FREE_HABIT_LIMIT } from "@/hooks/use-premium"
import { HabitList } from "./habit-list"
import { DashboardHeader } from "./dashboard-header"
import { AddHabitSheet } from "./add-habit-sheet"
import { AchievementToast } from "./achievement-toast"
import { CalendarView } from "./calendar-view"
import { StatsView } from "./stats-view"
import { SettingsView } from "./settings-view"
import { QuestsView } from "./quests-view"
import { ProfileView } from "./profile-view"
import { LeaderboardView } from "./leaderboard-view"
import { EvolutionModal } from "./evolution-modal"
import { ComebackModal } from "./comeback-modal"
import { NotificationNudge } from "./notification-nudge"
import { PremiumUpgradeModal } from "./premium-upgrade-modal"
import { ACHIEVEMENTS } from "@/lib/constants"
import {
  calculateOverallStreak,
  calculatePoints,
  getTodayString,
  getCompletionForHabitOnDate,
  calculateStreak,
} from "@/lib/habit-utils"

type TabType = "home" | "quests" | "calendar" | "stats" | "profile" | "settings"

import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export function HabitDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  const {
    habits,
    completions,
    stats,
    isLoaded,
    toggleCompletion,
    addHabit,
    deleteHabit,
    newAchievement,
    clearNewAchievement,
    xpGained,
    habitEvolution,
    clearHabitEvolution,
    claimQuestReward,
  } = useHabits()
  const { resetOnboarding } = useOnboarding()
  const { isPremium, upgradeToPremium, canAddHabit, habitLimit } = usePremium()

  const activeHabits = habits.filter((h) => !h.archived)
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => (stats.achievements || []).includes(a.id))

  const completedUnclaimedQuests = (stats.currentDailyQuests || []).filter((q) => q.isCompleted).length

  const handleClearData = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [supabase, router])

  const handleResetOnboarding = useCallback(() => {
    resetOnboarding()
    window.location.reload()
  }, [resetOnboarding])

  const handleAddHabitClick = () => {
    if (canAddHabit(activeHabits.length)) {
      setShowAddHabit(true)
    } else {
      setShowPremiumModal(true)
    }
  }

  const handleUpgrade = () => {
    upgradeToPremium()
    setShowPremiumModal(false)
  }

  if (!isLoaded || authLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const tabs = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "quests" as const, icon: Scroll, label: "Quests" },
    { id: "calendar" as const, icon: Calendar, label: "Calendar" },
    { id: "stats" as const, icon: BarChart3, label: "Stats" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ]

  return (
    <div className="flex h-dvh flex-col bg-background safe-top">
      {activeTab === "home" && (
        <DashboardHeader
          stats={stats}
          userName={user?.name}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {activeTab !== "home" && (
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-4">
          <h1 className="text-xl font-bold capitalize text-foreground">
            {showLeaderboard ? "Leaderboard" : activeTab}
          </h1>
          {(activeTab === "stats" || activeTab === "profile") && !showLeaderboard && (
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowLeaderboard(true)}>
              <Trophy className="h-4 w-4" />
              Ranks
            </Button>
          )}
          {showLeaderboard && (
            <Button variant="ghost" size="sm" onClick={() => setShowLeaderboard(false)}>
              Back
            </Button>
          )}
        </header>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <HabitList
                habits={activeHabits}
                completions={completions}
                onToggleCompletion={toggleCompletion}
                onDeleteHabit={deleteHabit}
                onAddHabit={handleAddHabitClick}
                xpGained={xpGained}
              />
            </motion.div>
          )}

          {activeTab === "quests" && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <QuestsView
                dailyQuests={stats.currentDailyQuests || []}
                weeklyChallenge={stats.currentWeeklyChallenge}
                monthlyTheme={stats.currentMonthlyTheme}
                onClaimReward={claimQuestReward}
                questsCompleted={stats.questsCompleted || 0}
                graceTokens={stats.availableGraceTokens || 0}
              />
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <CalendarView habits={activeHabits} completions={completions} onToggleCompletion={toggleCompletion} />
            </motion.div>
          )}

          {activeTab === "stats" && !showLeaderboard && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <StatsView habits={habits} completions={completions} stats={stats} />
            </motion.div>
          )}

          {activeTab === "profile" && !showLeaderboard && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <ProfileView stats={stats} unlockedAchievements={unlockedAchievements} />
              {/* Settings link at bottom of profile */}
              <motion.button
                className="mt-4 flex w-full items-center justify-between rounded-xl bg-card p-4 shadow-sm"
                onClick={() => setActiveTab("settings" as TabType)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Settings</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </motion.button>
            </motion.div>
          )}

          {showLeaderboard && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <LeaderboardView />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <SettingsView
                onResetOnboarding={handleResetOnboarding}
                onClearData={handleClearData}
                stats={stats}
                isPremium={isPremium}
                onUpgrade={() => setShowPremiumModal(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {activeTab === "home" && (
        <motion.div
          className="fixed bottom-24 right-4 z-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" onClick={handleAddHabitClick}>
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add habit</span>
          </Button>
        </motion.div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-lg safe-bottom">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setShowLeaderboard(false)
              }}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <motion.div
                animate={{
                  scale: activeTab === tab.id ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="relative"
              >
                <tab.icon className="h-5 w-5" />
                {tab.id === "quests" && completedUnclaimedQuests > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {completedUnclaimedQuests}
                  </span>
                )}
              </motion.div>
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0 h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      <AddHabitSheet
        isOpen={showAddHabit}
        onClose={() => setShowAddHabit(false)}
        onAdd={addHabit}
        currentHabitCount={activeHabits.length}
        habitLimit={habitLimit}
        isPremium={isPremium}
        onUpgrade={() => {
          setShowAddHabit(false)
          setShowPremiumModal(true)
        }}
      />

      <PremiumUpgradeModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handleUpgrade}
        currentHabits={activeHabits.length}
        habitLimit={FREE_HABIT_LIMIT}
      />

      <AchievementToast achievementId={newAchievement} onClose={clearNewAchievement} />

      {habitEvolution && (
        <EvolutionModal
          isOpen={!!habitEvolution}
          onClose={clearHabitEvolution}
          habitName={habitEvolution.habit.name}
          newStage={habitEvolution.habit.evolutionStage}
          color={habitEvolution.habit.color}
        />
      )}

      {/* {stats.comebackData?.isInComebackMode && (
        <ComebackModal
          isOpen={true}
          onClose={() => {}}
          comebackData={stats.comebackData}
          onClaimReward={() => {}}
        />
      )} */}

      <NotificationNudge
        type="almostDone"
        habitsLeft={activeHabits.length - completions.filter(c => c.date === getTodayString()).length}
        onDismiss={() => { }}
      />
    </div>
  )
}
