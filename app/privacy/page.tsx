"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-6 sm:p-12 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <Shield className="h-6 w-6" />
                        <h2 className="text-xl font-semibold">Your Data, Your Control</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        At Habit Tracker, we believe privacy is a fundamental right. We design our systems to minimize
                        data collection and maximize your control over your habit-building journey.
                    </p>
                </section>

                <section className="grid gap-6 sm:grid-cols-2">
                    <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                        <Lock className="h-8 w-8 text-amber-500" />
                        <h3 className="font-bold">Encryption</h3>
                        <p className="text-sm text-muted-foreground">
                            All your habit logs and personal stats are stored securely. We use industry-standard encryption
                            to ensure your progress remains private.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                        <Eye className="h-8 w-8 text-blue-500" />
                        <h3 className="font-bold">Transparency</h3>
                        <p className="text-sm text-muted-foreground">
                            We never sell your data. Your habit patterns and social interactions are only used to
                            provide the gamified experience and community features.
                        </p>
                    </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-border">
                    <h2 className="text-xl font-bold">Data We Collect</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                        <li>Account Information (Email, Username, Avatar)</li>
                        <li>Habit Names, Descriptions, and Completion History</li>
                        <li>Gamification Stats (XP, Level, Streak, Quests)</li>
                        <li>Social Connections (Friendships and Shared Leaderboards)</li>
                    </ul>
                </section>

                <section className="space-y-4 pt-4 border-t border-border pb-12">
                    <h2 className="text-xl font-bold">Your Rights</h2>
                    <p className="text-sm text-muted-foreground">
                        You can export or delete your data at any time through the Settings panel. If you have
                        any questions about your privacy, please contact our support team.
                    </p>
                    <p className="text-[10px] text-muted-foreground italic">
                        Last Updated: February 23, 2026
                    </p>
                </section>
            </motion.div>
        </div>
    )
}
