/**
 * Fortschritt und Statistik – dauerhaft in localStorage.
 *
 * Zwei Ebenen:
 *   history  – pro abgeschlossener Übung ein schlanker Eintrag
 *   tagStats – aufsummierte Trefferquote und Zeit je Aufgaben-Kategorie
 *
 * Eine "Kategorie" (Tag) ist das, woran man eine Schwäche festmachen kann:
 * bei Zahlenfolgen die Regelfamilie, beim Gedächtnistest der Fragetyp, bei den
 * Implikationen die Figur, bei der Wortflüssigkeit die Wortlänge. Nur diese
 * Summen werden gespeichert, nicht jede einzelne Aufgabe – das hält den
 * Speicher klein und die Auswertung eindeutig.
 *
 * Alles weitere Abgeleitete (Schnitt, Streak, Verlauf) wird beim Lesen
 * berechnet, damit es keine widersprüchlichen Doppeldaten gibt.
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

      /** { [testId]: { [tag]: { label, attempts, correct, seconds } } } */
      tagStats: {},

      /**
       * Ergebnis eines Durchgangs ablegen.
       * @param {{testId, score, max, seconds, mode?, breakdown?: Array<{tag, label, correct, seconds}>}} result
       */
      addResult: (result) =>
        set((state) => {
          const { breakdown, ...rest } = result;
          const entry = {
            id: `${result.testId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            at: Date.now(),
            mode: 'practice',
            ...rest,
          };
          const sameTest = state.history.filter((item) => item.testId === entry.testId);
          const others = state.history.filter((item) => item.testId !== entry.testId);
          const trimmed = [...sameTest, entry].slice(-HISTORY_LIMIT);

          // Kategorien aufsummieren
          const forTest = { ...(state.tagStats[entry.testId] ?? {}) };
          for (const item of breakdown ?? []) {
            if (!item?.tag) continue;
            const current = forTest[item.tag] ?? { label: item.label ?? item.tag, attempts: 0, correct: 0, seconds: 0 };
            forTest[item.tag] = {
              label: item.label ?? current.label,
              attempts: current.attempts + 1,
              correct: current.correct + (item.correct ? 1 : 0),
              seconds: current.seconds + (item.seconds ?? 0),
            };
          }

          return {
            history: [...others, ...trimmed].sort((a, b) => a.at - b.at),
            tagStats: { ...state.tagStats, [entry.testId]: forTest },
          };
        }),

      /**
       * Kategorien eines Untertests, schwächste zuerst.
       * Kategorien mit weniger als `minAttempts` Versuchen gelten als noch nicht
       * belastbar und werden ans Ende sortiert.
       */
      tagsFor: (testId, { minAttempts = 3 } = {}) => {
        const stats = get().tagStats[testId] ?? {};
        return Object.entries(stats)
          .map(([tag, value]) => ({
            tag,
            ...value,
            accuracy: value.attempts > 0 ? value.correct / value.attempts : 0,
            secondsPerTask: value.attempts > 0 ? value.seconds / value.attempts : 0,
            reliable: value.attempts >= minAttempts,
          }))
          .sort((a, b) => {
            if (a.reliable !== b.reliable) return a.reliable ? -1 : 1;
            return a.accuracy - b.accuracy;
          });
      },

      /** Die schwächsten Kategorien eines Untertests (für das gezielte Training). */
      weakTags: (testId, { limit = 3, threshold = 0.8, minAttempts = 3 } = {}) =>
        get()
          .tagsFor(testId, { minAttempts })
          .filter((item) => item.reliable && item.accuracy < threshold)
          .slice(0, limit),

      /** Gibt es überhaupt genug Daten für eine Schwachstellen-Analyse? */
      hasTagData: (testId) => Object.keys(get().tagStats[testId] ?? {}).length > 0,

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

      resetAll: () => set({ history: [], tagStats: {} }),
    }),
    {
      name: PROGRESS_KEY,
      version: 2,
      // Bestehende Installationen behalten ihren Verlauf; die Kategorie-
      // Statistik startet leer und füllt sich ab der nächsten Übung.
      migrate: (persisted) => ({ tagStats: {}, ...persisted }),
      merge: (persisted, current) => ({ ...current, ...persisted, tagStats: persisted?.tagStats ?? {} }),
    },
  ),
);
