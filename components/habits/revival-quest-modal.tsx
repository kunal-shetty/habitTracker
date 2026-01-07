"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, HeartCrack, Sparkles, Shield } from "lucide-react"
import type { Habit } from "@/lib/types"

interface RevivalQuestModalProps {
  isOpen: boolean
  onClose: () => void
  habit: Habit | null
  hasGraceToken: boolean
  onUseGraceToken: () => void
  onStartRevival: () => void
}

export function RevivalQuestModal({
  isOpen,
  onClose,
  habit,
  hasGraceToken,
  onUseGraceToken,
  onStartRevival,
}: RevivalQuestModalProps) {
  if (!habit) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm border-red-200 bg-gradient-to-b from-red-50 to-background dark:border-red-900 dark:from-red-950">
        <DialogTitle className="sr-only">Revive Habit</DialogTitle>
        <div className="flex flex-col items-center gap-6 p-4 text-center">
          {/* Dead habit visualization */}
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
              <HeartCrack className="h-10 w-10 text-gray-400" />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              <Heart className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-foreground">{habit.name} needs help!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This habit has lost all its health from missed days. Choose how to revive it:
            </p>
          </div>

          {/* Revival options */}
          <div className="flex w-full flex-col gap-3">
            {/* Use grace token */}
            {hasGraceToken && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:hover:bg-blue-900"
                onClick={onUseGraceToken}
              >
                <Shield className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">Use Grace Token</p>
                  <p className="text-xs text-muted-foreground">Instant revival to full health</p>
                </div>
              </Button>
            )}

            {/* Revival quest */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:hover:bg-amber-900"
              onClick={onStartRevival}
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
              <div className="text-left">
                <p className="font-medium">Revival Quest</p>
                <p className="text-xs text-muted-foreground">Complete 3 days to fully revive</p>
              </div>
            </Button>

            {/* Let it go (archive) */}
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={onClose}>
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
