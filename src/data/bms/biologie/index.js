/**
 * BMS – Biologie.
 *
 * Ein Modul je Thema: Das hält die Dateien lesbar und erlaubt es, ein Thema zu
 * überarbeiten, ohne die übrigen anzufassen. Zusammengesetzt wird erst hier.
 *
 * Niveau durchgehend österreichische Matura. Die Erklärungen decken das
 * Stichwort sicher ab, ohne ins Universitäre zu gehen; die Schlüsselfakten
 * sind auf die typischen Prüfungsfallen zugeschnitten.
 */
import { TOPIC as zelle, QUESTIONS as zelleQuestions } from './zelle.js';
import { TOPIC as koerper, QUESTIONS as koerperQuestions } from './koerper.js';
import { TOPIC as entwicklung, QUESTIONS as entwicklungQuestions } from './entwicklung.js';
import { TOPIC as genetik, QUESTIONS as genetikQuestions } from './genetik.js';
import { TOPIC as molekulargenetik, QUESTIONS as molekulargenetikQuestions } from './molekulargenetik.js';
import { TOPIC as humangenetik, QUESTIONS as humangenetikQuestions } from './humangenetik.js';
import { TOPIC as evolution, QUESTIONS as evolutionQuestions } from './evolution.js';
import { TOPIC as oekologie, QUESTIONS as oekologieQuestions } from './oekologie.js';
import { TOPIC as immunbiologie, QUESTIONS as immunbiologieQuestions } from './immunbiologie.js';

export const TOPICS = [
  zelle,
  koerper,
  genetik,
  molekulargenetik,
  humangenetik,
  entwicklung,
  evolution,
  oekologie,
  immunbiologie,
];

export const QUESTIONS = [
  ...zelleQuestions,
  ...koerperQuestions,
  ...genetikQuestions,
  ...molekulargenetikQuestions,
  ...humangenetikQuestions,
  ...entwicklungQuestions,
  ...evolutionQuestions,
  ...oekologieQuestions,
  ...immunbiologieQuestions,
];
