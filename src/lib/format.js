/** Kleine Formatier- und Messhelfer. */

/**
 * Vergangene Sekunden seit einem Zeitstempel, auf eine Nachkommastelle genau.
 *
 * Ganze Sekunden wären zu grob: Wer eine Aufgabe in 0,8 Sekunden wegklickt,
 * hätte sonst 0 Sekunden in der Statistik.
 */
export function secondsSince(timestamp) {
  return Math.round(((Date.now() - timestamp) / 1000) * 10) / 10;
}

/** Sekunden für die Anzeige: "42 s" bzw. "2:05 min". */
export function formatDuration(seconds) {
  const value = Math.max(0, seconds);
  if (value < 60) return `${Math.round(value)} s`;
  const minutes = Math.floor(value / 60);
  return `${minutes}:${String(Math.round(value % 60)).padStart(2, '0')} min`;
}
