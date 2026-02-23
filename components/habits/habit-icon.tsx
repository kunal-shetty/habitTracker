"use client"

import type React from "react"

import {
  Heart,
  Dumbbell,
  Brain,
  Target,
  BookOpen,
  Users,
  Palette,
  Star,
  Coffee,
  Moon,
  Sun,
  Droplet,
  Apple,
  Bike,
  Music,
  Pencil,
  Camera,
  Phone,
  Laptop,
  Briefcase,
  type LucideProps,
} from "lucide-react"

const iconMap: Record<string, React.FC<LucideProps>> = {
  Heart,
  Dumbbell,
  Brain,
  Target,
  BookOpen,
  Users,
  Palette,
  Star,
  Coffee,
  Moon,
  Sun,
  Droplet,
  Apple,
  Bike,
  Music,
  Pencil,
  Camera,
  Phone,
  Laptop,
  Briefcase,
}

interface HabitIconProps extends React.SVGProps<SVGSVGElement> {
  name: string
}

export function HabitIcon({ name, ...props }: HabitIconProps) {
  const Icon = iconMap[name] || Star
  return <Icon {...props} />
}
