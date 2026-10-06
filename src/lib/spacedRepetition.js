/**
 * Wiedervorlage falsch beantworteter Fragen – Abstandswiederholung nach dem
 * Leitner-Prinzip.
 *
 * Jede falsch beantwortete Frage landet auf Stufe 1 und kommt nach einem Tag
 * wieder. Wer sie bei Fälligkeit richtig beantwortet, rückt eine Stufe vor; die
 * Abstände wachsen von 1 über 3, 7 und 14 auf 30 Tage. Nach der letzten Stufe
 * gilt die Frage als gelernt: Sie verlässt die Wiedervorlage, bleibt aber mit
 * ihrem Datum im Archiv stehen, damit die Statistik den Fortschritt zeigen
 * kann. Ein Fehler – gleich wann und wo – setzt auf Stufe 1 zurück, auch bei
 * einer schon gelernten Frage.
 *
 * Eine richtige Antwort auf eine Frage, die noch nicht fällig ist (etwa weil
 * sie im normalen Fach-Quiz zufällig wieder auftaucht), ändert nichts. Sonst
 * ließe sich eine Frage an einem Nachmittag durch alle Stufen klicken, und die
 * Abstände – der eigentliche Nutzen – fielen weg.
 *
 * Fälligkeit zählt tageweise: Was für heute ansteht, ist den ganzen Tag über
 * fällig, nicht erst ab der Uhrzeit der letzten Antwort.
 *
 * Reine Funktionen ohne Speicherzugriff und ohne fest verdrahtete Uhr – jede
 * Funktion bekommt den Zeitpunkt übergeben, damit der Selbsttest die Zeit
 * vorspulen kann.
 */

/** Abstand bis zur nächsten Vorlage, in Tagen, je Stufe (Index 0 = Stufe 1). */
export const INTERVALS_DAYS = [1, 3, 7, 14, 30];

/** Zahl der Stufen; wer die letzte richtig beantwortet, hat die Frage gelernt. */
export const STAGE_COUNT = INTERVALS_DAYS.length;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Tagesbeginn – Fälligkeit zählt tageweise, nicht auf die Minute genau. */
export function startOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Tagesbeginn in `days` Tagen. Über das Kalenderdatum statt über Millisekunden,
 * damit eine Zeitumstellung dazwischen den Termin nicht verschiebt.
 */
function dayPlus(now, days) {
  const date = new Date(startOfDay(now));
  date.setDate(date.getDate() + days);
  return date.getTime();
}

/** Ist die Frage gelernt, also aus der Wiedervorlage heraus? */
export function isLearned(entry) {
  return Boolean(entry?.learnedAt);
}

/**
 * Archiveintrag nach einer falschen Antwort: Stufe 1, morgen wieder.
 * Fach und Thema eines bestehenden Eintrags bleiben erhalten.
 */
export function afterWrong(now, entry = {}) {
  const { learnedAt, ...rest } = entry ?? {};
  return { ...rest, stage: 0, due: dayPlus(now, INTERVALS_DAYS[0]), wrongAt: now };
}

/**
 * Nächster Zustand nach einer richtigen Antwort auf eine fällige Frage.
 * Nach der letzten Stufe ist sie gelernt: `learnedAt` gesetzt, kein Termin mehr.
 */
export function afterCorrect(entry, now) {
  const stage = (entry?.stage ?? 0) + 1;
  if (stage >= STAGE_COUNT) return { ...entry, stage: STAGE_COUNT, due: null, learnedAt: now };
  return { ...entry, stage, due: dayPlus(now, INTERVALS_DAYS[stage]) };
}

/** Ist der Eintrag heute (oder überfällig) dran? Gelernte nie. */
export function isDue(entry, now) {
  if (!entry || isLearned(entry) || typeof entry.due !== 'number') return false;
  return entry.due < dayPlus(now, 1);
}

/**
 * Eine Antwort verbuchen – der eine Weg, über den sich das Archiv ändert.
 *
 * @param {object|undefined} entry Bisheriger Archiveintrag oder undefined.
 * @param {boolean} correct Richtig beantwortet?
 * @param {number} now Zeitpunkt der Antwort.
 * @param {object} [meta] Fach und Thema für den Eintrag.
 * @returns {object|undefined} Neuer Eintrag; undefined, wenn die Frage nicht
 *   ins Archiv gehört (richtig und nie falsch gewesen). Bleibt alles beim
 *   Alten, kommt derselbe Eintrag zurück.
 */
export function reviewEntry(entry, correct, now, meta = {}) {
  if (!correct) return afterWrong(now, { ...entry, ...meta });
  if (!entry) return undefined;
  if (!isDue(entry, now)) return entry;
  return afterCorrect(entry, now);
}

/**
 * Archiv aus älteren Ständen auf das heutige Format bringen.
 *
 * Version 2 kannte nur drei Stufen (1, 3, 7 Tage) und löschte gelernte
 * Fragen. Deren Einträge bleiben gültig, wie sie sind: Stufe und Termin
 * behalten ihre Bedeutung, es liegen jetzt nur zwei Stufen mehr vor ihnen.
 * Fehlt etwas oder ist es unbrauchbar, startet der Eintrag auf Stufe 1, fällig
 * heute – lieber einmal zu früh wiederholt als nie. Mehrfach angewandt ändert
 * die Funktion nichts mehr.
 */
export function migrateArchive(archive, now) {
  if (!archive || typeof archive !== 'object' || Array.isArray(archive)) return {};
  const result = {};
  for (const [questionId, raw] of Object.entries(archive)) {
    if (!raw || typeof raw !== 'object') continue;
    const entry = { ...raw };
    if (isLearned(entry)) {
      result[questionId] = { ...entry, stage: STAGE_COUNT, due: null };
      continue;
    }
    delete entry.learnedAt;
    const stage = Number.isInteger(entry.stage) ? entry.stage : 0;
    entry.stage = Math.min(Math.max(stage, 0), STAGE_COUNT - 1);
    if (typeof entry.due !== 'number' || !Number.isFinite(entry.due)) entry.due = startOfDay(now);
    if (typeof entry.wrongAt !== 'number') entry.wrongAt = null;
    result[questionId] = entry;
  }
  return result;
}

/**
 * Kennzahlen des Archivs: fällig, in Wiederholung, gelernt und je Stufe.
 * `byStage[i]` zählt die Fragen auf Stufe i + 1, die noch wiederholt werden.
 */
export function archiveSummary(archive, now) {
  const byStage = INTERVALS_DAYS.map(() => 0);
  let due = 0;
  let learned = 0;
  let active = 0;
  for (const entry of Object.values(archive ?? {})) {
    if (isLearned(entry)) {
      learned += 1;
      continue;
    }
    active += 1;
    byStage[Math.min(entry.stage ?? 0, STAGE_COUNT - 1)] += 1;
    if (isDue(entry, now)) due += 1;
  }
  return { due, active, learned, total: active + learned, byStage };
}

/**
 * Wie lange noch, in Tagen, bis der Eintrag fällig wird.
 * 0 heißt „heute“, negative Werte heißen „überfällig“.
 */
export function daysUntilDue(entry, now) {
  if (typeof entry?.due !== 'number') return null;
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
