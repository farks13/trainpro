export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { USER_ID, parseJsonArray } from '@/lib/utils'
import { startOfDay, endOfDay } from 'date-fns'

function formatTemplate(t: any) {
  return {
    id: t.id, name: t.name, focus: t.focus,
    muscleGroups: parseJsonArray(t.muscleGroups),
    exercises: (t.exercises ?? []).map((e: any) => ({
      id: e.id, exerciseId: e.exerciseId,
      exerciseName: e.exercise?.name ?? '',
      primaryMuscleGroup: e.exercise?.primaryMuscleGroup ?? '',
      instructions: e.exercise?.instructions ?? '',
      prescribedSets: e.prescribedSets, repRangeMin: e.repRangeMin,
      repRangeMax: e.repRangeMax, rirTarget: e.rirTarget, notes: e.notes,
    })),
  }
}

function formatSession(s: any) {
  return {
    id: s.id, status: s.status,
    startedAt: s.startedAt?.toISOString() ?? null,
    completedAt: s.completedAt?.toISOString() ?? null,
    durationMinutes: s.durationMinutes,
    template: s.workoutTemplate ? formatTemplate(s.workoutTemplate) : null,
    setLogs: (s.setLogs ?? []).map((sl: any) => ({
      id: sl.id, exerciseId: sl.exerciseId, setNumber: sl.setNumber,
      targetRepsMin: sl.targetRepsMin, targetRepsMax: sl.targetRepsMax,
      actualReps: sl.actualReps, weight: sl.weight, isCompleted: sl.isCompleted,
    })),
  }
}

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

  const allTemplates = (program?.workoutTemplates ?? []).map(formatTemplate)

  // Check for an active session today
  const today = new Date()
  const session = await prisma.workoutSession.findFirst({
    where: {
      userId: USER_ID,
      scheduledDate: { gte: startOfDay(today), lte: endOfDay(today) },
      status: { in: ['in_progress', 'completed'] },
    },
    orderBy: { scheduledDate: 'desc' },
    include: {
      workoutTemplate: {
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: 'asc' } } },
      },
      setLogs: { orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }] },
    },
  })

  // Suggest next template (cycle based on last completed session)
  let suggestedTemplateId: string | null = allTemplates[0]?.id ?? null
  if (allTemplates.length > 1) {
    const lastSession = await prisma.workoutSession.findFirst({
      where: { userId: USER_ID, status: 'completed', workoutTemplateId: { not: null } },
      orderBy: { completedAt: 'desc' },
    })
    if (lastSession?.workoutTemplateId) {
      const idx = allTemplates.findIndex(t => t.id === lastSession.workoutTemplateId)
      suggestedTemplateId = allTemplates[(idx + 1) % allTemplates.length]?.id ?? suggestedTemplateId
    }
  }

  return NextResponse.json({
    allTemplates,
    suggestedTemplateId,
    session: session ? formatSession(session) : null,
  })
}

export async function POST(req: NextRequest) {
  const { workoutTemplateId } = await req.json()
  if (!workoutTemplateId) return NextResponse.json({ error: 'workoutTemplateId required' }, { status: 400 })

  const template = await prisma.workoutTemplate.findUnique({
    where: { id: workoutTemplateId },
    include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: 'asc' } } },
  })
  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

  const session = await prisma.workoutSession.create({
    data: {
      userId: USER_ID,
      workoutTemplateId,
      status: 'in_progress',
      startedAt: new Date(),
      setLogs: {
        create: template.exercises.flatMap(ex =>
          Array.from({ length: ex.prescribedSets }, (_, i) => ({
            exerciseId: ex.exerciseId,
            setNumber: i + 1,
            targetRepsMin: ex.repRangeMin,
            targetRepsMax: ex.repRangeMax,
          }))
        ),
      },
    },
    include: {
      workoutTemplate: {
        include: { exercises: { include: { exercise: true }, orderBy: { orderIndex: 'asc' } } },
      },
      setLogs: { orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }] },
    },
  })

  return NextResponse.json({ session: formatSession(session) }, { status: 201 })
}
