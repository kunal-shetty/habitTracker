"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Sprout, Leaf, Flower, TreesIcon } from "lucide-react"
import type { EvolutionStage } from "@/lib/types"
import { EVOLUTION_CONFIG } from "@/lib/constants"

interface EvolutionModalProps {
  isOpen: boolean
  onClose: () => void
  habitName: string
  newStage: EvolutionStage
  color: string
}

const stageIcons = {
  seed: Sprout,
  sprout: Leaf,
  bloom: Flower,
  flourish: TreesIcon,
  transcend: Sparkles,
}

export function EvolutionModal({ isOpen, onClose, habitName, newStage, color }: EvolutionModalProps) {
  const config = EVOLUTION_CONFIG[newStage]
  const Icon = stageIcons[newStage]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm overflow-hidden border-0 bg-gradient-to-b from-background to-muted p-0">
        <DialogTitle className="sr-only">Habit Evolution</DialogTitle>
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
              initial={{
                x: "50%",
                y: "50%",
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-6 p-8 text-center">
          {/* Evolution icon with glow */}
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: color }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}30` }}
            >
              <Icon className="h-12 w-12" style={{ color }} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-sm text-muted-foreground">Evolution Complete!</p>
            <h2 className="mt-2 text-2xl font-bold">{habitName}</h2>
            <p className="mt-1 text-lg font-semibold" style={{ color }}>
              {config.label} Stage
            </p>
          </motion.div>

          {/* Message */}
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Your habit has grown stronger! Keep nurturing it to unlock even more power.
          </motion.p>

          {/* Continue button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Button onClick={onClose} size="lg" style={{ backgroundColor: color }}>
              Continue
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
