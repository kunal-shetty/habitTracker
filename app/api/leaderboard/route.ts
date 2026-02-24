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
        if (tab === "weekly") {
            const startOfWeek = new Date()
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
            startOfWeek.setHours(0, 0, 0, 0)

            // Aggregate habit_logs for the week
            const { data: weeklyData, error: weeklyError } = await supabase
                .rpc('get_weekly_leaderboard', { week_start: startOfWeek.toISOString() })

            if (weeklyError) throw weeklyError
            return NextResponse.json(weeklyData || [])
        }

        // Global Leaderboard
        let query = supabase
            .from("profiles")
            .select(`
        id,
        full_name,
        avatar_url,
        username,
        user_stats (
          level,
          total_xp,
          current_overall_streak
        )
      `)

        const { data, error } = await query

        if (error) throw error

        const leaderboard = (data || []).map((entry: any) => {
            const stats = Array.isArray(entry.user_stats) ? entry.user_stats[0] : entry.user_stats
            const name = (entry.full_name || entry.username || "Habit Hero").trim()
            const avatar = entry.avatar_url && entry.avatar_url !== "" ? entry.avatar_url : name[0].toUpperCase()

            return {
                id: entry.id,
                name,
                avatar,
                level: stats?.level || 1,
                streak: stats?.current_overall_streak || 0,
                xp: stats?.total_xp || 0,
            }
        })
            .sort((a, b) => b.xp - a.xp)
            .map((entry, index) => ({ ...entry, rank: index + 1 }))

        return NextResponse.json(leaderboard)

        return NextResponse.json(leaderboard)
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
