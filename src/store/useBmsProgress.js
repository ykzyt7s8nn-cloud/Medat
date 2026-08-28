/**
 * Fortschritt im BMS-Teil – dauerhaft in localStorage.
 *
 * Gespeichert wird nur das Nötigste:
 *   readEntries – welche Lexikon-Einträge als gelesen markiert sind
 *   topicStats  – Trefferquote je Thema, aufsummiert
 *   history     – ein schlanker Eintrag je abgeschlossenem Quiz
 *
 * Alles Abgeleitete (Prozentwerte, Schwächen, Verlauf) wird beim Lesen
 * berechnet – wie im KFF-Teil, damit es keine widersprüchlichen Doppeldaten
 * gibt.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const BMS_PROGRESS_KEY = 'medat-bms.progress.v1';

const HISTORY_LIMIT = 300;

export const useBmsProgress = create()(
  persist(
    (set, get) => ({
      /** { [entryId]: timestamp } */
      readEntries: {},
      /** { [subjectId]: { [topicId]: { title, attempts, correct } } } */
      topicStats: {},
      /** [{ id, subjectId, mode, score, max, seconds, at }] */
      history: [],

      toggleRead: (entryId) =>
        set((state) => {
          const next = { ...state.readEntries };
          if (next[entryId]) delete next[entryId];
          else next[entryId] = Date.now();
          return { readEntries: next };
        }),

      markRead: (entryId) =>
        set((state) => (state.readEntries[entryId]
          ? state
          : { readEntries: { ...state.readEntries, [entryId]: Date.now() } })),

      isRead: (entryId) => Boolean(get().readEntries[entryId]),

      /** Anteil gelesener Einträge eines Fachs. */
      readShare: (entryIds) => {
        if (entryIds.length === 0) return 0;
        const read = get().readEntries;
        return entryIds.filter((id) => read[id]).length / entryIds.length;
      },

      /**
       * Ergebnis eines Quiz ablegen.
       * @param {{subjectId, mode, score, max, seconds, breakdown: [{topicId, title, correct}]}} result
       */
      addQuizResult: (result) =>
        set((state) => {
          const { breakdown, ...rest } = result;
          const entry = {
            id: `${result.subjectId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            at: Date.now(),
            ...rest,
          };

          const forSubject = { ...(state.topicStats[result.subjectId] ?? {}) };
          for (const item of breakdown ?? []) {
            if (!item?.topicId) continue;
            const current = forSubject[item.topicId] ?? { title: item.title, attempts: 0, correct: 0 };
            forSubject[item.topicId] = {
              title: item.title ?? current.title,
              attempts: current.attempts + 1,
              correct: current.correct + (item.correct ? 1 : 0),
            };
          }

          return {
            history: [...state.history, entry].slice(-HISTORY_LIMIT),
            topicStats: { ...state.topicStats, [result.subjectId]: forSubject },
          };
        }),

      /** Themen eines Fachs, schwächste zuerst. */
      topicsFor: (subjectId, { minAttempts = 3 } = {}) => {
        const stats = get().topicStats[subjectId] ?? {};
        return Object.entries(stats)
          .map(([topicId, value]) => ({
            topicId,
            ...value,
            accuracy: value.attempts > 0 ? value.correct / value.attempts : 0,
            reliable: value.attempts >= minAttempts,
          }))
          .sort((a, b) => {
            if (a.reliable !== b.reliable) return a.reliable ? -1 : 1;
            return a.accuracy - b.accuracy;
          });
      },

      /** Trefferquote eines ganzen Fachs über alle gespeicherten Themen. */
      subjectAccuracy: (subjectId) => {
        const stats = Object.values(get().topicStats[subjectId] ?? {});
        const attempts = stats.reduce((sum, item) => sum + item.attempts, 0);
        if (attempts === 0) return null;
        return stats.reduce((sum, item) => sum + item.correct, 0) / attempts;
      },

      historyFor: (subjectId, limit = 30) =>
        get().history.filter((item) => item.subjectId === subjectId).slice(-limit),

      resetBms: () => set({ readEntries: {}, topicStats: {}, history: [] }),
    }),
    { name: BMS_PROGRESS_KEY, version: 1 },
  ),
);
