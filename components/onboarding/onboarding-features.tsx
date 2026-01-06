"use client"

import { motion } from "framer-motion"
import { BarChart3, Bell, Calendar, Flame } from "lucide-react"

const features = [
  {
    icon: Flame,
    title: "Build Streaks",
    description: "Stay motivated with visual streak counters",
    color: "bg-accent",
    iconColor: "text-accent-foreground",
  },
  {
    icon: Calendar,
    title: "Track Progress",
    description: "See your journey on a beautiful calendar",
    color: "bg-primary",
    iconColor: "text-primary-foreground",
  },
  {
    icon: BarChart3,
    title: "View Statistics",
    description: "Detailed insights into your habits",
    color: "bg-chart-3",
    iconColor: "text-primary-foreground",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a habit with gentle nudges",
    color: "bg-chart-4",
    iconColor: "text-primary-foreground",
  },
]

export function OnboardingFeatures() {
  return (
    <div className="flex h-full flex-col justify-center">
      <motion.h2
        className="mb-2 text-center text-2xl font-bold text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Powerful Features
      </motion.h2>

      <motion.p
        className="mb-8 text-center text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Everything you need to succeed
      </motion.p>

      <div className="grid gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
              <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
