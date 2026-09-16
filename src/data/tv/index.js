/**
 * Textverständnis – Laden und Zusammenstellen eines Durchgangs.
 *
 * MedAT-Vorgabe: 12 Aufgaben in 35 Minuten im Single-Choice-Verfahren zu
 * mehreren Texten. Jeder Text trägt hier vier Fragen, ein Durchgang zieht
 * also drei Texte.
 *
 * Die Fragen eines Textes bleiben beieinander und in ihrer Reihenfolge. Das
 * ist kein Schönheitsfehler, sondern entspricht dem Test: Man liest einen
 * Text und beantwortet dann die Fragen dazu. Gemischt werden die Texte und
 * innerhalb jeder Frage die Antwortmöglichkeiten.
 */
import { shuffle } from '../../lib/random.js';

/** Fragen je Text – daraus ergibt sich, wie viele Texte ein Durchgang braucht. */
export const QUESTIONS_PER_TEXT = 4;

let cache = null;

export async function loadTexts() {
  if (cache) return cache;
  const module = await import('./texts.js');
  cache = module.TEXTS;
  return cache;
}

/**
 * Einen Durchgang zusammenstellen.
 *
 * @param {Array} texts Alle verfügbaren Texte.
 * @param {number} count Gewünschte Aufgabenzahl (12 im Test).
 * @returns {Array} Aufgaben, jede mit ihrem Text verbunden.
 */
export function drawTextTasks(texts, count) {
  const needed = Math.ceil(count / QUESTIONS_PER_TEXT);
  const chosen = shuffle(texts).slice(0, Math.min(needed, texts.length));

  const tasks = [];
  for (const text of chosen) {
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
