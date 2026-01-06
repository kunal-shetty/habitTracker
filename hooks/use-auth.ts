"use client"

import { useState, useEffect, useCallback } from "react"
import type { User, AuthState } from "@/lib/types"
import { getAuthState, saveAuthState, clearAuthState } from "@/lib/storage"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const state = getAuthState()
    setAuthState(state)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      const newState: AuthState = {
        user: data.user,
        isAuthenticated: true,
        token: data.token,
      }
      setAuthState(newState)
      saveAuthState(newState)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Login failed" }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      const newState: AuthState = {
        user: data.user,
        isAuthenticated: true,
        token: data.token,
      }
      setAuthState(newState)
      saveAuthState(newState)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Signup failed" }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // Ignore logout API errors
    }
    clearAuthState()
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    })
  }, [])

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!authState.user) return { success: false, error: "Not authenticated" }

      try {
        const response = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(updates),
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Update failed")
        }

        const newState: AuthState = {
          ...authState,
          user: { ...authState.user, ...data.user },
        }
        setAuthState(newState)
        saveAuthState(newState)
        return { success: true }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Update failed" }
      }
    },
    [authState],
  )

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  }
}
