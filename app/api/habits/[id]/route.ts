import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { id: habitId } = await params

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from("habits")
      .update(body)
      .eq("id", habitId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to update habit:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { id: habitId } = await params

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId)
      .eq("user_id", user.id)

    if (error) throw error
    return NextResponse.json({ message: "Habit deleted" })
  } catch (error) {
    console.error("Failed to delete habit:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
