export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateStreak, USER_ID } from "@/lib/utils"
import { startOfDay } from "date-fns"

export async function GET() {
  try {
    const [sessions, personalBests, cardioSessions] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { userId: USER_ID },
        orderBy: { scheduledDate: "desc" },
        include: {
          workoutTemplate: { select: { name: true } },
          setLogs: { select: { isCompleted: true, weight: true, actualReps: true } },
        },
      }),
      prisma.exercisePersonalBest.findMany({
        where: { userId: USER_ID },
        include: { exercise: { select: { name: true, primaryMuscleGroup: true } } },
        orderBy: { volume: "desc" },
        take: 20,
      }),
      prisma.cardioSession.findMany({
        where: { userId: USER_ID },
        orderBy: { date: "desc" },
      }),
    ])

    const completedSessions = sessions.filter(s => s.status === "completed")
    const totalVolume = sessions.flatMap(s => s.setLogs)
      .filter(sl => sl.isCompleted)
      .reduce((sum, sl) => sum + (sl.weight ?? 0) * (sl.actualReps ?? 0), 0)
    const avgDuration = completedSessions.length
      ? Math.round(completedSessions.reduce((s, w) => s + (w.durationMinutes ?? 0), 0) / completedSessions.length)
      : 0

    const allDates = [
      ...completedSessions.map(s => startOfDay(new Date(s.scheduledDate))),
      ...cardioSessions.map(c => startOfDay(new Date(c.date))),
    ]
    const streak = calculateStreak(allDates)

    const totalCardioCalories = cardioSessions.reduce((sum, c) => sum + (c.calories ?? 0), 0)

    return NextResponse.json({
      sessions: sessions.map(s => ({
        id: s.id,
        scheduledDate: s.scheduledDate,
        status: s.status,
        durationMinutes: s.durationMinutes,
        workoutTemplate: s.workoutTemplate,
        setLogs: s.setLogs,
      })),
      cardioSessions: cardioSessions.map(c => ({
        id: c.id,
        date: c.date,
        activityType: c.activityType,
        durationMinutes: c.durationMinutes,
        distance: c.distance,
        calories: c.calories,
        intensity: c.intensity,
      })),
      personalBests,
      streak,
      totalVolume: Math.round(totalVolume),
      avgDuration,
      totalCardioCalories,
    })
  } catch (e) {
    return NextResponse.json({ sessions: [], cardioSessions: [], personalBests: [], streak: 0, totalVolume: 0, avgDuration: 0, totalCardioCalories: 0 })
  }
}
