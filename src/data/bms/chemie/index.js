/**
 * BMS – Chemie.
 *
 * Ein Modul je Thema, zusammengesetzt erst hier. Niveau österreichische Matura:
 * Die Einträge decken das Stichwort vollständig ab, ohne ins Universitäre zu
 * gehen; die Schlüsselfakten zielen auf die typischen Prüfungsfallen.
 */
import { TOPIC as atombau, QUESTIONS as atombauQuestions } from './atombau.js';
import { TOPIC as bindung, QUESTIONS as bindungQuestions } from './bindung.js';
import { TOPIC as stoffe, QUESTIONS as stoffeQuestions } from './stoffe.js';
import { TOPIC as stoechiometrie, QUESTIONS as stoechiometrieQuestions } from './stoechiometrie.js';
import { TOPIC as reaktionen, QUESTIONS as reaktionenQuestions } from './reaktionen.js';
import { TOPIC as saeuren, QUESTIONS as saeurenQuestions } from './saeuren.js';
import { TOPIC as redox, QUESTIONS as redoxQuestions } from './redox.js';
import { TOPIC as kohlenwasserstoffe, QUESTIONS as kohlenwasserstoffeQuestions } from './kohlenwasserstoffe.js';
import { TOPIC as funktionell, QUESTIONS as funktionellQuestions } from './funktionell.js';
import { TOPIC as naturstoffe, QUESTIONS as naturstoffeQuestions } from './naturstoffe.js';

export const TOPICS = [
  atombau,
  bindung,
  stoffe,
  stoechiometrie,
  reaktionen,
  saeuren,
  redox,
  kohlenwasserstoffe,
  funktionell,
  naturstoffe,
];

export const QUESTIONS = [
  ...atombauQuestions,
  ...bindungQuestions,
  ...stoffeQuestions,
  ...stoechiometrieQuestions,
  ...reaktionenQuestions,
  ...saeurenQuestions,
  ...redoxQuestions,
  ...kohlenwasserstoffeQuestions,
  ...funktionellQuestions,
  ...naturstoffeQuestions,
];
