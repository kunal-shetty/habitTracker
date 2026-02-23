import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const tab = searchParams.get("tab") || "global"
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        let query = supabase
            .from("profiles")
            .select(`
        id,
        full_name,
        avatar_url,
        username,
        user_stats!inner (
          level,
          total_xp,
          current_overall_streak
        )
      `)
            .order("total_xp", { referencedTable: "user_stats", ascending: false })
        // Removed limit to show all users as requested

        if (tab === "friends") {
            // Fetch friend IDs
            const { data: friendsData } = await supabase
                .from("friendships")
                .select("friend_id")
                .eq("user_id", user.id)
                .eq("status", "accepted")

            const friendIds = [user.id, ...(friendsData?.map(f => f.friend_id) || [])]
            query = query.in("user_id", friendIds)
        }

        const { data, error } = await query

        if (error) throw error

        const leaderboard = (data || []).map((entry: any, index: number) => {
            const stats = Array.isArray(entry.user_stats) ? entry.user_stats[0] : entry.user_stats
            const name = (entry.full_name || entry.username || "Habit Hero").trim()
            const avatar = entry.avatar_url && entry.avatar_url !== "" ? entry.avatar_url : name[0].toUpperCase()

            return {
                id: entry.id,
                rank: index + 1,
                name,
                avatar,
                level: stats?.level || 1,
                streak: stats?.current_overall_streak || 0,
                xp: stats?.total_xp || 0,
            }
        })

        return NextResponse.json(leaderboard)
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
