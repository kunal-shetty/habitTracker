import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const [statsRes, achievementsRes, questsRes] = await Promise.all([
      supabase.from("user_stats").select("*").eq("user_id", user.id).single(),
      supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
      supabase.from("user_quests").select("*, quests(*)").eq("user_id", user.id).gt("expires_at", new Date().toISOString())
    ])

    if (statsRes.error && statsRes.error.code !== "PGRST116") throw statsRes.error

    let stats = statsRes.data
    if (!stats) {
      const { data: newData, error: insertError } = await supabase
        .from("user_stats")
        .insert({ user_id: user.id })
        .select()
        .single()
      if (insertError) throw insertError
      stats = newData
    }

    let userQuests = questsRes.data || []

    // AUTO-ASSIGN QUESTS: If no daily quests, assign 3 random ones
    const dailyQuests = userQuests.filter(uq => uq.quests?.type === 'daily')
    if (dailyQuests.length === 0) {
      const { data: templates } = await supabase
        .from("quests")
        .select("*")
        .eq("type", "daily")
        .limit(10)

      if (templates && templates.length > 0) {
        const selected = templates.sort(() => 0.5 - Math.random()).slice(0, 3)
        const expiresAt = new Date()
        expiresAt.setHours(23, 59, 59, 999)

        const assignments = selected.map(q => ({
          user_id: user.id,
          quest_id: q.id,
          expires_at: expiresAt.toISOString(),
          progress: 0,
          completed: false
        }))

        const { data: newAssignments, error: assignError } = await supabase
          .from("user_quests")
          .insert(assignments)
          .select("*, quests(*)")

        if (!assignError && newAssignments) {
          userQuests = [...userQuests, ...newAssignments]
        }
      }
    }

    const achievements = (achievementsRes.data || []).map(a => a.achievement_id)
    const quests = userQuests.map(uq => ({
      id: uq.quest_id,
      title: uq.quests?.title || "Unknown Quest",
      description: uq.quests?.description || "",
      type: uq.quests?.type || "daily",
      difficulty: uq.quests?.difficulty || "medium",
      requirement: {
        type: uq.quests?.requirement_type,
        count: uq.quests?.requirement_count,
      },
      xpReward: uq.quests?.xp_reward || 0,
      graceTokenReward: uq.quests?.grace_token_reward || 0,
      progress: uq.progress || 0,
      isCompleted: uq.completed || false,
      isClaimed: uq.claimed || false,
      expiresAt: uq.expires_at,
      createdAt: uq.created_at || new Date().toISOString(),
    }))

    return NextResponse.json({
      ...stats,
      achievements,
      currentDailyQuests: quests.filter(q => q.type === "daily"),
      currentWeeklyChallenge: quests.find(q => q.type === "weekly"),
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { data, error } = await supabase
      .from("user_stats")
      .update(body)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to update stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
