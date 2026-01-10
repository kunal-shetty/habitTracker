"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Sword, Lock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Habit, HabitCategory, HabitFrequency, HabitDifficulty } from "@/lib/types"
import { CATEGORY_CONFIG, HABIT_ICONS, HABIT_COLORS, DIFFICULTY_CONFIG } from "@/lib/constants"
import { HabitIcon } from "./habit-icon"

interface AddHabitSheetProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (
    habit: Omit<
      Habit,
      | "id"
      | "createdAt"
      | "archived"
      | "level"
      | "experience"
      | "health"
      | "maxHealth"
      | "power"
      | "evolutionStage"
      | "isMastered"
    >,
  ) => void
  currentHabitCount: number
  habitLimit: number
  isPremium: boolean
  onUpgrade?: () => void
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function AddHabitSheet({
  isOpen,
  onClose,
  onAdd,
  currentHabitCount,
  habitLimit,
  isPremium,
  onUpgrade,
}: AddHabitSheetProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Star")
  const [color, setColor] = useState(HABIT_COLORS[0])
  const [category, setCategory] = useState<HabitCategory>("other")
  const [frequency, setFrequency] = useState<HabitFrequency>("daily")
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [targetCount, setTargetCount] = useState(1)
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState("09:00")
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("medium")

  const canAddMoreHabits = isPremium || currentHabitCount < habitLimit
  const habitsRemaining = habitLimit - currentHabitCount

  const resetForm = () => {
    setStep(1)
    setName("")
    setDescription("")
    setIcon("Star")
    setColor(HABIT_COLORS[0])
    setCategory("other")
    setFrequency("daily")
    setTargetDays([0, 1, 2, 3, 4, 5, 6])
    setTargetCount(1)
    setReminderEnabled(false)
    setReminderTime("09:00")
    setDifficulty("medium")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = () => {
    if (!name.trim() || !canAddMoreHabits) return

    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      category,
      frequency,
      targetDays: frequency !== "daily" ? targetDays : undefined,
      targetCount,
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : undefined,
      difficulty,
    })

    handleClose()
  }

  const toggleDay = (dayIndex: number) => {
    setTargetDays((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0
      case 2:
        return true
      case 3:
        return frequency === "daily" || targetDays.length > 0
      default:
        return true
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-3xl bg-background"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${s === step ? "w-6 bg-primary" : "w-2 bg-muted"}`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
                disabled={!canProceed() || (step === 3 && !canAddMoreHabits)}
              >
                {step === 3 ? "Done" : "Next"}
              </Button>
            </div>

            {!isPremium && (
              <div className="mx-4 mt-3 flex items-center justify-between rounded-lg bg-amber-500/10 px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700 dark:text-amber-400">
                    {habitsRemaining > 0 ? (
                      <>
                        {habitsRemaining} habit{habitsRemaining !== 1 ? "s" : ""} remaining
                      </>
                    ) : (
                      "Habit limit reached"
                    )}
                  </span>
                </div>
                {onUpgrade && (
                  <Button size="sm" variant="ghost" className="h-7 gap-1 text-amber-600" onClick={onUpgrade}>
                    <Crown className="h-3 w-3" />
                    Upgrade
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-foreground">Create a habit</h2>
                      <p className="text-sm text-muted-foreground">What would you like to track?</p>
                    </div>

                    {/* Name input */}
                    <div className="space-y-2">
                      <Label htmlFor="habit-name">Habit name</Label>
                      <Input
                        id="habit-name"
                        placeholder="e.g., Exercise, Read, Meditate"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-lg"
                        autoFocus
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="habit-description">Description (optional)</Label>
                      <Textarea
                        id="habit-description"
                        placeholder="Add more details about your habit..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                      />
                    </div>

                    {/* Category selection */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {(Object.keys(CATEGORY_CONFIG) as HabitCategory[]).map((cat) => {
                          const config = CATEGORY_CONFIG[cat]
                          return (
                            <motion.button
                              key={cat}
                              type="button"
                              className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-colors ${
                                category === cat
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground hover:bg-muted/80"
                              }`}
                              onClick={() => {
                                setCategory(cat)
                                setColor(config.color)
                                setIcon(config.icon)
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <HabitIcon
                                name={config.icon}
                                className="h-5 w-5"
                                style={{ color: category === cat ? undefined : config.color }}
                              />
                              <span className="text-xs">{config.label}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Appearance */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-foreground">Customize appearance</h2>
                      <p className="text-sm text-muted-foreground">Choose an icon and color</p>
                    </div>

                    {/* Preview */}
                    <div className="flex justify-center">
                      <motion.div
                        className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
                        style={{ backgroundColor: color }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3 }}
                        key={`${icon}-${color}`}
                      >
                        <HabitIcon name={icon} className="h-10 w-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Color selection */}
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {HABIT_COLORS.map((c) => (
                          <motion.button
                            key={c}
                            type="button"
                            className={`relative h-10 w-10 rounded-xl ${color === c ? "ring-2 ring-foreground ring-offset-2" : ""}`}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                            whileTap={{ scale: 0.9 }}
                          >
                            {color === c && <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Icon selection */}
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {HABIT_ICONS.map((iconName) => (
                          <motion.button
                            key={iconName}
                            type="button"
                            className={`flex h-12 w-full items-center justify-center rounded-xl transition-colors ${
                              icon === iconName
                                ? "bg-foreground text-background"
                                : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                            onClick={() => setIcon(iconName)}
                            whileTap={{ scale: 0.9 }}
                          >
                            <HabitIcon name={iconName} className="h-5 w-5" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-foreground">Set your schedule</h2>
                      <p className="text-sm text-muted-foreground">When do you want to do this?</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Sword className="h-4 w-4 text-amber-500" />
                        Difficulty (affects XP earned)
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {(Object.keys(DIFFICULTY_CONFIG) as HabitDifficulty[]).map((diff) => {
                          const config = DIFFICULTY_CONFIG[diff]
                          return (
                            <motion.button
                              key={diff}
                              type="button"
                              className={`rounded-xl py-3 text-center transition-colors ${
                                difficulty === diff ? "text-white" : "bg-muted text-foreground"
                              }`}
                              style={{
                                backgroundColor: difficulty === diff ? config.color : undefined,
                              }}
                              onClick={() => setDifficulty(diff)}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="text-sm font-medium">{config.label}</span>
                              <p className="text-[10px] opacity-80">{config.xpMultiplier}x XP</p>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["daily", "weekly", "custom"] as HabitFrequency[]).map((freq) => (
                          <motion.button
                            key={freq}
                            type="button"
                            className={`rounded-xl py-3 text-sm font-medium transition-colors ${
                              frequency === freq ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                            }`}
                            onClick={() => setFrequency(freq)}
                            whileTap={{ scale: 0.95 }}
                          >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Day selection (for weekly/custom) */}
                    {frequency !== "daily" && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Label>Which days?</Label>
                        <div className="flex gap-1">
                          {DAYS.map((day, index) => (
                            <motion.button
                              key={day}
                              type="button"
                              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                                targetDays.includes(index)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                              onClick={() => toggleDay(index)}
                              whileTap={{ scale: 0.9 }}
                            >
                              {day}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Target count */}
                    <div className="space-y-2">
                      <Label>How many times per day?</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                          disabled={targetCount <= 1}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center text-2xl font-bold">{targetCount}</span>
                        <Button variant="outline" size="icon" onClick={() => setTargetCount(targetCount + 1)}>
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Reminder toggle */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Daily reminder</Label>
                        <motion.button
                          type="button"
                          className={`relative h-7 w-12 rounded-full transition-colors ${
                            reminderEnabled ? "bg-primary" : "bg-muted"
                          }`}
                          onClick={() => setReminderEnabled(!reminderEnabled)}
                        >
                          <motion.div
                            className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                            animate={{ left: reminderEnabled ? "calc(100% - 24px)" : "4px" }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </div>

                      {reminderEnabled && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer navigation */}
            <div className="border-t border-border p-4 safe-bottom">
              <div className="flex gap-3">
                {step > 1 && (
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <Button
                  className="flex-1"
                  onClick={step === 3 ? handleSubmit : () => setStep(step + 1)}
                  disabled={!canProceed() || (step === 3 && !canAddMoreHabits)}
                >
                  {step === 3 ? (canAddMoreHabits ? "Create Habit" : "Upgrade to Add More") : "Continue"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
