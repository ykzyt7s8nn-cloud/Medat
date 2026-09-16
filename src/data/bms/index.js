/**
 * BMS – Basiskenntnistest für Medizinische Studien.
 *
 * Der BMS macht 40 % des MedAT aus und prüft naturwissenschaftliches Wissen auf
 * Maturaniveau in vier Fächern. Dieses Modul enthält nur die Metadaten; die
 * eigentlichen Inhalte (Lexikon und Fragen) liegen je Fach in einer eigenen
 * Datei und werden erst beim Öffnen nachgeladen.
 *
 * Der Grund: Die Inhalte sind umfangreich. Würden sie im Hauptbündel stecken,
 * wäre der Start der App spürbar langsamer – auch für alle, die nur den
 * KFF-Teil üben.
 *
 * Datenschema (siehe auch scripts/selftest.mjs, das es prüft):
 *
 *   Fach     { id, name, short, accent, icon, questionCount, seconds, topics }
 *   Thema    { id, title, summary, entries[], }
 *   Eintrag  { id, title, text, facts[], formulas[]?, mnemonic?, related[] }
 *   Frage    { id, topicId, entryId, kind, prompt, options[], explanation }
 *
 *   kind 'single' – genau eine Antwort ist richtig (MedAT-Standard "1 aus 5")
 *   kind 'multi'  – mehrere richtige Antworten, die Anzahl steht in der Frage
 *                   ("x aus 5"); es müssen genau diese angekreuzt werden
 *
 *   Jede Option trägt ein `why`: die Begründung, warum sie richtig oder falsch
 *   ist. Nach dem Antworten wird sie zur gewählten Option eingeblendet – so
 *   sieht man nicht nur, dass man falsch lag, sondern woran der Denkfehler lag.
 */

import { shuffle } from '../../lib/random.js';

/** Reihenfolge und Prüfungsvorgaben der vier Fächer. */
export const SUBJECTS = {
  biologie: {
    id: 'biologie',
    name: 'Biologie',
    short: 'Bio',
    accent: '#34C759',
    icon: 'cell',
    questionCount: 40,
    seconds: 30 * 60,
  },
  chemie: {
    id: 'chemie',
    name: 'Chemie',
    short: 'Chemie',
    accent: '#007AFF',
    icon: 'flask',
    questionCount: 24,
    seconds: 18 * 60,
  },
  physik: {
    id: 'physik',
    name: 'Physik',
    short: 'Physik',
    accent: '#FF9500',
    icon: 'atom',
    questionCount: 18,
    seconds: 16 * 60,
  },
  mathematik: {
    id: 'mathematik',
    name: 'Mathematik',
    short: 'Mathe',
    accent: '#AF52DE',
    icon: 'numbers',
    questionCount: 12,
    seconds: 11 * 60,
  },
};

export const SUBJECT_ORDER = ['biologie', 'chemie', 'physik', 'mathematik'];

/**
 * Übungsformen, die Fragen quer über alle Fächer ziehen. Sie treten an
 * dieselbe Stelle wie ein Fach – das Quiz behandelt sie gleich und muss den
 * Unterschied nur beim Zusammenstellen der Fragen kennen.
 *
 *   archiv   – alles, was heute zur Wiederholung ansteht
 *   taeglich – zehn Fragen: erst die fälligen, dann die schwächsten Themen
 */
export const MIXED_SOURCES = {
  archiv: {
    id: 'archiv',
    name: 'Fehlerarchiv',
    short: 'Archiv',
    accent: '#FF3B30',
    icon: 'refresh',
    questionCount: 20,
    seconds: 20 * 60,
  },
  taeglich: {
    id: 'taeglich',
    name: 'Tägliche 10',
    short: 'Täglich',
    accent: '#FF9500',
    icon: 'flame',
    questionCount: 10,
    seconds: 10 * 60,
  },
};

/** Fach oder Übungsform – beides kann ein Quiz tragen. */
export function quizSource(id) {
  return SUBJECTS[id] ?? MIXED_SOURCES[id] ?? null;
}

/** Gesamtumfang des BMS: 94 Fragen in 75 Minuten. */
export const BMS_TOTAL = {
  questionCount: SUBJECT_ORDER.reduce((sum, id) => sum + SUBJECTS[id].questionCount, 0),
  seconds: SUBJECT_ORDER.reduce((sum, id) => sum + SUBJECTS[id].seconds, 0),
};

/** Standardtext der letzten Antwortmöglichkeit, wenn sie verwendet wird. */
export const NO_ANSWER_LABEL = 'Keine der angegebenen Antwortmöglichkeiten ist korrekt';

/**
 * Antwortmöglichkeiten einer Frage mischen.
 *
 * In den Quelldateien steht die richtige Antwort bewusst an erster Stelle: So
 * lässt sich beim Schreiben und beim Nachlesen mit einem Blick prüfen, ob die
 * Begründungen zueinander passen. Ungemischt wäre das im Quiz allerdings ein
 * Freifahrtschein – man käme mit „immer a“ auf volle Punktzahl, ohne eine
 * einzige Frage gelesen zu haben.
 *
 * Gemischt wird deshalb bei jedem Ziehen, nicht einmalig beim Laden: Dieselbe
 * Frage soll beim Wiedersehen anders aussehen, sonst merkt man sich die
 * Position statt des Inhalts.
 *
 * Eine „Keine der angegebenen Antwortmöglichkeiten ist korrekt“-Option bleibt
 * an letzter Stelle – im MedAT steht sie immer als e).
 */
export function withShuffledOptions(question) {
  const fixed = question.options.filter((option) => option.text === NO_ANSWER_LABEL);
  const movable = question.options.filter((option) => option.text !== NO_ANSWER_LABEL);
  return { ...question, options: [...shuffle(movable), ...fixed] };
}

/**
 * Lädt die Inhalte eines Fachs. Jedes Fach wird höchstens einmal geladen und
 * danach im Modul behalten.
 */
const cache = new Map();

export async function loadSubject(subjectId) {
  if (cache.has(subjectId)) return cache.get(subjectId);
  const loaders = {
    biologie: () => import('./biologie/index.js'),
    chemie: () => import('./chemie/index.js'),
    physik: () => import('./physik/index.js'),
    mathematik: () => import('./mathematik/index.js'),
  };
  const loader = loaders[subjectId];
  if (!loader) throw new Error(`Unbekanntes Fach: ${subjectId}`);
  const module = await loader();
  const content = { topics: module.TOPICS, questions: module.QUESTIONS };
  cache.set(subjectId, content);
  return content;
}

/** Lädt alle Fächer – nur für die fachübergreifende Suche und die Simulation. */
export async function loadAllSubjects() {
  const entries = await Promise.all(
    SUBJECT_ORDER.map(async (id) => [id, await loadSubject(id)]),
  );
  return Object.fromEntries(entries);
}
