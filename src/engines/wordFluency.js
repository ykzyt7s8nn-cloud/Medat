/**
 * Engine für den Untertest "Wortflüssigkeit".
 *
 * Ablauf einer Aufgabe: Aus einem deutschen Substantiv wird ein Buchstabensalat
 * erzeugt; gefragt ist der Anfangsbuchstabe des gesuchten Wortes. Angeboten
 * werden vier Buchstaben plus "Keine Antwort ist richtig".
 *
 * Eigenschaften (geprüft von scripts/selftest.mjs):
 *   - der Buchstabensalat weicht an mindestens 3 Positionen vom Original ab und
 *     beginnt nie mit dem gesuchten Anfangsbuchstaben
 *   - in ~80 % der Aufgaben steht der korrekte Buchstabe unter a–d,
 *     in ~20 % ist e) "Keine Antwort ist richtig" korrekt
 *   - Distraktoren stammen aus den Buchstaben des Wortes und wirken dadurch
 *     plausibel
 */
import { chance, pick, sample, shuffle } from '../lib/random.js';
import { DIFFICULTY_RANGES, NOUNS } from '../data/nouns.js';

const MIN_SHUFFLE_DIFFERENCES = 3;
export const NO_ANSWER_LABEL = 'Keine Antwort ist richtig';

/** Ab wie vielen plausiblen Fehlanfängen ein Wort als schwer gilt. */
const MIN_DISTRACTION = 4;

/**
 * Sicherheitsnetz: Wörter, die mit einem anderen Eintrag ein Anagramm bilden,
 * werden ausgeschlossen – sonst gäbe es mehr als eine Lösung.
 * (Die Datenbank ist bereits bereinigt; diese Prüfung hält sie es auch nach
 * künftigen Ergänzungen.)
 */
export const SOLVABLE_NOUNS = (() => {
  const buckets = new Map();
  for (const word of NOUNS) {
    const key = word.toLowerCase().split('').sort().join('');
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(word);
  }
  return [...buckets.values()].filter((group) => group.length === 1).map((group) => group[0]);
})();

/**
 * Häufigkeit der Anfangsbuchstaben in der eigenen Wortdatenbank.
 *
 * Daraus ergibt sich, welche Buchstaben im Deutschen überhaupt als Wortanfang
 * in Frage kommen. Das ist der eigentliche Schwierigkeitshebel dieses
 * Untertests: Ein Salat ist nicht deshalb schwer, weil das Wort lang ist,
 * sondern weil mehrere seiner Buchstaben ein glaubwürdiger Anfang wären.
 */
const INITIAL_COUNTS = NOUNS.reduce((counts, word) => {
  const initial = word[0].toUpperCase();
  counts[initial] = (counts[initial] ?? 0) + 1;
  return counts;
}, {});

/** Buchstaben, die mindestens 2 % aller Substantive anführen. */
const COMMON_INITIALS = new Set(
  Object.entries(INITIAL_COUNTS)
    .filter(([, count]) => count >= NOUNS.length * 0.02)
    .map(([letter]) => letter),
);

/**
 * Ablenkbarkeit eines Wortes: Wie viele seiner übrigen Buchstaben wären selbst
 * ein glaubwürdiger Wortanfang? "Anker" (N, K, E, R) ist damit schwerer als
 * manches längere Wort.
 */
export function distractionScore(word) {
  const letters = new Set(word.toUpperCase().split(''));
  letters.delete(word[0].toUpperCase());
  return [...letters].filter((letter) => COMMON_INITIALS.has(letter)).length;
}

/** Wörter einer Längenstufe. */
function poolForRange([min, max]) {
  return SOLVABLE_NOUNS.filter((word) => word.length >= min && word.length <= max);
}

/**
 * Wortpool je Schwierigkeitsstufe.
 *
 * Leicht/Mittel/Schwer richten sich nach der Wortlänge (wie in der
 * MedAT-Literatur üblich). "MedAT-Niveau" geht bewusst einen anderen Weg und
 * wählt nach Ablenkbarkeit: entscheidend ist nicht, wie lang das Wort ist,
 * sondern wie viele seiner Buchstaben als Anfang in Frage kämen. Dadurch sind
 * auch kurze, aber knifflige Wörter wie "Anker" oder "Apfel" dabei.
 */
export function wordPool(difficulty = 'medat') {
  if (difficulty === 'gemischt') return SOLVABLE_NOUNS;
  if (difficulty === 'medat') {
    return SOLVABLE_NOUNS.filter((word) => distractionScore(word) >= MIN_DISTRACTION);
  }
  const range = DIFFICULTY_RANGES[difficulty];
  return range ? poolForRange(range) : SOLVABLE_NOUNS;
}

/**
 * Wahl des Wortes. Auf MedAT-Niveau bekommen besonders ablenkungsreiche Wörter
 * zusätzliches Gewicht, damit der Schwierigkeitsgrad nicht von der zufälligen
 * Poolzusammensetzung abhängt.
 */
function pickWord(difficulty, available) {
  if (difficulty !== 'medat') return pick(available);
  const tricky = available.filter((word) => distractionScore(word) >= MIN_DISTRACTION + 1);
  if (tricky.length > 0 && chance(0.5)) return pick(tricky);
  return pick(available);
}

/**
 * Mischt die Buchstaben so, dass sich mindestens MIN_SHUFFLE_DIFFERENCES
 * Positionen vom Original unterscheiden und der erste Buchstabe nicht der
 * gesuchte Anfangsbuchstabe ist.
 */
/** Wie viele benachbarte Buchstabenpaare des Originals im Salat übrig sind. */
function keptPairs(original, candidate) {
  let count = 0;
  for (let i = 0; i < candidate.length - 1; i += 1) {
    if (original.includes(candidate[i] + candidate[i + 1])) count += 1;
  }
  return count;
}

export function scrambleWord(word) {
  const letters = word.toUpperCase().split('');
  const original = letters.join('');
  const first = letters[0];
  const distinct = new Set(letters).size;
  const minDifferences = Math.min(MIN_SHUFFLE_DIFFERENCES, letters.length);

  let best = null;
  let bestPairs = Infinity;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const candidate = shuffle(letters);
    const differences = candidate.reduce((sum, letter, i) => sum + (letter === letters[i] ? 0 : 1), 0);
    if (differences < minDifferences) continue;
    if (distinct > 1 && candidate[0] === first) continue;

    // Von allen gültigen Mischungen die nehmen, die am wenigsten
    // Original-Buchstabenpaare stehen lässt: "SCHNEE" soll nicht als
    // "SCHNEE"-Fragment erkennbar bleiben.
    const pairs = keptPairs(original, candidate);
    if (pairs < bestPairs) {
      best = candidate;
      bestPairs = pairs;
      if (pairs === 0) break;
    }
  }
  // Fallback für Extremfälle (kurze Wörter mit vielen gleichen Buchstaben)
  return best ?? shuffle(letters);
}

/**
 * Buchstaben, die als Distraktor infrage kommen.
 *
 * Reihenfolge der Bevorzugung:
 *   1. Buchstaben aus dem Wort, die häufig Wörter anführen (echte Fallen)
 *   2. übrige Buchstaben aus dem Wort
 *   3. sonstige häufige Anfangsbuchstaben
 *
 * Ein Distraktor wie "Y" wäre wertlos – man könnte ihn ohne Nachdenken
 * ausschließen.
 */
function distractorLetters(word, exclude) {
  const inWord = [...new Set(word.toUpperCase().split(''))].filter((l) => !exclude.has(l));
  const plausible = inWord.filter((l) => COMMON_INITIALS.has(l));
  const others = inWord.filter((l) => !COMMON_INITIALS.has(l));
  const fallback = [...COMMON_INITIALS].filter((l) => !exclude.has(l) && !inWord.includes(l));
  return { plausible, others, fallback };
}

/**
 * Erzeugt eine Aufgabe.
 * @param {{difficulty?: string, usedWords?: Set<string>, forceNone?: boolean}} options
 */
export function generateWordFluencyTask(options = {}) {
  const { difficulty = 'medat', usedWords } = options;
  const pool = wordPool(difficulty);
  const available = usedWords ? pool.filter((word) => !usedWords.has(word)) : pool;
  const word = pickWord(difficulty, available.length > 0 ? available : pool);
  if (usedWords) usedWords.add(word);

  const correctLetter = word[0].toUpperCase();
  const noneCorrect = options.forceNone ?? chance(0.2);

  const exclude = new Set([correctLetter]);
  const { plausible, others, fallback } = distractorLetters(word, exclude);
  const needed = noneCorrect ? 4 : 3;
  // Erst die echten Fallen, dann auffüllen – immer ohne Dopplungen.
  const distractors = [];
  for (const letter of [...shuffle(plausible), ...shuffle(others), ...shuffle(fallback)]) {
    if (distractors.length >= needed) break;
    if (!distractors.includes(letter)) distractors.push(letter);
  }

  const letters = shuffle(noneCorrect ? distractors : [correctLetter, ...distractors]);
  const optionLetters = ['a', 'b', 'c', 'd'];
  const options_ = letters.map((letter, index) => ({
    letter: optionLetters[index],
    text: letter,
    correct: !noneCorrect && letter === correctLetter,
  }));
  options_.push({ letter: 'e', text: NO_ANSWER_LABEL, correct: noneCorrect });

  return {
    type: 'wordFluency',
    word,
    scrambled: scrambleWord(word),
    correctLetter,
    options: options_,
    correctOption: options_.find((option) => option.correct).letter,
    difficultyLabel: word.length <= 6 ? 'leicht' : word.length <= 9 ? 'mittel' : 'schwer',
  };
}

/** Aufgabensatz mit ~20 % "Keine Antwort ist richtig" und ohne Wortwiederholung. */
export function generateWordFluencySet(count, difficulty = 'medat') {
  const usedWords = new Set();
  const noneTarget = Math.round(count * 0.2);
  const noneFlags = shuffle([
    ...Array.from({ length: noneTarget }, () => true),
    ...Array.from({ length: count - noneTarget }, () => false),
  ]);
  return noneFlags.map((forceNone, index) => ({
    ...generateWordFluencyTask({ difficulty, usedWords, forceNone }),
    index,
  }));
}
