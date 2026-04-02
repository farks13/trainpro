export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await prisma.workoutSession.findUnique({
    where: { id: params.id },
    include: { setLogs: true },
  })
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const now = new Date()
  const durationMinutes = session.startedAt
    ? Math.round((now.getTime() - session.startedAt.getTime()) / 60000)
    : 0

  const completedLogs = session.setLogs.filter(s => s.isCompleted)
  const totalSets = completedLogs.length
  const totalReps = completedLogs.reduce((sum, s) => sum + (s.actualReps ?? 0), 0)
  const totalVolume = completedLogs.reduce((sum, s) => sum + (s.weight ?? 0) * (s.actualReps ?? 0), 0)

  await prisma.workoutSession.update({
    where: { id: params.id },
    data: { status: 'completed', completedAt: now, durationMinutes },
  })

  return NextResponse.json({ durationMinutes, totalSets, totalReps, totalVolume })
}
