"use client"

import { motion } from "framer-motion"
import { Plus, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onAddHabit: () => void
}

export function EmptyState({ onAddHabit }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Animated illustration */}
      <div className="relative mb-6 h-32 w-32">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Target className="h-10 w-10 text-primary" />
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
          </motion.div>
        ))}
      </div>

      <motion.h3
        className="mb-2 text-lg font-semibold text-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Start Your Journey
      </motion.h3>

      <motion.p
        className="mb-6 max-w-xs text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Create your first habit and begin building a better routine, one day at a time.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Button onClick={onAddHabit} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create your first habit
        </Button>
      </motion.div>
    </motion.div>
  )
}
