import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await prisma.workoutSession.findUnique({
    where: { id: params.id },
    include: {
      workoutTemplate: {
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: 'asc' } } },
      },
      setLogs: { orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }] },
    },
  })
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(session)
}
