/**
 * Zentrale Konfiguration aller Untertests.
 *
 * Alle Zeitlimits und Aufgabenzahlen entsprechen den offiziellen MedAT-Vorgaben
 * und werden ausschließlich hier gepflegt – Screens, Simulation und Statistik
 * lesen von hier.
 */

/**
 * Die vier Testteile des MedAT-H samt ihrem Gewicht am Gesamtergebnis.
 * Der BMS liegt nicht in TESTS, sondern in data/bms – er ist nach Fächern
 * gegliedert, nicht nach Untertests.
 */
export const SECTIONS = {
  bms: { id: 'bms', name: 'Basiskenntnistest', short: 'BMS', weight: 0.4 },
  kff: { id: 'kff', name: 'Kognitive Fähigkeiten und Fertigkeiten', short: 'KFF', weight: 0.4 },
  tv: { id: 'tv', name: 'Textverständnis', short: 'TV', weight: 0.1 },
  sek: { id: 'sek', name: 'Sozial-emotionale Kompetenzen', short: 'SEK', weight: 0.1 },
};

export const SECTION_ORDER = ['bms', 'kff', 'tv', 'sek'];

export const TESTS = {
  figures: {
    id: 'figures',
    section: 'kff',
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
    section: 'kff',
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
    section: 'kff',
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
    section: 'kff',
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
    section: 'kff',
    name: 'Implikationen erkennen',
    short: 'Implikationen',
    tagline: 'Aus 2 Prämissen logisch korrekt schließen',
    icon: 'logic',
    accent: '#FF9500',
    questionCount: 10,
    optionCount: 5,
    testSeconds: 10 * 60,
  },
  textComprehension: {
    id: 'textComprehension',
    section: 'tv',
    name: 'Textverständnis',
    short: 'Textverständnis',
    tagline: 'Sachtexte lesen und gezielt Aussagen prüfen',
    icon: 'text',
    accent: '#5AC8FA',
    questionCount: 12,
    optionCount: 5,
    testSeconds: 35 * 60,
  },
  emotionsRecognise: {
    id: 'emotionsRecognise',
    section: 'sek',
    name: 'Emotionen erkennen',
    short: 'Emotionen erkennen',
    tagline: 'Zu jeder Situation fünf Gefühle einschätzen',
    icon: 'heart',
    accent: '#FF2D55',
    questionCount: 14,
    /** Fünf Emotionen je Aufgabe, jede einzeln einzuordnen. */
    emotionCount: 5,
    testSeconds: 21 * 60,
  },
  emotionsRegulate: {
    id: 'emotionsRegulate',
    section: 'sek',
    name: 'Emotionen regulieren',
    short: 'Emotionen regulieren',
    tagline: 'Den Vorsatz wählen, der zum Ziel führt',
    icon: 'refresh',
    accent: '#00C7BE',
    questionCount: 12,
    optionCount: 4,
    testSeconds: 18 * 60,
  },
  socialDecision: {
    id: 'socialDecision',
    section: 'sek',
    name: 'Soziales Entscheiden',
    short: 'Soziales Entscheiden',
    tagline: 'Fünf Überlegungen nach moralischem Gewicht reihen',
    icon: 'scale',
    accent: '#A2845E',
    questionCount: 14,
    /** Fünf Aussagen, die auf die Plätze a bis e zu verteilen sind. */
    statementCount: 5,
    testSeconds: 21 * 60,
  },
};

/** Die fünf kognitiven Untertests, in der Reihenfolge des echten Tests. */
export const KFF_ORDER = ['figures', 'memory', 'numberSeries', 'wordFluency', 'implications'];

/** Die drei sozial-emotionalen Untertests. */
export const SEK_ORDER = ['emotionsRecognise', 'emotionsRegulate', 'socialDecision'];

/** Textverständnis – ein einzelner Untertest, der Vollständigkeit halber als Liste. */
export const TV_ORDER = ['textComprehension'];

/** Alle Untertests, gruppiert nach Testteil. */
export const TEST_ORDER = [...KFF_ORDER, ...TV_ORDER, ...SEK_ORDER];

/** Untertests eines Testteils. */
export function testsInSection(sectionId) {
  return TEST_ORDER.filter((id) => TESTS[id].section === sectionId);
}

/**
 * Untertests mit einstellbarer Schwierigkeit: Nur die fünf kognitiven werden
 * erzeugt, alles Übrige ist geschriebener Inhalt mit fester Schwierigkeit.
 */
export const ADJUSTABLE_ORDER = KFF_ORDER.filter((id) => id !== 'memory');

/** Zeitlimit von "Figuren zusammensetzen" – vor der Liste gebraucht. */
const TESTS_SECONDS_FIGURES = TESTS.figures.testSeconds;

/** Ablauf der KFF-Simulation in der echten Testreihenfolge. */
export const SIMULATION_STEPS = [
  { kind: 'test', id: 'figures', title: 'Figuren zusammensetzen', seconds: TESTS_SECONDS_FIGURES },
  { kind: 'memoryLearn', id: 'memoryLearn', title: 'Gedächtnis – Lernphase', seconds: TESTS.memory.learnSeconds },
  { kind: 'test', id: 'numberSeries', title: 'Zahlenfolgen', seconds: TESTS.numberSeries.testSeconds },
  { kind: 'test', id: 'wordFluency', title: 'Wortflüssigkeit', seconds: TESTS.wordFluency.testSeconds },
  { kind: 'memoryQuiz', id: 'memoryQuiz', title: 'Gedächtnis – Prüfphase', seconds: TESTS.memory.testSeconds },
  { kind: 'test', id: 'implications', title: 'Implikationen erkennen', seconds: TESTS.implications.testSeconds },
];

/** Auswählbare Schwierigkeitsstufen (gilt für Figuren, Zahlenfolgen, Wortflüssigkeit, Implikationen). */
export const DIFFICULTIES = [
  { id: 'leicht', label: 'Leicht' },
  { id: 'mittel', label: 'Mittel' },
  { id: 'schwer', label: 'Schwer' },
  { id: 'medat', label: 'MedAT-Niveau' },
  { id: 'gemischt', label: 'Gemischt' },
];

/** Auswählbare Pausendauern für den Gedächtnis-Untertest (in Minuten). */
export const BREAK_DURATIONS = [2, 5, 10, 20, 40];
