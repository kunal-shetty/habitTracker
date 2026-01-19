"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Moon,
  Sun,
  Smartphone,
  Bell,
  Trash2,
  RefreshCw,
  ChevronRight,
  Shield,
  Info,
  Heart,
  LogOut,
  User,
  Crown,
  Sparkles,
  Download,
  Upload,
  FileJson,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth"
import { downloadExportedData, importData, exportToCSV } from "@/lib/export-import"
import type { UserStats } from "@/lib/types"

interface SettingsViewProps {
  onResetOnboarding: () => void
  onClearData: () => void
  stats?: UserStats
  isPremium?: boolean
  onUpgrade?: () => void
}

export function SettingsView({ onResetOnboarding, onClearData, stats, isPremium, onUpgrade }: SettingsViewProps) {
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const safeLevel = Number.isNaN(stats?.level) ? 1 : stats?.level || 1
  const safeTotalXp = Number.isNaN(stats?.totalXp) ? 0 : stats?.totalXp || 0

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

  const handleLogout = async () => {
    await logout()
  }

  const handleExportJSON = () => {
    downloadExportedData()
  }

  const handleExportCSV = () => {
    exportToCSV()
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const result = importData(content)
      if (result.success) {
        alert("Data imported successfully! The page will reload.")
        window.location.reload()
      } else {
        alert(`Import failed: ${result.error}`)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Account Section */}
      {isAuthenticated && user && (
        <motion.div
          className="overflow-hidden rounded-xl bg-card shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-primary/20 to-chart-2/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{user.name || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              {isPremium && (
                <div className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-600">
                  <Crown className="h-3 w-3" />
                  Pro
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Edit Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Upsell (if not premium) */}
      {!isPremium && (
        <motion.button
          className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 p-4 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={onUpgrade}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Upgrade to Pro</h3>
              <p className="text-xs text-muted-foreground">Unlock unlimited habits, themes, and more</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </motion.button>
      )}

      {/* Appearance */}
      <motion.div
        className="rounded-xl bg-card p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
        transition={{ delay: 0.15 }}
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
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
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
            onClick={handleExportJSON}
            className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Export Data (JSON)</p>
                <p className="text-xs text-muted-foreground">Backup all your habits and progress</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <FileJson className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Export as CSV</p>
                <p className="text-xs text-muted-foreground">Download data for spreadsheets</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="font-medium">Import Data</p>
                <p className="text-xs text-muted-foreground">Restore from backup file</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

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

      {/* Logout */}
      {isAuthenticated && (
        <motion.div
          className="rounded-xl bg-card p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-lg p-3 text-destructive transition-colors hover:bg-destructive/10"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

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
            <span className="text-sm text-muted-foreground">2.0.0</span>
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
        transition={{ delay: 0.35 }}
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
