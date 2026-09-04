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
    figures: 'medat',
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
  /**
   * Ton: 'aus' | 'ergebnisse' | 'alles'
   * „ergebnisse“ ist die Vorgabe – ein Ton bei jedem Tippen nervt schnell,
   * beim Auflösen ist er nützlich.
   */
  sound: 'ergebnisse',
  /**
   * Haptik: 'aus' | 'dezent' | 'deutlich'
   * „dezent“ gibt überall einen einzelnen Impuls, „deutlich“ unterscheidet die
   * Ereignisse über die Zahl der Impulse.
   */
  haptics: 'deutlich',
  /** Kurzes Signal, wenn die Zeit knapp wird (5 Min, 1 Min, 10 Sek). */
  timeWarnings: true,
};

/** Auswahl für die Einstellungen. */
export const SOUND_LEVELS = [
  { id: 'aus', label: 'Aus' },
  { id: 'ergebnisse', label: 'Auflösung' },
  { id: 'alles', label: 'Alles' },
];

export const HAPTIC_LEVELS = [
  { id: 'aus', label: 'Aus' },
  { id: 'dezent', label: 'Dezent' },
  { id: 'deutlich', label: 'Deutlich' },
];

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
      setSound: (level) => set({ sound: level }),
      setHaptics: (level) => set({ haptics: level }),
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
      resetSettings: () => set({ ...defaultSettings }),
    }),
    {
      name: SETTINGS_KEY,
      version: 2,
      /**
       * v1 kannte Ton und Haptik nur als An/Aus. Wer sie anhatte, bekommt die
       * Vorgabestufe; wer sie ausgeschaltet hatte, behält „aus“.
       */
      migrate: (persisted, version) => {
        if (!persisted || version >= 2) return persisted;
        return {
          ...persisted,
          sound: persisted.sound === false ? 'aus' : defaultSettings.sound,
          haptics: persisted.haptics === false ? 'aus' : defaultSettings.haptics,
        };
      },
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
