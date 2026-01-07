"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Zap } from "lucide-react"

interface XpPopupProps {
  amount: number
  isVisible: boolean
}

export function XpPopup({ amount, isVisible }: XpPopupProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none absolute -top-2 right-0 z-50 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow-lg"
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
        >
          <Zap className="h-3 w-3" />+{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  )
}
