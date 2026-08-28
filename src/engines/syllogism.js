/**
 * Engine für den Untertest "Implikationen erkennen".
 *
 * Grundlage ist die aristotelische Syllogistik mit den vier Aussageformen
 * (Quantoren) A, E, I, O und den vier Figuren. Statt einer fehleranfälligen
 * Tabelle gültiger Modi wird die Gültigkeit semantisch bestimmt:
 *
 *   Das Venn-Diagramm dreier Mengen (S, M, P) hat 7 Regionen. Ein "Modell" legt
 *   für jede Region fest, ob sie leer oder besetzt ist – also 2^7 = 128 Modelle.
 *   Eine Schlussfolgerung ist genau dann gültig, wenn sie in ALLEN Modellen wahr
 *   ist, die beide Prämissen erfüllen.
 *
 * Es wird die traditionelle Logik MIT existenzieller Voraussetzung verwendet
 * (jeder der drei Begriffe hat mindestens ein Element) – das entspricht der im
 * MedAT erwarteten Lesart, in der aus "Alle A sind B" auch "Einige A sind B"
 * folgt.
 *
 * Nebenprodukt der Modellprüfung ist der Status jeder Venn-Region
 * (leer / besetzt / unbestimmt), aus dem die Erklärungsgrafik gezeichnet wird.
 */
import { chance, pick, sample, shuffle } from '../lib/random.js';
import { TERM_TRIPLES } from '../data/syllogismTerms.js';

/** Die vier Aussageformen. */
export const QUANTIFIERS = {
  A: { code: 'A', label: 'universell bejahend', phrase: (x, y) => `Alle ${x} sind ${y}.` },
  E: { code: 'E', label: 'universell verneinend', phrase: (x, y) => `Alle ${x} sind keine ${y}.` },
  I: { code: 'I', label: 'partikulär bejahend', phrase: (x, y) => `Einige ${x} sind ${y}.` },
  O: { code: 'O', label: 'partikulär verneinend', phrase: (x, y) => `Einige ${x} sind keine ${y}.` },
};

export const QUANTIFIER_CODES = ['A', 'E', 'I', 'O'];

/**
 * Die 7 Venn-Regionen. Reihenfolge ist Teil der API: die Venn-Grafik
 * (components/VennDiagram.jsx) verlässt sich auf denselben Index.
 */
export const REGIONS = [
  { key: 'S', members: { S: true, M: false, P: false } },
  { key: 'M', members: { S: false, M: true, P: false } },
  { key: 'P', members: { S: false, M: false, P: true } },
  { key: 'SM', members: { S: true, M: true, P: false } },
  { key: 'SP', members: { S: true, M: false, P: true } },
  { key: 'MP', members: { S: false, M: true, P: true } },
  { key: 'SMP', members: { S: true, M: true, P: true } },
];

const REGION_COUNT = REGIONS.length;
const ALL_MODELS = Array.from({ length: 1 << REGION_COUNT }, (_, mask) => mask);

/** Bitmaske aller Regionen, die zu einem Begriff gehören. */
const TERM_MASK = { S: 0, M: 0, P: 0 };
REGIONS.forEach((region, index) => {
  for (const term of ['S', 'M', 'P']) {
    if (region.members[term]) TERM_MASK[term] |= 1 << index;
  }
});

/** Regionen in X, aber nicht in Y. */
function differenceMask(x, y) {
  return TERM_MASK[x] & ~TERM_MASK[y];
}

/** Regionen in X und Y. */
function intersectionMask(x, y) {
  return TERM_MASK[x] & TERM_MASK[y];
}

/**
 * Prüft, ob eine Aussage in einem Modell wahr ist.
 * @param {{quantifier: string, subject: string, predicate: string}} statement
 * @param {number} model Bitmaske der besetzten Regionen
 */
export function holdsInModel(statement, model) {
  const { quantifier, subject, predicate } = statement;
  const diff = differenceMask(subject, predicate) & model;
  const inter = intersectionMask(subject, predicate) & model;
  switch (quantifier) {
    case 'A':
      return diff === 0;
    case 'E':
      return inter === 0;
    case 'I':
      return inter !== 0;
    case 'O':
      return diff !== 0;
    default:
      throw new Error(`Unbekannter Quantor: ${quantifier}`);
  }
}

/** Existenzielle Voraussetzung: S, M und P sind nicht leer. */
function hasExistentialImport(model) {
  return (model & TERM_MASK.S) !== 0 && (model & TERM_MASK.M) !== 0 && (model & TERM_MASK.P) !== 0;
}

/** Alle Modelle, die beide Prämissen (und die Existenzvoraussetzung) erfüllen. */
export function modelsSatisfying(premises) {
  return ALL_MODELS.filter(
    (model) => hasExistentialImport(model) && premises.every((p) => holdsInModel(p, model)),
  );
}

/** Ist die Schlussfolgerung aus den Prämissen zwingend? */
export function isValidConclusion(premises, conclusion, models = modelsSatisfying(premises)) {
  if (models.length === 0) return false; // widersprüchliche Prämissen
  return models.every((model) => holdsInModel(conclusion, model));
}

/**
 * Status jeder Venn-Region über alle zulässigen Modelle hinweg.
 * @returns {Array<'empty'|'occupied'|'unknown'>}
 */
export function regionStatus(models) {
  return REGIONS.map((_, index) => {
    const bit = 1 << index;
    const everOccupied = models.some((model) => (model & bit) !== 0);
    const alwaysOccupied = models.every((model) => (model & bit) !== 0);
    if (!everOccupied) return 'empty';
    if (alwaysOccupied) return 'occupied';
    return 'unknown';
  });
}

/** Belegung der Prämissen je Figur: [Prämisse 1, Prämisse 2] als [Subjekt, Prädikat]. */
export const FIGURES = {
  1: { id: 1, premise1: ['M', 'P'], premise2: ['S', 'M'] },
  2: { id: 2, premise1: ['P', 'M'], premise2: ['S', 'M'] },
  3: { id: 3, premise1: ['M', 'P'], premise2: ['M', 'S'] },
  4: { id: 4, premise1: ['P', 'M'], premise2: ['M', 'S'] },
};

/** Welche Figuren und Quantoren je Schwierigkeitsstufe verwendet werden. */
const DIFFICULTY_PROFILE = {
  leicht: { figures: [1], quantifiers: ['A', 'E', 'I'], noneRate: 0.12 },
  mittel: { figures: [1, 2], quantifiers: ['A', 'E', 'I', 'O'], noneRate: 0.15 },
  schwer: { figures: [1, 2, 3, 4], quantifiers: ['A', 'E', 'I', 'O'], noneRate: 0.2 },
  medat: { figures: [1, 2, 3, 4], quantifiers: ['A', 'E', 'I', 'O'], noneRate: 0.18 },
};

function profileFor(difficulty) {
  if (difficulty === 'gemischt') return DIFFICULTY_PROFILE[pick(['leicht', 'mittel', 'schwer', 'medat'])];
  return DIFFICULTY_PROFILE[difficulty] ?? DIFFICULTY_PROFILE.medat;
}

/** Text einer Aussage mit konkreten Begriffen. */
function phraseOf(statement, terms) {
  return QUANTIFIERS[statement.quantifier].phrase(terms[statement.subject], terms[statement.predicate]);
}

/** Alle 8 Kandidaten für die Schlussfolgerung: S–P und P–S in allen vier Formen. */
function conclusionCandidates() {
  const candidates = [];
  for (const [subject, predicate] of [['S', 'P'], ['P', 'S']]) {
    for (const quantifier of QUANTIFIER_CODES) {
      candidates.push({ quantifier, subject, predicate });
    }
  }
  return candidates;
}

/** Stärkere Aussagen zuerst – so wird bei Subalternation die "beste" Lösung gewählt. */
const STRENGTH = { A: 0, E: 1, I: 2, O: 3 };

/**
 * Erzeugt eine einzelne Aufgabe.
 * @param {{difficulty?, forceNone?, usedTriples?, onlyFigures?: number[]}} options
 */
export function generateSyllogismTask(options = {}) {
  const { difficulty = 'medat', usedTriples } = options;
  const baseProfile = profileFor(difficulty);
  // Gezieltes Training: nur die angegebenen Figuren
  const profile = options.onlyFigures?.length
    ? { ...baseProfile, figures: options.onlyFigures }
    : baseProfile;
  const wantNone = options.forceNone ?? chance(profile.noneRate);

  for (let attempt = 0; attempt < 400; attempt += 1) {
    // Begriffe wählen (möglichst ohne Wiederholung innerhalb eines Durchgangs)
    let tripleIndex = Math.floor(Math.random() * TERM_TRIPLES.length);
    if (usedTriples && usedTriples.size < TERM_TRIPLES.length) {
      let guard = 0;
      while (usedTriples.has(tripleIndex) && guard < 50) {
        tripleIndex = Math.floor(Math.random() * TERM_TRIPLES.length);
        guard += 1;
      }
    }
    const [a, b, c] = shuffle(TERM_TRIPLES[tripleIndex]);
    const terms = { S: a, M: b, P: c };

    const figure = FIGURES[pick(profile.figures)];
    const premises = [
      { quantifier: pick(profile.quantifiers), subject: figure.premise1[0], predicate: figure.premise1[1] },
      { quantifier: pick(profile.quantifiers), subject: figure.premise2[0], predicate: figure.premise2[1] },
    ];

    const models = modelsSatisfying(premises);
    if (models.length === 0) continue; // widersprüchliche Prämissen -> unbrauchbar

    const candidates = conclusionCandidates().map((candidate) => ({
      ...candidate,
      valid: isValidConclusion(premises, candidate, models),
    }));
    const valid = candidates.filter((candidate) => candidate.valid);
    const invalid = candidates.filter((candidate) => !candidate.valid);

    if (wantNone && valid.length > 0) continue;
    if (!wantNone && valid.length === 0) continue;
    if (invalid.length < (wantNone ? 4 : 3)) continue;

    // Antwortoptionen zusammenstellen
    let correctStatement = null;
    let statements;
    if (wantNone) {
      // Distraktoren: bevorzugt Aussagen über S–P, damit die Aufgabe natürlich wirkt
      const preferred = invalid.filter((s) => s.subject === 'S');
      const rest = invalid.filter((s) => s.subject !== 'S');
      statements = [...sample(preferred, 4), ...sample(rest, 4)].slice(0, 4);
    } else {
      const spValid = valid.filter((s) => s.subject === 'S');
      const pool = spValid.length > 0 ? spValid : valid;
      correctStatement = [...pool].sort((x, y) => STRENGTH[x.quantifier] - STRENGTH[y.quantifier])[0];
      const preferred = invalid.filter((s) => s.subject === 'S');
      const rest = invalid.filter((s) => s.subject !== 'S');
      const distractors = [...sample(preferred, 3), ...sample(rest, 3)].slice(0, 3);
      statements = [correctStatement, ...distractors];
    }
    if (statements.length < 4) continue;

    const shuffled = shuffle(statements);
    const letters = ['a', 'b', 'c', 'd'];
    const answerOptions = shuffled.map((statement, index) => ({
      letter: letters[index],
      text: phraseOf(statement, terms),
      statement,
      correct: !wantNone && statement === correctStatement,
    }));
    answerOptions.push({
      letter: 'e',
      text: 'Keine der Schlussfolgerungen ist richtig.',
      statement: null,
      correct: wantNone,
    });

    if (usedTriples) usedTriples.add(tripleIndex);

    return {
      type: 'implications',
      terms,
      figure: figure.id,
      mood: premises.map((p) => p.quantifier).join(''),
      premises: premises.map((p) => ({ ...p, text: phraseOf(p, terms) })),
      options: answerOptions,
      correctLetter: answerOptions.find((option) => option.correct).letter,
      /** Für die Erklärung: Status der Venn-Regionen und alle gültigen Schlüsse. */
      regionStatus: regionStatus(models),
      validConclusions: valid.map((statement) => phraseOf(statement, terms)),
      explanation: buildExplanation({ wantNone, correctStatement, terms, premises, valid }),
    };
  }
  return null;
}

function buildExplanation({ wantNone, correctStatement, terms, premises, valid }) {
  const premiseText = premises.map((p) => phraseOf(p, terms)).join(' ');
  if (wantNone) {
    return `Aus "${premiseText}" folgt zwingend keine der vier Aussagen über ${terms.S} und ${terms.P}. `
      + 'Es lassen sich jeweils Situationen denken, in denen die Prämissen zutreffen, die Schlussfolgerung aber falsch ist.';
  }
  const others = valid
    .map((statement) => phraseOf(statement, terms))
    .filter((text) => text !== phraseOf(correctStatement, terms));
  const extra = others.length > 0 ? ` Ebenfalls zwingend: ${others.join(' ')}` : '';
  return `Aus "${premiseText}" folgt in jedem denkbaren Fall: ${phraseOf(correctStatement, terms)}${extra}`;
}

/** Erzeugt einen kompletten Aufgabensatz ohne Wiederholung der Begriffstripel. */
export function generateSyllogismSet(count, difficulty = 'medat', options = {}) {
  const usedTriples = new Set();
  const tasks = [];
  let noneCount = 0;
  for (let i = 0; i < count; i += 1) {
    // Ziel: 15–20 % "Keine der Schlussfolgerungen ist richtig"
    const remaining = count - i;
    const targetNone = Math.max(1, Math.round(count * 0.18));
    const forceNone = noneCount < targetNone && remaining <= targetNone - noneCount ? true : undefined;
    const task = generateSyllogismTask({ difficulty, usedTriples, forceNone, onlyFigures: options.onlyFigures });
    if (!task) continue;
    if (task.correctLetter === 'e') noneCount += 1;
    tasks.push({ ...task, index: tasks.length });
  }
  return tasks;
}
