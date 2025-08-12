import type { Session } from './store'

export function poopMinutesFromSession(s: Session): number | null {
  if (!s.end || s.end <= s.start) return null
  const ms = s.end - s.start
  return Math.round(ms / 60000) // whole minutes
}

// (Optional) if you want one decimal instead of whole minutes:
// return Math.round((ms / 60000) * 10) / 10
