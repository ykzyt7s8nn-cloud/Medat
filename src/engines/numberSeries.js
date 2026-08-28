/**
 * Engine für den Untertest "Zahlenfolgen".
 *
 * Aufbau: Eine flache Liste von Generatoren. Jeder Generator liefert eine Folge
 * aus 9 ganzen Zahlen (die ersten 7 werden gezeigt, die letzten 2 sind gesucht)
 * plus die Regelbeschreibung, die nach dem Prüfen als Erklärung erscheint.
 *
 * Wichtig für den Lerneffekt: Ein Level ist eine SCHWIERIGKEITSSTUFE, keine
 * Regelfamilie. Auf jeder Stufe mischen sich mehrere Familien – Addition,
 * Multiplikation, Potenzen, Fibonacci, alternierende und verschachtelte Muster.
 * Sonst bekäme man, gerade im adaptiven Modus, mehrere Aufgaben hintereinander
 * nach demselben Schema.
 */
import { chance, pick, randInt, shuffle } from '../lib/random.js';

export const SERIES_LENGTH = 9;
export const VISIBLE_LENGTH = 7;
const MAX_ABS = 200000;

const PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
];

/** Regelfamilien – dienen der Durchmischung innerhalb eines Durchgangs. */
export const FAMILIES = {
  additiv: 'Addition und Subtraktion',
  multiplikativ: 'Multiplikation und Division',
  potenzen: 'Quadrat-, Kubik- und Primzahlen',
  fibonacci: 'Fibonacci-artige Regeln',
  alternierend: 'Abwechselnde Rechenarten',
  verschachtelt: 'Zwei verschachtelte Folgen',
  kombiniert: 'Kombinierte Regeln',
};

/** Kurzbeschreibung der sieben Schwierigkeitsstufen. */
export const LEVELS = [
  { level: 1, label: 'Grundrechenarten in kleinen Schritten' },
  { level: 2, label: 'Multiplikation, Division, wachsende Schritte' },
  { level: 3, label: 'Wachsende Differenzen, Quadratzahlen, Wechselregeln' },
  { level: 4, label: 'Verschachtelte Folgen, Fibonacci, Kubikzahlen' },
  { level: 5, label: 'Versetzte Reihen und kombinierte Rechenwege' },
  { level: 6, label: 'Gewichtete Regeln und geometrische Differenzen' },
  { level: 7, label: 'Mehrfach kombinierte Bildungsgesetze' },
];

/** Welche Stufen eine Schwierigkeitseinstellung verwendet (Mehrfachnennung = mehr Gewicht). */
export const DIFFICULTY_LEVELS = {
  leicht: [1, 1, 2, 2, 3],
  mittel: [3, 3, 4, 4, 5],
  schwer: [5, 5, 6, 6, 7, 7],
  medat: [4, 4, 5, 5, 6, 6, 7, 7],
  gemischt: [1, 2, 3, 4, 5, 6, 7],
};

/** Startstufe im adaptiven Modus (3× richtig hoch, 2× falsch runter). */
export const START_LEVEL = { leicht: 1, mittel: 3, schwer: 5, medat: 5, gemischt: 4 };

/** Untergrenze im adaptiven Modus – verhindert das Abrutschen ins Triviale. */
export const MIN_LEVEL = { leicht: 1, mittel: 2, schwer: 4, medat: 3, gemischt: 1 };

const sign = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);

/** Baut eine Folge aus einem Startwert und einer Schrittfunktion. */
function build(start, step) {
  const values = [start];
  for (let i = 1; i < SERIES_LENGTH; i += 1) values.push(step(values[i - 1], i, values));
  return values;
}

/**
 * Alle Generatoren. `level` ist die Schwierigkeitsstufe, `family` die
 * Regelfamilie – beides wird für die Durchmischung im Aufgabensatz gebraucht.
 */
const GENERATORS = [
  /* ------------------------------------------------------------- Stufe 1 */
  {
    id: 'konstanteDifferenz',
    family: 'additiv',
    level: 1,
    make() {
      const step = pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, -3, -4, -5, -6, -7, -8]);
      return {
        values: build(randInt(-15, 60), (previous) => previous + step),
        rule: `Jede Zahl entsteht aus der vorherigen durch ${sign(step)}.`,
      };
    },
  },
  {
    id: 'verdopplung',
    family: 'multiplikativ',
    level: 1,
    make() {
      return {
        values: build(pick([1, 2, 3, 4, 5]), (previous) => previous * 2),
        rule: 'Jede Zahl ist das Doppelte der vorherigen (× 2).',
      };
    },
  },
  {
    id: 'plusMinusWechsel',
    family: 'alternierend',
    level: 1,
    make() {
      const up = randInt(4, 12);
      const down = randInt(1, up - 1);
      return {
        values: build(randInt(1, 30), (previous, i) => (i % 2 === 1 ? previous + up : previous - down)),
        rule: `Abwechselnd ${sign(up)} und ${sign(-down)}.`,
      };
    },
  },

  /* ------------------------------------------------------------- Stufe 2 */
  {
    id: 'multiplikation',
    family: 'multiplikativ',
    level: 2,
    make() {
      const factor = pick([2, 3, 4, 5]);
      return {
        values: build(pick([1, 2, 3, 4, 6, 7, 8, 9]), (previous) => previous * factor),
        rule: `Jede Zahl ist das ${factor}-fache der vorherigen (× ${factor}).`,
      };
    },
  },
  {
    id: 'division',
    family: 'multiplikativ',
    level: 2,
    make() {
      const factor = pick([2, 3, 4]);
      // Von hinten aufbauen, damit alle Werte ganzzahlig bleiben
      const values = [pick([1, 2, 3, 4, 5])];
      for (let i = 1; i < SERIES_LENGTH; i += 1) values.unshift(values[0] * factor);
      return { values, rule: `Jede Zahl ist die vorherige geteilt durch ${factor} (÷ ${factor}).` };
    },
  },
  {
    id: 'wachsendeDifferenzKlein',
    family: 'additiv',
    level: 2,
    make() {
      const first = randInt(1, 5);
      const growth = pick([1, 2]);
      let diff = first;
      return {
        values: build(randInt(1, 20), (previous) => {
          const next = previous + diff;
          diff += growth;
          return next;
        }),
        rule: `Die Differenz startet bei ${first} und wächst pro Schritt um ${growth} `
          + `(${sign(first)}, ${sign(first + growth)}, ${sign(first + 2 * growth)}, …).`,
      };
    },
  },
  {
    id: 'malPlusWechselKlein',
    family: 'alternierend',
    level: 2,
    make() {
      const add = pick([1, 2, 3]);
      return {
        values: build(randInt(1, 8), (previous, i) => (i % 2 === 1 ? previous * 2 : previous + add)),
        rule: `Abwechselnd × 2 und ${sign(add)}.`,
      };
    },
  },

  /* ------------------------------------------------------------- Stufe 3 */
  {
    id: 'wachsendeDifferenz',
    family: 'additiv',
    level: 3,
    make() {
      const first = randInt(2, 11);
      const growth = pick([2, 3, 4, 5, 6, -2, -3, -4]);
      let diff = first;
      return {
        values: build(randInt(1, 40), (previous) => {
          const next = previous + diff;
          diff += growth;
          return next;
        }),
        rule: `Die Differenz startet bei ${first} und ${growth > 0 ? 'wächst' : 'fällt'} pro Schritt um `
          + `${Math.abs(growth)} (${sign(first)}, ${sign(first + growth)}, ${sign(first + 2 * growth)}, …).`,
      };
    },
  },
  {
    id: 'quadratzahlen',
    family: 'potenzen',
    level: 3,
    make() {
      const offset = randInt(1, 6);
      const shift = pick([0, 1, -1, 2, 3]);
      return {
        values: Array.from({ length: SERIES_LENGTH }, (_, i) => (i + offset) ** 2 + shift),
        rule: `Quadratzahlen ab ${offset}²${shift === 0 ? '' : ` ${sign(shift)}`}: `
          + `${offset}², ${offset + 1}², ${offset + 2}², …`,
      };
    },
  },
  {
    id: 'verschachteltArithmetisch',
    family: 'verschachtelt',
    level: 3,
    make() {
      const oddStep = pick([3, 4, 5, 6, 7, -3, -4]);
      const evenStep = pick([7, 9, 11, 13, -6, -8]);
      let odd = randInt(1, 20);
      let even = randInt(5, 40);
      const values = [];
      for (let i = 0; i < SERIES_LENGTH; i += 1) {
        if (i % 2 === 0) { values.push(odd); odd += oddStep; } else { values.push(even); even += evenStep; }
      }
      return {
        values,
        rule: `Zwei verschachtelte Folgen: Positionen 1, 3, 5, … laufen mit ${sign(oddStep)}, `
          + `Positionen 2, 4, 6, … mit ${sign(evenStep)}.`,
      };
    },
  },
  {
    id: 'malPlusWechsel',
    family: 'alternierend',
    level: 3,
    make() {
      const factor = pick([2, 3]);
      const add = pick([3, 4, 5, 7, -3]);
      return {
        values: build(randInt(1, 12), (previous, i) => (i % 2 === 1 ? previous * factor : previous + add)),
        rule: `Abwechselnd × ${factor} und ${sign(add)}.`,
      };
    },
  },

  /* ------------------------------------------------------------- Stufe 4 */
  {
    id: 'fibonacci',
    family: 'fibonacci',
    level: 4,
    make() {
      const values = [randInt(1, 9), randInt(1, 12)];
      for (let i = 2; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] + values[i - 2]);
      return { values, rule: 'Jede Zahl ist die Summe der beiden vorherigen Zahlen (Fibonacci-Prinzip).' };
    },
  },
  {
    id: 'verschachteltGeometrisch',
    family: 'verschachtelt',
    level: 4,
    make() {
      const oddStep = pick([3, 4, 5, 6, 9, -3, -4]);
      const factor = pick([2, 3]);
      let odd = randInt(1, 20);
      let even = randInt(2, 12);
      const values = [];
      for (let i = 0; i < SERIES_LENGTH; i += 1) {
        if (i % 2 === 0) { values.push(odd); odd += oddStep; } else { values.push(even); even *= factor; }
      }
      return {
        values,
        rule: `Zwei verschachtelte Folgen: Positionen 1, 3, 5, … laufen mit ${sign(oddStep)}, `
          + `Positionen 2, 4, 6, … mit × ${factor}.`,
      };
    },
  },
  {
    id: 'kubikzahlen',
    family: 'potenzen',
    level: 4,
    make() {
      const offset = randInt(1, 3);
      return {
        values: Array.from({ length: SERIES_LENGTH }, (_, i) => (i + offset) ** 3),
        rule: `Kubikzahlen ab ${offset}³: ${offset}³, ${offset + 1}³, ${offset + 2}³, …`,
      };
    },
  },
  {
    id: 'malMinusWechsel',
    family: 'alternierend',
    level: 4,
    make() {
      const factor = pick([3, 4]);
      const subtract = pick([4, 5, 7, 9]);
      return {
        values: build(randInt(2, 12), (previous, i) => (i % 2 === 1 ? previous * factor : previous - subtract)),
        rule: `Abwechselnd × ${factor} und ${sign(-subtract)}.`,
      };
    },
  },
  {
    id: 'primzahlen',
    family: 'potenzen',
    level: 4,
    make() {
      const start = randInt(0, PRIMES.length - SERIES_LENGTH - 1);
      return { values: PRIMES.slice(start, start + SERIES_LENGTH), rule: 'Aufeinanderfolgende Primzahlen.' };
    },
  },

  /* ------------------------------------------------------------- Stufe 5 */
  {
    id: 'fibonacciVersetzt',
    family: 'fibonacci',
    level: 5,
    make() {
      const add = pick([1, 2, 3, -1, -2]);
      const values = [randInt(1, 9), randInt(1, 12)];
      for (let i = 2; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] + values[i - 2] + add);
      return { values, rule: `Jede Zahl ist die Summe der beiden vorherigen Zahlen ${sign(add)}.` };
    },
  },
  {
    id: 'linearKombiniert',
    family: 'kombiniert',
    level: 5,
    make() {
      const factor = pick([2, 3]);
      const add = pick([1, -1, 2, -2, 3, 5]);
      return {
        values: build(randInt(1, 8), (previous) => previous * factor + add),
        rule: `Jede Zahl ist die vorherige × ${factor} ${sign(add)}.`,
      };
    },
  },
  {
    id: 'primzahlenVersetzt',
    family: 'potenzen',
    level: 5,
    make() {
      const start = randInt(0, PRIMES.length - SERIES_LENGTH - 1);
      const base = randInt(2, 20);
      return {
        values: PRIMES.slice(start, start + SERIES_LENGTH).map((prime) => prime + base),
        rule: `Aufeinanderfolgende Primzahlen ${sign(base)}.`,
      };
    },
  },
  {
    id: 'quadratSchritte',
    family: 'kombiniert',
    level: 5,
    make() {
      return {
        values: build(randInt(1, 20), (previous, i) => previous + i ** 2),
        rule: 'Addiert werden nacheinander die Quadratzahlen 1², 2², 3², 4², …',
      };
    },
  },
  {
    id: 'verschachteltGemischt',
    family: 'verschachtelt',
    level: 5,
    make() {
      const factorA = pick([2, 3]);
      const addB = pick([6, 8, 11, -7]);
      let odd = randInt(1, 6);
      let even = randInt(10, 40);
      const values = [];
      for (let i = 0; i < SERIES_LENGTH; i += 1) {
        if (i % 2 === 0) { values.push(odd); odd *= factorA; } else { values.push(even); even += addB; }
      }
      return {
        values,
        rule: `Zwei verschachtelte Folgen: Positionen 1, 3, 5, … laufen mit × ${factorA}, `
          + `Positionen 2, 4, 6, … mit ${sign(addB)}.`,
      };
    },
  },

  /* ------------------------------------------------------------- Stufe 6 */
  {
    id: 'gewichteteFibonacci',
    family: 'fibonacci',
    level: 6,
    make() {
      const weight = pick([2, 3]);
      const values = [randInt(1, 6), randInt(2, 9)];
      for (let i = 2; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] + weight * values[i - 2]);
      return { values, rule: `Jede Zahl ist die vorherige plus das ${weight}-fache der vorvorherigen Zahl.` };
    },
  },
  {
    id: 'quadratDifferenzen',
    family: 'potenzen',
    level: 6,
    make() {
      const offset = randInt(1, 3);
      return {
        values: build(randInt(2, 20), (previous, i) => previous + (i + offset) ** 2),
        rule: `Addiert werden die Quadratzahlen ab ${offset + 1}²: `
          + `${(offset + 1) ** 2}, ${(offset + 2) ** 2}, ${(offset + 3) ** 2}, …`,
      };
    },
  },
  {
    id: 'geometrischeDifferenzen',
    family: 'kombiniert',
    level: 6,
    make() {
      const first = pick([2, 3, 4]);
      const factor = pick([2, 3]);
      let diff = first;
      return {
        values: build(randInt(2, 15), (previous) => {
          const next = previous + diff;
          diff *= factor;
          return next;
        }),
        rule: `Die Differenzen wachsen geometrisch: ${first}, ${first * factor}, `
          + `${first * factor * factor}, … (jeweils × ${factor}).`,
      };
    },
  },
  {
    id: 'verschachteltZweiGeometrisch',
    family: 'verschachtelt',
    level: 6,
    make() {
      const factorA = pick([2, 3]);
      const factorB = pick([2, 3, 4]);
      let odd = randInt(1, 5);
      let even = randInt(2, 7);
      const values = [];
      for (let i = 0; i < SERIES_LENGTH; i += 1) {
        if (i % 2 === 0) { values.push(odd); odd *= factorA; } else { values.push(even); even *= factorB; }
      }
      return {
        values,
        rule: `Zwei verschachtelte Folgen: Positionen 1, 3, 5, … laufen mit × ${factorA}, `
          + `Positionen 2, 4, 6, … mit × ${factorB}.`,
      };
    },
  },
  {
    id: 'dreierWechsel',
    family: 'alternierend',
    level: 6,
    make() {
      const add = pick([3, 5, 7]);
      const factor = pick([2, 3]);
      const subtract = pick([2, 4, 6]);
      return {
        values: build(randInt(2, 15), (previous, i) => {
          const phase = (i - 1) % 3;
          if (phase === 0) return previous + add;
          if (phase === 1) return previous * factor;
          return previous - subtract;
        }),
        rule: `Drei Regeln im Wechsel: ${sign(add)}, dann × ${factor}, dann ${sign(-subtract)}.`,
      };
    },
  },

  /* ------------------------------------------------------------- Stufe 7 */
  {
    id: 'positionsSchritt',
    family: 'kombiniert',
    level: 7,
    make() {
      const factor = pick([2, 3]);
      return {
        values: build(randInt(1, 9), (previous, i) => previous * factor + i),
        rule: `Jede Zahl ist die vorherige × ${factor} plus ihre Position (+1, +2, +3, …).`,
      };
    },
  },
  {
    id: 'gewichteteSumme',
    family: 'fibonacci',
    level: 7,
    make() {
      const weight = pick([2, 3]);
      const values = [randInt(1, 6), randInt(2, 9)];
      for (let i = 2; i < SERIES_LENGTH; i += 1) values.push(values[i - 1] * weight + values[i - 2]);
      return { values, rule: `Jede Zahl ist die vorherige × ${weight} plus die vorvorherige Zahl.` };
    },
  },
  {
    id: 'linearNegativ',
    family: 'kombiniert',
    level: 7,
    make() {
      const factor = pick([-2, -3]);
      const add = pick([1, 3, 5, -4]);
      return {
        values: build(randInt(1, 8), (previous) => previous * factor + add),
        rule: `Jede Zahl ist die vorherige × ${factor} ${sign(add)}.`,
      };
    },
  },
  {
    id: 'verschachteltFibonacci',
    family: 'verschachtelt',
    level: 7,
    make() {
      const step = pick([4, 6, 7, -5]);
      const fib = [randInt(1, 5), randInt(2, 7)];
      for (let i = 2; i < 6; i += 1) fib.push(fib[i - 1] + fib[i - 2]);
      let odd = randInt(2, 15);
      const values = [];
      let fibIndex = 0;
      for (let i = 0; i < SERIES_LENGTH; i += 1) {
        if (i % 2 === 0) { values.push(odd); odd += step; } else { values.push(fib[fibIndex]); fibIndex += 1; }
      }
      return {
        values,
        rule: `Zwei verschachtelte Folgen: Positionen 1, 3, 5, … laufen mit ${sign(step)}, `
          + 'Positionen 2, 4, 6, … folgen dem Fibonacci-Prinzip (jede Zahl ist die Summe der beiden vorherigen).',
      };
    },
  },
  {
    id: 'wechselndeQuadrate',
    family: 'alternierend',
    level: 7,
    make() {
      const factor = pick([2, 3]);
      return {
        values: build(randInt(2, 12), (previous, i) => (i % 2 === 1 ? previous + i ** 2 : previous * factor)),
        rule: `Abwechselnd wird eine Quadratzahl addiert (1², 3², 5², …) und mit ${factor} multipliziert.`,
      };
    },
  },
];

/**
 * Erkennt Folgen, die trotz komplizierter Bildungsvorschrift auf eine triviale
 * Reihe hinauslaufen – etwa wenn zufällige Startwerte eine "schwere" Regel in
 * eine konstante Differenz kippen lassen.
 */
function isTrivial(values) {
  const diffs = values.slice(1).map((value, i) => value - values[i]);
  if (diffs.every((d) => d === diffs[0])) return true;
  if (values[0] === 0) return false;
  const ratio = values[1] / values[0];
  return values.every((value, i) => i === 0 || (values[i - 1] !== 0 && value / values[i - 1] === ratio));
}

/** Plausibilitätsprüfung: ganzzahlig, nicht zu groß, nicht trivial. */
function isUsable(values, level) {
  if (values.length !== SERIES_LENGTH) return false;
  if (!values.every((v) => Number.isInteger(v) && Math.abs(v) <= MAX_ABS)) return false;
  if (new Set(values.slice(0, VISIBLE_LENGTH)).size <= 2) return false;
  // Ab Stufe 3 darf die Folge nicht auf eine konstante Differenz oder einen
  // konstanten Faktor hinauslaufen – das wären Stufe-1-/Stufe-2-Aufgaben.
  if (level >= 3 && isTrivial(values)) return false;
  return true;
}

const generatorsForLevel = (level) => GENERATORS.filter((generator) => generator.level === level);

function toTask(generator) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const { values, rule } = generator.make();
    if (!isUsable(values, generator.level)) continue;
    return {
      type: 'numberSeries',
      generatorId: generator.id,
      level: generator.level,
      levelLabel: LEVELS[generator.level - 1].label,
      family: generator.family,
      familyLabel: FAMILIES[generator.family],
      visible: values.slice(0, VISIBLE_LENGTH),
      solution: values.slice(VISIBLE_LENGTH),
      full: values,
      rule,
    };
  }
  return null;
}

/**
 * Erzeugt eine Aufgabe.
 * @param {{level?, difficulty?, excludeFamily?, onlyFamilies?: string[]}} options
 */
export function generateNumberSeriesTask(options = {}) {
  const level = options.level ?? pick(DIFFICULTY_LEVELS[options.difficulty] ?? DIFFICULTY_LEVELS.medat);
  let candidates = generatorsForLevel(level);
  // Gezieltes Training: nur die angegebenen Regelfamilien, notfalls über alle
  // Stufen hinweg (eine Familie kommt nicht auf jeder Stufe vor).
  if (options.onlyFamilies?.length) {
    const wanted = new Set(options.onlyFamilies);
    const onLevel = candidates.filter((generator) => wanted.has(generator.family));
    candidates = onLevel.length > 0 ? onLevel : GENERATORS.filter((generator) => wanted.has(generator.family));
  }
  // Möglichst nicht zweimal hintereinander dieselbe Regelfamilie
  if (options.excludeFamily) {
    const filtered = candidates.filter((generator) => generator.family !== options.excludeFamily);
    if (filtered.length > 0) candidates = filtered;
  }
  for (const generator of shuffle(candidates)) {
    const task = toTask(generator);
    if (task) return task;
  }
  // Rückfallebene: irgendeine Aufgabe derselben Stufe, sonst Stufe 1
  for (const generator of shuffle(generatorsForLevel(level).concat(generatorsForLevel(1)))) {
    const task = toTask(generator);
    if (task) return task;
  }
  return toTask(GENERATORS[0]);
}

/**
 * Aufgabensatz für einen kompletten Durchgang.
 *
 * Achtet auf zwei Dinge: keine doppelte Folge und eine echte Durchmischung der
 * Regelfamilien – sonst kämen leicht fünf Fibonacci-Aufgaben hintereinander.
 */
export function generateNumberSeriesSet(count, difficulty = 'medat', options = {}) {
  const seen = new Set();
  const tasks = [];
  let lastFamily = null;
  let guard = 0;
  // Beim gezielten Training auf eine einzige Familie darf sie sich wiederholen.
  const allowRepeat = (options.onlyFamilies?.length ?? 0) === 1;
  while (tasks.length < count && guard < count * 40) {
    guard += 1;
    const task = generateNumberSeriesTask({
      difficulty,
      excludeFamily: allowRepeat ? null : lastFamily,
      onlyFamilies: options.onlyFamilies,
    });
    const key = task.full.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    lastFamily = task.family;
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
