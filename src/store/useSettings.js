/**
 * Einstellungen – dauerhaft in localStorage.
 *
 * Speicherschlüssel und Migrationen sind hier gebündelt, damit ein späteres
 * Feld-Update nicht die gespeicherten Daten der Nutzer zerstört.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TEST_ORDER } from '../data/testConfig.js';

export const SETTINGS_KEY = 'medat-kff.settings.v1';

const defaultSettings = {
  /** Timer je Untertest an/aus. */
  timers: Object.fromEntries(TEST_ORDER.map((id) => [id, true])),
  /** Schwierigkeitsstufe je Untertest. */
  difficulty: {
    memory: 'medat',
    numberSeries: 'medat',
    wordFluency: 'medat',
    implications: 'medat',
  },
  /** Adaptive Schwierigkeit bei Zahlenfolgen (3× richtig -> ein Level höher). */
  adaptiveNumberSeries: true,
  /** Pausendauer zwischen Lern- und Prüfphase des Gedächtnistests (Minuten). */
  breakMinutes: 2,
  /**
   * 'uebung'  – Auflösung nach jeder Aufgabe (gut zum Lernen)
   * 'pruefung' – keine Auflösung, dafür Überspringen, Markieren und Abgabe am
   *              Ende (wie im echten Test)
   */
  mode: 'uebung',
  /** 'system' | 'light' | 'dark' */
  theme: 'system',
  sound: true,
  haptics: true,
};

export const useSettings = create()(
  persist(
    (set) => ({
      ...defaultSettings,
      setTimer: (testId, enabled) =>
        set((state) => ({ timers: { ...state.timers, [testId]: enabled } })),
      setDifficulty: (testId, level) =>
        set((state) => ({ difficulty: { ...state.difficulty, [testId]: level } })),
      setBreakMinutes: (minutes) => set({ breakMinutes: minutes }),
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
      resetSettings: () => set({ ...defaultSettings }),
    }),
    {
      name: SETTINGS_KEY,
      version: 1,
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        // Verschachtelte Objekte bewusst zusammenführen, damit neue Untertests
        // nach einem Update sinnvolle Standardwerte bekommen.
        timers: { ...current.timers, ...(persisted?.timers ?? {}) },
        difficulty: { ...current.difficulty, ...(persisted?.difficulty ?? {}) },
      }),
    },
  ),
);
