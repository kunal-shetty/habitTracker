"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Sparkles, Trophy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PerfectDayCelebrationProps {
  isOpen: boolean
  onClose: () => void
  completedHabits: number
  bonusXp: number
}

export function PerfectDayCelebration({ isOpen, onClose, completedHabits, bonusXp }: PerfectDayCelebrationProps) {
  const [showStars, setShowStars] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowStars(true)
      const timer = setTimeout(() => setShowStars(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Shooting stars */}
          {showStars && (
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-8 rounded-full bg-gradient-to-r from-amber-300 to-transparent"
                  style={{
                    left: `${-10 + Math.random() * 50}%`,
                    top: `${Math.random() * 50}%`,
                    rotate: "45deg",
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: [0, 300],
                    y: [0, 200],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 2,
                    repeat: 1,
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 p-1 shadow-2xl"
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="rounded-[calc(1.5rem-4px)] bg-background p-8 text-center">
              {/* Crown icon */}
              <motion.div
                className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-400/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                <Crown className="h-16 w-16 text-amber-500" fill="currentColor" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h2 className="text-2xl font-bold text-foreground">Perfect Day!</h2>
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>

                <p className="mb-4 text-muted-foreground">
                  You completed all <span className="font-semibold text-foreground">{completedHabits}</span> habits
                  today!
                </p>

                {/* Bonus XP */}
                <motion.div
                  className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Trophy className="h-6 w-6 text-amber-500" />
                  <span className="text-xl font-bold text-amber-600">+{bonusXp} Bonus XP</span>
                </motion.div>

                {/* Stars earned */}
                <div className="mb-6 flex items-center justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                    >
                      <Star className="h-8 w-8 text-amber-500" fill="currentColor" />
                    </motion.div>
                  ))}
                </div>

                <Button className="w-full" size="lg" onClick={onClose}>
                  Amazing!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
