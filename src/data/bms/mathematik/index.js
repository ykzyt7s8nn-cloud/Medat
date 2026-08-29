/**
 * BMS – Mathematik.
 *
 * Ein Modul je Thema, zusammengesetzt erst hier. Alle Aufgaben sind so gewählt,
 * dass sie im Kopf lösbar bleiben – im BMS ist kein Taschenrechner erlaubt.
 */
import { TOPIC as grundlagen, QUESTIONS as grundlagenQuestions } from './grundlagen.js';
import { TOPIC as funktionen, QUESTIONS as funktionenQuestions } from './funktionen.js';
import { TOPIC as geometrie, QUESTIONS as geometrieQuestions } from './geometrie.js';
import { TOPIC as statistik, QUESTIONS as statistikQuestions } from './statistik.js';

export const TOPICS = [grundlagen, funktionen, geometrie, statistik];

export const QUESTIONS = [
  ...grundlagenQuestions,
  ...funktionenQuestions,
  ...geometrieQuestions,
  ...statistikQuestions,
];
