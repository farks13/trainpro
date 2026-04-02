'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Dumbbell, Loader2, X } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  primaryMuscleGroup: string
  equipment: string
  instructions: string
  mediaUrl: string
}

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/)
  return match ? match[1] : null
}

function getYoutubeThumbnail(url: string): string | null {
  const id = getYoutubeVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

function VideoModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const videoId = getYoutubeVideoId(exercise.mediaUrl)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', width: '100%', maxWidth: 760, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F0F0ED' }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#888888', margin: '0 0 3px' }}>
              {exercise.primaryMuscleGroup}
            </p>
            <h2 style={{ fontWeight: 800, fontSize: 16, color: '#1A1A1A', margin: 0 }}>{exercise.name}</h2>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', backgroundColor: '#F0F0ED', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} color="#1A1A1A" />
          </button>
        </div>
        {/* Embedded player */}
        <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
          {videoId && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={exercise.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none', display: 'block' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function ExercisesClient() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    fetch('/api/exercises')
      .then(r => r.json())
      .then(data => setExercises(Array.isArray(data) ? data : []))
      .catch(() => setExercises([]))
      .finally(() => setLoading(false))
  }, [])

  const muscleGroups = useMemo(() => {
    return Array.from(new Set(exercises.map(e => e.primaryMuscleGroup))).sort()
  }, [exercises])

  const activeFilters = ['All', ...muscleGroups]

  const filtered = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'All' || ex.primaryMuscleGroup === filter
      return matchesSearch && matchesFilter
    })
  }, [exercises, search, filter])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Loader2 size={32} style={{ color: '#888888' }} />
    </div>
  )

  return (
    <>
      {activeExercise && (
        <VideoModal exercise={activeExercise} onClose={() => setActiveExercise(null)} />
      )}

      <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1A1A1A', margin: 0, lineHeight: 1.1 }}>Exercise Library</h1>
          <p style={{ color: '#888888', marginTop: 6, fontSize: 15 }}>
            Explore exercises, watch tutorials, and track your performance
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          <div style={{ position: 'relative', maxWidth: 320 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888888' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises..."
              style={{ width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, borderRadius: 12, border: '1.5px solid #E8E8E8', backgroundColor: '#fff', fontSize: 14, color: '#1A1A1A', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {activeFilters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700, border: '1.5px solid', cursor: 'pointer',
                  backgroundColor: filter === f ? '#1A1A1A' : '#fff',
                  borderColor: filter === f ? '#1A1A1A' : '#E8E8E8',
                  color: filter === f ? '#fff' : '#1A1A1A' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: '56px 24px', textAlign: 'center' }}>
            <Dumbbell size={48} style={{ color: '#E8E8E8', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontWeight: 700, color: '#1A1A1A', fontSize: 18, margin: '0 0 8px' }}>No exercises found</p>
            <p style={{ color: '#888888', fontSize: 14, margin: 0 }}>Try a different search or filter</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(exercise => {
              const thumb = getYoutubeThumbnail(exercise.mediaUrl)
              return (
                <div key={exercise.id}
                  onClick={() => exercise.mediaUrl ? setActiveExercise(exercise) : undefined}
                  style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', cursor: exercise.mediaUrl ? 'pointer' : 'default' }}>
                  {/* Thumbnail */}
                  <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#F0F0ED', position: 'relative', overflow: 'hidden' }}>
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={exercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #aaa', marginLeft: 3 }} />
                        </div>
                      </div>
                    )}
                    {/* Play button overlay */}
                    {thumb && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #fff', marginLeft: 4 }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <h3 style={{ fontWeight: 700, color: '#1A1A1A', margin: 0, fontSize: 14, lineHeight: 1.3 }}>{exercise.name}</h3>
                      <span style={{ flexShrink: 0, borderRadius: 20, backgroundColor: '#F0F0ED', padding: '3px 9px', fontSize: 10, fontWeight: 700, color: '#888888', textTransform: 'lowercase' as const }}>
                        {exercise.primaryMuscleGroup.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
