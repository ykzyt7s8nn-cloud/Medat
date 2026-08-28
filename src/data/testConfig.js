/**
 * Zentrale Konfiguration der vier KFF-Untertests.
 *
 * Alle Zeitlimits und Aufgabenzahlen entsprechen den offiziellen MedAT-Vorgaben
 * und werden ausschließlich hier gepflegt – Screens, Simulation und Statistik
 * lesen von hier.
 */

export const TESTS = {
  figures: {
    id: 'figures',
    name: 'Figuren zusammensetzen',
    short: 'Figuren',
    tagline: 'Teilstücke zu einer Figur zusammensetzen',
    icon: 'shapes',
    accent: '#5856D6',
    questionCount: 15,
    optionCount: 5,
    testSeconds: 15 * 60,
  },
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
export const TEST_ORDER = ['figures', 'memory', 'numberSeries', 'wordFluency', 'implications'];

/** Zeitlimit von "Figuren zusammensetzen" – vor der Liste gebraucht. */
const TESTS_SECONDS_FIGURES = TESTS.figures.testSeconds;

/** Ablauf der MedAT-Simulation in der echten Testreihenfolge. */
export const SIMULATION_STEPS = [
  { kind: 'test', id: 'figures', title: 'Figuren zusammensetzen', seconds: TESTS_SECONDS_FIGURES },
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
