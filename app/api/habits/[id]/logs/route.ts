import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { id: habitId } = await params

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { xp_earned, streak_multiplier, bonus_xp, note, photo_url, date } = body

        const { data, error } = await supabase
            .from("habit_logs")
            .insert({
                habit_id: habitId,
                user_id: user.id,
                completed_at: new Date(date || undefined).toISOString(),
                xp_earned: xp_earned || 0,
                streak_multiplier: streak_multiplier || 1.0,
                bonus_xp: bonus_xp || 0,
                note,
                photo_url,
            })
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error("Failed to create habit log:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
