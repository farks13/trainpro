import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { startOfWeek, endOfWeek, differenceInCalendarDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const USER_ID = 'user_steve'

export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function getThisWeekRange() {
  const now = new Date()
  return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
}

export function calculateStreak(dates: Date[]): number {
  if (!dates.length) return 0
  const unique = [...new Set(dates.map(d => d.toISOString().split('T')[0]))].sort().reverse()
  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)
  for (const d of unique) {
    const date = new Date(d)
    const diff = differenceInCalendarDays(current, date)
    if (diff <= 1) { streak++; current = date } else break
  }
  return streak
}

export function parseJsonArray(val: string | null | undefined): string[] {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}
