export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { USER_ID } from "@/lib/utils"

export async function GET() {
  try {
    const [sessions, cardioSessions] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { userId: USER_ID, status: "completed" },
        orderBy: { scheduledDate: "desc" },
        include: {
          workoutTemplate: { select: { name: true, focus: true } },
          setLogs: {
            where: { isCompleted: true },
            include: { exercise: { select: { name: true, primaryMuscleGroup: true } } },
            orderBy: [{ exerciseId: "asc" }, { setNumber: "asc" }],
          },
        },
      }),
      prisma.cardioSession.findMany({
        where: { userId: USER_ID },
        orderBy: { date: "desc" },
      }),
    ])

    const workoutDays = sessions.map(s => {
      // Group set logs by exercise
      const exerciseMap = new Map<string, {
        exerciseName: string
        primaryMuscleGroup: string
        sets: { setNumber: number; actualReps: number; weight: number }[]
      }>()
      s.setLogs.forEach(sl => {
        const key = sl.exerciseId
        if (!exerciseMap.has(key)) {
          exerciseMap.set(key, {
            exerciseName: sl.exercise.name,
            primaryMuscleGroup: sl.exercise.primaryMuscleGroup,
            sets: [],
          })
        }
        exerciseMap.get(key)!.sets.push({
          setNumber: sl.setNumber,
          actualReps: sl.actualReps ?? 0,
          weight: sl.weight ?? 0,
        })
      })

      const exercises = Array.from(exerciseMap.values())
      const totalVolume = s.setLogs.reduce(
        (sum, sl) => sum + (sl.weight ?? 0) * (sl.actualReps ?? 0), 0
      )

      return {
        id: s.id,
        date: s.scheduledDate,
        templateName: s.workoutTemplate?.name ?? "Custom Workout",
        focus: s.workoutTemplate?.focus ?? "",
        durationMinutes: s.durationMinutes,
        totalVolume: Math.round(totalVolume),
        totalSets: s.setLogs.length,
        exercises,
        type: "workout" as const,
      }
    })

    const cardioDays = cardioSessions.map(c => ({
      id: c.id,
      date: c.date,
      activityType: c.activityType,
      durationMinutes: c.durationMinutes,
      distance: c.distance,
      calories: c.calories,
      intensity: c.intensity,
      notes: c.notes,
      type: "cardio" as const,
    }))

    return NextResponse.json({ workouts: workoutDays, cardio: cardioDays })
  } catch (e) {
    return NextResponse.json({ workouts: [], cardio: [] })
  }
}
