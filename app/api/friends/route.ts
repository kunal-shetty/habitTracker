import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        // Fetch friendships where user is either side
        // We select both profiles to handle the "other user" logic
        const { data: friendships, error } = await supabase
            .from("friendships")
            .select(`
                user_id,
                friend_id,
                status,
                sender:profiles!friendships_user_id_fkey (id, full_name, avatar_url, description),
                receiver:profiles!friendships_friend_id_fkey (id, full_name, avatar_url, description)
            `)
            .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

        if (error) throw error

        // Format the response to return a list with "other" user details
        const results = await Promise.all((friendships || []).map(async (f: any) => {
            const isSender = f.user_id === user.id
            const otherProfile = isSender ? f.receiver : f.sender

            // Fetch stats for the other user
            const { data: stats } = await supabase
                .from("user_stats")
                .select("level, current_overall_streak")
                .eq("user_id", otherProfile.id)
                .single()

            return {
                ...f,
                other_user: {
                    ...otherProfile,
                    level: stats?.level || 1,
                    streak: stats?.current_overall_streak || 0
                }
            }
        }))

        return NextResponse.json(results)
    } catch (error) {
        console.error("Failed to fetch friends:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        const { friendId, action } = await req.json()

        if (action === "request") {
            const { data, error } = await supabase
                .from("friendships")
                .insert({ user_id: user.id, friend_id: friendId, status: 'pending' })
                .select()
                .single()
            if (error) throw error
            return NextResponse.json(data)
        }

        if (action === "accept") {
            const { data, error } = await supabase
                .from("friendships")
                .update({ status: 'accepted' })
                .match({ user_id: friendId, friend_id: user.id }) // Accept request SENT TO you
                .select()
                .single()
            if (error) throw error
            return NextResponse.json(data)
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    } catch (error) {
        console.error("Failed to manage friendship:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        const { friendId } = await req.json()
        const { error } = await supabase
            .from("friendships")
            .delete()
            .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to remove friend:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
