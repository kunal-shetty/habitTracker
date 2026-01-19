"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, RefreshCw } from "lucide-react"
import { getDailyQuote, getRandomQuote, type MotivationalQuote } from "@/lib/motivational-quotes"
import { Button } from "@/components/ui/button"

export function DailyQuoteCard() {
  const [quote, setQuote] = useState<MotivationalQuote>(getDailyQuote())
  const [isAnimating, setIsAnimating] = useState(false)

  const handleRefresh = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setQuote(getRandomQuote())
      setIsAnimating(false)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/20"
    >
      <div className="absolute top-0 right-0 opacity-10">
        <Quote className="h-32 w-32 text-primary" />
      </div>

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Daily Inspiration</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-3 text-base font-medium italic text-foreground leading-relaxed">
              "{quote.text}"
            </p>
            <p className="text-sm text-muted-foreground">— {quote.author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
