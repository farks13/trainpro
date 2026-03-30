'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Dumbbell, CalendarDays, Timer, TrendingUp, BookOpen, Menu, X } from 'lucide-react'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workout', label: "Today's Workout", icon: Dumbbell },
  { href: '/program', label: 'Program', icon: CalendarDays },
  { href: '/cardio', label: 'Cardio', icon: Timer },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/exercises', label: 'Exercises', icon: BookOpen },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <>
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link key={href} href={href} onClick={onNavigate}
            className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150', active ? '' : 'hover:bg-black/5')}
            style={active ? { background: '#E85D20', color: '#FFFFFF' } : { color: '#888888' }}
          >
            <Icon className="w-4 h-4 shrink-0" /><span>{label}</span>
          </Link>
        )
      })}
    </>
  )
}

function UserFooter() {
  return (
    <div className="px-4 py-5" style={{ borderTop: '1px solid #E2E2DE' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: '#1A1A1A' }}>S</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: '#1A1A1A' }}>Steve</p>
          <p className="text-xs" style={{ color: '#888888' }}>5-Day Program</p>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col z-40" style={{ background: '#F0F0ED', borderRight: '1px solid #E2E2DE' }}>
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E85D20' }}>
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: '#1A1A1A' }}>TrainPro</span>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto"><NavLinks /></nav>
        <UserFooter />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: '#F0F0ED', borderBottom: '1px solid #E2E2DE', height: 56 }}>
        <button onClick={() => setMobileOpen(true)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-black/5" aria-label="Open menu">
          <Menu className="w-5 h-5" style={{ color: '#1A1A1A' }} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#E85D20' }}>
            <Dumbbell className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: '#1A1A1A' }}>TrainPro</span>
        </div>
        <div className="w-9" />
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }} onClick={() => setMobileOpen(false)} />
          <div className="relative flex flex-col w-72 h-full shadow-2xl" style={{ background: '#F0F0ED' }}>
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E85D20' }}>
                  <Dumbbell className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight" style={{ color: '#1A1A1A' }}>TrainPro</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5" aria-label="Close menu">
                <X className="w-4 h-4" style={{ color: '#888888' }} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </nav>
            <UserFooter />
          </div>
        </div>
      )}
    </>
  )
}
