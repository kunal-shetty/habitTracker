"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Crown, Sparkles, Infinity, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PremiumUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
  currentHabits: number
  habitLimit: number
}

const PREMIUM_FEATURES = [
  { icon: Infinity, label: "Unlimited habits", description: "Create as many habits as you want" },
  { icon: Sparkles, label: "Premium themes", description: "Unlock exclusive app themes" },
  { icon: Crown, label: "Priority support", description: "Get help when you need it" },
]

export function PremiumUpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  currentHabits,
  habitLimit,
}: PremiumUpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-background shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 px-6 pb-8 pt-10 text-center text-white">
              <motion.div
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="h-8 w-8" />
              </motion.div>
              <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
              <p className="mt-1 text-white/80">Unlock unlimited potential</p>
            </div>

            {/* Current limit info */}
            <div className="mx-6 -mt-4 rounded-xl bg-card p-4 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current usage</p>
                <p className="text-2xl font-bold text-foreground">
                  {currentHabits} / {habitLimit}
                </p>
                <p className="text-xs text-muted-foreground">habits used</p>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-3 p-6">
              {PREMIUM_FEATURES.map(({ icon: Icon, label, description }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Icon className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="border-t border-border p-6">
              <Button
                className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                size="lg"
                onClick={onUpgrade}
              >
                <Crown className="h-4 w-4" />
                Upgrade Now
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Demo mode: Click to instantly unlock premium
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
