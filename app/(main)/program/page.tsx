export const dynamic = 'force-dynamic'
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Play } from 'lucide-react'

interface ExerciseInfo {
  id: string
  exerciseName: string
  primaryMuscleGroup: string
  prescribedSets: number
  repRangeMin: number
  repRangeMax: number
  rirTarget: number
}

interface WorkoutTemplate {
  id: string
  name: string
  focus: string
  muscleGroups: string[]
  exercises: ExerciseInfo[]
}

interface ProgramData {
  program: { id: string; name: string; description: string; workoutTemplates: WorkoutTemplate[] } | null
  stats: { totalCompleted: number; thisWeek: number; avgDuration: number; streak: number }
}

export default function ProgramPage() {
  const [data, setData] = useState<ProgramData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/program')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Loader2 size={32} style={{ color: '#888888' }} />
    </div>
  )

  const templates = data?.program?.workoutTemplates ?? []

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1.1 }}>My Program</h1>
          <p style={{ color: '#888888', marginTop: 6, fontSize: 15 }}>
            {data?.program?.name ?? 'No active program'} · {templates.length} days
          </p>
        </div>
        <Link href="/workout" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#E85D20', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <Play size={15} /> Start Workout
          </div>
        </Link>
      </div>

      {/* Stats row */}
      {data?.stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Completed', value: data.stats.totalCompleted },
            { label: 'This Week', value: data.stats.thisWeek },
            { label: 'Streak', value: `${data.stats.streak}d` },
            { label: 'Avg Duration', value: data.stats.avgDuration > 0 ? `${data.stats.avgDuration}m` : '—' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: 14, padding: '16px 18px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#888888', margin: '0 0 6px' }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Workout days — always expanded */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {templates.map((template, i) => (
          <div key={template.id} style={{ backgroundColor: '#fff', borderRadius: 20, padding: '24px 28px' }}>
            {/* Day header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #4a6fa5, #2d4d7a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15, fontWeight: 800, color: '#fff' }}>
                  {i + 1}
                </div>
                <div>
                  <h2 style={{ fontWeight: 800, color: '#1A1A1A', margin: '0 0 3px', fontSize: 18 }}>{template.name}</h2>
                  <p style={{ color: '#888888', fontSize: 13, margin: 0 }}>
                    {template.muscleGroups.join(', ')}
                  </p>
                </div>
              </div>
              <span style={{ backgroundColor: '#F0F0ED', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: '#1A1A1A', flexShrink: 0 }}>
                {template.exercises.length} exercises
              </span>
            </div>

            {/* Exercise grid — 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {template.exercises.map((ex) => (
                <div key={ex.id} style={{ border: '1px solid #E8E8E8', borderRadius: 12, padding: '14px 16px' }}>
                  <p style={{ fontWeight: 700, color: '#1A1A1A', margin: '0 0 6px', fontSize: 14, lineHeight: 1.3 }}>{ex.exerciseName}</p>
                  <p style={{ color: '#888888', fontSize: 13, margin: 0 }}>
                    {ex.prescribedSets} sets &nbsp;×&nbsp; {ex.repRangeMin}-{ex.repRangeMax} reps
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
