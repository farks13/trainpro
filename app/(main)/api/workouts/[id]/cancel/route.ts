export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.workoutSetLog.deleteMany({ where: { workoutSessionId: params.id } })
  await prisma.workoutSession.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
