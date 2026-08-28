/**
 * Engine für den Untertest "Gedächtnis & Merkfähigkeit".
 *
 * Teil 1: Es werden 8 Allergieausweise mit exakt den acht MedAT-Feldern
 * erzeugt (Foto, Vor-/Nachname, Geburtsdatum TT.MM., Blutgruppe,
 * Medikamenteneinnahme, Allergien, Blutdruck, Brillenträger/in).
 *
 * Teil 2: Aus diesen Ausweisen werden 25 Multiple-Choice-Fragen mit je fünf
 * Antworten gebildet (e ist immer "Keine Antwort ist richtig"). Jeder
 * Fragetyp prüft vorher, ob die zugrunde liegende Tatsache eindeutig ist –
 * z. B. wird nach einem Allergen nur gefragt, wenn genau eine Person es hat.
 * Dadurch gibt es zu jeder Frage genau eine richtige Antwort.
 */
import { chance, pick, randInt, sample, shuffle } from '../lib/random.js';
import { ALLERGENS, ALLERGEN_CATEGORY, BLOOD_TYPES } from '../data/allergens.js';
import { AVATAR_COLORS, FEMALE_FIRST_NAMES, LAST_NAMES, MALE_FIRST_NAMES } from '../data/names.js';

export const CARD_COUNT = 8;
export const NO_ANSWER_LABEL = 'Keine Antwort ist richtig';
const NONE_CORRECT_RATE = 0.15;

const MONTH_LENGTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const pad = (value) => String(value).padStart(2, '0');

/** Erzeugt ein Geburtsdatum im Format TT.MM. (ohne Jahr, wie im MedAT). */
function randomBirthday() {
  const month = randInt(1, 12);
  const day = randInt(1, MONTH_LENGTHS[month - 1]);
  return { day, month, label: `${pad(day)}.${pad(month)}.` };
}

/** Realistischer Blutdruck: systolisch 100–160, diastolisch 60–100. */
function randomBloodPressure() {
  const systolic = randInt(10, 16) * 10 + pick([0, 5]);
  const diastolic = randInt(6, 10) * 10 + pick([0, 5]);
  return { systolic, diastolic, label: `${systolic}/${diastolic}` };
}

/** Erzeugt einen einzelnen Allergieausweis. */
function createCard(index, usedNames, usedBirthdays) {
  const gender = index % 2 === 0 ? 'w' : 'm';
  const firstNames = gender === 'w' ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;

  let firstName;
  let lastName;
  do {
    firstName = pick(firstNames);
    lastName = pick(LAST_NAMES);
  } while (usedNames.has(`${firstName} ${lastName}`) || usedNames.has(firstName) || usedNames.has(lastName));
  usedNames.add(`${firstName} ${lastName}`);
  usedNames.add(firstName);
  usedNames.add(lastName);

  let birthday;
  do {
    birthday = randomBirthday();
  } while (usedBirthdays.has(birthday.label));
  usedBirthdays.add(birthday.label);

  return {
    id: `card-${index}`,
    index,
    gender,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    initials: `${firstName[0]}${lastName[0]}`,
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    birthday,
    bloodType: pick(BLOOD_TYPES),
    medication: chance(0.5) ? 'Ja' : 'Nein',
    allergies: sample(ALLERGENS, randInt(1, 4)).sort((a, b) => a.localeCompare(b, 'de')),
    bloodPressure: randomBloodPressure(),
    glasses: chance(0.5) ? 'Ja' : 'Nein',
  };
}

/**
 * Erzeugt einen Satz von 8 Ausweisen.
 * Es wird sichergestellt, dass genügend Fakten eindeutig sind, damit sich
 * daraus 25 saubere Fragen bilden lassen.
 */
export function generateCards(count = CARD_COUNT) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const usedNames = new Set();
    const usedBirthdays = new Set();
    const cards = Array.from({ length: count }, (_, index) => createCard(index, usedNames, usedBirthdays));

    const uniqueAllergens = allergenOwners(cards).filter(([, owners]) => owners.length === 1);
    const uniqueBloodTypes = new Set(cards.map((card) => card.bloodType)).size;
    const medicationYes = cards.filter((card) => card.medication === 'Ja').length;
    const glassesYes = cards.filter((card) => card.glasses === 'Ja').length;

    if (uniqueAllergens.length >= 8 && uniqueBloodTypes >= 5
      && medicationYes >= 2 && medicationYes <= count - 2
      && glassesYes >= 2 && glassesYes <= count - 2) {
      return cards;
    }
  }
  const usedNames = new Set();
  const usedBirthdays = new Set();
  return Array.from({ length: count }, (_, index) => createCard(index, usedNames, usedBirthdays));
}

/** Liste [Allergen, Besitzer[]] über alle Ausweise. */
function allergenOwners(cards) {
  const map = new Map();
  for (const card of cards) {
    for (const allergen of card.allergies) {
      if (!map.has(allergen)) map.set(allergen, []);
      map.get(allergen).push(card);
    }
  }
  return [...map.entries()];
}

/** Werte, die in genau einem Ausweis vorkommen (für eindeutige Kreuzfragen). */
function uniqueBy(cards, selector) {
  const map = new Map();
  for (const card of cards) {
    const key = selector(card);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(card);
  }
  return [...map.entries()].filter(([, owners]) => owners.length === 1).map(([key, owners]) => [key, owners[0]]);
}

/**
 * Baut die fünf Antwortmöglichkeiten.
 * @param {string} correctValue Richtiger Wert (entfällt bei noneCorrect)
 * @param {string[]} distractorPool Plausible falsche Werte
 * @param {boolean} noneCorrect true -> e) ist die richtige Antwort
 */
function buildOptions(correctValue, distractorPool, noneCorrect) {
  const pool = [...new Set(distractorPool)].filter((value) => value !== correctValue);
  const needed = noneCorrect ? 4 : 3;
  if (pool.length < needed) return null;

  const distractors = sample(pool, needed);
  const values = shuffle(noneCorrect ? distractors : [correctValue, ...distractors]);
  const letters = ['a', 'b', 'c', 'd'];
  const options = values.map((text, index) => ({
    letter: letters[index],
    text,
    correct: !noneCorrect && text === correctValue,
  }));
  options.push({ letter: 'e', text: NO_ANSWER_LABEL, correct: noneCorrect });
  return options;
}

const joinAllergies = (card) => card.allergies.join(', ');

/**
 * Fragetypen. Jeder Generator liefert null, wenn er mit den vorliegenden
 * Ausweisen keine eindeutige Frage bilden kann.
 */
const QUESTION_TYPES = [
  {
    id: 'bloodOfPerson',
    label: 'Blutgruppe einer Person',
    build(cards, noneCorrect) {
      const card = pick(cards);
      const options = buildOptions(card.bloodType, BLOOD_TYPES, noneCorrect);
      if (!options) return null;
      return {
        prompt: `Welche Blutgruppe hat ${card.fullName}?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} hat die Blutgruppe ${card.bloodType}.`,
      };
    },
  },
  {
    id: 'birthdayOfPerson',
    label: 'Geburtstag einer Person',
    build(cards, noneCorrect) {
      const card = pick(cards);
      const options = buildOptions(
        card.birthday.label,
        cards.map((c) => c.birthday.label),
        noneCorrect,
      );
      if (!options) return null;
      return {
        prompt: `An welchem Tag hat ${card.fullName} Geburtstag?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} hat am ${card.birthday.label} Geburtstag.`,
      };
    },
  },
  {
    id: 'bloodPressureOfPerson',
    label: 'Blutdruck einer Person',
    build(cards, noneCorrect) {
      const card = pick(cards);
      const options = buildOptions(
        card.bloodPressure.label,
        cards.map((c) => c.bloodPressure.label),
        noneCorrect,
      );
      if (!options) return null;
      return {
        prompt: `Welchen Blutdruck hat ${card.fullName}?`,
        options,
        cardIds: [card.id],
        solution: `Der Blutdruck von ${card.fullName} beträgt ${card.bloodPressure.label}.`,
      };
    },
  },
  {
    id: 'allergiesOfBloodType',
    label: 'Allergien zu einer Blutgruppe',
    build(cards, noneCorrect) {
      const candidates = uniqueBy(cards, (card) => card.bloodType);
      if (candidates.length === 0) return null;
      const [bloodType, card] = pick(candidates);
      const options = buildOptions(joinAllergies(card), cards.map(joinAllergies), noneCorrect);
      if (!options) return null;
      return {
        prompt: `Welche Allergien hat die Person mit der Blutgruppe ${bloodType}?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} hat die Blutgruppe ${bloodType} und ist allergisch gegen ${joinAllergies(card)}.`,
      };
    },
  },
  {
    id: 'allergiesOfPerson',
    label: 'Allergien einer Person',
    build(cards, noneCorrect) {
      const card = pick(cards);
      const options = buildOptions(joinAllergies(card), cards.map(joinAllergies), noneCorrect);
      if (!options) return null;
      return {
        prompt: `Gegen welche Allergene ist ${card.fullName} allergisch?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} ist allergisch gegen ${joinAllergies(card)}.`,
      };
    },
  },
  {
    id: 'personWithAllergen',
    label: 'Person zu einem Allergen',
    build(cards, noneCorrect) {
      const candidates = allergenOwners(cards).filter(([, owners]) => owners.length === 1);
      if (candidates.length === 0) return null;
      const [allergen, owners] = pick(candidates);
      const card = owners[0];
      const options = buildOptions(card.fullName, cards.map((c) => c.fullName), noneCorrect);
      if (!options) return null;
      return {
        prompt: `Welche Person hat eine Allergie gegen ${allergen}?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} ist gegen ${allergen} allergisch.`,
      };
    },
  },
  {
    id: 'personByBirthday',
    label: 'Person zu einem Geburtsdatum',
    build(cards, noneCorrect) {
      const card = pick(cards);
      const options = buildOptions(card.fullName, cards.map((c) => c.fullName), noneCorrect);
      if (!options) return null;
      return {
        prompt: `Wie heißt die Person mit Geburtstag am ${card.birthday.label}?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} hat am ${card.birthday.label} Geburtstag.`,
      };
    },
  },
  {
    id: 'bloodTypeByAllergen',
    label: 'Blutgruppe über ein Allergen',
    build(cards, noneCorrect) {
      const candidates = allergenOwners(cards).filter(([, owners]) => owners.length === 1);
      if (candidates.length === 0) return null;
      const [allergen, owners] = pick(candidates);
      const card = owners[0];
      const options = buildOptions(card.bloodType, BLOOD_TYPES, noneCorrect);
      if (!options) return null;
      return {
        prompt: `Welche Blutgruppe hat die Person, die gegen ${allergen} allergisch ist?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} ist gegen ${allergen} allergisch und hat die Blutgruppe ${card.bloodType}.`,
      };
    },
  },
  {
    id: 'birthdayByBloodType',
    label: 'Geburtstag über die Blutgruppe',
    build(cards, noneCorrect) {
      const candidates = uniqueBy(cards, (card) => card.bloodType);
      if (candidates.length === 0) return null;
      const [bloodType, card] = pick(candidates);
      const options = buildOptions(card.birthday.label, cards.map((c) => c.birthday.label), noneCorrect);
      if (!options) return null;
      return {
        prompt: `Wann hat die Person mit der Blutgruppe ${bloodType} Geburtstag?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} (Blutgruppe ${bloodType}) hat am ${card.birthday.label} Geburtstag.`,
      };
    },
  },
  {
    id: 'medicationPerson',
    label: 'Medikamenteneinnahme',
    build(cards, noneCorrect) {
      const takers = cards.filter((card) => card.medication === 'Ja');
      const nonTakers = cards.filter((card) => card.medication === 'Nein');
      if (takers.length === 0 || nonTakers.length < 4) return null;
      if (noneCorrect) {
        const options = buildOptions(null, sample(nonTakers, 4).map((c) => c.fullName), true);
        if (!options) return null;
        return {
          prompt: 'Welche der folgenden Personen nimmt Medikamente ein?',
          options,
          cardIds: nonTakers.map((c) => c.id),
          solution: 'Keine der genannten Personen nimmt Medikamente ein.',
        };
      }
      const card = pick(takers);
      const options = buildOptions(card.fullName, nonTakers.map((c) => c.fullName), false);
      if (!options) return null;
      return {
        prompt: 'Welche der folgenden Personen nimmt Medikamente ein?',
        options,
        cardIds: [card.id],
        solution: `${card.fullName} nimmt Medikamente ein.`,
      };
    },
  },
  {
    id: 'glassesPerson',
    label: 'Brillenträger/in',
    build(cards, noneCorrect) {
      const wearers = cards.filter((card) => card.glasses === 'Ja');
      const nonWearers = cards.filter((card) => card.glasses === 'Nein');
      if (wearers.length === 0 || nonWearers.length < 4) return null;
      if (noneCorrect) {
        const options = buildOptions(null, sample(nonWearers, 4).map((c) => c.fullName), true);
        if (!options) return null;
        return {
          prompt: 'Welche der folgenden Personen ist Brillenträger/in?',
          options,
          cardIds: nonWearers.map((c) => c.id),
          solution: 'Keine der genannten Personen trägt eine Brille.',
        };
      }
      const card = pick(wearers);
      const options = buildOptions(card.fullName, nonWearers.map((c) => c.fullName), false);
      if (!options) return null;
      return {
        prompt: 'Welche der folgenden Personen ist Brillenträger/in?',
        options,
        cardIds: [card.id],
        solution: `${card.fullName} ist Brillenträger/in.`,
      };
    },
  },
  {
    id: 'allergyCount',
    label: 'Anzahl der Allergien',
    build(cards, noneCorrect) {
      const card = pick(cards);
      const counts = ['1', '2', '3', '4'];
      const options = buildOptions(String(card.allergies.length), counts, noneCorrect);
      if (!options) return null;
      return {
        prompt: `Wie viele Allergien sind bei ${card.fullName} eingetragen?`,
        options,
        cardIds: [card.id],
        solution: `Bei ${card.fullName} sind ${card.allergies.length} Allergien eingetragen `
          + `(${joinAllergies(card)}).`,
      };
    },
  },
  {
    id: 'personWithAllergenCategory',
    label: 'Allergen einer Person',
    build(cards, noneCorrect) {
      const candidates = allergenOwners(cards).filter(([, owners]) => owners.length === 1);
      if (candidates.length === 0) return null;
      const [allergen, owners] = pick(candidates);
      const card = owners[0];
      const category = ALLERGEN_CATEGORY[allergen];
      // Ähnliche Allergene derselben Kategorie als Distraktoren
      const similar = ALLERGENS.filter((a) => ALLERGEN_CATEGORY[a] === category && a !== allergen);
      const options = buildOptions(allergen, [...similar, ...ALLERGENS], noneCorrect);
      if (!options) return null;
      return {
        prompt: `Gegen welches dieser Allergene ist ${card.fullName} allergisch?`,
        options,
        cardIds: [card.id],
        solution: `${card.fullName} ist allergisch gegen ${joinAllergies(card)}.`,
      };
    },
  },
];

/** Alle Fragetypen mit ihrer Bezeichnung – für die Schwachstellen-Statistik. */
export const QUESTION_TYPE_LABELS = Object.fromEntries(
  QUESTION_TYPES.map((type) => [type.id, type.label]),
);

/**
 * Erzeugt den Fragensatz zur Prüfphase.
 * @param {Array} cards Die zuvor gelernten Ausweise
 * @param {number} count Anzahl Fragen (MedAT: 25)
 * @param {{preferTypes?: string[]}} options Gezieltes Training: diese Fragetypen
 *        bevorzugen (die übrigen füllen nur auf, wenn nicht genug zustande kommt)
 */
export function generateQuestions(cards, count = 25, options = {}) {
  const questions = [];
  const usedPrompts = new Set();
  const noneTarget = Math.max(1, Math.round(count * NONE_CORRECT_RATE));
  const noneFlags = shuffle([
    ...Array.from({ length: noneTarget }, () => true),
    ...Array.from({ length: count - noneTarget }, () => false),
  ]);

  const preferred = options.preferTypes?.length
    ? QUESTION_TYPES.filter((type) => options.preferTypes.includes(type.id))
    : [];

  // Beim gezielten Training rotieren zuerst nur die gewählten Fragetypen.
  // Acht Ausweise geben aber nicht beliebig viele verschiedene Fragen eines
  // Typs her – wenn nichts mehr Neues entsteht, füllen die übrigen Typen auf,
  // damit der Durchgang trotzdem vollständig wird.
  let rotation = preferred.length > 0 ? preferred : QUESTION_TYPES;
  let typeQueue = shuffle(rotation);
  let guard = 0;
  let sinceLastQuestion = 0;
  while (questions.length < count && guard < count * 60) {
    guard += 1;
    sinceLastQuestion += 1;
    if (sinceLastQuestion > rotation.length * 4 && rotation !== QUESTION_TYPES) {
      rotation = QUESTION_TYPES;
      typeQueue = shuffle(rotation);
      sinceLastQuestion = 0;
    }
    if (typeQueue.length === 0) typeQueue = shuffle(rotation);
    const type = typeQueue.pop();
    const noneCorrect = noneFlags[questions.length];
    const built = type.build(cards, noneCorrect);
    if (!built || usedPrompts.has(built.prompt)) continue;
    usedPrompts.add(built.prompt);
    sinceLastQuestion = 0;
    questions.push({
      id: `q-${questions.length}`,
      index: questions.length,
      typeId: type.id,
      typeLabel: type.label,
      ...built,
      correctLetter: built.options.find((option) => option.correct).letter,
    });
  }
  return questions;
}

/** Kompletter Durchgang: Ausweise + Fragen. */
export function generateMemorySession(cardCount = CARD_COUNT, questionCount = 25, options = {}) {
  const cards = generateCards(cardCount);
  return { cards, questions: generateQuestions(cards, questionCount, options) };
}
