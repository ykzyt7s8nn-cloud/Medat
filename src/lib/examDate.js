/**
 * Testtermin und die Zeit bis dahin.
 *
 * Gespeichert wird ein reines Datum als „JJJJ-MM-TT“ – kein Zeitstempel. Ein
 * Zeitstempel trüge eine Uhrzeit und eine Zeitzone mit sich, und beides wäre
 * hier falsch: Der MedAT findet an einem Tag statt, nicht zu einer Sekunde.
 *
 * Reine Funktionen ohne Speicherzugriff, damit sie im Selbsttest prüfbar sind.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** „JJJJ-MM-TT“ → Zeitstempel des Tagesbeginns in der lokalen Zeitzone. */
export function parseExamDate(value) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  // Abfangen, was der Kalender nicht hergibt (31. Februar und Ähnliches).
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date.getTime();
}

/**
 * Tage bis zum Termin: 0 heißt „heute“, negative Werte liegen dahinter.
 * @returns {number|null} null, wenn kein gültiges Datum hinterlegt ist.
 */
export function daysUntilExam(value, now = Date.now()) {
  const target = parseExamDate(value);
  if (target === null) return null;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / DAY_MS);
}

/** Datum in deutscher Schreibweise, z. B. „7. Juli 2026“. */
export function formatExamDate(value) {
  const target = parseExamDate(value);
  if (target === null) return '';
  return new Date(target).toLocaleDateString('de-AT', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

/**
 * Wie die verbleibende Zeit genannt wird. Wochen sind ab einem Monat die
 * greifbarere Einheit – „noch 9 Wochen“ sagt mehr als „noch 63 Tage“.
 */
export function describeDaysLeft(days) {
  if (days === null) return '';
  if (days < 0) return days === -1 ? 'gestern' : `vor ${-days} Tagen`;
  if (days === 0) return 'heute';
  if (days === 1) return 'morgen';
  if (days < 28) return `in ${days} Tagen`;
  const weeks = Math.round(days / 7);
  return `in ${weeks} Wochen`;
}
