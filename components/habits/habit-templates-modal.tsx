"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  HABIT_TEMPLATES,
  getPopularTemplates,
  getTemplatesByCategory,
  searchTemplates,
  type HabitTemplate,
} from "@/lib/habit-templates"
import { CATEGORY_CONFIG } from "@/lib/constants"
import type { HabitCategory } from "@/lib/types"
import * as Icons from "lucide-react"

interface HabitTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: HabitTemplate) => void
}

export function HabitTemplatesModal({ isOpen, onClose, onSelectTemplate }: HabitTemplatesModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | "all">("all")

  const categories: Array<HabitCategory | "all"> = [
    "all",
    "health",
    "fitness",
    "mindfulness",
    "productivity",
    "learning",
    "social",
    "creativity",
  ]

  const getFilteredTemplates = () => {
    if (searchQuery) {
      return searchTemplates(searchQuery)
    }
    if (selectedCategory === "all") {
      return getPopularTemplates(20)
    }
    return getTemplatesByCategory(selectedCategory)
  }

  const templates = getFilteredTemplates()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "hard":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "extreme":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="habit-templates-wrapper">
          <motion.div
            key="templates-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="templates-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-2xl -translate-y-1/2 overflow-hidden rounded-2xl bg-background shadow-2xl border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Habit Templates</h2>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="border-b border-border bg-muted/30 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <ScrollArea className="horizontal-scroll border-b border-border">
              <div className="flex gap-2 p-4">
                {categories.map((category) => {
                  const isActive = selectedCategory === category
                  const config = category === "all" ? null : CATEGORY_CONFIG[category]

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                    >
                      {category === "all" ? (
                        <>
                          <TrendingUp className="h-4 w-4" />
                          Popular
                        </>
                      ) : (
                        <>
                          {config?.icon && React.createElement(Icons[config.icon as keyof typeof Icons] as any, {
                            className: "h-4 w-4",
                          })}
                          {config?.label}
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Templates List */}
            <ScrollArea className="max-h-[400px]">
              <div className="p-4">
                {templates.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Search className="mx-auto mb-3 h-12 w-12 opacity-50" />
                    <p>No templates found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templates.map((template) => {
                      const IconComponent = Icons[template.icon as keyof typeof Icons] as any

                      return (
                        <motion.button
                          key={template.id}
                          onClick={() => onSelectTemplate(template)}
                          className="w-full rounded-xl border border-border bg-card p-4 text-left transition-all hover:scale-[1.02] hover:border-primary/50 hover:shadow-md"
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                              style={{ backgroundColor: template.color + "20", color: template.color }}
                            >
                              {IconComponent && <IconComponent className="h-6 w-6" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{template.name}</h3>
                                <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                                  {template.difficulty}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {template.targetCount}x daily
                                </Badge>
                                {template.reminderTime && (
                                  <Badge variant="outline" className="text-xs">
                                    ⏰ {template.reminderTime}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
