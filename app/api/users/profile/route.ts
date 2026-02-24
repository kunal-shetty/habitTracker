import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { full_name, username, avatar_url } = body

        const updates: any = {}
        if (full_name !== undefined) updates.full_name = full_name
        if (username !== undefined) updates.username = username
        if (avatar_url !== undefined) updates.avatar_url = avatar_url

        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error("Failed to update profile:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
