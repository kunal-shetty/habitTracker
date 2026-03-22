"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase-client"

export function LoginButton() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error("Login error:", error)
            setLoading(false)
        }
    }

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-2 py-4 text-sm font-medium text-gray-700 shadow-sm transition-all hover:shadow-md hover:bg-gray-50 disabled:opacity-70"
        >
            {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            ) : (
                <svg className="h-5 w-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.9-6.9C35.6 2.1 30.2 0 24 0 14.6 0 6.6 5.5 2.7 13.5l8 6.2C12.5 13.1 17.7 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.1 24.5c0-1.7-.1-3-.4-4.4H24v8.4h12.5c-.3 2.1-1.6 5.3-4.5 7.4l7 5.4c4.1-3.8 6.1-9.3 6.1-16.8z"/>
                    <path fill="#FBBC05" d="M10.7 28.3c-.5-1.4-.8-2.9-.8-4.3s.3-2.9.8-4.3l-8-6.2C1 17.1 0 20.4 0 24s1 6.9 2.7 9.5l8-6.2z"/>
                    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7-5.4c-2 1.4-4.7 2.4-8.2 2.4-6.3 0-11.5-3.6-13.3-8.8l-8 6.2C6.6 42.5 14.6 48 24 48z"/>
                </svg>
            )}

            {loading ? "Signing you in..." : "Continue with Google"}
        </motion.button>
    )
}