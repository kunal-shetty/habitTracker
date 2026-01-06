import { type NextRequest, NextResponse } from "next/server"

// Dummy user database (in production, this would be a real database)
const DUMMY_USERS = [
  {
    id: "user_1",
    email: "demo@habittracker.com",
    password: "demo123",
    name: "Demo User",
    createdAt: new Date().toISOString(),
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user (dummy implementation)
    const user = DUMMY_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate dummy token
    const token = `dummy_token_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Return user data (excluding password)
    const { password: _, ...userData } = user
    return NextResponse.json({
      user: userData,
      token,
      message: "Login successful",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
