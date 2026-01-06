"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, BarChart3, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/use-habits"
import { useOnboarding } from "@/hooks/use-onboarding"
import { HabitList } from "./habit-list"
import { DashboardHeader } from "./dashboard-header"
import { AddHabitSheet } from "./add-habit-sheet"
import { AchievementToast } from "./achievement-toast"
import { CalendarView } from "./calendar-view"
import { StatsView } from "./stats-view"
import { SettingsView } from "./settings-view"
import { saveHabits, saveCompletions, saveStats } from "@/lib/storage"

type TabType = "home" | "calendar" | "stats" | "settings"

export function HabitDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [showAddHabit, setShowAddHabit] = useState(false)
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
  } = useHabits()
  const { resetOnboarding } = useOnboarding()

  const handleClearData = useCallback(() => {
    // Clear all data from localStorage
    saveHabits([])
    saveCompletions([])
    saveStats({
      totalCompletions: 0,
      currentOverallStreak: 0,
      longestOverallStreak: 0,
      totalPoints: 0,
      level: 1,
      achievements: [],
    })
    // Reload the page to reset state
    window.location.reload()
  }, [])

  const handleResetOnboarding = useCallback(() => {
    resetOnboarding()
    window.location.reload()
  }, [resetOnboarding])

  if (!isLoaded) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const tabs = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "calendar" as const, icon: Calendar, label: "Calendar" },
    { id: "stats" as const, icon: BarChart3, label: "Stats" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex h-dvh flex-col bg-background safe-top">
      {/* Header - only show on home tab */}
      {activeTab === "home" && <DashboardHeader stats={stats} />}

      {/* Tab header for other tabs */}
      {activeTab !== "home" && (
        <header className="border-b border-border bg-background px-4 py-4">
          <h1 className="text-xl font-bold capitalize text-foreground">{activeTab}</h1>
        </header>
      )}

      {/* Main content */}
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
                habits={habits.filter((h) => !h.archived)}
                completions={completions}
                onToggleCompletion={toggleCompletion}
                onDeleteHabit={deleteHabit}
                onAddHabit={() => setShowAddHabit(true)}
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
              <CalendarView
                habits={habits.filter((h) => !h.archived)}
                completions={completions}
                onToggleCompletion={toggleCompletion}
              />
            </motion.div>
          )}

          {activeTab === "stats" && (
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

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <SettingsView onResetOnboarding={handleResetOnboarding} onClearData={handleClearData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAB for adding habits - only on home tab */}
      {activeTab === "home" && (
        <motion.div
          className="fixed bottom-24 right-4 z-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setShowAddHabit(true)}>
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add habit</span>
          </Button>
        </motion.div>
      )}

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-lg safe-bottom">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <motion.div
                animate={{
                  scale: activeTab === tab.id ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <tab.icon className="h-5 w-5" />
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

      {/* Add habit sheet */}
      <AddHabitSheet isOpen={showAddHabit} onClose={() => setShowAddHabit(false)} onAdd={addHabit} />

      {/* Achievement notification */}
      <AchievementToast achievementId={newAchievement} onClose={clearNewAchievement} />
    </div>
  )
}
