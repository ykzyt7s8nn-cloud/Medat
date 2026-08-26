/**
 * Zentrale Konfiguration der vier KFF-Untertests.
 *
 * Alle Zeitlimits und Aufgabenzahlen entsprechen den offiziellen MedAT-Vorgaben
 * und werden ausschließlich hier gepflegt – Screens, Simulation und Statistik
 * lesen von hier.
 */

export const TESTS = {
  memory: {
    id: 'memory',
    name: 'Gedächtnis & Merkfähigkeit',
    short: 'Gedächtnis',
    tagline: '8 Allergieausweise einprägen, danach 25 Fragen',
    icon: 'brain',
    accent: '#AF52DE',
    questionCount: 25,
    optionCount: 5,
    /** Lernphase 8 Minuten, Prüfphase 15 Minuten (in Sekunden). */
    learnSeconds: 8 * 60,
    testSeconds: 15 * 60,
    cardCount: 8,
  },
  numberSeries: {
    id: 'numberSeries',
    name: 'Zahlenfolgen',
    short: 'Zahlenfolgen',
    tagline: '7 Zahlen sehen, die nächsten 2 ergänzen',
    icon: 'numbers',
    accent: '#007AFF',
    questionCount: 10,
    testSeconds: 15 * 60,
    /** Sichtbare Zahlen pro Aufgabe bzw. zu ergänzende Zahlen. */
    visibleCount: 7,
    answerCount: 2,
  },
  wordFluency: {
    id: 'wordFluency',
    name: 'Wortflüssigkeit',
    short: 'Wortflüssigkeit',
    tagline: 'Buchstabensalat entschlüsseln, Anfangsbuchstabe wählen',
    icon: 'letters',
    accent: '#34C759',
    questionCount: 15,
    optionCount: 5,
    testSeconds: 20 * 60,
  },
  implications: {
    id: 'implications',
    name: 'Implikationen erkennen',
    short: 'Implikationen',
    tagline: 'Aus 2 Prämissen logisch korrekt schließen',
    icon: 'logic',
    accent: '#FF9500',
    questionCount: 10,
    optionCount: 5,
    testSeconds: 10 * 60,
  },
};

/** Reihenfolge auf dem Startbildschirm. */
export const TEST_ORDER = ['memory', 'numberSeries', 'wordFluency', 'implications'];

/**
 * Ablauf der MedAT-Simulation in der echten Testreihenfolge.
 * "Figuren zusammensetzen" ist nicht Teil dieser App und wird nur als Hinweis
 * eingeblendet.
 */
export const SIMULATION_STEPS = [
  { kind: 'notice', id: 'figures', title: 'Figuren zusammensetzen', seconds: 15 * 60 },
  { kind: 'memoryLearn', id: 'memoryLearn', title: 'Gedächtnis – Lernphase', seconds: TESTS.memory.learnSeconds },
  { kind: 'test', id: 'numberSeries', title: 'Zahlenfolgen', seconds: TESTS.numberSeries.testSeconds },
  { kind: 'test', id: 'wordFluency', title: 'Wortflüssigkeit', seconds: TESTS.wordFluency.testSeconds },
  { kind: 'memoryQuiz', id: 'memoryQuiz', title: 'Gedächtnis – Prüfphase', seconds: TESTS.memory.testSeconds },
  { kind: 'test', id: 'implications', title: 'Implikationen erkennen', seconds: TESTS.implications.testSeconds },
];

/** Auswählbare Schwierigkeitsstufen (gilt für Zahlenfolgen, Wortflüssigkeit, Implikationen). */
export const DIFFICULTIES = [
  { id: 'leicht', label: 'Leicht' },
  { id: 'mittel', label: 'Mittel' },
  { id: 'schwer', label: 'Schwer' },
  { id: 'medat', label: 'MedAT-Niveau' },
  { id: 'gemischt', label: 'Gemischt' },
];

/** Auswählbare Pausendauern für den Gedächtnis-Untertest (in Minuten). */
export const BREAK_DURATIONS = [2, 5, 10, 20, 40];
