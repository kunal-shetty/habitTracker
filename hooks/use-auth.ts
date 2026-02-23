"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/lib/types"
import { createClient } from "@/lib/supabase-client"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const mapSupabaseUser = (sbUser: any): User | null => {
    if (!sbUser) return null
    return {
      id: sbUser.id,
      email: sbUser.email || "",
      name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split("@")[0] || "Habit Hero",
      avatar: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || null,
      createdAt: sbUser.created_at,
    }
  }

  useEffect(() => {
    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(mapSupabaseUser(session?.user))
      setIsLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user))
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [supabase])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    })
    setIsLoading(false)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }, [supabase])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          avatar_url: updates.avatar,
        }
      })
      if (error) return { success: false, error: error.message }
      return { success: true }
    },
    [supabase],
  )

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  }
}
