import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    const supabase = await createClient()

    if (!query || query.length < 3) {
        return NextResponse.json([])
    }

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, username, description")
            .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
            .limit(10)

        if (error) throw error
        return NextResponse.json(data || [])
    } catch (error) {
        console.error("User search error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
