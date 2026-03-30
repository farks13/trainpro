'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Play, CheckCircle2, Clock, RefreshCw, Timer, Trophy, Plus, X, Video, RotateCcw } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface SetLogDB {
  id?: string; exerciseId: string; setNumber: number
  targetRepsMin: number; targetRepsMax: number
  actualReps: number | null; weight: number | null; isCompleted: boolean
}
interface ExerciseInfo {
  id: string; exerciseId: string; exerciseName: string; primaryMuscleGroup: string
  instructions: string; prescribedSets: number; repRangeMin: number; repRangeMax: number; rirTarget: number; notes: string
}
interface WorkoutTemplate { id: string; name: string; focus: string; muscleGroups: string[]; exercises: ExerciseInfo[] }
interface Session {
  id: string; status: string; startedAt: string | null; completedAt: string | null
  durationMinutes: number | null; template: WorkoutTemplate | null; setLogs: SetLogDB[]
}
type SetStatus = 'idle' | 'saving' | 'logged'

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60); const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function SetRow({ setNumber, setLogId, targetRepsMin, targetRepsMax, initialReps, initialWeight, initialCompleted, sessionId, onLogged }:
  { setNumber: number; setLogId?: string; targetRepsMin: number; targetRepsMax: number; initialReps: string; initialWeight: string; initialCompleted: boolean; sessionId: string; onLogged: (reps: number, weight: number, isNew: boolean) => void }) {
  const [reps, setReps] = useState(initialReps)
  const [weight, setWeight] = useState(initialWeight)
  const [status, setStatus] = useState<SetStatus>(initialCompleted ? 'logged' : 'idle')
  const [everLogged, setEverLogged] = useState(initialCompleted)
  const [error, setError] = useState('')

  async function handleLogSet() {
    const repsNum = parseFloat(reps); const weightNum = parseFloat(weight)
    if (!reps || isNaN(repsNum) || repsNum <= 0) { setError('Enter reps > 0'); return }
    if (weight === '' || isNaN(weightNum) || weightNum < 0) { setError('Enter weight (0 or more)'); return }
    setError(''); setStatus('saving')
    try {
      if (setLogId) {
        await fetch(`/api/workouts/${sessionId}/sets`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setLogId, weight: weightNum, actualReps: repsNum, isCompleted: true }),
        })
      }
      setStatus('logged')
      onLogged(repsNum, weightNum, !everLogged)
      setEverLogged(true)
    } catch { setStatus('idle'); setError('Save failed — try again') }
  }

  if (status === 'logged') {
    return (
      <div style={{ borderRadius: 12, border: '2px solid #bbf7d0', backgroundColor: '#f0fdf4', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Set {setNumber}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setStatus('idle')} style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', background: 'none', border: '1px solid #d1d5db', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>Edit</button>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#16a34a' }}><CheckCircle2 size={14} /> Done</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Reps</div>
            <div style={{ height: 44, borderRadius: 8, border: '1px solid #d1fae5', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#374151' }}>{reps}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Weight</div>
            <div style={{ height: 44, borderRadius: 8, border: '1px solid #d1fae5', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 18, fontWeight: 700, color: '#374151' }}>
              {weight} <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>kg</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ borderRadius: 12, border: '2px solid #e5e7eb', backgroundColor: '#fff', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Set {setNumber}</span>
        {error && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 500 }}>{error}</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 5, fontWeight: 500 }}>Reps</div>
          <input type="text" inputMode="numeric" placeholder={`${targetRepsMin}–${targetRepsMax}`} value={reps}
            onChange={e => { setReps(e.target.value); setError('') }}
            disabled={status === 'saving'}
            style={{ width: '100%', height: 48, borderRadius: 8, border: error && (!reps || parseFloat(reps) <= 0) ? '2px solid #ef4444' : '2px solid #d1d5db', backgroundColor: '#fff', fontSize: 18, fontWeight: 600, textAlign: 'center', color: '#111827', outline: 'none', cursor: 'text', boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#E85D20'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,93,32,0.12)' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 5, fontWeight: 500 }}>Weight (kg)</div>
          <input type="text" inputMode="decimal" placeholder="0" value={weight}
            onChange={e => { setWeight(e.target.value); setError('') }}
            disabled={status === 'saving'}
            style={{ width: '100%', height: 48, borderRadius: 8, border: error && (weight === '' || parseFloat(weight) < 0) ? '2px solid #ef4444' : '2px solid #d1d5db', backgroundColor: '#fff', fontSize: 18, fontWeight: 600, textAlign: 'center', color: '#111827', outline: 'none', cursor: 'text', boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#E85D20'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,93,32,0.12)' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>
        <button onClick={handleLogSet} disabled={status === 'saving'}
          style={{ height: 48, paddingLeft: 18, paddingRight: 18, borderRadius: 8, border: 'none', backgroundColor: status === 'saving' ? '#F5A078' : '#E85D20', color: '#fff', fontSize: 13, fontWeight: 700, cursor: status === 'saving' ? 'wait' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          onMouseEnter={e => { if (status !== 'saving') e.currentTarget.style.backgroundColor = '#D14E15' }}
          onMouseLeave={e => { if (status !== 'saving') e.currentTarget.style.backgroundColor = '#E85D20' }}
        >{status === 'saving' ? 'Saving…' : 'Log Set'}</button>
      </div>
    </div>
  )
}

function ExerciseCard({ exercise, setLogs, sessionId, isActive }:
  { exercise: ExerciseInfo; setLogs: SetLogDB[]; sessionId: string; isActive: boolean }) {
  const [loggedCount, setLoggedCount] = useState(setLogs.filter(s => s.isCompleted).length)
  // Track reps×weight per set number so edits replace previous values
  const [setVolumes, setSetVolumes] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {}
    setLogs.forEach(sl => {
      if (sl.isCompleted && sl.actualReps != null && sl.weight != null) {
        init[sl.setNumber] = sl.actualReps * sl.weight
      }
    })
    return init
  })
  const totalLoad = Object.values(setVolumes).reduce((s, v) => s + v, 0)
  const allDone = loggedCount === setLogs.length && setLogs.length > 0
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 16, border: allDone ? '2px solid #bbf7d0' : '2px solid transparent', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {allDone ? <CheckCircle2 size={18} color="#22c55e" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #d1d5db' }} />}
          <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{exercise.exerciseName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {totalLoad > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: '#E85D20', backgroundColor: '#FFF0EA', borderRadius: 8, padding: '4px 10px' }}>
              {totalLoad.toLocaleString()} kg total
            </span>
          )}
          {exercise.instructions && (
            <a href={exercise.instructions.startsWith('http') ? exercise.instructions : '#'} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 10px', textDecoration: 'none' }}>
              <Video size={12} /> Tutorial
            </a>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, backgroundColor: '#f3f4f6', borderRadius: 8, padding: '4px 10px', color: '#374151' }}>
            <RefreshCw size={11} color="#9ca3af" /> {exercise.prescribedSets} Sets
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, backgroundColor: '#f3f4f6', borderRadius: 8, padding: '4px 10px', color: '#374151' }}>
            <RotateCcw size={11} color="#9ca3af" /> {exercise.repRangeMin}–{exercise.repRangeMax} Reps
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, backgroundColor: '#f3f4f6', borderRadius: 8, padding: '4px 10px', color: '#374151' }}>
            <Timer size={11} color="#9ca3af" /> {exercise.rirTarget} RIR
          </span>
        </div>
      </div>
      {exercise.instructions && !exercise.instructions.startsWith('http') && (
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instructions</span>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{exercise.instructions}</p>
        </div>
      )}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {setLogs.map((sl, idx) => (
          <SetRow key={sl.id ?? idx} setNumber={sl.setNumber} setLogId={sl.id} targetRepsMin={sl.targetRepsMin} targetRepsMax={sl.targetRepsMax}
            initialReps={sl.actualReps?.toString() ?? ''} initialWeight={sl.weight?.toString() ?? ''} initialCompleted={sl.isCompleted}
            sessionId={sessionId} onLogged={(reps, weight, isNew) => {
              if (isNew) setLoggedCount(c => c + 1)
              setSetVolumes(prev => ({ ...prev, [sl.setNumber]: reps * weight }))
            }} />
        ))}
      </div>
    </div>
  )
}

function ExercisePreviewCard({ exercise }: { exercise: ExerciseInfo }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{exercise.exerciseName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 10px' }}><Video size={12} /> Tutorial</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, backgroundColor: '#f3f4f6', borderRadius: 8, padding: '4px 10px', color: '#374151' }}><RefreshCw size={11} color="#9ca3af" /> {exercise.prescribedSets} Sets</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, backgroundColor: '#f3f4f6', borderRadius: 8, padding: '4px 10px', color: '#374151' }}><RotateCcw size={11} color="#9ca3af" /> {exercise.repRangeMin}–{exercise.repRangeMax} Reps</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, backgroundColor: '#f3f4f6', borderRadius: 8, padding: '4px 10px', color: '#374151' }}><Timer size={11} color="#9ca3af" /> {exercise.rirTarget} RIR</span>
        </div>
      </div>
      {exercise.instructions && (
        <div style={{ padding: '10px 20px', borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instructions</span>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{exercise.instructions}</p>
        </div>
      )}
    </div>
  )
}

interface CustomExerciseForm { name: string; sets: string; repRangeMin: string; repRangeMax: string; rirTarget: string; instructions: string; mediaUrl: string }
const emptyCustomForm: CustomExerciseForm = { name: '', sets: '3', repRangeMin: '8', repRangeMax: '12', rirTarget: '2', instructions: '', mediaUrl: '' }

export function WorkoutPageClient() {
  const { toast } = useToast()
  const [allTemplates, setAllTemplates] = useState<WorkoutTemplate[]>([])
  const [suggestedTemplateId, setSuggestedTemplateId] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [starting, setStarting] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customForm, setCustomForm] = useState<CustomExerciseForm>(emptyCustomForm)
  const [addingCustom, setAddingCustom] = useState(false)
  const [summary, setSummary] = useState<{ durationMinutes: number; totalSets: number; totalReps: number; totalVolume: number } | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [extraExercises, setExtraExercises] = useState<{ exercise: ExerciseInfo; setLogs: SetLogDB[] }[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const loadWorkout = useCallback(async () => {
    try {
      const res = await fetch('/api/workouts')
      const data = await res.json()
      setAllTemplates(data.allTemplates ?? [])
      setSuggestedTemplateId(data.suggestedTemplateId ?? null)
      if (data.session) {
        setSession(data.session)
        if (data.session.status === 'in_progress' && data.session.startedAt) {
          const elapsed = Math.floor((Date.now() - new Date(data.session.startedAt).getTime()) / 1000)
          setElapsedSeconds(elapsed)
          startTimeRef.current = Date.now() - elapsed * 1000
          setTimerRunning(true)
        }
      }
      const defaultId = data.session?.template?.id ?? data.suggestedTemplateId ?? data.allTemplates?.[0]?.id ?? ''
      setSelectedTemplateId(defaultId)
    } catch { toast({ title: 'Failed to load workout data', variant: 'destructive' }) }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { loadWorkout() }, [loadWorkout])

  useEffect(() => {
    if (timerRunning) { timerRef.current = setInterval(() => { setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000)) }, 1000) }
    else { if (timerRef.current) clearInterval(timerRef.current) }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  async function startWorkout() {
    if (!selectedTemplateId) return
    setStarting(true)
    try {
      const res = await fetch('/api/workouts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workoutTemplateId: selectedTemplateId }) })
      const data = await res.json()
      setSession(data.session); setExtraExercises([])
      startTimeRef.current = Date.now(); setElapsedSeconds(0); setTimerRunning(true)
      toast({ title: '🏋️ Workout started!' })
    } catch { toast({ title: 'Failed to start workout', variant: 'destructive' }) }
    finally { setStarting(false) }
  }

  async function completeWorkout() {
    if (!session) return; setCompleting(true)
    try {
      const res = await fetch(`/api/workouts/${session.id}/complete`, { method: 'POST' })
      const data = await res.json(); setTimerRunning(false); setSummary(data)
    } catch { toast({ title: 'Failed to complete workout', variant: 'destructive' }) }
    finally { setCompleting(false) }
  }

  async function cancelWorkout() {
    if (!session) return
    if (!window.confirm('Cancel this workout? All logged sets will be deleted.')) return
    setCancelling(true)
    try {
      await fetch(`/api/workouts/${session.id}/cancel`, { method: 'POST' })
      setTimerRunning(false); setSession(null); setExtraExercises([]); setElapsedSeconds(0); await loadWorkout()
    } catch { toast({ title: 'Failed to cancel workout', variant: 'destructive' }) }
    finally { setCancelling(false) }
  }

  async function addCustomExercise() {
    if (!session || !customForm.name.trim()) return; setAddingCustom(true)
    try {
      const res = await fetch(`/api/workouts/${session.id}/custom-exercise`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customForm) })
      const data = await res.json()
      const newExercise: ExerciseInfo = { id: `custom-${Date.now()}`, exerciseId: data.exerciseId, exerciseName: data.exerciseName, primaryMuscleGroup: 'Custom', instructions: data.instructions ?? '', prescribedSets: data.prescribedSets, repRangeMin: data.repRangeMin, repRangeMax: data.repRangeMax, rirTarget: data.rirTarget, notes: '' }
      const newSetLogs: SetLogDB[] = (data.newSetLogs ?? []).map((sl: any, i: number) => ({ id: undefined, exerciseId: data.exerciseId, setNumber: sl.setNumber ?? i + 1, targetRepsMin: data.repRangeMin, targetRepsMax: data.repRangeMax, actualReps: null, weight: null, isCompleted: false }))
      setExtraExercises(prev => [...prev, { exercise: newExercise, setLogs: newSetLogs }])
      setCustomForm(emptyCustomForm); setShowCustomForm(false)
      toast({ title: `✅ ${data.exerciseName} added` })
    } catch { toast({ title: 'Failed to add exercise', variant: 'destructive' }) }
    finally { setAddingCustom(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F0ED', padding: 24 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ height: 40, backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, opacity: 0.7 }} />
        <div style={{ height: 240, backgroundColor: '#fff', borderRadius: 16, opacity: 0.7 }} />
      </div>
    </div>
  )

  if (summary) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F0ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: 24, padding: 40, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: '#E85D20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Trophy size={28} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>Workout Complete!</h1>
        <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 28px' }}>Great session. Here's your summary.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {[{ label: 'Duration', value: formatDuration(summary.durationMinutes) }, { label: 'Sets', value: summary.totalSets }, { label: 'Total Reps', value: summary.totalReps }, { label: 'Volume', value: `${summary.totalVolume.toLocaleString()}kg` }].map(s => (
            <div key={s.label} style={{ backgroundColor: '#f9fafb', borderRadius: 12, padding: '14px 10px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setSummary(null); setExtraExercises([]); loadWorkout() }} style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: '#E85D20', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Done</button>
      </div>
    </div>
  )

  const isActive = session?.status === 'in_progress'
  const isCompletedToday = session?.status === 'completed'
  const setLogsByExercise: Record<string, SetLogDB[]> = {}
  if (session?.setLogs) { for (const sl of session.setLogs) { if (!setLogsByExercise[sl.exerciseId]) setLogsByExercise[sl.exerciseId] = []; setLogsByExercise[sl.exerciseId].push(sl) } }
  const templateExercises = isActive && session?.template ? session.template.exercises : (allTemplates.find(t => t.id === selectedTemplateId) ?? allTemplates[0])?.exercises ?? []
  const showNewWorkoutOption = isCompletedToday || false

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F0ED' }}>
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E2DE', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>Workout Session</h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>{templateExercises.length > 0 ? (session?.template?.name ?? allTemplates.find(t => t.id === selectedTemplateId)?.name ?? 'Select a workout') : 'Select a workout'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {(!isActive || showNewWorkoutOption) && allTemplates.length > 0 && (
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger style={{ height: 36, fontSize: 13, width: 220 }}><SelectValue placeholder="Select workout" /></SelectTrigger>
                <SelectContent>{allTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#f3f4f6', borderRadius: 8, padding: '6px 12px' }}>
              <Clock size={13} color="#9ca3af" />
              <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#374151', minWidth: 44 }}>{formatTimer(elapsedSeconds)}</span>
            </div>
            {showNewWorkoutOption ? (
              <button onClick={startWorkout} disabled={starting || !selectedTemplateId}
                style={{ height: 36, paddingLeft: 16, paddingRight: 16, borderRadius: 8, border: 'none', backgroundColor: '#E85D20', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: starting || !selectedTemplateId ? 0.5 : 1 }}>
                <Play size={14} /> {starting ? 'Starting…' : 'New Workout'}
              </button>
            ) : isActive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={cancelWorkout} disabled={cancelling}
                  style={{ height: 36, paddingLeft: 14, paddingRight: 14, borderRadius: 8, border: '1.5px solid #fca5a5', backgroundColor: '#fff5f5', color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: cancelling ? 0.6 : 1 }}>
                  <X size={13} /> {cancelling ? 'Cancelling…' : 'Cancel'}
                </button>
                <button onClick={completeWorkout} disabled={completing}
                  style={{ height: 36, paddingLeft: 14, paddingRight: 14, borderRadius: 8, border: 'none', backgroundColor: '#22c55e', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: completing ? 0.6 : 1 }}>
                  <CheckCircle2 size={13} /> {completing ? 'Saving…' : 'Stop'}
                </button>
              </div>
            ) : (
              <button onClick={startWorkout} disabled={starting || !selectedTemplateId}
                style={{ height: 36, paddingLeft: 16, paddingRight: 16, borderRadius: 8, border: 'none', backgroundColor: '#E85D20', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: starting || !selectedTemplateId ? 0.5 : 1 }}>
                <Play size={14} /> {starting ? 'Starting…' : 'Start Workout'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 120px' }}>
        {isActive && (
          <div style={{ marginBottom: 16 }}>
            {!showCustomForm ? (
              <button onClick={() => setShowCustomForm(true)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px dashed #d1d5db', backgroundColor: 'transparent', fontSize: 13, fontWeight: 600, color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E85D20'; e.currentTarget.style.color = '#E85D20' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af' }}
              ><Plus size={14} /> Add Custom Exercise</button>
            ) : (
              <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Add Custom Exercise</span>
                  <button onClick={() => { setShowCustomForm(false); setCustomForm(emptyCustomForm) }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}><X size={16} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Exercise Name *</label>
                    <input type="text" placeholder="e.g. Push-ups" value={customForm.name} onChange={e => setCustomForm(p => ({ ...p, name: e.target.value }))} autoFocus
                      style={{ width: '100%', height: 40, borderRadius: 8, border: '1.5px solid #d1d5db', padding: '0 12px', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  {[{ key: 'sets', label: 'Sets' }, { key: 'rirTarget', label: 'RIR' }, { key: 'repRangeMin', label: 'Min Reps' }, { key: 'repRangeMax', label: 'Max Reps' }].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>{f.label}</label>
                      <input type="number" value={(customForm as any)[f.key]} onChange={e => setCustomForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: '100%', height: 40, borderRadius: 8, border: '1.5px solid #d1d5db', padding: '0 12px', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setShowCustomForm(false); setCustomForm(emptyCustomForm) }}
                    style={{ flex: 1, height: 40, borderRadius: 8, border: '1.5px solid #d1d5db', backgroundColor: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
                  <button onClick={addCustomExercise} disabled={addingCustom || !customForm.name.trim()}
                    style={{ flex: 1, height: 40, borderRadius: 8, border: 'none', backgroundColor: '#E85D20', color: '#fff', fontSize: 13, fontWeight: 700, cursor: addingCustom || !customForm.name.trim() ? 'not-allowed' : 'pointer', opacity: addingCustom || !customForm.name.trim() ? 0.5 : 1 }}>
                    {addingCustom ? 'Adding…' : 'Add Exercise'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(isActive || isCompletedToday)
            ? [...templateExercises.map(ex => (
                <ExerciseCard key={ex.exerciseId} exercise={ex} setLogs={setLogsByExercise[ex.exerciseId] ?? []} sessionId={session!.id} isActive={isActive} />
              )), ...extraExercises.map(({ exercise, setLogs }, i) => (
                <ExerciseCard key={`custom-${i}`} exercise={exercise} setLogs={setLogs} sessionId={session!.id} isActive={isActive} />
              ))]
            : templateExercises.map(ex => <ExercisePreviewCard key={ex.exerciseId} exercise={ex} />)
          }
        </div>
      </div>

      {isActive && (
        <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'rgba(240,240,237,0.95)', backdropFilter: 'blur(8px)', borderTop: '1px solid #e5e7eb', padding: '12px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <button onClick={completeWorkout} disabled={completing}
              style={{ width: '100%', height: 52, borderRadius: 12, border: 'none', background: '#E85D20', color: '#fff', fontSize: 15, fontWeight: 700, cursor: completing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: completing ? 0.7 : 1 }}>
              <CheckCircle2 size={18} /> {completing ? 'Saving…' : 'Complete Workout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
