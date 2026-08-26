/**
 * Fortschritt und Statistik – dauerhaft in localStorage.
 *
 * Gespeichert wird bewusst nur das Nötigste: pro abgeschlossener Übung ein
 * schlanker Eintrag. Alles Abgeleitete (Schnitt, Streak, Verlauf) wird beim
 * Lesen berechnet, damit es keine inkonsistenten Doppeldaten gibt.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const PROGRESS_KEY = 'medat-kff.progress.v1';

/** Maximale Anzahl gespeicherter Einträge je Untertest. */
const HISTORY_LIMIT = 200;

const startOfDay = (timestamp) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const useProgress = create()(
  persist(
    (set, get) => ({
      /** [{ id, testId, score, max, seconds, at, mode }] */
      history: [],

      addResult: (result) =>
        set((state) => {
          const entry = {
            id: `${result.testId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            at: Date.now(),
            mode: 'practice',
            ...result,
          };
          const sameTest = state.history.filter((item) => item.testId === entry.testId);
          const others = state.history.filter((item) => item.testId !== entry.testId);
          const trimmed = [...sameTest, entry].slice(-HISTORY_LIMIT);
          return { history: [...others, ...trimmed].sort((a, b) => a.at - b.at) };
        }),

      historyFor: (testId, limit = 30) =>
        get().history.filter((item) => item.testId === testId).slice(-limit),

      lastResult: (testId) => {
        const items = get().history.filter((item) => item.testId === testId);
        return items.length > 0 ? items[items.length - 1] : null;
      },

      averagePercent: (testId) => {
        const items = get().history.filter((item) => item.testId === testId);
        if (items.length === 0) return null;
        const sum = items.reduce((acc, item) => acc + (item.score / item.max) * 100, 0);
        return sum / items.length;
      },

      totalSeconds: () => get().history.reduce((acc, item) => acc + (item.seconds || 0), 0),

      /** Anzahl aufeinanderfolgender Tage mit mindestens einer Übung (bis heute). */
      streak: () => {
        const days = new Set(get().history.map((item) => startOfDay(item.at)));
        if (days.size === 0) return 0;
        const dayMs = 24 * 60 * 60 * 1000;
        let cursor = startOfDay(Date.now());
        if (!days.has(cursor)) {
          cursor -= dayMs; // Heute noch nicht geübt: Streak endet ggf. gestern
          if (!days.has(cursor)) return 0;
        }
        let count = 0;
        while (days.has(cursor)) {
          count += 1;
          cursor -= dayMs;
        }
        return count;
      },

      resetAll: () => set({ history: [] }),
    }),
    { name: PROGRESS_KEY, version: 1 },
  ),
);
