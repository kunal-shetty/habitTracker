"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CompletionCelebrationProps {
  isActive: boolean
  color: string
}

export function CompletionCelebration({ isActive, color }: CompletionCelebrationProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
    }>
  >([])

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 100,
        y: -Math.random() * 80 - 20,
        size: Math.random() * 6 + 4,
        color: i % 2 === 0 ? color : "#fcd34d",
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => setParticles([]), 800)
      return () => clearTimeout(timer)
    }
  }, [isActive, color])

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: "50%",
            top: "50%",
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            scale: 0,
            opacity: 0,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  )
}
