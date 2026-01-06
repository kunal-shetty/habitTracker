"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, Smartphone, Bell, Trash2, RefreshCw, ChevronRight, Shield, Info, Heart } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface SettingsViewProps {
  onResetOnboarding: () => void
  onClearData: () => void
}

export function SettingsView({ onResetOnboarding, onClearData }: SettingsViewProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Smartphone },
  ]

  const handleClearData = () => {
    onClearData()
    setShowClearConfirm(false)
  }

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="mb-4 font-semibold">Appearance</h3>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((option) => {
            const isActive = mounted && theme === option.id
            return (
              <motion.button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <option.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{option.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="mb-4 font-semibold">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Daily Reminders</p>
                <p className="text-xs text-muted-foreground">Get notified about your habits</p>
              </div>
            </div>
            <Switch />
          </div>
        </div>
      </motion.div>

      {/* Data */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="mb-4 font-semibold">Data</h3>
        <div className="space-y-2">
          <button
            onClick={onResetOnboarding}
            className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <span>Replay Onboarding</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex w-full items-center justify-between rounded-lg p-3 text-destructive transition-colors hover:bg-destructive/10"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5" />
              <span>Clear All Data</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="mb-4 font-semibold">About</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-muted-foreground" />
              <span>Version</span>
            </div>
            <span className="text-sm text-muted-foreground">1.0.0</span>
          </div>

          <div className="flex items-center justify-between rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span>Privacy</span>
            </div>
            <span className="text-xs text-muted-foreground">Data stored locally</span>
          </div>
        </div>
      </motion.div>

      {/* Made with love */}
      <motion.div
        className="flex items-center justify-center gap-1 py-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Made with <Heart className="h-4 w-4 text-chart-3" fill="currentColor" /> using v0
      </motion.div>

      {/* Clear data confirmation */}
      {showClearConfirm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl bg-background p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="mb-2 text-lg font-bold">Clear all data?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              This will permanently delete all your habits, completions, and progress. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleClearData}>
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
