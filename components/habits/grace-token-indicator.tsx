"use client"

import { motion } from "framer-motion"
import { Shield, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GraceTokenIndicatorProps {
  count: number
  onUse?: () => void
  compact?: boolean
}

export function GraceTokenIndicator({ count, onUse, compact = false }: GraceTokenIndicatorProps) {
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-sm">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-600">{count}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Grace Tokens protect your streak</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <motion.div
      className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-900 dark:bg-blue-950"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="relative">
        <Shield className="h-6 w-6 text-blue-500" />
        {count > 0 && (
          <motion.div
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {count}
          </motion.div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Grace Tokens</p>
        <p className="text-xs text-blue-600 dark:text-blue-400">Protect your streak</p>
      </div>
      {onUse && count > 0 && (
        <button onClick={onUse} className="rounded-full bg-blue-500 p-1 text-white transition-colors hover:bg-blue-600">
          <Plus className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}
