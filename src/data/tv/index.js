/**
 * Textverständnis – Laden und Zusammenstellen eines Durchgangs.
 *
 * MedAT-Vorgabe: 12 Aufgaben in 35 Minuten im Single-Choice-Verfahren zu
 * mehreren Texten. Im Test waren es zuletzt meist vier bis fünf Texte mit je
 * zwei bis drei, gelegentlich mehr Fragen. Hier trägt ein Text zwei bis vier
 * Fragen, und ein Durchgang zieht so viele Texte, dass genau zwölf Fragen
 * zusammenkommen – nach Möglichkeit vier oder fünf.
 *
 * Welche Texte gezogen werden, richtet sich danach, wie oft man sie schon
 * gesehen hat: Ungesehene zuerst, gleich oft gesehene zufällig. So lassen sich
 * mehrere vollständige Durchgänge hintereinander ohne Wiederholung üben, bevor
 * ein Text wiederkommt. Die Zählung stammt aus der Kategorie-Statistik, die
 * der Untertest ohnehin je Text führt – gespeichert wird dafür nichts Neues.
 *
 * Die Fragen eines Textes bleiben beieinander und in ihrer Reihenfolge. Das
 * ist kein Schönheitsfehler, sondern entspricht dem Test: Man liest einen
 * Text und beantwortet dann die Fragen dazu. Gemischt werden die Texte und
 * innerhalb jeder Frage die Antwortmöglichkeiten.
 */
import { shuffle } from '../../lib/random.js';

/** Fragen je Text: so viel Spielraum, wie die Erfahrungsberichte zeigen. */
export const QUESTIONS_PER_TEXT = { min: 2, max: 4 };

/** Texte je Durchgang, die angestrebt werden. */
export const TEXTS_PER_RUN = { min: 4, max: 5 };

let cache = null;

export async function loadTexts() {
  if (cache) return cache;
  const module = await import('./texts.js');
  cache = module.TEXTS;
  return cache;
}

/**
 * Wie oft ein Text schon vollständig bearbeitet wurde.
 *
 * @param {object} text
 * @param {Object<string, {attempts: number}>} practised Kategorie-Statistik
 *   des Untertests – je Text die Zahl der beantworteten Fragen.
 */
export function timesSeen(text, practised = {}) {
  const attempts = practised[text.id]?.attempts ?? 0;
  return Math.floor(attempts / text.questions.length);
}

/**
 * Texte wählen, deren Fragen zusammen genau `count` ergeben.
 *
 * Tiefensuche in der vorgegebenen Reihenfolge: Die erste Lösung bevorzugt die
 * vorderen Texte. Bei rund zwanzig Texten ist das ohne Weiteres schnell.
 */
function pickExactly(texts, count, { min, max }) {
  const picked = [];
  const search = (start, remaining) => {
    if (remaining === 0) return picked.length >= min;
    if (picked.length >= max) return false;
    for (let i = start; i < texts.length; i += 1) {
      const size = texts[i].questions.length;
      if (size > remaining) continue;
      picked.push(texts[i]);
      if (search(i + 1, remaining - size)) return true;
      picked.pop();
    }
    return false;
  };
  return search(0, count) ? [...picked] : null;
}

/**
 * Einen Durchgang zusammenstellen.
 *
 * @param {Array} texts Alle verfügbaren Texte.
 * @param {number} count Gewünschte Aufgabenzahl (12 im Test).
 * @param {Object<string, {attempts: number}>} [practised] Bisher bearbeitete
 *   Fragen je Text (siehe `timesSeen`).
 * @returns {Array} Aufgaben, jede mit ihrem Text verbunden.
 */
export function drawTextTasks(texts, count, practised = {}) {
  // Am wenigsten gesehene zuerst; unter gleich oft gesehenen entscheidet der Zufall.
  const ranked = shuffle(texts)
    .map((text) => ({ text, seen: timesSeen(text, practised) }))
    .sort((a, b) => a.seen - b.seen);
  const fewest = ranked[0]?.seen ?? 0;
  const fresh = ranked.filter((entry) => entry.seen === fewest).map((entry) => entry.text);
  const all = ranked.map((entry) => entry.text);

  // Wiederholung vermeiden wiegt schwerer als die übliche Textzahl: Erst wenn
  // sich aus den frischen Texten gar keine zwölf Fragen legen lassen, kommen
  // schon gesehene dazu.
  const chosen = pickExactly(fresh, count, TEXTS_PER_RUN)
    ?? pickExactly(fresh, count, { min: 1, max: Infinity })
    ?? pickExactly(all, count, TEXTS_PER_RUN)
    ?? pickExactly(all, count, { min: 1, max: Infinity })
    ?? all;

  const tasks = [];
  for (const text of shuffle(chosen)) {
    for (const question of text.questions) {
      tasks.push({
        ...question,
        // Antwortreihenfolge mischen: In der Quelldatei steht die richtige
        // zuerst, damit sich eine Frage beim Schreiben prüfen lässt.
        options: shuffle(question.options),
        textId: text.id,
        title: text.title,
        paragraphs: text.paragraphs,
      });
    }
  }
  return tasks.slice(0, count);
}
