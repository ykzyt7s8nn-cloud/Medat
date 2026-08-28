/**
 * Untertest "Gedächtnis & Merkfähigkeit".
 *
 * Ablauf laut MedAT:
 *   1. Lernphase   – 8 Allergieausweise, 8 Minuten
 *   2. Pause       – im echten Test liegen andere Untertests dazwischen; hier
 *                    einstellbar 2/5/10/20/40 Minuten
 *   3. Prüfphase   – 25 Fragen, 15 Minuten, je 5 Antworten (e = keine richtig)
 *
 * Die Komponente wird auch von der Simulation genutzt. Über `stage` lässt sich
 * gezielt nur die Lern- oder nur die Prüfphase starten; die erzeugten Ausweise
 * werden dabei von außen durchgereicht.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import AllergyCard from '../../components/memory/AllergyCard.jsx';
import AnswerOption from '../../components/ui/AnswerOption.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import ProgressRing from '../../components/ui/ProgressRing.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { TESTS } from '../../data/testConfig.js';
import { generateMemorySession } from '../../engines/memory.js';
import { formatTime, useCountdown } from '../../hooks/useCountdown.js';
import { secondsSince } from '../../lib/format.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useSwipe } from '../../hooks/useSwipe.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

const TEST = TESTS.memory;

/* -------------------------------------------------------------- Lernphase */

function LearnGallery({ cards }) {
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const swipe = useSwipe({
    onSwipeLeft: () => setIndex((i) => Math.min(cards.length - 1, i + 1)),
    onSwipeRight: () => setIndex((i) => Math.max(0, i - 1)),
  });

  if (showAll) {
    return (
      <div className="space-y-3">
        <Tappable
          onClick={() => setShowAll(false)}
          className="ios-card w-full px-4 py-2.5 text-[15px] font-medium text-ios-blue"
        >
          Einzelansicht
        </Tappable>
        {cards.map((card) => (
          <AllergyCard key={card.id} card={card} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3" {...swipe}>
      <AllergyCard card={cards[index]} className="animate-fade-in" />

      <div className="flex items-center justify-center gap-1.5" role="tablist" aria-label="Ausweise">
        {cards.map((card, i) => (
          <Tappable
            key={card.id}
            role="tab"
            aria-selected={i === index}
            aria-label={`Ausweis ${i + 1}`}
            onClick={() => setIndex(i)}
            silent
            className={`h-2 rounded-full transition-all duration-200 ${
              i === index ? 'w-6 bg-ios-blue' : 'w-2 bg-black/20 dark:bg-white/25'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="neutral"
          size="sm"
          className="flex-1 whitespace-nowrap"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
          Zurück
        </Button>
        <Button variant="secondary" size="sm" className="whitespace-nowrap" onClick={() => setShowAll(true)}>
          Alle
        </Button>
        <Button
          variant="neutral"
          size="sm"
          className="flex-1 whitespace-nowrap"
          onClick={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
          disabled={index === cards.length - 1}
        >
          Weiter
          <Icon name="chevronRight" className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-[13px] text-black/45 dark:text-white/45">
        Ausweis {index + 1} von {cards.length} · nach links wischen für den nächsten
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ Hauptscreen */

export default function MemoryTest({
  embedded = false,
  stage: initialStage,
  session: providedSession,
  onLearnComplete,
  onFinish,
  focusTags = null,
}) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const timerSetting = useSettings((state) => state.timers.memory);
  const breakMinutes = useSettings((state) => state.breakMinutes);
  const feedback = useFeedback();

  const useTimer = embedded ? true : timerSetting;
  const [stage, setStage] = useState(initialStage ?? 'intro');
  const [session, setSession] = useState(providedSession ?? null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const startedAt = useRef(Date.now());

  // Zeit je Frage: Die Prüfphase erlaubt Vor- und Zurückspringen, deshalb wird
  // die Verweildauer je Frage aufsummiert statt einmalig gemessen.
  const timingsRef = useRef({});
  const questionStartedAt = useRef(Date.now());
  const currentQuestionIdRef = useRef(null);

  const flushTiming = useCallback(() => {
    const id = currentQuestionIdRef.current;
    if (!id) return;
    const delta = secondsSince(questionStartedAt.current);
    timingsRef.current[id] = (timingsRef.current[id] ?? 0) + delta;
    questionStartedAt.current = Date.now();
  }, []);

  /* --- Lernphase ------------------------------------------------------- */
  const learnCountdown = useCountdown(TEST.learnSeconds, {
    enabled: useTimer && stage === 'learn',
    autoStart: false,
    onExpire: () => {
      feedback.warning();
      if (embedded) onLearnComplete?.(session);
      else setStage('break');
    },
  });

  /* --- Pause ------------------------------------------------------------ */
  const breakCountdown = useCountdown(breakMinutes * 60, {
    enabled: stage === 'break',
    autoStart: false,
    onExpire: () => startQuiz(),
  });

  /* --- Prüfphase -------------------------------------------------------- */
  const finish = useCallback(
    (finalAnswers) => {
      flushTiming();
      const timings = timingsRef.current;
      const questions = session?.questions ?? [];
      const items = questions.map((question, i) => {
        const given = finalAnswers[question.id];
        const correctOption = question.options.find((option) => option.correct);
        return {
          id: question.id,
          number: i + 1,
          correct: given === question.correctLetter,
          prompt: question.prompt,
          correctText: correctOption.text,
          givenText: given ? question.options.find((o) => o.letter === given)?.text : 'keine Antwort',
          explanation: question.solution,
          cardIds: question.cardIds,
          typeId: question.typeId,
          typeLabel: question.typeLabel,
          seconds: timings[question.id] ?? 0,
        };
      });
      const score = items.filter((item) => item.correct).length;
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      setResults(items);
      if (!embedded) {
        addResult({
          testId: TEST.id,
          score,
          max: questions.length,
          seconds,
          breakdown: items.map((item) => ({
            tag: item.typeId,
            label: item.typeLabel,
            correct: item.correct,
            seconds: item.seconds,
          })),
        });
      }
      feedback.done();
      setStage('result');
      onFinish?.({ testId: TEST.id, score, max: questions.length, seconds, results: items });
    },
    [addResult, embedded, feedback, flushTiming, onFinish, session],
  );

  const quizCountdown = useCountdown(TEST.testSeconds, {
    enabled: useTimer && stage === 'quiz',
    autoStart: false,
    onExpire: () => finish(answers),
  });

  const startQuiz = useCallback(() => {
    setIndex(0);
    setAnswers({});
    timingsRef.current = {};
    currentQuestionIdRef.current = null;
    startedAt.current = Date.now();
    questionStartedAt.current = Date.now();
    setStage('quiz');
    quizCountdown.reset(TEST.testSeconds);
  }, [quizCountdown]);

  const startLearn = useCallback(
    (existing) => {
      const newSession = existing ?? generateMemorySession(TEST.cardCount, TEST.questionCount, { preferTypes: focusTags });
      setSession(newSession);
      setStage('learn');
      learnCountdown.reset(TEST.learnSeconds);
    },
    [focusTags, learnCountdown],
  );

  // Simulation: die Phase wird von außen vorgegeben und startet sofort.
  useEffect(() => {
    if (!embedded) return;
    if (initialStage === 'learn') {
      if (!session) setSession(generateMemorySession(TEST.cardCount, TEST.questionCount, { preferTypes: focusTags }));
      learnCountdown.reset(TEST.learnSeconds);
    } else if (initialStage === 'quiz') {
      startedAt.current = Date.now();
      quizCountdown.reset(TEST.testSeconds);
    }
    // Nur beim Einhängen der Phase ausführen – die Countdown-Objekte ändern sich
    // bei jedem Tick und dürfen deshalb nicht in die Abhängigkeiten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded, initialStage]);

  // Beim Wechsel der Frage die Uhr auf die neue Frage stellen
  useEffect(() => {
    if (stage !== 'quiz' || !session) return;
    currentQuestionIdRef.current = session.questions[index]?.id ?? null;
    questionStartedAt.current = Date.now();
  }, [index, session, stage]);

  const startBreak = () => {
    setStage('break');
    breakCountdown.reset(breakMinutes * 60);
  };

  /* ------------------------------------------------------------ Rendering */

  if (stage === 'intro') {
    return (
      <Screen title={TEST.name} onClose={closeScreen}>
        <TestIntro
          test={{ ...TEST, testSeconds: TEST.learnSeconds + TEST.testSeconds }}
          timerEnabled={timerSetting}
          startLabel="Lernphase starten"
          facts={[
            '8 Allergieausweise in 8 Minuten einprägen',
            `Danach ${breakMinutes} Minuten Pause (in den Einstellungen änderbar)`,
            '25 Fragen in 15 Minuten, je 5 Antwortmöglichkeiten',
            'Jeder Ausweis enthält 8 Felder – auch Blutdruck und Brille werden abgefragt',
          ]}
          onStart={() => startLearn()}
        />
      </Screen>
    );
  }

  if (stage === 'learn' && session) {
    const warning = useTimer && learnCountdown.remaining <= 3 && learnCountdown.remaining > 0;
    return (
      <Screen
        title="Lernphase"
        onClose={embedded ? undefined : closeScreen}
        headerExtra={
          <TimerBar
            remaining={learnCountdown.remaining}
            total={TEST.learnSeconds}
            enabled={useTimer}
            accent={TEST.accent}
            progressLabel="Alle 8 Ausweise einprägen"
          />
        }
        footer={
          !embedded && (
            <div className="px-3 py-3">
              <Button size="lg" variant="secondary" onClick={startBreak}>
                Lernphase beenden
              </Button>
            </div>
          )
        }
      >
        {warning && (
          <div className="mb-3 animate-pop rounded-card bg-ios-orange px-4 py-3 text-center text-[17px] font-bold text-white">
            Lernphase endet in {learnCountdown.remaining} …
          </div>
        )}
        <LearnGallery cards={session.cards} />
      </Screen>
    );
  }

  if (stage === 'break') {
    const total = breakMinutes * 60;
    return (
      <Screen title="Pause" onClose={embedded ? undefined : closeScreen}>
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <ProgressRing
            value={total > 0 ? breakCountdown.remaining / total : 0}
            size={168}
            strokeWidth={12}
            color={TEST.accent}
          >
            <span className="tabular text-[32px] font-bold">{formatTime(breakCountdown.remaining)}</span>
          </ProgressRing>
          <div className="px-6">
            <h2 className="text-[19px] font-bold">Im echten MedAT folgen jetzt andere Untertests</h2>
            <p className="mt-2 text-[15px] text-black/60 dark:text-white/60">
              Zwischen Lern- und Prüfphase liegen rund 40 Minuten. Warte kurz – oder überspringe die
              Pause, wenn du direkt weiterüben möchtest.
            </p>
          </div>
          <div className="w-full space-y-2 px-2">
            <Button size="lg" onClick={startQuiz}>
              Pause überspringen und Prüfphase starten
            </Button>
            {!embedded && (
              <Button size="lg" variant="neutral" onClick={closeScreen}>
                Abbrechen
              </Button>
            )}
          </div>
        </div>
      </Screen>
    );
  }

  if (stage === 'quiz' && session) {
    const question = session.questions[index];
    const selected = answers[question.id];
    const answered = Object.keys(answers).length;

    const choose = (option) => {
      feedback.tap();
      setAnswers((current) => ({ ...current, [question.id]: option.letter }));
    };

    const advance = () => {
      flushTiming();
      if (index + 1 >= session.questions.length) finish(answers);
      else setIndex(index + 1);
    };

    const goBack = () => {
      flushTiming();
      setIndex(Math.max(0, index - 1));
    };

    return (
      <Screen
        title="Prüfphase"
        onClose={embedded ? undefined : closeScreen}
        headerExtra={
          <TimerBar
            remaining={quizCountdown.remaining}
            total={TEST.testSeconds}
            enabled={useTimer}
            accent={TEST.accent}
            progressLabel={`Frage ${index + 1} von ${session.questions.length} · ${answered} beantwortet`}
          />
        }
        footer={
          <div className="flex gap-2 px-3 py-3">
            <Button
              variant="neutral"
              size="md"
              onClick={goBack}
              disabled={index === 0}
            >
              <Icon name="chevronLeft" className="h-5 w-5" />
            </Button>
            <Button size="md" className="flex-1" onClick={advance}>
              {index + 1 >= session.questions.length ? 'Abgeben und auswerten' : 'Nächste Frage'}
              <Icon name="chevronRight" className="h-5 w-5" />
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <h2 className="px-1 text-[17px] font-semibold leading-snug">{question.prompt}</h2>
          <div className="space-y-2">
            {question.options.map((option) => (
              <AnswerOption
                key={option.letter}
                letter={option.letter}
                selected={selected === option.letter}
                onClick={() => choose(option)}
              >
                {option.text}
              </AnswerOption>
            ))}
          </div>
          <p className="px-1 text-center text-[13px] text-black/45 dark:text-white/45">
            Antworten lassen sich bis zur Abgabe ändern.
          </p>
        </div>
      </Screen>
    );
  }

  if (stage === 'result') {
    const score = results.filter((item) => item.correct).length;
    return (
      <Screen title="Gedächtnis – Ergebnis" onClose={closeScreen}>
        <ResultView
          title="Gedächtnis & Merkfähigkeit"
          score={score}
          max={session?.questions.length ?? TEST.questionCount}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          renderReview={(item) => (
            <div className="space-y-3">
              <p className="text-[14px] text-black/60 dark:text-white/60">{item.explanation}</p>
              {(item.cardIds ?? []).slice(0, 2).map((cardId) => {
                const card = session.cards.find((c) => c.id === cardId);
                return card ? <AllergyCard key={cardId} card={card} compact /> : null;
              })}
            </div>
          )}
          onRestart={() => startLearn()}
          onClose={closeScreen}
        />
      </Screen>
    );
  }

  return null;
}
