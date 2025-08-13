import type { Session } from './store'

export function poopMinutesFromSession(s: Session): number | null {
  if (!s.end || s.end <= s.start) return null
  const ms = s.end - s.start
  return Math.round(ms / 60000) // whole minutes
}

/** Average poop duration in minutes (whole minutes). Returns null if none complete. */
export function averagePoopMinutes(sessions: Session[]): number | null {
  let totalMs = 0
  let count = 0

  for (const s of sessions) {
    if (s.end && s.end > s.start) {
      totalMs += (s.end - s.start)
      count++
    }
  }

  if (!count) return null
  return Math.round((totalMs / count) / 60000)
}

/** Average time between poop STARTS, shown as "Xd Yh Zm". Returns null if <2 sessions. */
export function averageTimeBetweenPoopsDHM(sessions: Session[]): string | null {
  if (sessions.length < 2) return null

  // collect and sort start times (oldest → newest)
  const starts = sessions.map(s => s.start).sort((a, b) => a - b)

  // sum gaps between consecutive starts
  let totalGapMs = 0
  for (let i = 1; i < starts.length; i++) {
    totalGapMs += (starts[i] - starts[i - 1])
  }

  // average gap in ms
  const avgMs = Math.floor(totalGapMs / (starts.length - 1))

  // convert to days / hours / minutes
  const totalMinutes = Math.floor(avgMs / 60000)
  const days = Math.floor(totalMinutes / 1440)        // 1440 = 24*60
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  return `${days}d ${hours}h ${minutes}m`
}
// (Optional) if you want one decimal instead of whole minutes:
// return Math.round((ms / 60000) * 10) / 10
