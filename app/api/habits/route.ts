import { type NextRequest, NextResponse } from "next/server"

// GET all habits
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In production, fetch from database
    return NextResponse.json({
      habits: [],
      message: "Habits fetched successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new habit
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const habit = await request.json()

    // Validate required fields
    if (!habit.name) {
      return NextResponse.json({ error: "Habit name is required" }, { status: 400 })
    }

    // In production, save to database
    const newHabit = {
      ...habit,
      id: `habit_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      habit: newHabit,
      message: "Habit created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
