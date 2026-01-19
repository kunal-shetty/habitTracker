"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface HabitTimerProps {
  habitName: string
  onComplete: (timeSpent: number) => void
  onClose: () => void
}

export function HabitTimer({ habitName, onComplete, onClose }: HabitTimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [presetMinutes, setPresetMinutes] = useState<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleToggle = () => setIsRunning(!isRunning)
  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  const handleComplete = () => {
    const timeSpent = Math.floor(seconds / 60)
    onComplete(timeSpent)
    onClose()
  }

  const presets = [5, 10, 15, 25, 30, 45, 60]

  const handlePresetSelect = (minutes: number) => {
    setPresetMinutes(minutes)
    setSeconds(0)
    setIsRunning(true)
  }

  const progressPercentage = presetMinutes ? (seconds / (presetMinutes * 60)) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{habitName}</h3>
        </div>

        {/* Timer Display */}
        <div className="relative mb-6">
          <div className="flex justify-center">
            <div className="relative">
              {/* Progress Ring */}
              {presetMinutes && (
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                  <circle
                    cx="120"
                    cy="120"
                    r="110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 110}`}
                    strokeDashoffset={`${2 * Math.PI * 110 * (1 - progressPercentage / 100)}`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              <div className="flex h-60 w-60 items-center justify-center rounded-full bg-card">
                <div className="text-center">
                  <div className="text-5xl font-bold tabular-nums">{formatTime(seconds)}</div>
                  {presetMinutes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Target: {presetMinutes} min
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Times */}
        {!isRunning && seconds === 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm text-muted-foreground">Quick start:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((minutes) => (
                <Button
                  key={minutes}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(minutes)}
                  className="text-xs"
                >
                  {minutes} min
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={handleToggle}
            className="flex-1"
            size="lg"
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {seconds > 0 ? "Resume" : "Start"}
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {seconds > 0 && (
          <Button
            onClick={handleComplete}
            variant="secondary"
            className="mt-3 w-full"
          >
            Complete & Save
          </Button>
        )}

        <Button
          onClick={onClose}
          variant="ghost"
          className="mt-2 w-full"
        >
          Close
        </Button>
      </Card>
    </motion.div>
  )
}
