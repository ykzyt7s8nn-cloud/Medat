/**
 * Wiedervorlage falsch beantworteter Fragen.
 *
 * Das Verfahren ist bewusst schlicht: Wer eine Frage falsch hat, bekommt sie
 * nach einem Tag wieder vorgelegt, bei erneut richtiger Antwort nach drei, dann
 * nach sieben Tagen. Wer sie dreimal in Folge trifft, hat sie gelernt – die
 * Frage verlässt das Archiv. Ein Fehler zwischendurch setzt auf die erste
 * Stufe zurück.
 *
 * Die Abstände sind der Kern von verteiltem Lernen: Wiederholen, kurz bevor
 * man es wieder vergessen würde. Längere Ketten (30, 90 Tage) bringen erst
 * über Monate etwas – vor einem Aufnahmetest in wenigen Wochen wäre das
 * verschenkt.
 *
 * Reine Funktionen ohne Speicherzugriff, damit sie im Selbsttest prüfbar sind.
 */

/** Abstand bis zur nächsten Vorlage, in Tagen, je Stufe. */
export const INTERVALS_DAYS = [1, 3, 7];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Tagesbeginn – Fälligkeit zählt tageweise, nicht auf die Minute genau. */
export function startOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Neuer Archiveintrag nach einer falschen Antwort.
 * @param {number} now Zeitpunkt der Antwort.
 */
export function afterWrong(now = Date.now()) {
  return { stage: 0, due: startOfDay(now) + INTERVALS_DAYS[0] * DAY_MS, wrongAt: now };
}

/**
 * Nächster Zustand nach einer richtigen Antwort auf eine archivierte Frage.
 * @returns {object|null} Neuer Eintrag – oder null, wenn die Frage gelernt ist.
 */
export function afterCorrect(entry, now = Date.now()) {
  const stage = (entry?.stage ?? 0) + 1;
  if (stage >= INTERVALS_DAYS.length) return null;
  return { ...entry, stage, due: startOfDay(now) + INTERVALS_DAYS[stage] * DAY_MS };
}

/** Ist der Eintrag heute (oder überfällig) dran? */
export function isDue(entry, now = Date.now()) {
  if (!entry) return false;
  return entry.due <= startOfDay(now) + DAY_MS - 1;
}

/**
 * Wie lange noch, in Tagen, bis der Eintrag fällig wird.
 * 0 heißt „heute“, negative Werte heißen „überfällig“.
 */
export function daysUntilDue(entry, now = Date.now()) {
  return Math.round((startOfDay(entry.due) - startOfDay(now)) / DAY_MS);
}

/**
 * Längste Kette aufeinanderfolgender Tage mit Aktivität, die bis heute (oder
 * gestern) reicht. Gestern zählt noch mit, damit der heutige Tag nicht schon
 * am Morgen als Abbruch gilt.
 *
 * @param {number[]} timestamps Zeitpunkte beliebiger Aktivität, unsortiert.
 */
export function streakFrom(timestamps, now = Date.now()) {
  const days = new Set(timestamps.map(startOfDay));
  if (days.size === 0) return 0;
  let cursor = startOfDay(now);
  if (!days.has(cursor)) {
    cursor -= DAY_MS;
    if (!days.has(cursor)) return 0;
  }
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor -= DAY_MS;
  }
  return count;
}
