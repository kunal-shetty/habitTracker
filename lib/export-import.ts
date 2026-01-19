import type { Habit, HabitCompletion, UserStats } from "./types"
import { getHabits, getCompletions, getStats, saveHabits, saveCompletions, saveStats } from "./storage"

export interface ExportData {
  version: string
  exportDate: string
  habits: Habit[]
  completions: HabitCompletion[]
  stats: UserStats
}

export function exportData(): ExportData {
  return {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    habits: getHabits(),
    completions: getCompletions(),
    stats: getStats(),
  }
}

export function downloadExportedData(): void {
  const data = exportData()
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `habitual-backup-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importData(jsonData: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonData) as ExportData

    // Validate structure
    if (!data.habits || !data.completions || !data.stats) {
      return { success: false, error: "Invalid backup file format" }
    }

    // Import data
    saveHabits(data.habits)
    saveCompletions(data.completions)
    saveStats(data.stats)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to parse backup file" }
  }
}

export function exportToCSV(): void {
  const habits = getHabits()
  const completions = getCompletions()

  // Create CSV header
  let csv = "Date,Habit Name,Category,Completed,Count,XP Earned,Streak Multiplier,Notes\n"

  // Add data rows
  completions.forEach((completion) => {
    const habit = habits.find((h) => h.id === completion.habitId)
    if (habit) {
      csv += `${completion.date},"${habit.name}",${habit.category},Yes,${completion.count},${completion.xpEarned || 0},${completion.streakMultiplier || 1},"${completion.note || ""}"\n`
    }
  })

  // Download
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `habitual-data-${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
