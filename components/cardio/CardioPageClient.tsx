'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { Plus, Loader2, Heart, Zap } from 'lucide-react'

interface CardioSession {
  id: string
  activityType: string
  date: string
  durationMinutes: number
  distance: number | null
  calories: number | null
  intensity: string
  notes: string
}

const ACTIVITY_TYPES = ['Running', 'Cycling', 'Walking', 'Swimming', 'Rowing', 'HIIT', 'Elliptical', 'Other']
const INTENSITIES = ['low', 'moderate', 'high', 'max']
const INTENSITY_LABELS: Record<string, string> = { low: 'Low', moderate: 'Moderate', high: 'High', max: 'Max' }

// Calories per minute (based on MET values × 80kg bodyweight)
const CALORIE_RATES: Record<string, Record<string, number>> = {
  Running:    { low: 7,  moderate: 10, high: 13, max: 17 },
  Cycling:    { low: 5,  moderate: 8,  high: 11, max: 14 },
  Walking:    { low: 3,  moderate: 4,  high: 6,  max: 8  },
  Swimming:   { low: 6,  moderate: 9,  high: 11, max: 14 },
  Rowing:     { low: 5,  moderate: 8,  high: 11, max: 14 },
  HIIT:       { low: 8,  moderate: 12, high: 15, max: 18 },
  Elliptical: { low: 5,  moderate: 7,  high: 9,  max: 12 },
  Other:      { low: 4,  moderate: 6,  high: 8,  max: 10 },
}

function estimateCalories(activity: string, minutes: number, intensity: string): number {
  const rate = CALORIE_RATES[activity]?.[intensity] ?? 6
  return Math.round(rate * minutes)
}

export function CardioPageClient() {
  const [sessions, setSessions] = useState<CardioSession[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [caloriesAutoSet, setCaloriesAutoSet] = useState(true)
  const [form, setForm] = useState({
    activityType: 'Running',
    date: format(new Date(), 'yyyy-MM-dd'),
    durationMinutes: '',
    distance: '',
    calories: '',
    intensity: 'moderate',
    notes: '',
  })

  useEffect(() => {
    fetch('/api/cardio')
      .then(r => r.json())
      .then(data => setSessions(Array.isArray(data) ? data : []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  // Auto-estimate calories when activity/duration/intensity changes
  useEffect(() => {
    if (!caloriesAutoSet) return
    const mins = parseInt(form.durationMinutes)
    if (!mins || mins <= 0) { setForm(f => ({ ...f, calories: '' })); return }
    const estimated = estimateCalories(form.activityType, mins, form.intensity)
    setForm(f => ({ ...f, calories: String(estimated) }))
  }, [form.activityType, form.durationMinutes, form.intensity, caloriesAutoSet])

  function handleFormChange(field: string, value: string) {
    if (field === 'calories') {
      // User manually edited calories — stop auto-updating
      setCaloriesAutoSet(false)
      setForm(f => ({ ...f, calories: value }))
    } else {
      setForm(f => ({ ...f, [field]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.durationMinutes) return
    setSaving(true)
    try {
      const res = await fetch('/api/cardio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: form.activityType,
          date: form.date,
          durationMinutes: parseInt(form.durationMinutes),
          distance: form.distance ? parseFloat(form.distance) : null,
          calories: form.calories ? parseInt(form.calories) : null,
          intensity: form.intensity,
          notes: form.notes,
        }),
      })
      if (res.ok) {
        const newSession = await res.json()
        setSessions(prev => [newSession, ...prev])
        setShowForm(false)
        setCaloriesAutoSet(true)
        setForm({ activityType: 'Running', date: format(new Date(), 'yyyy-MM-dd'), durationMinutes: '', distance: '', calories: '', intensity: 'moderate', notes: '' })
      }
    } finally {
      setSaving(false)
    }
  }

  const totalMinutes = sessions.reduce((s, c) => s + c.durationMinutes, 0)
  const totalDistance = sessions.reduce((s, c) => s + (c.distance ?? 0), 0)
  const totalCalories = sessions.reduce((s, c) => s + (c.calories ?? 0), 0)

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E8E8E8', fontSize: 14, backgroundColor: '#F0F0ED', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' as const }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Loader2 size={32} style={{ color: '#888888' }} />
    </div>
  )

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1.1 }}>Cardio</h1>
          <p style={{ color: '#888888', marginTop: 6, fontSize: 15 }}>{sessions.length} sessions logged</p>
        </div>
        <button onClick={() => { setShowForm(true); setCaloriesAutoSet(true) }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#E85D20', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} /> Log Cardio
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Time', value: totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` : `${totalMinutes}m` },
          { label: 'Total Distance', value: `${totalDistance.toFixed(1)} km` },
          { label: 'Calories Burned', value: totalCalories > 0 ? totalCalories.toLocaleString() : '—' },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: 16, padding: '20px 22px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#888888', margin: '0 0 8px' }}>{s.label}</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Log Form */}
      {showForm && (
        <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: '28px', marginBottom: 24, border: '2px solid #E85D20' }}>
          <h2 style={{ fontWeight: 800, fontSize: 18, color: '#1A1A1A', margin: '0 0 20px' }}>Log Cardio Session</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Activity */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Activity</label>
                <select value={form.activityType} onChange={e => handleFormChange('activityType', e.target.value)} style={inputStyle}>
                  {ACTIVITY_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {/* Date */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Date</label>
                <input type="date" value={form.date} onChange={e => handleFormChange('date', e.target.value)} style={inputStyle} />
              </div>
              {/* Duration */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Duration (min)*</label>
                <input type="number" placeholder="30" min="1" value={form.durationMinutes} onChange={e => handleFormChange('durationMinutes', e.target.value)} style={inputStyle} />
              </div>
              {/* Distance */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Distance (km)</label>
                <input type="number" placeholder="5.0" step="0.1" value={form.distance} onChange={e => handleFormChange('distance', e.target.value)} style={inputStyle} />
              </div>
              {/* Calories — auto-estimated */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                  Calories {caloriesAutoSet && form.calories ? <span style={{ color: '#E85D20', fontWeight: 600, fontSize: 10, textTransform: 'none', marginLeft: 4 }}>estimated</span> : null}
                </label>
                <input type="number" placeholder="—" value={form.calories} onChange={e => handleFormChange('calories', e.target.value)} style={inputStyle} />
              </div>
              {/* Intensity */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Intensity</label>
                <select value={form.intensity} onChange={e => handleFormChange('intensity', e.target.value)} style={inputStyle}>
                  {INTENSITIES.map(o => <option key={o} value={o}>{INTENSITY_LABELS[o]}</option>)}
                </select>
              </div>
            </div>
            {/* Notes */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Notes</label>
              <textarea value={form.notes} onChange={e => handleFormChange('notes', e.target.value)} placeholder="How did it feel?" rows={2}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving || !form.durationMinutes}
                style={{ flex: 1, padding: '13px', borderRadius: 12, backgroundColor: '#E85D20', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', opacity: saving || !form.durationMinutes ? 0.6 : 1 }}>
                {saving ? 'Saving…' : 'Save Session'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '13px 20px', borderRadius: 12, backgroundColor: '#F0F0ED', color: '#1A1A1A', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Session History */}
      {sessions.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: '56px 24px', textAlign: 'center' }}>
          <Heart size={48} style={{ color: '#E8E8E8', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontWeight: 700, color: '#1A1A1A', fontSize: 18, margin: '0 0 8px' }}>No cardio sessions yet</p>
          <p style={{ color: '#888888', fontSize: 14, margin: 0 }}>Log your first session to start tracking</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F0F0ED' }}>
            <h2 style={{ fontWeight: 800, fontSize: 17, color: '#1A1A1A', margin: 0 }}>Session History</h2>
          </div>
          {sessions.map((session, i) => (
            <div key={session.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: i < sessions.length - 1 ? '1px solid #F0F0ED' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={18} color="#E85D20" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#1A1A1A', margin: '0 0 3px', fontSize: 14 }}>{session.activityType}</p>
                <p style={{ color: '#888888', fontSize: 12, margin: 0 }}>
                  {format(new Date(session.date), 'MMM d, yyyy')} · {session.durationMinutes}min
                  {session.distance ? ` · ${session.distance}km` : ''}
                  {session.calories ? ` · ${session.calories} kcal` : ''}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#E85D20', backgroundColor: '#FFF0EA', borderRadius: 20, padding: '4px 10px', textTransform: 'capitalize', flexShrink: 0 }}>
                {session.intensity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
