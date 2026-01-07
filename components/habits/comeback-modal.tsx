"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Gift, Sparkles, ArrowRight } from "lucide-react"
import type { ComebackData } from "@/lib/types"

interface ComebackModalProps {
  isOpen: boolean
  onClose: () => void
  comebackData: ComebackData
  onClaimReward: () => void
}

export function ComebackModal({ isOpen, onClose, comebackData, onClaimReward }: ComebackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm overflow-hidden border-0 bg-gradient-to-b from-primary/10 to-background p-0">
        <DialogTitle className="sr-only">Welcome Back</DialogTitle>
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary/30"
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-20, -100],
                x: Math.sin(i) * 50,
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
              style={{ left: `${(i / 15) * 100}%` }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-6 p-8 text-center">
          {/* Heart animation */}
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </motion.div>

          {/* Welcome message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <p className="mt-2 text-muted-foreground">
              We missed you! It&apos;s been {comebackData.missedDays} days since your last visit.
            </p>
          </motion.div>

          {/* Reward preview */}
          {!comebackData.welcomeBackRewardClaimed && (
            <motion.div
              className="w-full rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-amber-700 dark:text-amber-400">Welcome Back Reward</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4">
                <div className="text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-amber-500" />
                  <p className="mt-1 text-sm font-medium">50 XP</p>
                </div>
                {comebackData.missedDays >= 7 && (
                  <div className="text-center">
                    <div className="mx-auto flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-xs font-bold text-white">
                      1
                    </div>
                    <p className="mt-1 text-sm font-medium">Grace Token</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Soft message */}
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            No pressure - let&apos;s take it one step at a time. Your habits are waiting to grow again.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="flex w-full gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {!comebackData.welcomeBackRewardClaimed ? (
              <Button className="flex-1 gap-2" onClick={onClaimReward}>
                <Gift className="h-4 w-4" />
                Claim Reward
              </Button>
            ) : (
              <Button className="flex-1 gap-2" onClick={onClose}>
                Let&apos;s Go
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
