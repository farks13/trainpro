import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { setLogId, weight, actualReps, isCompleted } = await req.json()
  const log = await prisma.workoutSetLog.update({
    where: { id: setLogId },
    data: {
      weight: weight ?? null,
      actualReps: actualReps ?? null,
      isCompleted: isCompleted ?? false,
      completedAt: isCompleted ? new Date() : null,
    },
  })
  return NextResponse.json(log)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { exerciseId, setNumber, targetRepsMin, targetRepsMax } = await req.json()
  const log = await prisma.workoutSetLog.create({
    data: { workoutSessionId: params.id, exerciseId, setNumber, targetRepsMin: targetRepsMin ?? 8, targetRepsMax: targetRepsMax ?? 12 },
  })
  return NextResponse.json(log, { status: 201 })
}
