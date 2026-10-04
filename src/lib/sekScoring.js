/**
 * Auswertung der drei SEK-Untertests.
 *
 * Jeder zählt anders, und das ist keine Willkür, sondern Vorgabe:
 *
 *   Emotionen erkennen   Alles oder nichts. Ein Punkt nur, wenn alle fünf
 *                        Einschätzungen einer Aufgabe stimmen.
 *   Emotionen regulieren Ein Kreuz, ein Punkt.
 *   Soziales Entscheiden Teilpunkte nach Übereinstimmung: bis zu ein Punkt
 *                        je Aufgabe, abgestuft danach, wie nah die gesetzte
 *                        Reihung an der erwarteten liegt.
 *
 * Zum Sozialen Entscheiden: Die offiziellen Hinweise (medizinstudieren.at,
 * „Tipps und Tricks“) sagen, dass die Leistung aus der Übereinstimmung der
 * eigenen mit der aus der Theorie abgeleiteten Rangreihe folgt und über ein
 * Zusammenhangsmaß bestimmt wird – gezählt werden also nicht richtig gesetzte
 * Kreuze. Welches Maß, wird nicht gesagt. Hier steht die Rangkorrelation
 * nach Spearman: Bei fünf Plätzen ergibt sie genau die Teilpunkte, die in
 * Erfahrungsberichten genannt werden (zwei benachbarte Plätze vertauscht
 * 0,9, drei im Kreis verschoben 0,7). Eine gegenläufige Reihung zählt null,
 * nicht negativ.
 *
 * Der Unterschied zum bloßen Markenzählen ist erheblich: Wer a und b
 * vertauscht, hätte dort nur drei von fünf Marken, verfehlt die erwartete
 * Reihung aber kaum (0,9). Wer zusätzlich d und e vertauscht, hätte nur noch
 * eine Marke, aber immer noch 0,8. Umgekehrt kostet ein grober Fehler – die
 * wichtigste Überlegung ganz nach unten – viel mehr als zwei Marken.
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

  // Soziales Entscheiden: Unvollständig ist ungültig, wie im Test ein doppelt
  // oder gar nicht vergebener Platz.
  if (!isSekComplete(testId, task, value)) return 0;
  return rankAgreement(task, value);
}

/**
 * Übereinstimmung einer vollständigen Reihung mit der erwarteten, als
 * Spearman-Korrelation auf eine Nachkommastelle, negative Werte als null.
 *
 * `value` ist die Reihenfolge der Anzeigepositionen – value[0] ist die
 * Aussage, die auf Platz a gesetzt wurde; `rank` ist ihr erwarteter Platz.
 */
export function rankAgreement(task, value) {
  const n = task.statements.length;
  const squared = value.reduce((sum, displayIndex, place) => {
    const d = place - task.statements[displayIndex].rank;
    return sum + d * d;
  }, 0);
  const rho = 1 - (6 * squared) / (n * (n * n - 1));
  return Math.max(0, Math.round(rho * 10) / 10);
}

/** Wie viele Aussagen auf ihrem erwarteten Platz stehen – nur zur Anzeige. */
export function correctPlaces(task, value) {
  if (!Array.isArray(value)) return 0;
  return value.filter((displayIndex, place) => task.statements[displayIndex]?.rank === place).length;
}

/** Höchstpunktzahl je Aufgabe – in allen drei Untertests ein Punkt. */
export function pointsPerTask() {
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
