/**
 * Zustand eines Durchgangs – für Übungs- und Prüfungsmodus gleichermaßen.
 *
 * Im echten MedAT arbeitet man einen Untertest nicht zwingend der Reihe nach ab:
 * Man überspringt, was gerade nicht aufgeht, holt anderswo Punkte und knobelt am
 * Ende in Ruhe an den offenen Aufgaben. Deshalb liegt hier in beiden Modi
 * dieselbe Mechanik – Antworten je Index, freies Springen, Markieren.
 *
 * Der einzige Unterschied zwischen den Modi ist die Auflösung: Im Übungsmodus
 * wird eine Aufgabe nach dem Beantworten sofort aufgedeckt (reveal), im
 * Prüfungsmodus erst bei der Abgabe. Antworten und Zeiten werden identisch
 * geführt, damit die Auswertung nur einen Weg kennt.
 *
 * Die Verweildauer je Aufgabe wird aufsummiert, weil man mehrfach zu einer
 * Aufgabe zurückkehren kann.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { secondsSince } from '../lib/format.js';

/**
 * Eine Antwort zählt als gegeben, wenn sie gesetzt und nicht leer ist.
 * Besteht sie aus mehreren Feldern (Zahlenfolgen: zwei gesuchte Zahlen), gilt
 * sie erst als gegeben, wenn alle Felder gefüllt sind – ein halb ausgefülltes
 * Feld ist in der Übersicht eine offene Aufgabe.
 */
export function isAnswered(value) {
  if (Array.isArray(value)) return value.length > 0 && value.every((part) => part !== '' && part !== '-');
  return value !== undefined && value !== null && value !== '';
}

/**
 * @param {number} count Zahl der Aufgaben des Durchgangs.
 * @param {object} [options]
 * @param {(value: any, index: number) => boolean} [options.isComplete]
 *   Wann eine Antwort vollständig ist. Vorgabe ist isAnswered; das BMS-Quiz
 *   braucht mehr, weil eine „x aus 5“-Frage erst mit x Kreuzen fertig ist –
 *   sonst gälte sie schon nach dem ersten als erledigt und würde übersprungen.
 */
export function useTaskSession(count, { isComplete } = {}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [revealed, setRevealed] = useState({});

  // Die Vollständigkeitsprüfung landet in einem Ref, damit sich die Rückgaben
  // nicht bei jedem Render ändern, wenn der Aufrufer sie inline schreibt.
  const isCompleteRef = useRef(isComplete);
  isCompleteRef.current = isComplete;
  const done = useCallback((i, value) => (isCompleteRef.current
    ? isCompleteRef.current(value, i)
    : isAnswered(value)), []);

  const timings = useRef({});
  const startedAt = useRef(Date.now());
  const currentIndex = useRef(0);

  /** Verweildauer der zuletzt gezeigten Aufgabe verbuchen. */
  const flushTiming = useCallback(() => {
    const i = currentIndex.current;
    timings.current[i] = (timings.current[i] ?? 0) + secondsSince(startedAt.current);
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    currentIndex.current = index;
    startedAt.current = Date.now();
  }, [index]);

  const goTo = useCallback((next) => {
    flushTiming();
    setIndex(Math.max(0, Math.min(count - 1, next)));
  }, [count, flushTiming]);

  /**
   * Nächste offene Aufgabe ab einer Position, im Kreis gesucht – so landet man
   * beim Überspringen der letzten Aufgabe wieder bei der ersten offenen und
   * nicht in einer Sackgasse. Ohne offene Aufgabe: null.
   */
  const nextOpenAfter = useCallback(
    (from) => {
      if (count <= 0) return null;
      for (let step = 1; step <= count; step += 1) {
        const i = (from + step) % count;
        if (!done(i, answers[i])) return i;
      }
      return null;
    },
    [answers, count, done],
  );

  const openIndexes = useMemo(
    () => Array.from({ length: Math.max(0, count) }, (_, i) => i).filter((i) => !done(i, answers[i])),
    [answers, count, done],
  );

  const reset = useCallback(() => {
    timings.current = {};
    startedAt.current = Date.now();
    currentIndex.current = 0;
    setIndex(0);
    setAnswers({});
    setFlags({});
    setRevealed({});
  }, []);

  return {
    index,
    answers,
    flags,
    revealed,
    setAnswer: useCallback((i, value) => setAnswers((current) => ({ ...current, [i]: value })), []),
    /** Übungsmodus: Aufgabe ist aufgelöst und wird nicht mehr entgegengenommen. */
    reveal: useCallback((i) => setRevealed((current) => ({ ...current, [i]: true })), []),
    toggleFlag: useCallback(
      (i) => setFlags((current) => ({ ...current, [i]: !current[i] })),
      [],
    ),
    goTo,
    next: useCallback(() => goTo(index + 1), [goTo, index]),
    previous: useCallback(() => goTo(index - 1), [goTo, index]),
    /** Überspringen: zur nächsten offenen Aufgabe, sonst schlicht zur nächsten. */
    skip: useCallback(() => {
      const target = nextOpenAfter(index);
      goTo(target === null ? index + 1 : target);
    }, [goTo, index, nextOpenAfter]),
    nextOpenAfter,
    openIndexes,
    /**
     * Erste noch offene Aufgabe – Ziel von „N offen · zur nächsten“. Markierte,
     * aber beantwortete Aufgaben zählen hier bewusst nicht mit, sonst stimmte
     * das Sprungziel nicht mit der genannten Zahl überein.
     */
    firstOpen: useCallback(() => (openIndexes.length ? openIndexes[0] : null), [openIndexes]),
    answeredCount: Math.max(0, count) - openIndexes.length,
    flaggedCount: Object.values(flags).filter(Boolean).length,
    /** Zeiten je Aufgabe, inklusive der gerade offenen. */
    collectTimings: useCallback(() => {
      flushTiming();
      return { ...timings.current };
    }, [flushTiming]),
    reset,
  };
}
