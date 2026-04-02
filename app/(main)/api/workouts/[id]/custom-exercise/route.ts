export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { name, sets, repRangeMin, repRangeMax, rirTarget, instructions, mediaUrl } = await req.json()
  const prescribedSets = parseInt(sets) || 3
  const min = parseInt(repRangeMin) || 8
  const max = parseInt(repRangeMax) || 12
  const rir = parseInt(rirTarget) || 2

  const exercise = await prisma.exercise.upsert({
    where: { name },
    update: {},
    create: { name, primaryMuscleGroup: 'Custom', instructions: instructions ?? '', mediaUrl: mediaUrl ?? '' },
  })

  const newSetLogs = await Promise.all(
    Array.from({ length: prescribedSets }, (_, i) =>
      prisma.workoutSetLog.create({
        data: { workoutSessionId: params.id, exerciseId: exercise.id, setNumber: i + 1, targetRepsMin: min, targetRepsMax: max },
      })
    )
  )

  return NextResponse.json({
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    prescribedSets,
    repRangeMin: min,
    repRangeMax: max,
    rirTarget: rir,
    instructions: exercise.instructions,
    newSetLogs: newSetLogs.map(sl => ({ setNumber: sl.setNumber })),
  })
}
