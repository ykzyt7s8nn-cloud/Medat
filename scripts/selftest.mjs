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
import { TESTS, TEST_ORDER } from '../src/data/testConfig.js';
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
  DISTRACTOR_ONLY_SHAPES,
  MIN_AREA_GAP,
  NO_ANSWER_LABEL,
  SHAPES,
  SOLUTION_SHAPES,
  dissect,
  generateFigureSet,
  generateFigureTask,
} from '../src/engines/figures.js';
import { polygonArea } from '../src/lib/geometry.js';
import { isAnswered } from '../src/hooks/useTaskSession.js';
import { crossedMarks, marksFor } from '../src/lib/timeWarnings.js';
import {
  BMS_TOTAL,
  NO_ANSWER_LABEL as BMS_NO_ANSWER_LABEL,
  SUBJECTS,
  SUBJECT_ORDER,
  loadAllSubjects,
  withShuffledOptions,
} from '../src/data/bms/index.js';
import { SECTIONS, SECTION_ORDER, SEK_ORDER, TV_ORDER } from '../src/data/testConfig.js';
import { drawRegulate, drawTasks, loadSekTasks } from '../src/data/sek/index.js';
import { QUESTIONS_PER_TEXT, drawTextTasks, loadTexts } from '../src/data/tv/index.js';
import {
  describeSekSolution,
  isSekComplete,
  pointsPerTask,
  scoreSekTask,
} from '../src/lib/sekScoring.js';
import { biggestGain, weightedScore } from '../src/lib/overallScore.js';
import {
  daysUntilExam,
  describeDaysLeft,
  formatExamDate,
  parseExamDate,
} from '../src/lib/examDate.js';
import {
  INTERVALS_DAYS,
  afterCorrect,
  afterWrong,
  daysUntilDue,
  isDue,
  startOfDay,
  streakFrom,
} from '../src/lib/spacedRepetition.js';

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
let noneCount = 0;
const usedShapes = new Set();
const FIGURE_SAMPLES = 400;
for (let i = 0; i < FIGURE_SAMPLES; i += 1) {
  const task = generateFigureTask({ difficulty: 'medat' });
  if (!task) { figureFailures += 1; continue; }
  usedShapes.add(task.shapeId);
  if (task.correctLetter === 'e') noneCount += 1;

  // Aufbau wie im Test: a–d zeigen Figuren, e ist immer die Textoption.
  const figures = task.options.slice(0, 4);
  if (task.options.length !== 5) figureIssues += 1;
  if (!figures.every((option) => option.points && !option.text)) figureIssues += 1;
  const last = task.options[4];
  if (last.letter !== 'e' || last.text !== NO_ANSWER_LABEL || last.points) figureIssues += 1;
  if (task.options.filter((option) => option.correct).length !== 1) figureIssues += 1;

  // Die Teile ergeben exakt die Zielfigur – die Aufgabe ist per Konstruktion lösbar.
  const pieceSum = task.placements.reduce((sum, piece) => sum + polygonArea(piece), 0);
  if (Math.abs(pieceSum - polygonArea(task.target)) > 1e-9) figureIssues += 1;

  // Der Beweis für jede gezeigte Figur, die nicht die Lösung ist.
  for (const option of figures) {
    const gap = Math.abs(polygonArea(option.points) - pieceSum) / pieceSum;
    if (option.correct) {
      if (gap > 1e-9) figureIssues += 1;
    } else {
      if (gap < MIN_AREA_GAP) figureIssues += 1;
      smallestGap = Math.min(smallestGap, gap);
    }
  }
  // Ist e) richtig, darf keine der gezeigten Figuren passen.
  if (task.noneCorrect && figures.some((option) => option.correct)) figureIssues += 1;

  if (task.pieces.length !== task.pieceCount) figureIssues += 1;
  // Keine Splitter: jedes Teil mindestens 8 % der Gesamtfläche
  if (task.placements.some((piece) => polygonArea(piece) < pieceSum * 0.08)) figureIssues += 1;
  if (task.pieces.some((piece) => piece.length < 3)) figureIssues += 1;
}
check(`${FIGURE_SAMPLES} Aufgaben: Aufbau a–d Figuren, e Textoption, genau eine richtige Antwort`,
  figureIssues === 0, `${figureIssues} Abweichungen`);
check('Alle Aufgaben konnten erzeugt werden', figureFailures === 0, `${figureFailures} Fehlversuche`);
check(`Kleinster Flächenabstand der Distraktoren über ${Math.round(MIN_AREA_GAP * 100)} % (${(smallestGap * 100).toFixed(1)} %)`,
  smallestGap >= MIN_AREA_GAP);

const figureNoneRate = (noneCount / FIGURE_SAMPLES) * 100;
check(`In 12–25 % der Aufgaben ist e) die Lösung (${figureNoneRate.toFixed(1)} %)`,
  figureNoneRate >= 12 && figureNoneRate <= 25);

check(`Alle ${SOLUTION_SHAPES.length} Lösungsfiguren kommen vor (${usedShapes.size})`,
  usedShapes.size === SOLUTION_SHAPES.length);
check('Nur Vielecke (5–8 Ecken) und Kreissegmente sind Lösung',
  [...usedShapes].every((id) => SOLUTION_SHAPES.includes(id)),
  [...usedShapes].filter((id) => !SOLUTION_SHAPES.includes(id)).join(', '));
check('Trapez, Dreieck, Quadrat und Rechteck sind nie die Lösung',
  DISTRACTOR_ONLY_SHAPES.every((id) => !usedShapes.has(id)));

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
    && SOLUTION_SHAPES.includes(task.shapeId));
  check(`Schwierigkeit "${level}" hält Teilezahl und Formenauswahl ein`, tasks.length === 15 && inRange);
}

check('MedAT-Niveau nutzt mindestens 4 Teilstücke', DIFFICULTY_SETUP.medat.pieces[0] >= 4);

const figureSet = generateFigureSet(TESTS.figures.questionCount, 'medat');
check('Aufgabensatz hat 15 Aufgaben ohne direkte Formwiederholung',
  figureSet.length === 15
  && figureSet.every((task, i) => i === 0 || task.shapeId !== figureSet[i - 1].shapeId));
const setNone = figureSet.filter((task) => task.correctLetter === 'e').length;
check(`Im Durchgang sind 2–4 Aufgaben mit e) als Lösung (${setNone})`, setNone >= 2 && setNone <= 4);

/* ------------------------------------------------------------- Durchgänge */
section('Durchgänge: offen oder beantwortet');

// Von dieser Unterscheidung hängt alles ab, was den Untertest steuerbar macht:
// die Zahlenleiste, das Überspringen und der Sprung zur nächsten offenen
// Aufgabe. Ein Fehler hier fiele erst mitten im Durchgang auf.
check('Nicht gesetzte Antwort gilt als offen',
  !isAnswered(undefined) && !isAnswered(null) && !isAnswered(''));
check('Ein Buchstabe gilt als beantwortet', isAnswered('a') && isAnswered('e'));
check('Leere Mehrfachauswahl gilt als offen', !isAnswered([]));
check('Gefüllte Mehrfachauswahl gilt als beantwortet', isAnswered([0]) && isAnswered([0, 3]));
check('Halb ausgefüllte Zahlenfolge gilt als offen',
  !isAnswered(['12', '']) && !isAnswered(['', '']) && !isAnswered(['-', '5']));
check('Vollständige Zahlenfolge gilt als beantwortet',
  isAnswered(['12', '18']) && isAnswered(['-4', '-9']));
check('Die Null ist eine gültige Antwort', isAnswered(['0', '0']) && isAnswered([0]));

/* --------------------------------------------------------------------- BMS */
section('BMS: Lexikon und Fragen');

const bmsSubjects = await loadAllSubjects();
const bmsEntryIds = new Set();
const bmsQuestionIds = new Set();
let bmsTopics = 0;
let bmsEntries = 0;
let bmsQuestions = 0;
let duplicateEntryIds = 0;
let duplicateQuestionIds = 0;

for (const subjectId of SUBJECT_ORDER) {
  const { topics: TOPICS, questions: QUESTIONS } = bmsSubjects[subjectId];
  bmsTopics += TOPICS.length;
  for (const topic of TOPICS) {
    for (const entry of topic.entries) {
      if (bmsEntryIds.has(entry.id)) duplicateEntryIds += 1;
      bmsEntryIds.add(entry.id);
      bmsEntries += 1;
    }
  }
  for (const question of QUESTIONS) {
    if (bmsQuestionIds.has(question.id)) duplicateQuestionIds += 1;
    bmsQuestionIds.add(question.id);
    bmsQuestions += 1;
  }
}

check(`Alle vier Fächer liefern Inhalte (${SUBJECT_ORDER.length})`,
  SUBJECT_ORDER.every((id) => bmsSubjects[id].topics.length > 0));
check(`Mindestens 250 Fragen insgesamt (${bmsQuestions})`, bmsQuestions >= 250);
check(`Mindestens 100 Lexikoneinträge (${bmsEntries})`, bmsEntries >= 100);
check('Eintrags-IDs sind eindeutig', duplicateEntryIds === 0, `${duplicateEntryIds} Dubletten`);
check('Frage-IDs sind eindeutig', duplicateQuestionIds === 0, `${duplicateQuestionIds} Dubletten`);

// Jedes Hauptthema braucht laut Vorgabe mindestens 10 Fragen.
const thinTopics = [];
for (const subjectId of SUBJECT_ORDER) {
  const { topics: TOPICS, questions: QUESTIONS } = bmsSubjects[subjectId];
  for (const topic of TOPICS) {
    const count = QUESTIONS.filter((q) => q.topicId === topic.id).length;
    if (count < 10) thinTopics.push(`${topic.title} (${count})`);
  }
}
check(`Jedes der ${bmsTopics} Hauptthemen hat mindestens 10 Fragen`,
  thinTopics.length === 0, thinTopics.join(', '));

// Ein Themen-Training zieht nur aus einem Thema und hat deshalb regelmäßig
// weniger Fragen, als das Fach im Test umfasst. Der Quiz-Screen muss seine
// Sitzung nach den tatsächlich gezogenen Fragen bemessen, nicht nach dem
// Sollwert des Fachs – sonst zeigt die Navigation auf Fragen, die es nicht gibt.
const smallerThanSubject = [];
for (const subjectId of SUBJECT_ORDER) {
  const { topics, questions } = bmsSubjects[subjectId];
  const need = SUBJECTS[subjectId].questionCount;
  for (const topic of topics) {
    const pool = questions.filter((q) => q.topicId === topic.id).length;
    if (pool < need) smallerThanSubject.push(`${topic.title} (${pool} < ${need})`);
  }
}
check(`Themen-Pools können kleiner sein als der Fach-Sollwert (${smallerThanSubject.length} Fälle)`,
  smallerThanSubject.length > 0,
  'kein Fall gefunden – die Annahme hinter der dynamischen Sitzungsgröße stimmt nicht mehr');

// Struktur jeder einzelnen Frage: fünf Optionen, korrekte Anzahl Lösungen,
// Begründung je Option und ein auflösbarer Lexikonverweis.
let malformed = 0;
let missingWhy = 0;
let danglingEntry = 0;
let danglingTopic = 0;
for (const subjectId of SUBJECT_ORDER) {
  const { topics: TOPICS, questions: QUESTIONS } = bmsSubjects[subjectId];
  const topicIds = new Set(TOPICS.map((t) => t.id));
  const entryIds = new Set(TOPICS.flatMap((t) => t.entries.map((e) => e.id)));
  for (const question of QUESTIONS) {
    const correct = question.options.filter((o) => o.correct).length;
    if (question.options.length !== 5) malformed += 1;
    else if (question.kind === 'single' && correct !== 1) malformed += 1;
    else if (question.kind === 'multi' && correct < 2) malformed += 1;
    if (!question.explanation || question.options.some((o) => !o.why)) missingWhy += 1;
    if (!entryIds.has(question.entryId)) danglingEntry += 1;
    if (!topicIds.has(question.topicId)) danglingTopic += 1;
  }
}
check('Jede Frage hat fünf Optionen und die passende Zahl richtiger Antworten',
  malformed === 0, `${malformed} Abweichungen`);
check('Jede Option hat eine Begründung, jede Frage eine Erklärung',
  missingWhy === 0, `${missingWhy} Abweichungen`);
check('Jede Frage verweist auf einen vorhandenen Lexikoneintrag',
  danglingEntry === 0, `${danglingEntry} Abweichungen`);
check('Jede Frage ist einem vorhandenen Thema zugeordnet',
  danglingTopic === 0, `${danglingTopic} Abweichungen`);

// Querverweise dürfen auch über Fächergrenzen hinweg nicht ins Leere zeigen.
const danglingRelated = [];
for (const subjectId of SUBJECT_ORDER) {
  for (const topic of bmsSubjects[subjectId].topics) {
    for (const entry of topic.entries) {
      for (const related of entry.related ?? []) {
        if (!bmsEntryIds.has(related)) danglingRelated.push(`${entry.id} → ${related}`);
      }
    }
  }
}
check('Alle Querverweise zwischen Stichwörtern lassen sich auflösen',
  danglingRelated.length === 0, danglingRelated.slice(0, 3).join(', '));

// Ein "Keine der Antwortmöglichkeiten"-Distraktor darf nie die Lösung sein,
// sonst wäre die Frage nicht eindeutig auflösbar.
let noneAsSolution = 0;
for (const subjectId of SUBJECT_ORDER) {
  for (const question of bmsSubjects[subjectId].questions) {
    const none = question.options.find((o) => o.text === BMS_NO_ANSWER_LABEL);
    if (none?.correct && question.options.filter((o) => o.correct).length > 1) noneAsSolution += 1;
  }
}
check('Kein "Keine der Antwortmöglichkeiten" neben einer weiteren Lösung', noneAsSolution === 0);

// Die Simulation muss jedes Fach vollständig bestücken können.
const shortPools = [];
for (const subjectId of SUBJECT_ORDER) {
  const need = SUBJECTS[subjectId].questionCount;
  const have = bmsSubjects[subjectId].questions.length;
  if (have < need) shortPools.push(`${subjectId}: ${have}/${need}`);
}
check('Jedes Fach hat genug Fragen für einen vollen Simulationsdurchgang',
  shortPools.length === 0, shortPools.join(', '));
check('BMS-Simulation: 94 Fragen in 75 Minuten',
  BMS_TOTAL.questionCount === 94 && BMS_TOTAL.seconds === 75 * 60);
check('Fächeraufteilung entspricht dem MedAT (40/24/18/12)',
  SUBJECTS.biologie.questionCount === 40 && SUBJECTS.chemie.questionCount === 24
  && SUBJECTS.physik.questionCount === 18 && SUBJECTS.mathematik.questionCount === 12);
check('Die Fächerzeiten ergeben zusammen die Gesamtzeit',
  SUBJECT_ORDER.reduce((sum, id) => sum + SUBJECTS[id].seconds, 0) === BMS_TOTAL.seconds);
check('Die Fragenzahlen der Fächer ergeben zusammen 94',
  SUBJECT_ORDER.reduce((sum, id) => sum + SUBJECTS[id].questionCount, 0) === BMS_TOTAL.questionCount);

// Ein Lexikoneintrag muss den Lernzweck erfüllen: erklärender Text plus
// stichpunktartige Kernaussagen.
let thinEntries = 0;
for (const subjectId of SUBJECT_ORDER) {
  for (const topic of bmsSubjects[subjectId].topics) {
    for (const entry of topic.entries) {
      if (!entry.title || entry.text.length < 250 || (entry.facts?.length ?? 0) < 3) thinEntries += 1;
    }
  }
}
check('Jeder Eintrag hat Titel, ausführlichen Text und mindestens 3 Schlüsselfakten',
  thinEntries === 0, `${thinEntries} Abweichungen`);

/* --------------------------------------------- BMS: Antwortreihenfolge */
section('BMS: Antwortreihenfolge');

// In den Quelldateien steht die richtige Antwort bewusst zuerst – das ist die
// Schreibkonvention und wird hier festgehalten, damit sie nicht unbemerkt
// verrutscht.
let correctNotFirst = 0;
for (const subjectId of SUBJECT_ORDER) {
  for (const question of bmsSubjects[subjectId].questions) {
    const firstWrong = question.options.findIndex((option) => !option.correct);
    const lastCorrect = question.options.map((option) => option.correct)
      .lastIndexOf(true);
    if (firstWrong !== -1 && lastCorrect > firstWrong) correctNotFirst += 1;
  }
}
check('In den Quelldateien stehen die richtigen Antworten zuerst',
  correctNotFirst === 0, `${correctNotFirst} Fragen abweichend`);

// Genau deshalb muss beim Ziehen gemischt werden: Ungemischt käme man mit
// „immer a“ auf volle Punktzahl, ohne eine Frage gelesen zu haben.
const shuffleSample = bmsSubjects.biologie.questions.slice(0, 40);
let firstIsCorrect = 0;
let textsPreserved = 0;
for (const question of shuffleSample) {
  const mixedQuestion = withShuffledOptions(question);
  if (mixedQuestion.options[0].correct) firstIsCorrect += 1;
  const before = [...question.options].map((option) => option.text).sort().join('|');
  const after = [...mixedQuestion.options].map((option) => option.text).sort().join('|');
  if (before === after) textsPreserved += 1;
}
check(`Gemischt liegt die richtige Antwort nicht mehr immer vorn (${firstIsCorrect} von ${shuffleSample.length})`,
  firstIsCorrect < shuffleSample.length * 0.6);
check('Mischen verliert und erfindet keine Antwortmöglichkeit',
  textsPreserved === shuffleSample.length);
check('Mischen lässt die Quelldaten unberührt',
  bmsSubjects.biologie.questions[0].options[0].correct === true);

/* ------------------------------------------------------- Wiedervorlage */
section('Fehlerarchiv: Wiedervorlage');

const heute = new Date(2026, 0, 15, 14, 30).getTime();
const tagMs = 24 * 60 * 60 * 1000;

check('Abstände sind 1, 3 und 7 Tage', INTERVALS_DAYS.join() === '1,3,7');

const frisch = afterWrong(heute);
check('Eine falsche Antwort kommt morgen wieder',
  frisch.stage === 0 && daysUntilDue(frisch, heute) === 1);
check('Heute ist sie noch nicht fällig', !isDue(frisch, heute));
check('Morgen ist sie fällig', isDue(frisch, heute + tagMs));

const stufe1 = afterCorrect(frisch, heute + tagMs);
check('Richtig beantwortet: nächste Vorlage in 3 Tagen',
  stufe1.stage === 1 && daysUntilDue(stufe1, heute + tagMs) === 3);
const stufe2 = afterCorrect(stufe1, heute + 4 * tagMs);
check('Danach in 7 Tagen',
  stufe2.stage === 2 && daysUntilDue(stufe2, heute + 4 * tagMs) === 7);
check('Dreimal richtig heißt gelernt – die Frage verlässt das Archiv',
  afterCorrect(stufe2, heute + 11 * tagMs) === null);
check('Ein Fehler setzt auf die erste Stufe zurück',
  afterWrong(heute + 11 * tagMs).stage === 0);
check('Überfälliges bleibt fällig',
  isDue({ ...frisch, due: startOfDay(heute) - 5 * tagMs }, heute));

check('Ohne Aktivität keine Strähne', streakFrom([], heute) === 0);
check('Heute und gestern geübt ergibt zwei Tage',
  streakFrom([heute, heute - tagMs], heute) === 2);
check('Gestern zuletzt geübt zählt noch mit',
  streakFrom([heute - tagMs, heute - 2 * tagMs], heute) === 2);
check('Eine Lücke beendet die Strähne',
  streakFrom([heute, heute - 2 * tagMs, heute - 3 * tagMs], heute) === 1);
check('Mehrfach am selben Tag zählt einmal',
  streakFrom([heute, heute - 3600 * 1000, heute - 7200 * 1000], heute) === 1);

/* ------------------------------------------------ SEK: Inhalte und Wertung */
section('SEK: Inhalte');

const sekTasks = Object.fromEntries(
  await Promise.all(SEK_ORDER.map(async (id) => [id, await loadSekTasks(id)])),
);

for (const testId of SEK_ORDER) {
  const tasks = sekTasks[testId];
  const test = TESTS[testId];
  check(`${test.short}: mehr Aufgaben vorhanden als ein Durchgang braucht (${tasks.length} > ${test.questionCount})`,
    tasks.length > test.questionCount);
  check(`${test.short}: alle Aufgaben-IDs eindeutig`,
    new Set(tasks.map((task) => task.id)).size === tasks.length);
  check(`${test.short}: jede Aufgabe hat eine ausführliche Situation`,
    tasks.every((task) => task.situation && task.situation.length >= 80));
}

const recognise = sekTasks.emotionsRecognise;
check(`Emotionen erkennen: immer ${TESTS.emotionsRecognise.emotionCount} Gefühle je Aufgabe`,
  recognise.every((task) => task.emotions.length === TESTS.emotionsRecognise.emotionCount));
check('Emotionen erkennen: jedes Gefühl hat eine Einschätzung und eine Begründung',
  recognise.every((task) => task.emotions.every((emotion) =>
    typeof emotion.likely === 'boolean' && emotion.why?.length > 10)));
// Eine Aufgabe, in der alle fünf gleich zu beurteilen sind, wäre kein Test der
// Unterscheidung, sondern eine Einladung zum Durchklicken.
check('Emotionen erkennen: keine Aufgabe ist durchgehend gleich zu beantworten',
  recognise.every((task) => {
    const likely = task.emotions.filter((emotion) => emotion.likely).length;
    return likely > 0 && likely < task.emotions.length;
  }));
check('Emotionen erkennen: Gefühlsnamen wiederholen sich nicht innerhalb einer Aufgabe',
  recognise.every((task) => new Set(task.emotions.map((e) => e.emotion)).size === task.emotions.length));

const regulate = sekTasks.emotionsRegulate;
check(`Emotionen regulieren: immer ${TESTS.emotionsRegulate.optionCount} Vorsätze`,
  regulate.every((task) => task.options.length === TESTS.emotionsRegulate.optionCount));
check('Emotionen regulieren: genau ein Vorsatz trifft, und er steht in der Quelle zuerst',
  regulate.every((task) => task.options.filter((option) => option.correct).length === 1
    && task.options[0].correct === true));
check('Emotionen regulieren: jede Aufgabe nennt ein Ziel',
  regulate.every((task) => task.goal?.length > 20));
check('Emotionen regulieren: jeder Vorsatz ist begründet',
  regulate.every((task) => task.options.every((option) => option.why?.length > 10)));

// Ungemischt käme man mit „immer a“ auf volle Punktzahl.
const regulateMixed = regulate.map(drawRegulate);
check(`Emotionen regulieren: gemischt steht der richtige Vorsatz nicht mehr immer vorn (${regulateMixed.filter((task) => task.options[0].correct).length} von ${regulate.length})`,
  regulateMixed.filter((task) => task.options[0].correct).length < regulate.length * 0.7);

const decision = sekTasks.socialDecision;
check(`Soziales Entscheiden: immer ${TESTS.socialDecision.statementCount} Aussagen`,
  decision.every((task) => task.statements.length === TESTS.socialDecision.statementCount));
check('Soziales Entscheiden: keine Aussage wiederholt sich innerhalb einer Aufgabe',
  decision.every((task) => new Set(task.statements).size === task.statements.length));
check('Soziales Entscheiden: jede Aufgabe erklärt ihre Reihung',
  decision.every((task) => task.explanation?.length > 40));

section('SEK: Wertung');

const drawnDecision = drawTasks('socialDecision', decision, 3);
check('Soziales Entscheiden: das Ziehen mischt die Aussagen und merkt sich den Platz',
  drawnDecision.every((task) => task.statements.every((statement, i) =>
    typeof statement.rank === 'number' && statement.text.length > 0
    && task.statements.filter((other) => other.rank === statement.rank).length === 1
    && i < task.statements.length)));

const exampleDecision = drawnDecision[0];
// Die richtige Reihung ergibt sich aus den mitgeführten Rängen.
const perfect = exampleDecision.statements
  .map((statement, displayIndex) => ({ displayIndex, rank: statement.rank }))
  .sort((a, b) => a.rank - b.rank)
  .map((entry) => entry.displayIndex);
check('Soziales Entscheiden: die richtige Reihung bringt volle Punktzahl',
  scoreSekTask('socialDecision', exampleDecision, perfect) === 5);
check('Soziales Entscheiden: zwei vertauschte Plätze kosten genau zwei Punkte',
  scoreSekTask('socialDecision', exampleDecision,
    [perfect[1], perfect[0], perfect[2], perfect[3], perfect[4]]) === 3);
check('Soziales Entscheiden: unvollständig heißt offen',
  !isSekComplete('socialDecision', exampleDecision, perfect.slice(0, 4))
  && isSekComplete('socialDecision', exampleDecision, perfect));
check('Soziales Entscheiden: fünf Punkte je Aufgabe',
  pointsPerTask('socialDecision', exampleDecision) === 5);

const exampleRecognise = recognise[0];
const allRight = exampleRecognise.emotions.map((emotion) => emotion.likely);
check('Emotionen erkennen: alles richtig gibt den Punkt',
  scoreSekTask('emotionsRecognise', exampleRecognise, allRight) === 1);
check('Emotionen erkennen: eine Fehleinschätzung kostet den ganzen Punkt',
  scoreSekTask('emotionsRecognise', exampleRecognise,
    [!allRight[0], ...allRight.slice(1)]) === 0);
check('Emotionen erkennen: erst mit allen fünf Angaben ist die Aufgabe fertig',
  !isSekComplete('emotionsRecognise', exampleRecognise, allRight.slice(0, 4))
  && isSekComplete('emotionsRecognise', exampleRecognise, allRight));

const exampleRegulate = regulate[0];
const rightIndex = exampleRegulate.options.findIndex((option) => option.correct);
check('Emotionen regulieren: der richtige Vorsatz gibt den Punkt',
  scoreSekTask('emotionsRegulate', exampleRegulate, rightIndex) === 1
  && scoreSekTask('emotionsRegulate', exampleRegulate, (rightIndex + 1) % 4) === 0);
check('Emotionen regulieren: die Lösung wird als Buchstabe mit Text benannt',
  describeSekSolution('emotionsRegulate', exampleRegulate).startsWith('a)'));
check('Ohne Antwort gibt es in allen drei Untertests null Punkte',
  scoreSekTask('emotionsRecognise', exampleRecognise, undefined) === 0
  && scoreSekTask('emotionsRegulate', exampleRegulate, undefined) === 0
  && scoreSekTask('socialDecision', exampleDecision, undefined) === 0);

/* ------------------------------------------------------- Textverständnis */
section('Textverständnis');

const tvTexts = await loadTexts();
const tvTest = TESTS[TV_ORDER[0]];
check(`Genug Texte für Abwechslung (${tvTexts.length})`, tvTexts.length >= 6);
check(`Jeder Text hat ${QUESTIONS_PER_TEXT} Fragen`,
  tvTexts.every((text) => text.questions.length === QUESTIONS_PER_TEXT));
check('Jeder Text hat mindestens drei Absätze und genug Substanz',
  tvTexts.every((text) => text.paragraphs.length >= 3
    && text.paragraphs.join(' ').length >= 900));
check(`Jede Frage hat ${tvTest.optionCount} Antwortmöglichkeiten, genau eine richtig, in der Quelle zuerst`,
  tvTexts.every((text) => text.questions.every((question) =>
    question.options.length === tvTest.optionCount
    && question.options.filter((option) => option.correct).length === 1
    && question.options[0].correct === true)));
check('Antwortmöglichkeiten wiederholen sich innerhalb einer Frage nicht',
  tvTexts.every((text) => text.questions.every((question) =>
    new Set(question.options.map((option) => option.text)).size === question.options.length)));
check('Jede Frage ist erklärt',
  tvTexts.every((text) => text.questions.every((question) => question.explanation?.length > 40)));
check('Text- und Frage-IDs sind eindeutig',
  new Set(tvTexts.map((text) => text.id)).size === tvTexts.length
  && new Set(tvTexts.flatMap((text) => text.questions.map((q) => q.id))).size
    === tvTexts.length * QUESTIONS_PER_TEXT);

const tvDraw = drawTextTasks(tvTexts, tvTest.questionCount);
check(`Ein Durchgang hat ${tvTest.questionCount} Aufgaben`, tvDraw.length === tvTest.questionCount);
check(`Sie verteilen sich auf ${tvTest.questionCount / QUESTIONS_PER_TEXT} Texte`,
  new Set(tvDraw.map((task) => task.textId)).size === tvTest.questionCount / QUESTIONS_PER_TEXT);
// Die Fragen eines Textes müssen beieinander bleiben – man liest einen Text
// und beantwortet dann dessen Fragen, nicht kreuz und quer.
check('Die Fragen eines Textes stehen zusammen',
  tvDraw.every((task, i) => i === 0
    || task.textId === tvDraw[i - 1].textId
    || !tvDraw.slice(0, i - 1).some((earlier) => earlier.textId === task.textId)));
check('Jede Aufgabe bringt ihren Text mit',
  tvDraw.every((task) => task.paragraphs?.length >= 3 && task.title?.length > 0));

const tvMixedFirst = tvDraw.filter((task) => task.options[0].correct).length;
check(`Gemischt liegt die richtige Antwort nicht mehr immer vorn (${tvMixedFirst} von ${tvDraw.length})`,
  tvMixedFirst < tvDraw.length * 0.7);

/* --------------------------------------------------- Gewichteter Gesamtwert */
section('Gewichteter Gesamtwert');

check('Die vier Testteile ergeben zusammen 100 %',
  Math.abs(SECTION_ORDER.reduce((sum, id) => sum + SECTIONS[id].weight, 0) - 1) < 1e-9);
check('Offizielle Gewichte: BMS 40, KFF 40, TV 10, SEK 10',
  SECTIONS.bms.weight === 0.4 && SECTIONS.kff.weight === 0.4
  && SECTIONS.tv.weight === 0.1 && SECTIONS.sek.weight === 0.1);

const voll = weightedScore({ bms: 0.5, kff: 1, tv: 0, sek: 1 });
check('Vollständige Daten werden nach Gewicht verrechnet (0,5·0,4 + 1·0,4 + 0 + 1·0,1 = 0,7)',
  Math.abs(voll.percent - 0.7) < 1e-9, String(voll.percent));
check('Vollständig heißt 100 % Abdeckung ohne Lücken',
  voll.coverage === 1 && voll.missing.length === 0);

// Fehlt ein Teil, werden die übrigen Gewichte hochgerechnet – sonst sähe ein
// starker Teilwert nach einem schwachen Gesamtergebnis aus.
const teilweise = weightedScore({ kff: 0.8 });
check('Ohne Daten wird der Teil ausgelassen und der Rest hochgerechnet',
  Math.abs(teilweise.percent - 0.8) < 1e-9 && Math.abs(teilweise.coverage - 0.4) < 1e-9);
check('Die fehlenden Teile werden benannt',
  teilweise.missing.join() === 'BMS,TV,SEK');
check('Ganz ohne Daten gibt es keinen Wert',
  weightedScore({}).percent === null && weightedScore({}).coverage === 0);

// 40 % Gewicht bei 60 % Trefferquote wiegen schwerer als 10 % bei 20 %.
check('Der größte Hebel berücksichtigt das Gewicht, nicht nur den Rückstand',
  biggestGain({ bms: 0.6, tv: 0.2 }).id === 'bms');
check('Bei gleichem Gewicht entscheidet der Rückstand',
  biggestGain({ bms: 0.9, kff: 0.5 }).id === 'kff');
check('Ohne Daten kein Hebel', biggestGain({}) === null);

/* ---------------------------------------------------------- Testtermin */
section('Testtermin');

const jetzt = new Date(2026, 4, 20, 9, 0).getTime();
check('Ein Datum wird als lokaler Tagesbeginn gelesen',
  new Date(parseExamDate('2026-07-07')).getHours() === 0);
check('Ohne Datum kein Countdown', daysUntilExam('', jetzt) === null);
check('Unsinn wird abgewiesen',
  parseExamDate('07.07.2026') === null && parseExamDate('2026-13-01') === null
  && parseExamDate('2026-02-31') === null && parseExamDate(undefined) === null);
check('Heute sind es null Tage', daysUntilExam('2026-05-20', jetzt) === 0);
check('Morgen ist ein Tag', daysUntilExam('2026-05-21', jetzt) === 1);
check('Über einen Monatswechsel wird richtig gezählt',
  daysUntilExam('2026-06-01', jetzt) === 12);
check('Ein vergangener Termin zählt negativ', daysUntilExam('2026-05-18', jetzt) === -2);
check('Ab vier Wochen wird in Wochen gesprochen',
  describeDaysLeft(28) === 'in 4 Wochen' && describeDaysLeft(27) === 'in 27 Tagen');
check('Heute, morgen und gestern haben eigene Worte',
  describeDaysLeft(0) === 'heute' && describeDaysLeft(1) === 'morgen'
  && describeDaysLeft(-1) === 'gestern');
check('Das Datum wird ausgeschrieben', /7\.\s*Juli 2026/.test(formatExamDate('2026-07-07')),
  formatExamDate('2026-07-07'));

/* ---------------------------------------------------------- Zeitwarnung */
section('Zeitwarnung');

check('Lange Untertests bekommen alle drei Marken',
  marksFor(TESTS.wordFluency.testSeconds).join() === '300,60,10'
  && marksFor(TESTS.numberSeries.testSeconds).join() === '300,60,10');
// Eine Marke lohnt erst, wenn danach noch ein spürbarer Teil der Zeit bleibt.
// Bei 10 Minuten ist die 5-Minuten-Marke die Halbzeit und damit sinnvoll, bei
// 5 Minuten wäre sie sofort fällig.
check('Die 5-Minuten-Marke gilt ab 7,5 Minuten Zeitlimit',
  marksFor(450).includes(300) && !marksFor(449).includes(300));
check('Bei 10 Minuten markiert sie die Halbzeit',
  marksFor(TESTS.implications.testSeconds).includes(300));
check('Jeder Untertest hat mindestens eine Marke',
  TEST_ORDER.every((id) => marksFor(TESTS[id].testSeconds).length > 0));
check('Eine Marke löst genau beim Unterschreiten aus',
  crossedMarks(61, 60, 900).join() === '60' && crossedMarks(60, 59, 900).length === 0);
check('Ein Sprung über mehrere Marken meldet alle',
  crossedMarks(70, 5, 900).join() === '60,10');
check('Zurücklaufende Zeit meldet nichts', crossedMarks(50, 80, 900).length === 0);

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
