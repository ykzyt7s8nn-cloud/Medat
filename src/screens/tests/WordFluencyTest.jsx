/**
 * Untertest "Wortflüssigkeit".
 *
 * MedAT-Vorgabe: 15 Aufgaben in 20 Minuten. Aus einem Buchstabensalat ist der
 * Anfangsbuchstabe des gesuchten Substantivs zu bestimmen; Antwort e) ist immer
 * "Keine Antwort ist richtig".
 *
 * Nach jeder Antwort wird das vollständige Wort eingeblendet – grün bei
 * richtiger, rot markiert mit anschließender Auflösung bei falscher Antwort.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import AnswerOption from '../../components/ui/AnswerOption.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import TaskNavigator from '../../components/TaskNavigator.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { DIFFICULTIES, TESTS } from '../../data/testConfig.js';
import { generateWordFluencySet } from '../../engines/wordFluency.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTaskSession } from '../../hooks/useTaskSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

const TEST = TESTS.wordFluency;

/** Bezeichnung der Längenbänder für die Schwachstellen-Statistik. */
const BAND_LABELS = {
  leicht: 'Kurze Wörter (5–6 Buchstaben)',
  mittel: 'Mittlere Wörter (7–9 Buchstaben)',
  schwer: 'Lange Wörter (10–14 Buchstaben)',
};

/** Buchstabenwolke: leichte, aber deterministische Neigung je Position. */
function LetterCloud({ letters }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label={`Buchstabensalat: ${letters.join(', ')}`}>
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[24px] font-bold shadow-card dark:bg-night-tertiary"
          style={{ transform: `rotate(${((index * 37) % 11) - 5}deg)` }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

export default function WordFluencyTest({ embedded = false, onFinish, focusTags = null }) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const difficulty = useSettings((state) => state.difficulty.wordFluency);
  const timerSetting = useSettings((state) => state.timers.wordFluency);
  const examMode = useSettings((state) => state.mode === 'pruefung');
  const feedback = useFeedback();
  const session = useTaskSession(TEST.questionCount);

  const useTimer = embedded ? true : timerSetting;
  const [phase, setPhase] = useState(embedded ? 'running' : 'intro');
  const [tasks, setTasks] = useState([]);
  const [results, setResults] = useState([]);
  const startedAt = useRef(Date.now());

  const finish = useCallback(
    (finalResults) => {
      const score = finalResults.filter((item) => item.correct).length;
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      if (!embedded) {
        addResult({
          testId: TEST.id,
          score,
          max: TEST.questionCount,
          seconds,
          difficulty,
          breakdown: finalResults.map((item) => ({
            tag: item.band,
            label: BAND_LABELS[item.band] ?? item.band,
            correct: item.correct,
            seconds: item.seconds,
          })),
        });
      }
      feedback.done();
      setPhase('result');
      onFinish?.({ testId: TEST.id, score, max: TEST.questionCount, seconds, results: finalResults });
    },
    [addResult, difficulty, embedded, feedback, onFinish],
  );

  /** Auswertung – in beiden Modi derselbe Weg, aus Aufgaben und Antworten. */
  const submit = useCallback(() => {
    const timings = session.collectTimings();
    const items = tasks.map((task, i) => {
      const given = session.answers[i];
      const givenOption = task.options.find((option) => option.letter === given);
      return {
        id: `wf-${i}`,
        number: i + 1,
        correct: given === task.correctOption,
        prompt: `${task.scrambled.join(' ')} – Anfangsbuchstabe?`,
        correctText: task.correctOption === 'e' ? 'Keine Antwort ist richtig' : task.correctLetter,
        givenText: givenOption ? givenOption.text : 'keine Antwort',
        word: task.word,
        band: task.band,
        seconds: timings[i] ?? 0,
        explanation: `Das gesuchte Wort lautet „${task.word}“.`,
      };
    });
    setResults(items);
    finish(items);
  }, [finish, session, tasks]);

  const countdown = useCountdown(TEST.testSeconds, {
    enabled: useTimer && phase === 'running',
    autoStart: embedded,
    onExpire: () => submit(),
  });

  const start = useCallback(() => {
    startedAt.current = Date.now();
    setTasks(generateWordFluencySet(TEST.questionCount, difficulty, { onlyBands: focusTags }));
    setResults([]);
    session.reset();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  }, [countdown, difficulty, focusTags, session]);

  useEffect(() => {
    if (embedded && tasks.length === 0) {
      startedAt.current = Date.now();
      setTasks(generateWordFluencySet(TEST.questionCount, difficulty, { onlyBands: focusTags }));
    }
  }, [difficulty, embedded, focusTags, tasks.length]);

  const { index } = session;
  const task = tasks[index];
  const revealed = !examMode && Boolean(session.revealed[index]);

  const answer = (option) => {
    if (revealed) return;
    session.setAnswer(index, option.letter);
    if (examMode) {
      feedback.tap();
      return;
    }
    // Übungsmodus: sofort auflösen, die Aufgabe bleibt danach unveränderlich.
    session.reveal(index);
    if (option.correct) feedback.correct();
    else feedback.wrong();
  };

  if (phase === 'intro') {
    return (
      <Screen title={TEST.name} onClose={closeScreen}>
        <TestIntro
          test={TEST}
          timerEnabled={timerSetting}
          difficultyLabel={DIFFICULTIES.find((d) => d.id === difficulty)?.label}
          facts={[
            '15 Aufgaben in 20 Minuten',
            'Gesucht ist ein deutsches Substantiv im Nominativ Singular',
            'Ohne Umlaute und ß – es gibt genau eine Lösung',
            'Antwort e) „Keine Antwort ist richtig“ trifft in etwa 20 % der Fälle zu',
            timerSetting ? 'Timer aktiv' : 'Übungsmodus ohne Timer (in den Einstellungen änderbar)',
          ]}
          onStart={start}
        />
      </Screen>
    );
  }

  if (phase === 'result') {
    const score = results.filter((item) => item.correct).length;
    return (
      <Screen title="Wortflüssigkeit – Ergebnis" onClose={closeScreen}>
        <ResultView
          title="Wortflüssigkeit"
          score={score}
          max={TEST.questionCount}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          limitSeconds={TEST.testSeconds}
          renderReview={(item) => (
            <div className="space-y-1">
              <p className="text-[15px]">
                Gesuchtes Wort: <span className="font-semibold text-ios-green">{item.word}</span>
              </p>
              <p className="text-[14px] text-black/60 dark:text-white/60">
                Anfangsbuchstabe: {item.word[0].toUpperCase()}
              </p>
            </div>
          )}
          onRestart={start}
          onClose={closeScreen}
        />
      </Screen>
    );
  }

  if (!task) return null;

  const chosenLetter = session.answers[index];

  return (
    <Screen
      title={TEST.name}
      onClose={embedded ? undefined : closeScreen}
      headerExtra={
        <TimerBar
          remaining={countdown.remaining}
          total={TEST.testSeconds}
          enabled={useTimer}
          accent={TEST.accent}
          progressLabel={`Aufgabe ${index + 1} von ${tasks.length}`}
        />
      }
      footer={
        <TaskNavigator
          count={tasks.length}
          index={index}
          answers={session.answers}
          flags={session.flags}
          answeredCount={session.answeredCount}
          onGoTo={session.goTo}
          onPrevious={session.previous}
          onSkip={session.skip}
          onNext={session.next}
          onToggleFlag={() => session.toggleFlag(index)}
          onSubmit={submit}
          practice={!examMode}
          revealed={revealed}
          revealedMap={session.revealed}
          isCorrect={(i) => session.answers[i] === tasks[i]?.correctOption}
          firstOpenIndex={session.firstOpen()}
          submitLabel={examMode ? 'Abgeben' : 'Auswerten'}
        />
      }
    >
      <div className="space-y-4">
        <section className="ios-card px-3 py-5">
          <LetterCloud letters={task.scrambled} />
          {revealed && (
            <p
              className={`mt-4 animate-pop text-center text-[22px] font-bold ${
                session.answers[index] === task.correctOption ? 'text-ios-green' : 'text-ios-red'
              }`}
            >
              {task.word}
            </p>
          )}
        </section>

        <h2 className="px-1 text-[15px] font-semibold">
          Mit welchem Buchstaben beginnt das gesuchte Wort?
        </h2>

        <div className="space-y-2">
          {task.options.map((option) => {
            const state = !revealed
              ? 'idle'
              : option.correct
                ? 'correct'
                : option.letter === chosenLetter
                  ? 'wrong'
                  : 'idle';
            return (
              <AnswerOption
                key={option.letter}
                letter={option.letter}
                state={state}
                selected={option.letter === chosenLetter}
                disabled={revealed}
                onClick={() => answer(option)}
              >
                {option.letter === 'e' ? option.text : <span className="text-[17px] font-semibold">{option.text}</span>}
              </AnswerOption>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
