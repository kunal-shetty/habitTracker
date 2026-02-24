import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        const { achievement_id } = await req.json()

        if (!achievement_id) {
            return NextResponse.json({ message: "Achievement ID is required" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("user_achievements")
            .insert({
                user_id: user.id,
                achievement_id: achievement_id,
            })
            .select()
            .single()

        if (error) {
            // Ignore duplicate key errors (already unlocked)
            if (error.code === '23505') {
                return NextResponse.json({ message: "Achievement already unlocked" }, { status: 200 })
            }
            throw error
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error("Failed to grant achievement:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
