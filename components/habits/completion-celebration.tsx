"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CompletionCelebrationProps {
  isActive: boolean
  color: string
  intensity?: "low" | "medium" | "high"
}

export function CompletionCelebration({ isActive, color, intensity = "medium" }: CompletionCelebrationProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
      type: "circle" | "star" | "spark"
    }>
  >([])

  const particleCount = intensity === "high" ? 24 : intensity === "medium" ? 16 : 10
  const colors = [color, "#fcd34d", "#10b981", "#f472b6", "#60a5fa"]

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 120,
        y: -Math.random() * 100 - 30,
        size: Math.random() * 8 + 4,
        color: colors[i % colors.length],
        type: (["circle", "star", "spark"] as const)[i % 3],
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => setParticles([]), 1000)
      return () => clearTimeout(timer)
    }
  }, [isActive, color, particleCount])

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="pointer-events-none absolute"
          style={{
            width: particle.size,
            height: particle.size,
            left: "50%",
            top: "50%",
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            scale: 0,
            opacity: 0,
            rotate: particle.type === "star" ? 180 : 0,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          {particle.type === "circle" && (
            <div className="h-full w-full rounded-full" style={{ backgroundColor: particle.color }} />
          )}
          {particle.type === "star" && (
            <svg viewBox="0 0 24 24" fill={particle.color} className="h-full w-full">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {particle.type === "spark" && (
            <div
              className="h-full w-1 rounded-full"
              style={{ backgroundColor: particle.color, transform: `rotate(${Math.random() * 360}deg)` }}
            />
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
