"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Star, X, Gift, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LevelUpModalProps {
  level: number
  isOpen: boolean
  onClose: () => void
}

const LEVEL_REWARDS: Record<number, { icon: typeof Gift; title: string; description: string }> = {
  5: { icon: Gift, title: "Grace Token", description: "Protect your streak for one missed day!" },
  10: { icon: Zap, title: "Double XP Day", description: "Your next day earns 2x XP!" },
  15: { icon: Crown, title: "Premium Badge", description: "Show off your dedication!" },
  20: { icon: Gift, title: "2 Grace Tokens", description: "Extra streak protection!" },
  25: { icon: Star, title: "Exclusive Theme", description: "Unlock a new app theme!" },
}

export function LevelUpModal({ level, isOpen, onClose }: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const reward = LEVEL_REWARDS[level]

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const confettiTimer = setTimeout(() => setShowConfetti(false), 3000)
      const rewardTimer = setTimeout(() => setShowReward(true), 800)
      return () => {
        clearTimeout(confettiTimer)
        clearTimeout(rewardTimer)
      }
    } else {
      setShowReward(false)
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
          {/* Confetti */}
          {showConfetti && (
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-5%",
                  }}
                  animate={{
                    y: ["0vh", "110vh"],
                    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 2,
                    delay: Math.random() * 0.8,
                    ease: "easeIn",
                  }}
                >
                  {i % 3 === 0 ? (
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{
                        backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][i % 6],
                      }}
                    />
                  ) : i % 3 === 1 ? (
                    <div
                      className="h-2 w-4 rounded-full"
                      style={{
                        backgroundColor: ["#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6"][i % 5],
                      }}
                    />
                  ) : (
                    <Star
                      className="h-4 w-4"
                      fill={["#fbbf24", "#f472b6", "#60a5fa"][i % 3]}
                      color={["#fbbf24", "#f472b6", "#60a5fa"][i % 3]}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-background p-8 text-center shadow-xl"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Animated rays background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-40 w-1 origin-bottom bg-gradient-to-t from-primary/20 to-transparent"
                  style={{
                    rotate: `${i * 30}deg`,
                    translateX: "-50%",
                    translateY: "-100%",
                  }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              ))}
            </div>

            {/* Animated stars */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${5 + (i % 5) * 20}%`,
                    top: `${10 + Math.floor(i / 5) * 60}%`,
                  }}
                  animate={{
                    scale: [0.5, 1.2, 0.5],
                    opacity: [0.3, 0.8, 0.3],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.15,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <Star className="h-4 w-4 text-accent" fill="currentColor" />
                </motion.div>
              ))}
            </div>

            {/* Level badge */}
            <motion.div
              className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, damping: 12 }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-chart-2"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              {/* Inner glow */}
              <motion.div
                className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/50 to-chart-2/50"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              <span className="relative text-5xl font-bold text-primary-foreground drop-shadow-lg">{level}</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-accent" />
                <h2 className="text-3xl font-bold text-foreground">Level Up!</h2>
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <p className="mb-4 text-muted-foreground">
                You&apos;ve reached <span className="font-semibold text-foreground">Level {level}</span>!
              </p>

              {/* Reward section */}
              <AnimatePresence>
                {reward && showReward && (
                  <motion.div
                    className="mb-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <reward.icon className="h-5 w-5 text-amber-500" />
                      <span className="font-semibold text-amber-600">Reward Unlocked!</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{reward.title}</p>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button className="w-full" size="lg" onClick={onClose}>
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
