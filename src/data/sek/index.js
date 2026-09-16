/**
 * SEK – Sozial-emotionale Kompetenzen.
 *
 * Drei Untertests, zusammen 10 % des MedAT-H:
 *
 *   Emotionen erkennen   14 Aufgaben / 21 min – fünf Gefühle je Situation
 *   Emotionen regulieren 12 Aufgaben / 18 min – vier Vorsätze, einer trifft
 *   Soziales Entscheiden 14 Aufgaben / 21 min – fünf Aussagen reihen
 *
 * Die Inhalte liegen je Untertest in einer eigenen Datei und werden erst beim
 * Öffnen nachgeladen – wie beim BMS, damit der Start der App nicht darunter
 * leidet.
 *
 * Ein Wort zur Verlässlichkeit: Die Aufgaben sind selbst geschrieben, nicht
 * den Originalen entnommen. Format, Aufgabenzahl und Zeit folgen den
 * offiziellen Vorgaben. Bei den Lösungen gilt: „Emotionen regulieren“ und
 * „Soziales Entscheiden“ folgen jeweils einem offengelegten Prinzip (Zielbezug
 * bzw. die Rangleiter nach Kohlberg), das in den Datendateien beschrieben ist.
 * Wer das Prinzip lernt, lernt das Nützliche – die einzelne Aufgabe ist nur
 * das Übungsmaterial dafür.
 */
import { shuffle } from '../../lib/random.js';

const loaders = {
  emotionsRecognise: () => import('./emotionsRecognise.js'),
  emotionsRegulate: () => import('./emotionsRegulate.js'),
  socialDecision: () => import('./socialDecision.js'),
};

const cache = new Map();

/** Lädt die Aufgaben eines SEK-Untertests; jede Datei höchstens einmal. */
export async function loadSekTasks(testId) {
  if (cache.has(testId)) return cache.get(testId);
  const loader = loaders[testId];
  if (!loader) throw new Error(`Unbekannter SEK-Untertest: ${testId}`);
  const module = await loader();
  cache.set(testId, module.TASKS);
  return module.TASKS;
}

/** Gibt es zu diesem Untertest überhaupt SEK-Inhalte? */
export function isSekTest(testId) {
  return Object.hasOwn(loaders, testId);
}

/**
 * Antwortmöglichkeiten mischen – wie im BMS steht in den Quelldateien die
 * richtige zuerst, damit sich eine Aufgabe beim Schreiben prüfen lässt.
 */
export function drawRegulate(task) {
  return { ...task, options: shuffle(task.options) };
}

/**
 * Die fünf Gefühle mischen. Hier gibt es kein Richtig-zuerst, aber eine feste
 * Reihenfolge würde die Aufgabe beim zweiten Sehen verraten.
 */
export function drawRecognise(task) {
  return { ...task, emotions: shuffle(task.emotions) };
}

/**
 * Die fünf Aussagen mischen und jeder ihren richtigen Platz mitgeben: `rank`
 * 0 heißt „gehört auf a“. Die Quelldatei führt sie in der richtigen
 * Reihenfolge, angezeigt werden sie gemischt.
 */
export function drawDecision(task) {
  const ranked = task.statements.map((text, rank) => ({ text, rank }));
  return { ...task, statements: shuffle(ranked) };
}

/** Der passende Ziehvorgang je Untertest. */
export const DRAW = {
  emotionsRecognise: drawRecognise,
  emotionsRegulate: drawRegulate,
  socialDecision: drawDecision,
};

/** Aufgaben für einen Durchgang ziehen: mischen, kürzen, Inhalte mischen. */
export function drawTasks(testId, tasks, count) {
  const draw = DRAW[testId];
  return shuffle(tasks).slice(0, Math.min(count, tasks.length)).map(draw);
}
