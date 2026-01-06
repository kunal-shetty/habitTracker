"use client"

import { motion } from "framer-motion"
import { Check, Flame, Trophy } from "lucide-react"

export function OnboardingWelcome() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      {/* Animated icons */}
      <div className="relative mb-8 h-40 w-40">
        <motion.div
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-primary shadow-lg"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          <Check className="h-10 w-10 text-primary-foreground" />
        </motion.div>

        <motion.div
          className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-xl bg-accent shadow-md"
          initial={{ scale: 0, x: 50, y: 50 }}
          animate={{ scale: 1, x: 0, y: 0 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <Flame className="h-7 w-7 text-accent-foreground" />
        </motion.div>

        <motion.div
          className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center rounded-xl bg-chart-3 shadow-md"
          initial={{ scale: 0, x: -50, y: -50 }}
          animate={{ scale: 1, x: 0, y: 0 }}
          transition={{ type: "spring", delay: 0.5 }}
        >
          <Trophy className="h-7 w-7 text-primary-foreground" />
        </motion.div>
      </div>

      <motion.h1
        className="mb-4 text-3xl font-bold tracking-tight text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Welcome to Habitual
      </motion.h1>

      <motion.p
        className="max-w-xs text-lg text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Your personal companion for building life-changing habits, one day at a time.
      </motion.p>
    </div>
  )
}
