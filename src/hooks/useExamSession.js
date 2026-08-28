/**
 * Zustand eines Durchgangs im Prüfungsmodus.
 *
 * Anders als im Übungsmodus gibt es keine sofortige Auflösung: Man beantwortet,
 * überspringt, markiert Aufgaben zum Wiederkommen und gibt am Ende alles auf
 * einmal ab – so wie im echten MedAT, wo das Einteilen der Zeit über das
 * Ergebnis mitentscheidet.
 *
 * Die Verweildauer je Aufgabe wird aufsummiert, weil man mehrfach zu einer
 * Aufgabe zurückkehren kann.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { secondsSince } from '../lib/format.js';

export function useExamSession(count) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});

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

  const reset = useCallback(() => {
    timings.current = {};
    startedAt.current = Date.now();
    currentIndex.current = 0;
    setIndex(0);
    setAnswers({});
    setFlags({});
  }, []);

  return {
    index,
    answers,
    flags,
    setAnswer: useCallback((i, value) => setAnswers((current) => ({ ...current, [i]: value })), []),
    toggleFlag: useCallback(
      (i) => setFlags((current) => ({ ...current, [i]: !current[i] })),
      [],
    ),
    goTo,
    next: useCallback(() => goTo(index + 1), [goTo, index]),
    previous: useCallback(() => goTo(index - 1), [goTo, index]),
    /** Erste unbeantwortete oder markierte Aufgabe – für "zu den offenen Aufgaben". */
    firstOpen: useCallback(() => {
      for (let i = 0; i < count; i += 1) {
        if (answers[i] === undefined || flags[i]) return i;
      }
      return null;
    }, [answers, count, flags]),
    answeredCount: Object.values(answers).filter((value) => value !== undefined && value !== null).length,
    flaggedCount: Object.values(flags).filter(Boolean).length,
    /** Zeiten je Aufgabe, inklusive der gerade offenen. */
    collectTimings: useCallback(() => {
      flushTiming();
      return { ...timings.current };
    }, [flushTiming]),
    reset,
  };
}
