import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { USER_ID, parseJsonArray } from '@/lib/utils'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const exercise = await prisma.exercise.findUnique({ where: { id: params.id } })
  if (!exercise) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const logs = await prisma.workoutSetLog.findMany({
    where: { exerciseId: params.id, isCompleted: true, workoutSession: { userId: USER_ID } },
    include: { workoutSession: true },
    orderBy: { workoutSession: { scheduledDate: 'desc' } },
    take: 50,
  })

  const bySession: Record<string, { date: string; sets: { reps: number; weight: number }[] }> = {}
  logs.forEach(l => {
    const sid = l.workoutSessionId
    if (!bySession[sid]) bySession[sid] = { date: l.workoutSession.scheduledDate.toISOString(), sets: [] }
    bySession[sid].sets.push({ reps: l.actualReps ?? 0, weight: l.weight ?? 0 })
  })

  const history = Object.values(bySession).slice(0, 10)
  const pb = await prisma.exercisePersonalBest.findFirst({
    where: { userId: USER_ID, exerciseId: params.id },
  })

  return NextResponse.json({
    exercise: { ...exercise, secondaryMuscleGroups: parseJsonArray(exercise.secondaryMuscleGroups) },
    history,
    personalBest: pb,
  })
}
