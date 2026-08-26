/**
 * Engine für den Untertest "Zahlenfolgen".
 *
 * Aufbau: Jeder Generator liefert eine Folge aus 9 Zahlen. Die ersten 7 werden
 * angezeigt, die letzten 2 sind die Lösung. Zusätzlich liefert jeder Generator
 * eine Regelbeschreibung, die nach dem Prüfen als Erklärung erscheint.
 *
 * Die sieben Level entsprechen der im MedAT üblichen Steigerung:
 *   1 konstante Addition/Subtraktion
 *   2 Multiplikation/Division
 *   3 steigende oder fallende Differenzen
 *   4 zwei verschachtelte Folgen
 *   5 Fibonacci-artige Bildungsgesetze
 *   6 Quadrat-/Kubik-/Primzahlen, alternierende Operationen
 *   7 kombinierte Regeln (z. B. ×2 − 1)
 */
import { chance, pick, randInt } from '../lib/random.js';

export const SERIES_LENGTH = 9;
export const VISIBLE_LENGTH = 7;
const MAX_ABS = 200000;

const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
];

/** Level-Metadaten für Anzeige und Auswahl. */
export const LEVELS = [
  { level: 1, label: 'Konstante Addition/Subtraktion' },
  { level: 2, label: 'Multiplikation/Division' },
  { level: 3, label: 'Steigende/fallende Differenzen' },
  { level: 4, label: 'Zwei verschachtelte Folgen' },
  { level: 5, label: 'Fibonacci-artig' },
  { level: 6, label: 'Quadrate, Kuben, Primzahlen, alternierende Operationen' },
  { level: 7, label: 'Kombinierte Regeln' },
];

/** Welche Level eine Schwierigkeitsstufe verwendet. */
export const DIFFICULTY_LEVELS = {
  leicht: [1, 2, 3],
  mittel: [2, 3, 4],
  schwer: [4, 5, 6, 7],
  medat: [1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
  gemischt: [1, 2, 3, 4, 5, 6, 7],
};

const sign = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);

/* ------------------------------------------------------------------ Level 1 */
function level1() {
  const step = pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, -3, -4, -5, -6, -7, -8, -11]);
  const start = randInt(-15, 60);
  const values = [start];
  for (let i = 1; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] + step);
  return { values, rule: `Jede Zahl entsteht aus der vorherigen durch ${sign(step)}.` };
}

/* ------------------------------------------------------------------ Level 2 */
function level2() {
  const factor = pick([2, 3, 4, 5]);
  const ascending = chance(0.6);
  if (ascending) {
    const start = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
    const values = [start];
    for (let i = 1; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] * factor);
    return { values, rule: `Jede Zahl ist das ${factor}-fache der vorherigen (× ${factor}).` };
  }
  // Absteigend: von hinten aufbauen, damit alle Werte ganzzahlig bleiben
  const last = pick([1, 2, 3, 4, 5]);
  const values = [last];
  for (let i = 1; i < SERIES_LENGTH; i += 1) values.unshift(values[0] * factor);
  return { values, rule: `Jede Zahl ist die vorherige geteilt durch ${factor} (÷ ${factor}).` };
}

/* ------------------------------------------------------------------ Level 3 */
function level3() {
  const start = randInt(1, 25);
  const firstDiff = randInt(1, 6);
  const growth = pick([1, 2, 3, -1, -2]);
  const values = [start];
  let diff = firstDiff;
  for (let i = 1; i < SERIES_LENGTH; i += 1) {
    values.push(values[i - 1] + diff);
    diff += growth;
  }
  const direction = growth > 0 ? 'wächst' : 'fällt';
  return {
    values,
    rule: `Die Differenz startet bei ${firstDiff} und ${direction} pro Schritt um ${Math.abs(growth)} `
      + `(${sign(firstDiff)}, ${sign(firstDiff + growth)}, ${sign(firstDiff + 2 * growth)}, …).`,
  };
}

/* ------------------------------------------------------------------ Level 4 */
function level4() {
  const oddStart = randInt(1, 12);
  const oddStep = pick([2, 3, 4, 5, -2, -3]);
  const evenStart = randInt(5, 30);
  const evenGeometric = chance(0.4);
  const evenStep = evenGeometric ? pick([2, 3]) : pick([5, 8, 10, 12, -5, -7]);

  const values = [];
  let odd = oddStart;
  let even = evenStart;
  for (let i = 0; i < SERIES_LENGTH; i += 1) {
    if (i % 2 === 0) {
      values.push(odd);
      odd += oddStep;
    } else {
      values.push(even);
      even = evenGeometric ? even * evenStep : even + evenStep;
    }
  }
  const evenRule = evenGeometric ? `× ${evenStep}` : sign(evenStep);
  return {
    values,
    rule: `Zwei verschachtelte Folgen: Positionen 1, 3, 5, … laufen mit ${sign(oddStep)}, `
      + `Positionen 2, 4, 6, … mit ${evenRule}.`,
  };
}

/* ------------------------------------------------------------------ Level 5 */
function level5() {
  const variant = pick(['sum', 'sumPlus', 'doubleMinus']);
  const a = randInt(1, 9);
  const b = randInt(1, 12);
  const values = [a, b];
  if (variant === 'sum') {
    for (let i = 2; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] + values[i - 2]);
    return { values, rule: 'Jede Zahl ist die Summe der beiden vorherigen Zahlen (Fibonacci-Prinzip).' };
  }
  if (variant === 'sumPlus') {
    const add = pick([1, 2, 3, -1, -2]);
    for (let i = 2; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] + values[i - 2] + add);
    return { values, rule: `Jede Zahl ist die Summe der beiden vorherigen Zahlen ${sign(add)}.` };
  }
  for (let i = 2; i < SERIES_LENGTH; i += 1) values.push(2 * values[i - 1] - values[i - 2]);
  return { values, rule: 'Jede Zahl ist das Doppelte der vorherigen minus der vorvorherigen Zahl.' };
}

/* ------------------------------------------------------------------ Level 6 */
function level6() {
  const variant = pick(['squares', 'cubes', 'primes', 'primeSum', 'alternating']);
  if (variant === 'squares') {
    const offset = randInt(1, 6);
    const shift = pick([0, 1, -1, 2]);
    const values = Array.from({ length: SERIES_LENGTH }, (_, i) => (i + offset) ** 2 + shift);
    return {
      values,
      rule: `Quadratzahlen ab ${offset}²${shift === 0 ? '' : ` ${sign(shift)}`}: `
        + `${offset}², ${offset + 1}², ${offset + 2}², …`,
    };
  }
  if (variant === 'cubes') {
    const offset = randInt(1, 3);
    const values = Array.from({ length: SERIES_LENGTH }, (_, i) => (i + offset) ** 3);
    return { values, rule: `Kubikzahlen ab ${offset}³: ${offset}³, ${offset + 1}³, ${offset + 2}³, …` };
  }
  if (variant === 'primes') {
    const start = randInt(0, PRIMES.length - SERIES_LENGTH - 1);
    return {
      values: PRIMES.slice(start, start + SERIES_LENGTH),
      rule: 'Aufeinanderfolgende Primzahlen.',
    };
  }
  if (variant === 'primeSum') {
    const start = randInt(0, PRIMES.length - SERIES_LENGTH - 1);
    const base = randInt(2, 20);
    const values = PRIMES.slice(start, start + SERIES_LENGTH).map((p) => p + base);
    return { values, rule: `Aufeinanderfolgende Primzahlen ${sign(base)}.` };
  }
  const add = pick([1, 2, 3, 4, 5, -2]);
  const factor = pick([2, 3]);
  const start = randInt(1, 10);
  const values = [start];
  for (let i = 1; i < SERIES_LENGTH; i += 1) {
    values.push(i % 2 === 1 ? values[i - 1] * factor : values[i - 1] + add);
  }
  return { values, rule: `Abwechselnd × ${factor} und ${sign(add)}.` };
}

/* ------------------------------------------------------------------ Level 7 */
function level7() {
  const variant = pick(['linear', 'squareStep', 'diffGeometric']);
  if (variant === 'linear') {
    const factor = pick([2, 2, 3, -2]);
    const add = pick([1, -1, 2, -2, 3, 5]);
    const start = randInt(1, 8);
    const values = [start];
    for (let i = 1; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] * factor + add);
    return { values, rule: `Jede Zahl ist die vorherige × ${factor} ${sign(add)}.` };
  }
  if (variant === 'squareStep') {
    const start = randInt(1, 20);
    const values = [start];
    for (let i = 1; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] + i ** 2);
    return { values, rule: 'Addiert werden nacheinander die Quadratzahlen 1², 2², 3², 4², …' };
  }
  const start = randInt(2, 15);
  const firstDiff = pick([2, 3, 4]);
  const factor = pick([2, 3]);
  const values = [start];
  let diff = firstDiff;
  for (let i = 1; i < SERIES_LENGTH; i += 1) {
    values.push(values[i - 1] + diff);
    diff *= factor;
  }
  return {
    values,
    rule: `Die Differenzen wachsen geometrisch: ${firstDiff}, ${firstDiff * factor}, `
      + `${firstDiff * factor * factor}, … (jeweils × ${factor}).`,
  };
}

const GENERATORS = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

/** Plausibilitätsprüfung: ganzzahlig, nicht zu groß, nicht konstant. */
function isUsable(values) {
  if (values.length !== SERIES_LENGTH) return false;
  if (!values.every((v) => Number.isInteger(v) && Math.abs(v) <= MAX_ABS)) return false;
  const visible = values.slice(0, VISIBLE_LENGTH);
  return new Set(visible).size > 2;
}

/**
 * Erzeugt eine Zahlenfolgen-Aufgabe.
 * @param {{level?: number, difficulty?: string}} options
 */
export function generateNumberSeriesTask(options = {}) {
  const level = options.level ?? pick(DIFFICULTY_LEVELS[options.difficulty] ?? DIFFICULTY_LEVELS.medat);
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const { values, rule } = GENERATORS[level]();
    if (!isUsable(values)) continue;
    return {
      type: 'numberSeries',
      level,
      levelLabel: LEVELS[level - 1].label,
      visible: values.slice(0, VISIBLE_LENGTH),
      solution: values.slice(VISIBLE_LENGTH),
      full: values,
      rule,
    };
  }
  // Fallback: Level 1 ist immer erzeugbar
  const { values, rule } = level1();
  return {
    type: 'numberSeries',
    level: 1,
    levelLabel: LEVELS[0].label,
    visible: values.slice(0, VISIBLE_LENGTH),
    solution: values.slice(VISIBLE_LENGTH),
    full: values,
    rule,
  };
}

/** Aufgabensatz für einen kompletten Durchgang. */
export function generateNumberSeriesSet(count, difficulty = 'medat') {
  const seen = new Set();
  const tasks = [];
  let guard = 0;
  while (tasks.length < count && guard < count * 40) {
    guard += 1;
    const task = generateNumberSeriesTask({ difficulty });
    const key = task.full.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push({ ...task, index: tasks.length });
  }
  return tasks;
}

/** Prüft die eingegebenen zwei Zahlen gegen die Lösung. */
export function checkNumberSeriesAnswer(task, answers) {
  const parsed = answers.map((value) => (value === '' || value === '-' ? NaN : Number(value)));
  const correctFlags = task.solution.map((expected, index) => parsed[index] === expected);
  return { correctFlags, correct: correctFlags.every(Boolean) };
}
