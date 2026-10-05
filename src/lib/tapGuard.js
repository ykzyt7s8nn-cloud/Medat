/**
 * Tipp oder Scrollen? – die Entscheidung, ob eine Berührung als Tipp zählt.
 *
 * Auf dem iPhone kam beim Herunterscrollen immer wieder eine Antwort durch: Der
 * Finger landet zum Scrollen auf einer Antwortfläche, und am Ende steht ein
 * Klick. Zwei Wege führen dorthin. Zum einen liegt über jeder tappbaren Fläche
 * der native Schalter für die Haptik (ui/Tappable.jsx), und ein solcher
 * Schalter wertet Berührungen selbst aus – er lässt sich ziehen und schaltet
 * beim Loslassen, gleich wohin sich der Finger bewegt hat. Zum anderen gibt
 * Safari einen Klick auch dann, wenn sich der Finger ein Stück bewegt hat, die
 * Seite aber (noch) nicht scrollt, oder wenn ein Tipp nur die auslaufende
 * Scrollbewegung anhält.
 *
 * Deshalb verlässt sich die Fläche nicht mehr darauf, dass ein Klick ein Tipp
 * war, sondern prüft das selbst: Zählt nur, wenn der Finger in der Nähe des
 * Aufsetzpunkts geblieben ist, kein umgebender Bereich währenddessen gescrollt
 * hat und der Finger nicht in eine gerade noch laufende Scrollbewegung getippt
 * hat. Die Regeln stehen hier als reine Funktionen, damit der Selbsttest sie
 * ohne Browser prüfen kann.
 */

/** Weiter als so viele Pixel vom Aufsetzpunkt weg ist es kein Tipp mehr. */
export const TAP_SLOP_PX = 10;

/**
 * Wer in eine laufende Scrollbewegung tippt, will sie anhalten, nicht wählen.
 * Ein Tipp so kurz nach dem letzten Scrollschritt zählt deshalb nicht.
 */
export const SCROLL_SETTLE_MS = 120;

/**
 * Nach so langer Zeit gehört ein Klick nicht mehr zur letzten Berührung –
 * er kommt dann von Tastatur oder VoiceOver und wird nicht geprüft.
 */
export const GESTURE_MAX_AGE_MS = 1000;

/** true, wenn sich der Finger weiter als die Toleranz bewegt hat. */
export function exceedsTapSlop(start, point, slop = TAP_SLOP_PX) {
  if (!start || !point) return false;
  const dx = point.x - start.x;
  const dy = point.y - start.y;
  return dx * dx + dy * dy > slop * slop;
}

/**
 * Entscheidet, ob ein Klick als bewusster Tipp gilt.
 *
 * @param {object|null} gesture Die letzte Berührung der Fläche:
 *   { downAt, endedAt?, moved, cancelled }
 * @param {object} context
 * @param {number} context.now Zeitpunkt des Klicks.
 * @param {number} [context.lastScrollAt] Letzter Scrollschritt eines Bereichs,
 *   der die Fläche enthält (0 = nie).
 * @returns {boolean}
 */
export function isDeliberateTap(gesture, { now, lastScrollAt = 0 }) {
  // Ohne zugehörige Berührung kommt der Klick von Tastatur oder VoiceOver.
  if (!gesture) return true;
  const reference = gesture.endedAt ?? gesture.downAt;
  if (now - reference > GESTURE_MAX_AGE_MS) return true;

  if (gesture.moved || gesture.cancelled) return false;
  // Während der Berührung gescrollt – oder kurz davor noch in Bewegung.
  if (lastScrollAt && lastScrollAt >= gesture.downAt - SCROLL_SETTLE_MS) return false;
  return true;
}
