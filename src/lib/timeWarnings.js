/**
 * Marken für die Zeitwarnung während eines Untertests.
 *
 * Beim Üben schaut man auf die Aufgabe, nicht auf die Uhr. Ein kurzes Signal
 * beim Unterschreiten fester Marken ersetzt den Blick – im echten MedAT
 * entscheidet die Zeiteinteilung mit über das Ergebnis.
 *
 * Reine Logik ohne React, damit sie im Selbsttest geprüft werden kann.
 */

/** Sekunden, bei denen gewarnt wird. */
export const WARNING_MARKS = [300, 60, 10];

/**
 * Welche Marken für ein Zeitlimit sinnvoll sind.
 *
 * Eine Marke lohnt nur, wenn danach noch ein spürbarer Teil der Zeit bleibt:
 * Bei 5 Minuten Gesamtzeit wäre eine 5-Minuten-Warnung sofort fällig und damit
 * wertlos. Deshalb muss das Limit mindestens das Anderthalbfache betragen.
 */
export function marksFor(totalSeconds) {
  return WARNING_MARKS.filter((mark) => totalSeconds >= mark * 1.5);
}

/**
 * Marken, die zwischen zwei Ständen unterschritten wurden.
 * @param {number} before Verbleibende Sekunden beim vorigen Takt.
 * @param {number} now    Verbleibende Sekunden jetzt.
 * @param {number} total  Zeitlimit des Untertests.
 */
export function crossedMarks(before, now, total) {
  return marksFor(total).filter((mark) => before > mark && now <= mark);
}
