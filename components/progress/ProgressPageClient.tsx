'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, subDays, startOfDay } from 'date-fns'
import { Loader2, Dumbbell, Heart, Trophy, ChevronLeft, ChevronRight, X, Clock, Layers, Flame, Ruler } from 'lucide-react'

interface SessionStat {
  id: string
  scheduledDate: string
  status: string
  durationMinutes: number | null
  workoutTemplate: { name: string } | null
  setLogs: { isCompleted: boolean; weight: number | null; actualReps: number | null }[]
}

interface CardioStat {
  id: string
  date: string
  activityType: string
  durationMinutes: number
  distance: number | null
  calories: number | null
  intensity: string
}

interface PersonalBest {
  exerciseId: string
  exercise: { name: string; primaryMuscleGroup: string }
  weight: number
  reps: number
  volume: number
  achievedAt: string
}

interface ProgressData {
  sessions: SessionStat[]
  cardioSessions: CardioStat[]
  personalBests: PersonalBest[]
  streak: number
  totalVolume: number
  avgDuration: number
  totalCardioCalories: number
}

interface HistoryExercise {
  exerciseName: string
  primaryMuscleGroup: string
  sets: { setNumber: number; actualReps: number; weight: number }[]
}

interface HistoryWorkout {
  id: string
  date: string
  templateName: string
  focus: string
  durationMinutes: number | null
  totalVolume: number
  totalSets: number
  exercises: HistoryExercise[]
  type: 'workout'
}

interface HistoryCardio {
  id: string
  date: string
  activityType: string
  durationMinutes: number
  distance: number | null
  calories: number | null
  intensity: string
  notes: string
  type: 'cardio'
}

interface HistoryData {
  workouts: HistoryWorkout[]
  cardio: HistoryCardio[]
}

const INTENSITY_COLORS: Record<string, { bg: string; text: string }> = {
  low:      { bg: '#F0FDF4', text: '#16a34a' },
  moderate: { bg: '#EFF6FF', text: '#3b82f6' },
  high:     { bg: '#FFF7ED', text: '#ea580c' },
  max:      { bg: '#FEF2F2', text: '#dc2626' },
}

function ModalShell({ title: _title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#F7F7F5', borderRadius: 24, width: '100%', maxWidth: 620, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        {children}
      </div>
    </div>
  )
}

function WorkoutModal({ workout, onClose }: { workout: HistoryWorkout; onClose: () => void }) {
  return (
    <ModalShell title={workout.templateName} onClose={onClose}>
      {/* Header */}
      <div style={{ padding: '12px 24px 16px', borderBottom: '1px solid #E8E8E5' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#888888', margin: '0 0 3px' }}>Workout</p>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', margin: '0 0 10px' }}>{workout.templateName}</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {workout.durationMinutes != null && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#555' }}>
                  <Clock size={13} color="#888888" /> {workout.durationMinutes} min
                </span>
              )}
              {workout.totalSets > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#555' }}>
                  <Layers size={13} color="#888888" /> {workout.totalSets} sets
                </span>
              )}
              {workout.totalVolume > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#E85D20' }}>
                  <Dumbbell size={13} color="#E85D20" /> {workout.totalVolume.toLocaleString()} kg total
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', backgroundColor: '#E8E8E5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={15} color="#555" />
          </button>
        </div>
      </div>
      {/* Exercise list */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px 24px' }}>
        {workout.exercises.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888888', padding: '32px 0', fontSize: 14 }}>No set data recorded for this session.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {workout.exercises.map((ex, i) => {
              const exVol = ex.sets.reduce((s, set) => s + set.actualReps * set.weight, 0)
              return (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }}>
                  {/* Exercise header */}
                  <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1A1A1A', margin: '0 0 2px', fontSize: 15 }}>{ex.exerciseName}</p>
                      <p style={{ fontSize: 11, color: '#888888', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ex.primaryMuscleGroup}</p>
                    </div>
                    {exVol > 0 && (
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#E85D20' }}>{exVol.toLocaleString()} kg</span>
                    )}
                  </div>
                  {/* Sets */}
                  <div style={{ padding: '0 18px 14px' }}>
                    {/* Column headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 1fr 72px', gap: 8, padding: '5px 0', borderBottom: '1px solid #F0F0ED', marginBottom: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase' }}>Set</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase' }}>Reps</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase' }}>Weight</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', textAlign: 'right' }}>Volume</span>
                    </div>
                    {ex.sets.map(set => (
                      <div key={set.setNumber} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 1fr 72px', gap: 8, padding: '8px 0', borderBottom: '1px solid #F7F7F5', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#888888' }}>{set.setNumber}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{set.actualReps}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{set.weight} kg</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#E85D20', textAlign: 'right' }}>{(set.actualReps * set.weight).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </ModalShell>
  )
}

function CardioModal({ cardio, onClose }: { cardio: HistoryCardio; onClose: () => void }) {
  const ic = INTENSITY_COLORS[cardio.intensity] ?? INTENSITY_COLORS.moderate
  return (
    <ModalShell title={cardio.activityType} onClose={onClose}>
      {/* Header */}
      <div style={{ padding: '12px 24px 20px', borderBottom: '1px solid #E8E8E5' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#888888', margin: '0 0 3px' }}>Cardio</p>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', margin: '0 0 10px' }}>{cardio.activityType}</h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: ic.text, backgroundColor: ic.bg, borderRadius: 20, padding: '4px 12px', textTransform: 'capitalize', display: 'inline-block' }}>{cardio.intensity}</span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', backgroundColor: '#E8E8E5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={15} color="#555" />
          </button>
        </div>
      </div>
      {/* Stats */}
      <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Clock size={14} color="#888888" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Duration</span>
            </div>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>{cardio.durationMinutes}</p>
            <p style={{ fontSize: 12, color: '#888888', margin: '4px 0 0' }}>minutes</p>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Flame size={14} color="#888888" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Calories</span>
            </div>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>{cardio.calories ?? '—'}</p>
            <p style={{ fontSize: 12, color: '#888888', margin: '4px 0 0' }}>kcal burned</p>
          </div>
        </div>
        {cardio.distance != null && (
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Ruler size={18} color="#888888" />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Distance</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>{cardio.distance} km</p>
            </div>
          </div>
        )}
        {cardio.notes && (
          <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '16px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Notes</p>
            <p style={{ fontSize: 14, color: '#1A1A1A', margin: 0, lineHeight: 1.6 }}>{cardio.notes}</p>
          </div>
        )}
      </div>
    </ModalShell>
  )
}

function WorkoutDayCard({ workout, onReview }: { workout: HistoryWorkout; onReview: () => void }) {
  return (
    <div onClick={onReview} style={{ backgroundColor: '#fff', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, border: '1.5px solid #E8E8E5', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#E85D20')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E8E5')}>
      <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#FFF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Dumbbell size={17} color="#E85D20" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px', fontSize: 15 }}>{workout.templateName}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {workout.durationMinutes && <span style={{ fontSize: 12, color: '#888888' }}>{workout.durationMinutes} min</span>}
          {workout.totalSets > 0 && <span style={{ fontSize: 12, color: '#888888' }}>{workout.totalSets} sets</span>}
          {workout.totalVolume > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: '#E85D20' }}>{workout.totalVolume.toLocaleString()} kg</span>}
        </div>
      </div>
      <ChevronRight size={16} color="#C0C0BC" style={{ flexShrink: 0 }} />
    </div>
  )
}

function CardioDayCard({ cardio, onReview }: { cardio: HistoryCardio; onReview: () => void }) {
  const ic = INTENSITY_COLORS[cardio.intensity] ?? INTENSITY_COLORS.moderate
  return (
    <div onClick={onReview} style={{ backgroundColor: '#fff', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, border: '1.5px solid #E8E8E5', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E8E5')}>
      <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Heart size={17} color="#3b82f6" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px', fontSize: 15 }}>{cardio.activityType}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#888888' }}>{cardio.durationMinutes} min</span>
          {cardio.distance && <span style={{ fontSize: 12, color: '#888888' }}>{cardio.distance} km</span>}
          {cardio.calories && <span style={{ fontSize: 12, color: '#888888' }}>{cardio.calories} kcal</span>}
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: ic.text, backgroundColor: ic.bg, borderRadius: 20, padding: '4px 10px', textTransform: 'capitalize', flexShrink: 0 }}>{cardio.intensity}</span>
      <ChevronRight size={16} color="#C0C0BC" style={{ flexShrink: 0 }} />
    </div>
  )
}

export function ProgressPageClient() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [history, setHistory] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'bests'>('overview')
  const [dayIndex, setDayIndex] = useState(0) // 0 = most recent day
  const [workoutModal, setWorkoutModal] = useState<HistoryWorkout | null>(null)
  const [cardioModal, setCardioModal] = useState<HistoryCardio | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/progress').then(r => r.json()),
      fetch('/api/history').then(r => r.json()),
    ])
      .then(([prog, hist]) => { setData(prog); setHistory(hist) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Build sorted list of unique dates that have any activity
  const activeDays = useMemo(() => {
    if (!history) return []
    const dateMap = new Map<string, { workouts: HistoryWorkout[]; cardio: HistoryCardio[] }>()
    history.workouts.forEach(w => {
      const key = format(startOfDay(new Date(w.date)), 'yyyy-MM-dd')
      if (!dateMap.has(key)) dateMap.set(key, { workouts: [], cardio: [] })
      dateMap.get(key)!.workouts.push(w)
    })
    history.cardio.forEach(c => {
      const key = format(startOfDay(new Date(c.date)), 'yyyy-MM-dd')
      if (!dateMap.has(key)) dateMap.set(key, { workouts: [], cardio: [] })
      dateMap.get(key)!.cardio.push(c)
    })
    return Array.from(dateMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([dateKey, items]) => ({ dateKey, ...items }))
  }, [history])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Loader2 size={32} style={{ color: '#888888' }} />
    </div>
  )

  if (!data) return (
    <div style={{ padding: '32px 24px', textAlign: 'center', color: '#888888' }}>
      <p>Failed to load progress data.</p>
    </div>
  )

  const completedSessions = data.sessions.filter(s => s.status === 'completed')
  const last7 = subDays(new Date(), 7)
  const thisWeek = [
    ...completedSessions.filter(s => new Date(s.scheduledDate) >= last7),
    ...(data.cardioSessions ?? []).filter(c => new Date(c.date) >= last7),
  ]

  // Weekly bar chart
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const weekEnd = subDays(new Date(), i * 7)
    const weekStart = subDays(new Date(), i * 7 + 6)
    const workouts = completedSessions.filter(s => {
      const d = new Date(s.scheduledDate)
      return d >= weekStart && d <= weekEnd
    }).length
    const cardio = (data.cardioSessions ?? []).filter(c => {
      const d = new Date(c.date)
      return d >= weekStart && d <= weekEnd
    }).length
    return { label: format(weekEnd, 'MMM d'), workouts, cardio, total: workouts + cardio }
  }).reverse()
  const maxCount = Math.max(...weeklyData.map(w => w.total), 1)

  const safeIndex = Math.max(0, Math.min(dayIndex, activeDays.length - 1))
  const currentDay = activeDays[safeIndex]

  return (
    <>
    {workoutModal && <WorkoutModal workout={workoutModal} onClose={() => setWorkoutModal(null)} />}
    {cardioModal && <CardioModal cardio={cardioModal} onClose={() => setCardioModal(null)} />}
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1.1 }}>Progress</h1>
        <p style={{ color: '#888888', marginTop: 6, fontSize: 15 }}>Track your gains over time</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Workouts Done', value: completedSessions.length },
          { label: 'Cardio Sessions', value: data.cardioSessions?.length ?? 0 },
          { label: 'Active Days This Week', value: thisWeek.length },
          { label: 'Current Streak', value: `${data.streak}d` },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: 16, padding: '20px 22px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#888888', margin: '0 0 8px' }}>{s.label}</p>
            <p style={{ fontSize: 52, fontWeight: 800, color: '#1A1A1A', lineHeight: 1, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['overview', 'bests'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 20, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', backgroundColor: tab === t ? '#E85D20' : '#fff', color: tab === t ? '#fff' : '#888888' }}>
            {t === 'overview' ? 'Activity' : 'Personal Bests'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Weekly bar chart */}
          <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: 17, color: '#1A1A1A', margin: 0 }}>Weekly Activity</h2>
              <div style={{ display: 'flex', gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888888' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: '#E85D20', display: 'inline-block' }} /> Workouts
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888888' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: '#60a5fa', display: 'inline-block' }} /> Cardio
                </span>
              </div>
            </div>
            {completedSessions.length === 0 && (data.cardioSessions?.length ?? 0) === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#888888' }}>
                <p style={{ fontSize: 36, margin: '0 0 8px' }}>📊</p>
                <p style={{ fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>No activity yet</p>
                <p style={{ fontSize: 14, margin: 0 }}>Log workouts or cardio to see your chart</p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
                {weeklyData.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1A1A1A' }}>{w.total > 0 ? w.total : ''}</span>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {w.cardio > 0 && (
                        <div style={{ width: '100%', borderRadius: 4, backgroundColor: '#60a5fa', height: `${Math.max((w.cardio / maxCount) * 120, 8)}px` }} />
                      )}
                      {w.workouts > 0 && (
                        <div style={{ width: '100%', borderRadius: 4, backgroundColor: '#E85D20', height: `${Math.max((w.workouts / maxCount) * 120, 8)}px` }} />
                      )}
                      {w.total === 0 && (
                        <div style={{ width: '100%', borderRadius: 4, backgroundColor: '#F0F0ED', height: 4 }} />
                      )}
                    </div>
                    <span style={{ fontSize: 10, color: '#888888', textAlign: 'center', lineHeight: 1.2 }}>{w.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity detail with date navigation */}
          <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' }}>
            {/* Header with navigator */}
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0F0ED', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1A1A1A', margin: 0 }}>Activity Review</h3>
              {activeDays.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={() => setDayIndex(i => Math.min(i + 1, activeDays.length - 1))}
                    disabled={safeIndex >= activeDays.length - 1}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #E8E8E8', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: safeIndex >= activeDays.length - 1 ? 'default' : 'pointer', opacity: safeIndex >= activeDays.length - 1 ? 0.35 : 1 }}>
                    <ChevronLeft size={16} color="#1A1A1A" />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', minWidth: 130, textAlign: 'center' }}>
                    {currentDay ? format(new Date(currentDay.dateKey), 'EEE, MMM d yyyy') : '—'}
                  </span>
                  <button
                    onClick={() => setDayIndex(i => Math.max(i - 1, 0))}
                    disabled={safeIndex <= 0}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #E8E8E8', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: safeIndex <= 0 ? 'default' : 'pointer', opacity: safeIndex <= 0 ? 0.35 : 1 }}>
                    <ChevronRight size={16} color="#1A1A1A" />
                  </button>
                </div>
              )}
            </div>

            {/* Day content */}
            <div style={{ padding: '16px' }}>
              {activeDays.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#888888' }}>
                  <p style={{ fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>No activity logged yet</p>
                  <p style={{ fontSize: 14, margin: 0 }}>Complete a workout or log cardio to see it here</p>
                </div>
              ) : currentDay ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {currentDay.workouts.map(w => <WorkoutDayCard key={w.id} workout={w} onReview={() => setWorkoutModal(w)} />)}
                  {currentDay.cardio.map(c => <CardioDayCard key={c.id} cardio={c} onReview={() => setCardioModal(c)} />)}
                </div>
              ) : null}
            </div>

            {/* Footer: n of N */}
            {activeDays.length > 0 && (
              <div style={{ padding: '12px 22px', borderTop: '1px solid #F0F0ED', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#888888' }}>
                  {safeIndex + 1} of {activeDays.length} active days
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'bests' && (
        <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: '24px' }}>
          <h2 style={{ fontWeight: 800, fontSize: 17, color: '#1A1A1A', margin: '0 0 20px' }}>Personal Bests</h2>
          {data.personalBests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888888' }}>
              <p style={{ fontSize: 36, margin: '0 0 8px' }}>🏆</p>
              <p style={{ fontWeight: 600, color: '#1A1A1A', margin: '0 0 4px' }}>No personal bests yet</p>
              <p style={{ fontSize: 14, margin: 0 }}>Log workouts to track your records</p>
            </div>
          ) : (
            data.personalBests.map((pb, i, arr) => (
              <div key={pb.exerciseId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #F0F0ED' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trophy size={16} color="#E85D20" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#1A1A1A', margin: '0 0 2px', fontSize: 14 }}>{pb.exercise.name}</p>
                  <p style={{ color: '#888888', fontSize: 12, margin: 0 }}>{pb.exercise.primaryMuscleGroup} · {format(new Date(pb.achievedAt), 'MMM d, yyyy')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 800, color: '#1A1A1A', margin: '0 0 2px', fontSize: 16 }}>{pb.weight}kg × {pb.reps}</p>
                  <p style={{ color: '#888888', fontSize: 11, margin: 0 }}>{pb.volume.toFixed(0)}kg vol</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    </>
  )
}
