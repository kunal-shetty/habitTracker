import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { id: questId } = await params

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { progress, completed, claimed } = body

        const { data, error } = await supabase
            .from("user_quests")
            .update({ progress, completed, claimed })
            .eq("user_id", user.id)
            .eq("quest_id", questId)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error("Failed to update quest:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
