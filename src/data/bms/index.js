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

/** Gesamtumfang des BMS: 94 Fragen in 75 Minuten. */
export const BMS_TOTAL = {
  questionCount: SUBJECT_ORDER.reduce((sum, id) => sum + SUBJECTS[id].questionCount, 0),
  seconds: SUBJECT_ORDER.reduce((sum, id) => sum + SUBJECTS[id].seconds, 0),
};

/** Standardtext der letzten Antwortmöglichkeit, wenn sie verwendet wird. */
export const NO_ANSWER_LABEL = 'Keine der angegebenen Antwortmöglichkeiten ist korrekt';

/**
 * Lädt die Inhalte eines Fachs. Jedes Fach wird höchstens einmal geladen und
 * danach im Modul behalten.
 */
const cache = new Map();

export async function loadSubject(subjectId) {
  if (cache.has(subjectId)) return cache.get(subjectId);
  const loaders = {
    biologie: () => import('./biologie.js'),
    chemie: () => import('./chemie.js'),
    physik: () => import('./physik.js'),
    mathematik: () => import('./mathematik.js'),
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
