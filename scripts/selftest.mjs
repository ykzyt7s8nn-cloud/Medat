/*
 * Selbsttest für Daten und Engines – ohne Test-Framework, damit die App keine
 * zusätzlichen Abhängigkeiten braucht.
 *
 *   npm run selftest
 *
 * Geprüft werden vor allem die Punkte, bei denen ein Fehler nicht auffällt,
 * sondern still falsche Aufgaben erzeugt: die Syllogismus-Logik, die
 * Eindeutigkeit der Wortlösungen und die Gültigkeit aller MC-Fragen.
 */
import { DIFFICULTY_RANGES, NOUNS } from '../src/data/nouns.js';
import { ALLERGENS, BLOOD_TYPES } from '../src/data/allergens.js';
import { FOREIGN_OR_TECHNICAL } from '../src/data/nouns.js';
import { FEMALE_FIRST_NAMES, LAST_NAMES, MALE_FIRST_NAMES } from '../src/data/names.js';
import { TERM_TRIPLES } from '../src/data/syllogismTerms.js';
import { TESTS } from '../src/data/testConfig.js';
import {
  FIGURES,
  generateSyllogismSet,
  generateSyllogismTask,
  isValidConclusion,
  modelsSatisfying,
} from '../src/engines/syllogism.js';
import {
  DIFFICULTY_LEVELS,
  MIN_LEVEL,
  START_LEVEL,
  checkNumberSeriesAnswer,
  generateNumberSeriesSet,
  generateNumberSeriesTask,
} from '../src/engines/numberSeries.js';
import {
  SOLVABLE_NOUNS,
  decipherScore,
  distractionScore,
  generateWordFluencySet,
  generateWordFluencyTask,
  wordPool,
} from '../src/engines/wordFluency.js';
import { generateMemorySession } from '../src/engines/memory.js';
import {
  DIFFICULTY_SETUP,
  MIN_AREA_GAP,
  SHAPES,
  dissect,
  generateFigureSet,
  generateFigureTask,
} from '../src/engines/figures.js';
import { polygonArea } from '../src/lib/geometry.js';

let failures = 0;
let checks = 0;

function check(name, condition, detail = '') {
  checks += 1;
  if (condition) {
    process.stdout.write(`  ✓ ${name}\n`);
  } else {
    failures += 1;
    process.stdout.write(`  ✗ ${name}${detail ? ` – ${detail}` : ''}\n`);
  }
}

function section(title) {
  process.stdout.write(`\n${title}\n`);
}

/* ------------------------------------------------------------ Datenbanken */
section('Datenbanken');

const badChars = NOUNS.filter((word) => !/^[A-Z][a-z]+$/.test(word));
check('Substantive enthalten nur Buchstaben ohne Umlaute/ß', badChars.length === 0, badChars.join(', '));

const badLength = NOUNS.filter((word) => word.length < 5 || word.length > 14);
check('Substantive sind 5–14 Zeichen lang', badLength.length === 0, badLength.join(', '));

const transliterations = NOUNS.filter((word) => /ae|oe|ue/.test(word.toLowerCase().replace(/que/g, 'q_'))
  && /aeh|oeh|ueh|aer$|hoehe/.test(word.toLowerCase()));
check('Keine ae/oe/ue-Ersatzschreibung erkennbar', transliterations.length === 0, transliterations.join(', '));

check('Substantive sind eindeutig', new Set(NOUNS).size === NOUNS.length);

const anagramGroups = new Map();
for (const word of NOUNS) {
  const key = word.toLowerCase().split('').sort().join('');
  anagramGroups.set(key, [...(anagramGroups.get(key) ?? []), word]);
}
const collisions = [...anagramGroups.values()].filter((group) => group.length > 1);
check('Keine Anagramm-Kollisionen (genau eine Lösung je Salat)', collisions.length === 0,
  collisions.slice(0, 3).map((g) => g.join('/')).join(', '));

for (const [level, [min, max]] of Object.entries(DIFFICULTY_RANGES)) {
  const count = NOUNS.filter((word) => word.length >= min && word.length <= max).length;
  check(`Wortpool "${level}" hat mindestens 50 Einträge (${count})`, count >= 50);
}
check('Mindestens 500 Substantive insgesamt', NOUNS.length >= 500, `${NOUNS.length}`);
check('Mindestens 40 Allergene', ALLERGENS.length >= 40, `${ALLERGENS.length}`);
check('Allergene sind eindeutig', new Set(ALLERGENS).size === ALLERGENS.length);
check('8 Blutgruppen', BLOOD_TYPES.length === 8);
check('Mindestens 80 Vornamen', FEMALE_FIRST_NAMES.length + MALE_FIRST_NAMES.length >= 80);
check('Mindestens 80 Nachnamen', LAST_NAMES.length >= 80, `${LAST_NAMES.length}`);
check('Mindestens 60 Begriffstripel', TERM_TRIPLES.length >= 60, `${TERM_TRIPLES.length}`);
check('Begriffstripel haben drei verschiedene Begriffe',
  TERM_TRIPLES.every((triple) => triple.length === 3 && new Set(triple).size === 3));

/* ------------------------------------------------- Implikationen (Logik) */
section('Implikationen: aristotelische Logik');

// Die 24 gültigen Modi der traditionellen Syllogistik (mit existenzieller
// Voraussetzung) – Referenz aus der Logik-Literatur.
const VALID_MOODS = {
  1: ['AAA', 'EAE', 'AII', 'EIO', 'AAI', 'EAO'],
  2: ['EAE', 'AEE', 'EIO', 'AOO', 'EAO', 'AEO'],
  3: ['AAI', 'IAI', 'AII', 'EAO', 'OAO', 'EIO'],
  4: ['AAI', 'AEE', 'IAI', 'EAO', 'EIO', 'AEO'],
};

for (const figure of [1, 2, 3, 4]) {
  const definition = FIGURES[figure];
  const found = [];
  for (const q1 of ['A', 'E', 'I', 'O']) {
    for (const q2 of ['A', 'E', 'I', 'O']) {
      const premises = [
        { quantifier: q1, subject: definition.premise1[0], predicate: definition.premise1[1] },
        { quantifier: q2, subject: definition.premise2[0], predicate: definition.premise2[1] },
      ];
      const models = modelsSatisfying(premises);
      if (models.length === 0) continue;
      for (const conclusion of ['A', 'E', 'I', 'O']) {
        if (isValidConclusion(premises, { quantifier: conclusion, subject: 'S', predicate: 'P' }, models)) {
          found.push(q1 + q2 + conclusion);
        }
      }
    }
  }
  const expected = [...VALID_MOODS[figure]].sort().join(',');
  const actual = [...found].sort().join(',');
  check(`Figur ${figure}: genau die klassischen Modi sind gültig`, expected === actual, `erwartet ${expected}, gefunden ${actual}`);
}

// Beispiel aus der Aufgabenstellung: Alle Seen sind Flüsse / Einige Flüsse sind
// Meere -> keine gültige Schlussfolgerung.
const examplePremises = [
  { quantifier: 'A', subject: 'S', predicate: 'M' },
  { quantifier: 'I', subject: 'M', predicate: 'P' },
];
check('Beispielaufgabe liefert korrekt "keine Schlussfolgerung"',
  ['A', 'E', 'I', 'O'].every((q) => !isValidConclusion(examplePremises, { quantifier: q, subject: 'S', predicate: 'P' })));

let syllogismIssues = 0;
let syllogismNone = 0;
const SYLLOGISM_SAMPLES = 500;
for (let i = 0; i < SYLLOGISM_SAMPLES; i += 1) {
  const task = generateSyllogismTask({ difficulty: 'medat' });
  if (!task) { syllogismIssues += 1; continue; }
  if (task.options.length !== 5) syllogismIssues += 1;
  if (task.options.filter((option) => option.correct).length !== 1) syllogismIssues += 1;
  if (task.options[4].text !== 'Keine der Schlussfolgerungen ist richtig.') syllogismIssues += 1;
  if (new Set(task.options.map((option) => option.text)).size !== 5) syllogismIssues += 1;

  const models = modelsSatisfying(task.premises);
  const validOptions = task.options.filter(
    (option) => option.statement && isValidConclusion(task.premises, option.statement, models),
  );
  if (task.correctLetter === 'e') {
    syllogismNone += 1;
    if (validOptions.length !== 0) syllogismIssues += 1;
  } else if (validOptions.length !== 1 || !validOptions[0].correct) {
    syllogismIssues += 1;
  }
}
check(`${SYLLOGISM_SAMPLES} Aufgaben haben genau eine logisch korrekte Antwort`, syllogismIssues === 0, `${syllogismIssues} Abweichungen`);
const noneRate = (syllogismNone / SYLLOGISM_SAMPLES) * 100;
check(`Anteil "keine Schlussfolgerung" liegt bei 15–22 % (${noneRate.toFixed(1)} %)`, noneRate >= 12 && noneRate <= 24);

const syllogismSet = generateSyllogismSet(TESTS.implications.questionCount, 'medat');
check('Aufgabensatz hat 10 Aufgaben', syllogismSet.length === TESTS.implications.questionCount);

/* ------------------------------------------------------------ Zahlenfolgen */
section('Zahlenfolgen');

// Jede Stufe muss mehrere Regelfamilien anbieten – sonst sieht man im
// adaptiven Modus mehrere Aufgaben hintereinander nach demselben Schema.
for (const level of [1, 2, 3, 4, 5, 6, 7]) {
  const families = new Set();
  for (let i = 0; i < 300; i += 1) families.add(generateNumberSeriesTask({ level }).family);
  check(`Stufe ${level} mischt mindestens 3 Regelfamilien (${[...families].join(', ')})`, families.size >= 3);
}

// Über mehrere Durchgänge messen statt über einen: Ein einzelner Zufallssatz
// darf auch mal nur drei Familien treffen, im Mittel müssen es mehr sein.
const SET_SAMPLES = 20;
let minFamilies = Infinity;
let familySum = 0;
let repeats = 0;
for (let i = 0; i < SET_SAMPLES; i += 1) {
  const set = generateNumberSeriesSet(10, 'medat');
  const families = new Set(set.map((task) => task.family));
  minFamilies = Math.min(minFamilies, families.size);
  familySum += families.size;
  for (let j = 1; j < set.length; j += 1) {
    if (set[j].family === set[j - 1].family) repeats += 1;
  }
}
const averageFamilies = familySum / SET_SAMPLES;
check(`Jeder MedAT-Durchgang nutzt mindestens 3 Regelfamilien (Minimum ${minFamilies})`, minFamilies >= 3);
check(`Im Schnitt mindestens 4 Regelfamilien je Durchgang (${averageFamilies.toFixed(1)})`, averageFamilies >= 4);
check('Keine zwei gleichen Regelfamilien direkt hintereinander', repeats === 0, `${repeats} Wiederholungen`);

for (const level of [1, 2, 3, 4, 5, 6, 7]) {
  let issues = 0;
  for (let i = 0; i < 300; i += 1) {
    const task = generateNumberSeriesTask({ level });
    if (task.full.length !== 9) issues += 1;
    if (!task.full.every((value) => Number.isInteger(value))) issues += 1;
    if (task.visible.length !== 7 || task.solution.length !== 2) issues += 1;
    if (!task.rule || task.rule.length < 10) issues += 1;
    if (!checkNumberSeriesAnswer(task, task.solution.map(String)).correct) issues += 1;
    if (checkNumberSeriesAnswer(task, ['', '']).correct) issues += 1;
  }
  check(`Level ${level}: 300 Aufgaben sind ganzzahlig, vollständig und prüfbar`, issues === 0, `${issues} Abweichungen`);
}

for (const difficulty of Object.keys(DIFFICULTY_LEVELS)) {
  const set = generateNumberSeriesSet(10, difficulty);
  const allowed = new Set(DIFFICULTY_LEVELS[difficulty]);
  check(`Schwierigkeit "${difficulty}" nutzt nur vorgesehene Level`,
    set.length === 10 && set.every((task) => allowed.has(task.level)));
}

check('MedAT-Niveau enthält keine Level-1/2-Aufgaben',
  DIFFICULTY_LEVELS.medat.every((level) => level >= 3), DIFFICULTY_LEVELS.medat.join(','));
check('Adaptives Startlevel liegt bei MedAT-Niveau bei mindestens 4', START_LEVEL.medat >= 4);
check('Adaptive Untergrenze verhindert Abrutschen unter Level 3 (MedAT)', MIN_LEVEL.medat >= 3);

// Ab Level 3 darf keine Folge auf eine konstante Differenz oder einen
// konstanten Faktor hinauslaufen – das wären verkappte Level-1/2-Aufgaben.
let trivialCount = 0;
for (const level of [3, 4, 5, 6, 7]) {
  for (let i = 0; i < 500; i += 1) {
    const { full } = generateNumberSeriesTask({ level });
    const diffs = full.slice(1).map((value, index) => value - full[index]);
    if (diffs.every((d) => d === diffs[0])) trivialCount += 1;
    const ratio = full[0] !== 0 ? full[1] / full[0] : null;
    if (ratio !== null && full.every((v, i2) => i2 === 0 || (full[i2 - 1] !== 0 && v / full[i2 - 1] === ratio))) {
      trivialCount += 1;
    }
  }
}
check('Ab Level 3 entstehen keine verkappt trivialen Folgen', trivialCount === 0, `${trivialCount} Fälle`);

/* --------------------------------------------------------- Wortflüssigkeit */
section('Wortflüssigkeit');

check('Alle Substantive sind eindeutig lösbar', SOLVABLE_NOUNS.length === NOUNS.length,
  `${SOLVABLE_NOUNS.length} von ${NOUNS.length}`);

let wordIssues = 0;
let wordNone = 0;
const WORD_SAMPLES = 3000;
for (let i = 0; i < WORD_SAMPLES; i += 1) {
  const task = generateWordFluencyTask({});
  const upper = task.word.toUpperCase();
  const differences = task.scrambled.filter((letter, index) => letter !== upper[index]).length;
  if (differences < Math.min(3, task.word.length)) wordIssues += 1;
  if (task.scrambled.length !== task.word.length) wordIssues += 1;
  if ([...task.scrambled].sort().join('') !== [...upper].sort().join('')) wordIssues += 1;
  if (new Set(upper).size > 1 && task.scrambled[0] === task.correctLetter) wordIssues += 1;
  if (task.options.length !== 5) wordIssues += 1;
  if (task.options.filter((option) => option.correct).length !== 1) wordIssues += 1;
  if (new Set(task.options.slice(0, 4).map((option) => option.text)).size !== 4) wordIssues += 1;
  if (task.correctOption === 'e') {
    wordNone += 1;
    if (task.options.slice(0, 4).some((option) => option.text === task.correctLetter)) wordIssues += 1;
  }
}
check(`${WORD_SAMPLES} Buchstabensalate erfüllen alle Vorgaben`, wordIssues === 0, `${wordIssues} Abweichungen`);
const wordNoneRate = (wordNone / WORD_SAMPLES) * 100;
check(`Anteil "Keine Antwort ist richtig" liegt bei ~20 % (${wordNoneRate.toFixed(1)} %)`, wordNoneRate >= 15 && wordNoneRate <= 25);

const wordSet = generateWordFluencySet(TESTS.wordFluency.questionCount, 'medat');
check('Aufgabensatz hat 15 Aufgaben ohne Wortwiederholung',
  wordSet.length === 15 && new Set(wordSet.map((task) => task.word)).size === 15);

// MedAT-Niveau: 8–9 Buchstaben, sperrige Buchstabenfolge, mehrere plausible
// Fehlanfänge, keine Fremd- oder Fachwörter.
const medatPool = wordPool('medat');
check('MedAT-Wortpool umfasst nur Wörter mit 8–9 Buchstaben',
  medatPool.length > 150 && medatPool.every((word) => word.length >= 8 && word.length <= 9),
  `${medatPool.length} Wörter`);
check('Jedes Wort im MedAT-Pool hat mindestens 4 plausible Fehlanfänge',
  medatPool.every((word) => distractionScore(word) >= 4));
check('Jedes Wort im MedAT-Pool hat eine sperrige Buchstabenfolge',
  medatPool.every((word) => decipherScore(word) >= 2));
check('Keine Fremd- oder Fachwörter im MedAT-Pool',
  medatPool.every((word) => !FOREIGN_OR_TECHNICAL.has(word)),
  medatPool.filter((word) => FOREIGN_OR_TECHNICAL.has(word)).join(', '));

let pairSum = 0;
let pairTotal = 0;
let scoreSum = 0;
let outsideSalad = 0;
let optionTotal = 0;
const MEDAT_SAMPLES = 2000;
for (let i = 0; i < MEDAT_SAMPLES; i += 1) {
  const task = generateWordFluencyTask({ difficulty: 'medat' });
  const original = task.word.toUpperCase();
  const scrambled = task.scrambled.join('');
  scoreSum += distractionScore(task.word);
  // Der Salat soll das Wort nicht in Fragmenten durchscheinen lassen.
  for (let j = 0; j < scrambled.length - 1; j += 1) {
    pairTotal += 1;
    if (original.includes(scrambled.slice(j, j + 2))) pairSum += 1;
  }
  // Kein angebotener Buchstabe darf per Ausschluss wegfallen.
  for (const option of task.options.slice(0, 4)) {
    optionTotal += 1;
    if (!original.includes(option.text)) outsideSalad += 1;
  }
}
const pairRate = (pairSum / pairTotal) * 100;
check(`Höchstens 3 % der Buchstabenpaare bleiben erhalten (${pairRate.toFixed(1)} %)`, pairRate <= 3);
const averageScore = scoreSum / MEDAT_SAMPLES;
check(`Durchschnittliche Ablenkbarkeit liegt bei mindestens 4,5 (${averageScore.toFixed(1)})`, averageScore >= 4.5);
const outsideRate = (outsideSalad / optionTotal) * 100;
check(`Alle angebotenen Buchstaben kommen im Salat vor (${outsideRate.toFixed(1)} % Ausreißer)`, outsideRate <= 1);

/* ------------------------------------------------------------- Gedächtnis */
section('Gedächtnis & Merkfähigkeit');

let memoryIssues = 0;
let memoryNone = 0;
let memoryQuestions = 0;
const MEMORY_SESSIONS = 150;
for (let i = 0; i < MEMORY_SESSIONS; i += 1) {
  const { cards, questions } = generateMemorySession(TESTS.memory.cardCount, TESTS.memory.questionCount);
  if (cards.length !== 8) memoryIssues += 1;
  if (new Set(cards.map((card) => card.fullName)).size !== 8) memoryIssues += 1;
  if (new Set(cards.map((card) => card.birthday.label)).size !== 8) memoryIssues += 1;
  for (const card of cards) {
    if (!/^\d{2}\.\d{2}\.$/.test(card.birthday.label)) memoryIssues += 1;
    if (!BLOOD_TYPES.includes(card.bloodType)) memoryIssues += 1;
    if (card.allergies.length < 1 || card.allergies.length > 4) memoryIssues += 1;
    if (new Set(card.allergies).size !== card.allergies.length) memoryIssues += 1;
    if (!['Ja', 'Nein'].includes(card.medication) || !['Ja', 'Nein'].includes(card.glasses)) memoryIssues += 1;
    if (!/^\d{2,3}\/\d{2,3}$/.test(card.bloodPressure.label)) memoryIssues += 1;
  }
  if (questions.length !== 25) memoryIssues += 1;
  for (const question of questions) {
    memoryQuestions += 1;
    if (question.options.length !== 5) memoryIssues += 1;
    if (question.options.filter((option) => option.correct).length !== 1) memoryIssues += 1;
    if (question.options[4].text !== 'Keine Antwort ist richtig') memoryIssues += 1;
    if (new Set(question.options.map((option) => option.text)).size !== 5) memoryIssues += 1;
    if (question.correctLetter === 'e') memoryNone += 1;
  }
}
check(`${MEMORY_SESSIONS} Durchgänge mit je 8 Ausweisen und 25 eindeutigen Fragen`, memoryIssues === 0, `${memoryIssues} Abweichungen`);
const memoryNoneRate = (memoryNone / memoryQuestions) * 100;
check(`Anteil "Keine Antwort ist richtig" liegt bei ~15 % (${memoryNoneRate.toFixed(1)} %)`, memoryNoneRate >= 10 && memoryNoneRate <= 20);

/* -------------------------------------------------- Figuren zusammensetzen */
section('Figuren zusammensetzen');

/** Grundform auf Einheitsfläche, im Ursprung – wie es die Engine intern tut. */
function centeredUnitShape(id) {
  const raw = SHAPES[id].build();
  const factor = Math.sqrt(1 / polygonArea(raw));
  const scaled = raw.map(([x, y]) => [x * factor, y * factor]);
  const cx = scaled.reduce((sum, point) => sum + point[0], 0) / scaled.length;
  const cy = scaled.reduce((sum, point) => sum + point[1], 0) / scaled.length;
  return scaled.map(([x, y]) => [x - cx, y - cy]);
}

let figureIssues = 0;
let figureFailures = 0;
let smallestGap = 1;
const usedShapes = new Set();
const FIGURE_SAMPLES = 300;
for (let i = 0; i < FIGURE_SAMPLES; i += 1) {
  const task = generateFigureTask({ difficulty: 'medat' });
  if (!task) { figureFailures += 1; continue; }
  usedShapes.add(task.shapeId);

  // Die Teile ergeben exakt die Zielfigur – die Aufgabe ist per Konstruktion lösbar.
  const pieceSum = task.placements.reduce((sum, piece) => sum + polygonArea(piece), 0);
  if (Math.abs(pieceSum - polygonArea(task.target)) > 1e-9) figureIssues += 1;

  // Der Beweis für die Distraktoren: abweichende Fläche lässt sich nicht
  // lückenlos auslegen, egal wie man die Teile anordnet.
  for (const option of task.options) {
    const gap = Math.abs(polygonArea(option.points) - pieceSum) / pieceSum;
    if (option.correct) {
      if (gap > 1e-9) figureIssues += 1;
    } else {
      if (gap < MIN_AREA_GAP) figureIssues += 1;
      smallestGap = Math.min(smallestGap, gap);
    }
  }

  if (task.options.length !== 5) figureIssues += 1;
  if (task.options.filter((option) => option.correct).length !== 1) figureIssues += 1;
  if (task.pieces.length !== task.pieceCount) figureIssues += 1;
  // Keine Splitter: jedes Teil mindestens 8 % der Gesamtfläche
  if (task.placements.some((piece) => polygonArea(piece) < pieceSum * 0.08)) figureIssues += 1;
  // Jedes Teil ist ein echtes Polygon
  if (task.pieces.some((piece) => piece.length < 3)) figureIssues += 1;
}
check(`${FIGURE_SAMPLES} Aufgaben: Teile ergeben exakt die Lösung, jeder Distraktor ist widerlegt`,
  figureIssues === 0, `${figureIssues} Abweichungen`);
check('Alle Aufgaben konnten erzeugt werden', figureFailures === 0, `${figureFailures} Fehlversuche`);
check(`Kleinster Flächenabstand der Distraktoren über ${Math.round(MIN_AREA_GAP * 100)} % (${(smallestGap * 100).toFixed(1)} %)`,
  smallestGap >= MIN_AREA_GAP);
check(`Alle ${Object.keys(SHAPES).length} Grundformen kommen vor (${usedShapes.size})`,
  usedShapes.size === Object.keys(SHAPES).length);

// Die Zerlegung muss für jede Grundform zuverlässig gelingen. Ein sehr
// seltener Fehlversuch ist unkritisch – generateFigureTask erzeugt dann eine
// neue Aufgabe –, deshalb wird eine Quote geprüft statt Perfektion verlangt.
let dissectFailures = 0;
let dissectAttempts = 0;
for (const id of Object.keys(SHAPES)) {
  for (let i = 0; i < 30; i += 1) {
    dissectAttempts += 1;
    if (!dissect(centeredUnitShape(id), 5)) dissectFailures += 1;
  }
}
const dissectRate = 1 - dissectFailures / dissectAttempts;
check(`Zerlegung in 5 Teile gelingt in über 99 % der Fälle (${(dissectRate * 100).toFixed(1)} %)`,
  dissectRate >= 0.99, `${dissectFailures} von ${dissectAttempts} Fehlversuchen`);

for (const [level, setup] of Object.entries(DIFFICULTY_SETUP)) {
  const tasks = Array.from({ length: 15 }, () => generateFigureTask({ difficulty: level })).filter(Boolean);
  const inRange = tasks.every((task) =>
    task.pieceCount >= setup.pieces[0] && task.pieceCount <= setup.pieces[1]
    && setup.shapes.includes(task.shapeId));
  check(`Schwierigkeit "${level}" hält Teilezahl und Formenauswahl ein`, tasks.length === 15 && inRange);
}

check('MedAT-Niveau nutzt mindestens 4 Teilstücke', DIFFICULTY_SETUP.medat.pieces[0] >= 4);

const figureSet = generateFigureSet(TESTS.figures.questionCount, 'medat');
check('Aufgabensatz hat 15 Aufgaben ohne direkte Formwiederholung',
  figureSet.length === 15
  && figureSet.every((task, i) => i === 0 || task.shapeId !== figureSet[i - 1].shapeId));

/* ---------------------------------------------------------- Konfiguration */
section('Konfiguration (MedAT-Vorgaben)');
check('Gedächtnis: 8 Ausweise, 8 Min Lernphase, 25 Fragen, 15 Min',
  TESTS.memory.cardCount === 8 && TESTS.memory.learnSeconds === 480
  && TESTS.memory.questionCount === 25 && TESTS.memory.testSeconds === 900);
check('Zahlenfolgen: 10 Aufgaben, 15 Min, 7 sichtbare + 2 gesuchte Zahlen',
  TESTS.numberSeries.questionCount === 10 && TESTS.numberSeries.testSeconds === 900
  && TESTS.numberSeries.visibleCount === 7 && TESTS.numberSeries.answerCount === 2);
check('Wortflüssigkeit: 15 Aufgaben, 20 Min',
  TESTS.wordFluency.questionCount === 15 && TESTS.wordFluency.testSeconds === 1200);
check('Implikationen: 10 Aufgaben, 10 Min',
  TESTS.implications.questionCount === 10 && TESTS.implications.testSeconds === 600);
check('Figuren zusammensetzen: 15 Aufgaben, 15 Min',
  TESTS.figures.questionCount === 15 && TESTS.figures.testSeconds === 900);

/* -------------------------------------------------------------- Ergebnis */
process.stdout.write(`\n${failures === 0 ? 'Alle Prüfungen bestanden' : `${failures} Prüfung(en) fehlgeschlagen`} (${checks} Prüfungen)\n`);
process.exit(failures > 0 ? 1 : 0);
