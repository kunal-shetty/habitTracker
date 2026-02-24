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
  Smile,
  Zap,
  Shield,
  Trophy,
  Medal,
  Crown,
  Gem,
  Gift,
  ShoppingBag,
  Plane,
  Car,
  Home,
  Watch,
  Map,
  Search,
  Settings,
  Lock,
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
  Smile,
  Zap,
  Shield,
  Trophy,
  Medal,
  Crown,
  Gem,
  Gift,
  ShoppingBag,
  Plane,
  Car,
  Home,
  Watch,
  Map,
  Search,
  Settings,
  Lock,
}

interface HabitIconProps extends React.SVGProps<SVGSVGElement> {
  name: string
}

export function HabitIcon({ name, ...props }: HabitIconProps) {
  const Icon = iconMap[name] || Star
  return <Icon {...props} />
}
