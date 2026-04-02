export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { USER_ID, getThisWeekRange, calculateStreak, parseJsonArray } from '@/lib/utils'
import { startOfDay } from 'date-fns'

export async function GET() {
  const program = await prisma.program.findFirst({
    where: { userId: USER_ID, isActive: true },
    include: {
      workoutTemplates: {
        orderBy: { orderIndex: 'asc' },
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: 'asc' } } },
      },
    },
  })

  const { start, end } = getThisWeekRange()
  const weekSessions = await prisma.workoutSession.findMany({
    where: { userId: USER_ID, status: 'completed', scheduledDate: { gte: start, lte: end } },
  })
  const allSessions = await prisma.workoutSession.findMany({
    where: { userId: USER_ID, status: 'completed' },
    orderBy: { scheduledDate: 'desc' },
  })
  const allCardio = await prisma.cardioSession.findMany({ where: { userId: USER_ID }, select: { date: true } })
  const allDates = [
    ...allSessions.map(s => startOfDay(s.scheduledDate)),
    ...allCardio.map(c => startOfDay(c.date)),
  ]
  const streak = calculateStreak(allDates)
  const avgDuration = allSessions.length
    ? Math.round(allSessions.reduce((s, w) => s + (w.durationMinutes ?? 0), 0) / allSessions.length)
    : 0

  return NextResponse.json({
    program: program ? {
      ...program,
      workoutTemplates: program.workoutTemplates.map(t => ({
        ...t,
        muscleGroups: parseJsonArray(t.muscleGroups),
        exercises: t.exercises.map(e => ({
          id: e.id,
          exerciseName: e.exercise.name,
          primaryMuscleGroup: e.exercise.primaryMuscleGroup,
          prescribedSets: e.prescribedSets,
          repRangeMin: e.repRangeMin,
          repRangeMax: e.repRangeMax,
          rirTarget: e.rirTarget,
        })),
      })),
    } : null,
    stats: {
      totalCompleted: allSessions.length,
      thisWeek: weekSessions.length,
      avgDuration,
      streak,
    },
  })
}
