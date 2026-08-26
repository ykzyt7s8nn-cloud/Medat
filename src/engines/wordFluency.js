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

/** Wörter einer Längenstufe. */
function poolForRange([min, max]) {
  return SOLVABLE_NOUNS.filter((word) => word.length >= min && word.length <= max);
}

/**
 * Wortpool je Schwierigkeitsstufe.
 *
 * "MedAT-Niveau" verwendet bewusst keine 5- und 6-Buchstaben-Wörter: Ein Salat
 * aus fünf Buchstaben ist meist auf einen Blick lesbar. Gefragt sind mittlere
 * und lange Wörter, mit Übergewicht auf dem schweren Ende.
 */
export function wordPool(difficulty = 'medat') {
  if (difficulty === 'gemischt') return SOLVABLE_NOUNS;
  if (difficulty === 'medat') {
    return [...poolForRange(DIFFICULTY_RANGES.mittel), ...poolForRange(DIFFICULTY_RANGES.schwer)];
  }
  const range = DIFFICULTY_RANGES[difficulty];
  return range ? poolForRange(range) : SOLVABLE_NOUNS;
}

/**
 * Wahl des Wortes. Auf MedAT-Niveau werden lange Wörter bevorzugt (60 % aus
 * 10–14 Buchstaben), damit der Schwierigkeitsgrad nicht von der zufälligen
 * Poolgröße abhängt.
 */
function pickWord(difficulty, available) {
  if (difficulty !== 'medat') return pick(available);
  const long = available.filter((word) => word.length >= DIFFICULTY_RANGES.schwer[0]);
  const medium = available.filter((word) => word.length < DIFFICULTY_RANGES.schwer[0]);
  if (long.length > 0 && (medium.length === 0 || chance(0.6))) return pick(long);
  return pick(medium.length > 0 ? medium : long);
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

/** Buchstaben, die als Distraktor infrage kommen: aus dem Wort, ohne Lösung. */
function distractorLetters(word, exclude) {
  const fromWord = [...new Set(word.toUpperCase().split(''))].filter((l) => !exclude.has(l));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter((l) => !exclude.has(l));
  return { fromWord, alphabet };
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
  const { fromWord, alphabet } = distractorLetters(word, exclude);
  const needed = noneCorrect ? 4 : 3;
  // Zuerst Buchstaben aus dem Wort (plausibel), dann bei Bedarf aus dem Alphabet
  // auffüllen – immer ohne Dopplungen.
  const distractors = [];
  for (const letter of [...sample(fromWord, fromWord.length), ...shuffle(alphabet)]) {
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
