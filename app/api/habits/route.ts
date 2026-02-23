import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("habits")
      .select("*, logs:habit_logs(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch habits:", error)
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
    const body = await req.json()
    const { name, description, icon, color, category, difficulty, target_count, frequency, target_days } = body

    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        name,
        description,
        icon,
        color,
        category,
        difficulty,
        target_count,
        frequency,
        target_days,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Failed to create habit:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
