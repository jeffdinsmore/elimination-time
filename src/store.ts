import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Session = {
  id: string
  start: number
  end?: number
}

type Store = {
  sessions: Session[]
  activeId: string | null
  // CRUD-style actions
  startPoop: () => void
  endPoop: () => void
}

function format(ms: number) {
  return new Date(ms).toLocaleString()
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeId: null,

      // C: create a new session with start time
      startPoop: () => {
        if (get().activeId) return // already running; ignore
        const id = String(Date.now());
        set({
          sessions: [...get().sessions, { id, start: Date.now() + 60000}],
          activeId: id,
        })
        console.log("start active Id", format(Number(id)), format(Number(Date.now() + 60000)));
      },

      // U: update current session with end time
      endPoop: () => {
        const { activeId, sessions } = get()
        if (!activeId) return
        set({
          sessions: sessions.map(s => (s.id === activeId ? { ...s, end: Date.now() - 60000 } : s)),
          activeId: null,
        })
        console.log("endPoop", format(Date.now() - 60000));
      },
    }),
    {
      name: 'poop-time', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)
