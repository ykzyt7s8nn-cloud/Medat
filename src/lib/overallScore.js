/**
 * Gewichteter Gesamtwert über die vier Testteile.
 *
 * Im MedAT-H zählen Basiskenntnistest und kognitive Fähigkeiten je 40 %,
 * Textverständnis und sozial-emotionale Kompetenzen je 10 %. Die Gewichte
 * stehen in data/testConfig.js und werden hier nur angewandt.
 *
 * Zwei Dinge, die diese Zahl ausdrücklich nicht ist:
 *
 *   1. Keine Prognose. Im echten Test wird nicht der Prozentsatz richtiger
 *      Antworten gewichtet, sondern der Rang gegenüber allen Mitschreibenden.
 *      Wer hier 70 % erreicht, hat damit keinen Prozentrang von 70.
 *   2. Kein Ersatz für die Einzelwerte. Ein guter Gesamtwert kann eine
 *      Schwäche in einem Teil verdecken, weil der BMS vier Zehntel trägt.
 *
 * Was sie leistet: Sie zeigt, wo Übung am meisten bringt. Zehn Prozentpunkte
 * im BMS wiegen viermal so schwer wie zehn im Textverständnis – das ist beim
 * Planen die nützlichste Information, und ohne Gewichtung sieht man sie nicht.
 *
 * Fehlt ein Teil noch ganz, wird er ausgelassen und die übrigen Gewichte auf
 * das verbliebene Gesamtgewicht hochgerechnet. Eine solche Zahl steht auf
 * dünnerem Grund, deshalb gibt die Funktion mit aus, welcher Anteil des Tests
 * überhaupt abgedeckt ist.
 */
import { SECTIONS, SECTION_ORDER } from '../data/testConfig.js';

/**
 * @param {Object} percents Anteil richtiger Antworten je Testteil (0 bis 1),
 *   null oder undefined, wenn dazu noch nichts geübt wurde.
 * @returns {{percent: number|null, coverage: number, missing: string[], parts: Array}}
 */
export function weightedScore(percents) {
  const parts = SECTION_ORDER.map((id) => ({
    id,
    name: SECTIONS[id].name,
    short: SECTIONS[id].short,
    weight: SECTIONS[id].weight,
    value: typeof percents?.[id] === 'number' ? percents[id] : null,
  }));

  const withData = parts.filter((part) => part.value !== null);
  const coverage = withData.reduce((sum, part) => sum + part.weight, 0);

  return {
    percent: coverage === 0
      ? null
      : withData.reduce((sum, part) => sum + part.value * part.weight, 0) / coverage,
    coverage,
    missing: parts.filter((part) => part.value === null).map((part) => part.short),
    parts,
  };
}

/**
 * Wie viel ein Testteil am Gesamtwert noch gewinnen kann – Grundlage für die
 * Empfehlung, woran als Nächstes zu arbeiten ist. Ein ungeübter Teil zählt
 * dabei nicht mit: Über ihn ist nichts bekannt, und eine Empfehlung braucht
 * einen Messwert.
 */
export function biggestGain(percents) {
  const parts = weightedScore(percents).parts.filter((part) => part.value !== null);
  if (parts.length === 0) return null;
  return parts.reduce(
    (best, part) => ((1 - part.value) * part.weight > (1 - best.value) * best.weight ? part : best),
    parts[0],
  );
}
