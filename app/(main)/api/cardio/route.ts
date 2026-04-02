export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const DEFAULT_USER_ID = "user_steve"

export async function GET() {
  try {
    const sessions = await prisma.cardioSession.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: "desc" },
      take: 50,
    })
    return NextResponse.json(sessions)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const session = await prisma.cardioSession.create({
      data: {
        userId: DEFAULT_USER_ID,
        activityType: body.activityType,
        durationMinutes: body.durationMinutes,
        distance: body.distance ?? null,
        calories: body.calories ?? null,
        intensity: body.intensity ?? "moderate",
        notes: body.notes ?? "",
      },
    })
    return NextResponse.json(session, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
