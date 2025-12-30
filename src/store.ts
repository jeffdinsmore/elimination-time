import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Session = {
  id: string;
  start: number;
  end?: number;
};

type Store = {
  sessions: Session[];
  activeId: string | null;
  // CRUD-style actions
  startPoop: () => void;
  endPoop: () => void;
  deletePoop: (id: string) => void;
  setEndTime: (id: string, endMs: number | null) => void;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeId: null,

      // C: create a new session with start time
      startPoop: () => {
        if (get().activeId) return; // already running; ignore
        const id = String(Date.now());
        set({
          sessions: [...get().sessions, { id, start: Date.now() }],
          activeId: id,
        });
      },

      // U: update current session with end time
      endPoop: () => {
        const { activeId, sessions } = get();
        if (!activeId) return;
        set({
          sessions: sessions.map((s) =>
            s.id === activeId ? { ...s, end: Date.now() } : s
          ),
          activeId: null,
        });
      },

      // in store.ts inside create(...)
      deletePoop: (id: string) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
        })),

      // 👇 NEW: set/clear end time
      setEndTime: (id: string, endMs: number | null) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, end: endMs ?? undefined } : s
          ),
          // if we edited the active one, ensure it's no longer "active"
          activeId: state.activeId === id ? null : state.activeId,
        })),
    }),
    {
      name: "poop-time", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
