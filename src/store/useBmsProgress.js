/**
 * Fortschritt im BMS-Teil – dauerhaft in localStorage.
 *
 * Gespeichert wird nur das Nötigste:
 *   readEntries – welche Lexikon-Einträge als gelesen markiert sind
 *   topicStats  – Trefferquote je Thema, aufsummiert
 *   history     – ein schlanker Eintrag je abgeschlossenem Quiz
 *   archive     – falsch beantwortete Fragen samt Termin der Wiedervorlage
 *
 * Alles Abgeleitete (Prozentwerte, Schwächen, Verlauf) wird beim Lesen
 * berechnet – wie im KFF-Teil, damit es keine widersprüchlichen Doppeldaten
 * gibt.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { afterCorrect, afterWrong, isDue } from '../lib/spacedRepetition.js';

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
      /**
       * Fehlerarchiv: { [questionId]: { subjectId, topicId, stage, due, wrongAt } }
       * Der Schlüssel ist die Frage-ID, damit dieselbe Frage nie zweimal im
       * Archiv liegt – sie rückt nur eine Stufe vor oder zurück.
       */
      archive: {},

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
          const now = Date.now();
          const entry = {
            id: `${result.subjectId}-${now}-${Math.random().toString(36).slice(2, 7)}`,
            at: now,
            ...rest,
          };

          // Die Themenstatistik hängt am Fach der jeweiligen Frage, nicht am
          // Durchgang: Im Fehlerarchiv und in der Täglichen 10 kommen die
          // Fragen aus allen vier Fächern.
          const topicStats = { ...state.topicStats };
          const archive = { ...state.archive };
          for (const item of breakdown ?? []) {
            if (!item?.topicId) continue;
            const subjectId = item.subjectId ?? result.subjectId;
            const forSubject = { ...(topicStats[subjectId] ?? {}) };
            const current = forSubject[item.topicId] ?? { title: item.title, attempts: 0, correct: 0 };
            forSubject[item.topicId] = {
              title: item.title ?? current.title,
              attempts: current.attempts + 1,
              correct: current.correct + (item.correct ? 1 : 0),
            };
            topicStats[subjectId] = forSubject;

            if (!item.questionId) continue;
            if (!item.correct) {
              // Falsch: neu ins Archiv oder wieder auf die erste Stufe zurück.
              archive[item.questionId] = {
                subjectId,
                topicId: item.topicId,
                ...afterWrong(now),
              };
            } else if (archive[item.questionId]) {
              const next = afterCorrect(archive[item.questionId], now);
              if (next) archive[item.questionId] = next;
              else delete archive[item.questionId]; // gelernt
            }
          }

          return {
            history: [...state.history, entry].slice(-HISTORY_LIMIT),
            topicStats,
            archive,
          };
        }),

      /** Fällige Archivfragen, am längsten überfällige zuerst. */
      dueQuestions: (now = Date.now()) =>
        Object.entries(get().archive)
          .filter(([, entry]) => isDue(entry, now))
          .sort((a, b) => a[1].due - b[1].due)
          .map(([questionId, entry]) => ({ questionId, ...entry })),

      /** Kennzahlen des Archivs für die Anzeige. */
      archiveCounts: (now = Date.now()) => {
        const entries = Object.values(get().archive);
        return {
          total: entries.length,
          due: entries.filter((entry) => isDue(entry, now)).length,
        };
      },

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

      /**
       * Schwächste Themen über alle Fächer hinweg, schwächste zuerst.
       * Grundlage der Täglichen 10: Erst kommt, was hakt.
       */
      weakTopics: ({ limit = 8, threshold = 0.8, minAttempts = 3 } = {}) => {
        const rows = [];
        for (const [subjectId, topics] of Object.entries(get().topicStats)) {
          for (const [topicId, value] of Object.entries(topics)) {
            if (value.attempts < minAttempts) continue;
            const accuracy = value.correct / value.attempts;
            if (accuracy >= threshold) continue;
            rows.push({ subjectId, topicId, title: value.title, accuracy, attempts: value.attempts });
          }
        }
        return rows.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit);
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

      resetBms: () => set({ readEntries: {}, topicStats: {}, history: [], archive: {} }),
    }),
    {
      name: BMS_PROGRESS_KEY,
      version: 2,
      // v1 kannte kein Archiv; bestehende Installationen starten mit einem
      // leeren und füllen es ab dem nächsten Durchgang.
      migrate: (persisted) => ({ archive: {}, ...persisted }),
      merge: (persisted, current) => ({ ...current, ...persisted, archive: persisted?.archive ?? {} }),
    },
  ),
);
