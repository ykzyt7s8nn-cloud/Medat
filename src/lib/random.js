/**
 * Kleine Zufallshelfer.
 *
 * Alle Engines nutzen ausschließlich diese Funktionen, damit sich der Zufall an
 * einer Stelle austauschen lässt (z. B. für reproduzierbare Tests via seed).
 */

/** Ganzzahl in [min, max] (beide inklusive). */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Zufälliges Element eines Arrays. */
export function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/** Neue, gemischte Kopie eines Arrays (Fisher-Yates). */
export function shuffle(array) {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** n verschiedene Elemente aus einem Array (n wird auf die Länge begrenzt). */
export function sample(array, n) {
  return shuffle(array).slice(0, Math.min(n, array.length));
}

/** true mit der Wahrscheinlichkeit p (0–1). */
export function chance(p) {
  return Math.random() < p;
}

/** Deterministische ID für Listen-Keys. */
let idCounter = 0;
export function nextId(prefix = 'id') {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
