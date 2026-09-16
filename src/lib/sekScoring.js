/**
 * Auswertung der drei SEK-Untertests.
 *
 * Jeder zählt anders, und das ist keine Willkür, sondern Vorgabe:
 *
 *   Emotionen erkennen   Alles oder nichts. Ein Punkt nur, wenn alle fünf
 *                        Einschätzungen einer Aufgabe stimmen.
 *   Emotionen regulieren Ein Kreuz, ein Punkt.
 *   Soziales Entscheiden Teilpunkte: Jede richtig gesetzte Marke zählt,
 *                        also bis zu fünf Punkte je Aufgabe.
 *
 * Deshalb steht hier `pointsPerTask` neben der Punktefunktion: Die
 * Ergebnisanzeige rechnet `max` daraus, und ohne diese Zahl sähe ein
 * Durchgang „Soziales Entscheiden“ nach 14 statt nach 70 Punkten aus.
 *
 * Reine Funktionen ohne Speicher- oder React-Zugriff, damit der Selbsttest sie
 * prüfen kann.
 */

/** Antwortform je Untertest, für die Navigation („ist die Aufgabe fertig?“). */
export function isSekComplete(testId, task, value) {
  if (!task) return false;
  if (testId === 'emotionsRecognise') {
    return Array.isArray(value)
      && value.length === task.emotions.length
      && value.every((entry) => entry === true || entry === false);
  }
  if (testId === 'emotionsRegulate') {
    return typeof value === 'number';
  }
  // Soziales Entscheiden: erst vollständig, wenn alle fünf Plätze vergeben sind.
  return Array.isArray(value) && value.length === task.statements.length;
}

/** Erreichte Punkte einer einzelnen Aufgabe. */
export function scoreSekTask(testId, task, value) {
  if (!task) return 0;

  if (testId === 'emotionsRecognise') {
    if (!Array.isArray(value)) return 0;
    // Alles oder nichts: Eine einzige Fehleinschätzung kostet die ganze Aufgabe.
    return task.emotions.every((emotion, i) => value[i] === emotion.likely) ? 1 : 0;
  }

  if (testId === 'emotionsRegulate') {
    return task.options[value]?.correct ? 1 : 0;
  }

  // Soziales Entscheiden: `value` ist die Reihenfolge der Anzeigepositionen –
  // value[0] ist die Aussage, die auf Platz a gesetzt wurde. Richtig ist sie
  // dort, wenn ihr hinterlegter Rang dem Platz entspricht.
  if (!Array.isArray(value)) return 0;
  return value.reduce(
    (sum, displayIndex, place) => sum + (task.statements[displayIndex]?.rank === place ? 1 : 0),
    0,
  );
}

/** Höchstpunktzahl je Aufgabe – Grundlage für `max` im Ergebnis. */
export function pointsPerTask(testId, task) {
  if (testId === 'socialDecision') return task?.statements.length ?? 5;
  return 1;
}

/** Wie die gegebene Antwort im Ergebnis benannt wird. */
export function describeSekAnswer(testId, task, value) {
  const letters = ['a', 'b', 'c', 'd', 'e'];

  if (testId === 'emotionsRecognise') {
    if (!Array.isArray(value)) return 'keine Antwort';
    return task.emotions
      .map((emotion, i) => `${emotion.emotion}: ${value[i] ? 'wahrscheinlich' : 'unwahrscheinlich'}`)
      .join(' · ');
  }

  if (testId === 'emotionsRegulate') {
    if (typeof value !== 'number') return 'keine Antwort';
    return `${letters[value]}) ${task.options[value].text}`;
  }

  if (!Array.isArray(value) || value.length === 0) return 'keine Antwort';
  return value
    .map((displayIndex, place) => `${letters[place]}) ${task.statements[displayIndex].text}`)
    .join(' · ');
}

/** Wie die richtige Lösung im Ergebnis benannt wird. */
export function describeSekSolution(testId, task) {
  const letters = ['a', 'b', 'c', 'd', 'e'];

  if (testId === 'emotionsRecognise') {
    const likely = task.emotions.filter((emotion) => emotion.likely).map((emotion) => emotion.emotion);
    return likely.length === 0
      ? 'keine der fünf Emotionen ist wahrscheinlich'
      : `wahrscheinlich: ${likely.join(', ')}`;
  }

  if (testId === 'emotionsRegulate') {
    const index = task.options.findIndex((option) => option.correct);
    return `${letters[index]}) ${task.options[index].text}`;
  }

  return [...task.statements]
    .sort((a, b) => a.rank - b.rank)
    .map((statement, place) => `${letters[place]}) ${statement.text}`)
    .join(' · ');
}
