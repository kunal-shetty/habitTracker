"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UserPlus, UserMinus, Check, X, Loader2, Users, Flame, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"

interface FriendProfile {
    id: string
    full_name?: string
    username?: string
    avatar_url?: string
    description?: string
    level?: number
    streak?: number
}

interface Friendship {
    user_id: string
    friend_id: string
    status: "pending" | "accepted"
    profiles?: any // Joined profile
}

export function FriendsView() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<FriendProfile[]>([])
    const [friends, setFriends] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const fetchFriends = async () => {
        try {
            const res = await fetch("/api/friends")
            if (res.ok) {
                const data = await res.json()
                setFriends(data)
            }
        } catch (error) {
            console.error("Failed to fetch friends:", error)
        }
    }

    useEffect(() => {
        fetchFriends()
    }, [])

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 3) {
                setSearchResults([])
                return
            }
            setIsSearching(true)
            try {
                const res = await fetch(`/api/users/search?q=${searchQuery}`)
                if (res.ok) {
                    const data = await res.json()
                    // Filter out current user
                    setSearchResults(data.filter((u: any) => u.id !== user?.id))
                }
            } catch (error) {
                console.error("Search failed:", error)
            } finally {
                setIsSearching(false)
            }
        }

        const timer = setTimeout(searchUsers, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, user?.id])

    const handleAction = async (friendId: string, action: "request" | "accept" | "delete") => {
        try {
            const method = action === "delete" ? "DELETE" : "POST"
            const res = await fetch("/api/friends", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendId, action })
            })
            if (res.ok) {
                fetchFriends()
                if (action === "request") setSearchQuery("")
            }
        } catch (error) {
            console.error(`Failed to ${action} friend:`, error)
        }
    }

    const pendingRequests = friends.filter(f => f.status === 'pending' && f.friend_id === user?.id)
    const sentRequests = friends.filter(f => f.status === 'pending' && f.user_id === user?.id)
    const acceptedFriends = friends.filter(f => f.status === 'accepted')

    return (
        <div className="space-y-6 pb-20">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search habit builders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl"
                />
                {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
                )}
            </div>

            {/* Search Results */}
            <AnimatePresence>
                {searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-2xl border border-primary/20 bg-primary/5 p-2 space-y-2"
                    >
                        <p className="px-3 py-1 text-[10px] font-bold text-primary uppercase">People you might know</p>
                        {searchResults.map((u) => (
                            <div key={u.id} className="flex items-center justify-between p-2 rounded-xl bg-card">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary capitalize">
                                        {u.avatar_url ? <img src={u.avatar_url} className="h-full w-full object-cover rounded-full" /> : (u.username?.[0] || u.full_name?.[0] || "?")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{u.full_name || u.username}</p>
                                        <p className="text-[10px] text-muted-foreground line-clamp-1">{u.description || "No bio yet"}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleAction(u.id, "request")}>
                                    <UserPlus className="h-4 w-4 text-primary" />
                                </Button>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                        Incoming Requests <Badge variant="secondary" className="bg-primary/20 text-primary border-none">{pendingRequests.length}</Badge>
                    </h3>
                    <div className="space-y-2">
                        {pendingRequests.map((req) => (
                            <div key={req.user_id + req.friend_id} className="flex items-center justify-between p-3 rounded-2xl bg-card border border-primary/10 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                        {req.other_user?.avatar_url ? <img src={req.other_user.avatar_url} className="h-full w-full object-cover rounded-full" /> : (req.other_user?.username?.[0] || req.other_user?.full_name?.[0] || "?")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{req.other_user?.full_name || req.other_user?.username || "Habit Builder"}</p>
                                        <p className="text-[10px] text-muted-foreground">Wants to be your accountability partner</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="h-8 rounded-full px-3 bg-primary text-white" onClick={() => handleAction(req.user_id, "accept")}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Accept
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive rounded-full hover:bg-destructive/10" onClick={() => handleAction(req.user_id, "delete")}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friends List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                        Your Community <span className="text-xs font-normal">({acceptedFriends.length})</span>
                    </h3>
                </div>
                {acceptedFriends.length === 0 ? (
                    <div className="text-center py-12 rounded-3xl border-2 border-dashed border-muted bg-muted/5">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Build your habit group!</p>
                        <p className="text-xs text-muted-foreground italic max-w-[200px] mx-auto">Search people above to connect and compete on the leaderboard.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {acceptedFriends.map((friend) => (
                            <motion.div
                                key={friend.user_id + friend.friend_id}
                                className="flex items-center justify-between p-4 rounded-3xl bg-card shadow-sm border border-border/50 hover:border-primary/20 transition-colors"
                                layout
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-xl shadow-inner relative overflow-hidden">
                                        {friend.other_user?.avatar_url ? (
                                            <img src={friend.other_user.avatar_url} className="h-full w-full object-cover" />
                                        ) : (
                                            friend.other_user?.username?.[0] || friend.other_user?.full_name?.[0] || "F"
                                        )}
                                        <div className="absolute bottom-0 inset-x-0 h-1 bg-primary/20" />
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground">{friend.other_user?.full_name || friend.other_user?.username || "Habit Builder"}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                                                <Flame className="h-2.5 w-2.5" />
                                                {friend.other_user?.streak || 0} Streak
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                                <Star className="h-2.5 w-2.5" />
                                                Lv. {friend.other_user?.level || 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl group" onClick={() => handleAction(friend.user_id === user?.id ? friend.friend_id : friend.user_id, "delete")}>
                                    <UserMinus className="h-4 w-4 group-hover:scale-110 transition-all" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
