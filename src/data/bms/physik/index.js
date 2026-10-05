/**
 * BMS – Physik.
 *
 * Ein Modul je Thema, zusammengesetzt erst hier. Niveau österreichische Matura;
 * die Rechenaufgaben bleiben bewusst im Kopfrechenbereich, weil im BMS kein
 * Taschenrechner erlaubt ist.
 */
import { TOPIC as mechanik, QUESTIONS as mechanikQuestions } from './mechanik.js';
import { TOPIC as fluide, QUESTIONS as fluideQuestions } from './fluide.js';
import { TOPIC as waerme, QUESTIONS as waermeQuestions } from './waerme.js';
import { TOPIC as elektrik, QUESTIONS as elektrikQuestions } from './elektrik.js';
import { TOPIC as optik, QUESTIONS as optikQuestions } from './optik.js';
import { TOPIC as atom, QUESTIONS as atomQuestions } from './atom.js';

export const TOPICS = [mechanik, fluide, waerme, elektrik, optik, atom];

export const QUESTIONS = [
  ...mechanikQuestions,
  ...fluideQuestions,
  ...waermeQuestions,
  ...elektrikQuestions,
  ...optikQuestions,
  ...atomQuestions,
];
