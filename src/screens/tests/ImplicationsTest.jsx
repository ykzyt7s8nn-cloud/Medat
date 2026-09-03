/**
 * Untertest "Implikationen erkennen".
 *
 * MedAT-Vorgabe: 10 Aufgaben in 10 Minuten. Zu zwei Prämissen sind vier
 * Schlussfolgerungen plus e) "Keine der Schlussfolgerungen ist richtig"
 * angeboten.
 *
 * Nach der Antwort erscheint die Begründung samt Venn-Diagramm: schraffierte
 * Flächen sind zwingend leer, grüne Punkte markieren zwingend besetzte
 * Bereiche – die klassische Prüfmethode für Syllogismen.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import AnswerOption from '../../components/ui/AnswerOption.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import TaskNavigator from '../../components/TaskNavigator.jsx';
import VennDiagram from '../../components/charts/VennDiagram.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { DIFFICULTIES, TESTS } from '../../data/testConfig.js';
import { generateSyllogismSet } from '../../engines/syllogism.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTaskSession } from '../../hooks/useTaskSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

const TEST = TESTS.implications;

/** Kategorie-Tags der Statistik ("figur-3") zurück in Figurnummern übersetzen. */
const figuresFrom = (tags) => (tags?.length
  ? tags.map((tag) => Number(String(tag).replace('figur-', ''))).filter(Number.isFinite)
  : null);

function Premises({ premises }) {
  return (
    <section className="rounded-card bg-ios-blue/10 px-4 py-3.5 dark:bg-ios-blue/15">
      <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ios-blue">Prämissen</h2>
      <ol className="space-y-1.5">
        {premises.map((premise, index) => (
          <li key={index} className="flex gap-2 text-[16px] leading-snug">
            <span className="shrink-0 font-semibold text-ios-blue">{index + 1}.</span>
            <span>{premise.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function ImplicationsTest({ embedded = false, onFinish, focusTags = null }) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const difficulty = useSettings((state) => state.difficulty.implications);
  const timerSetting = useSettings((state) => state.timers.implications);
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
            tag: `figur-${item.figure}`,
            label: `Figur ${item.figure}`,
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
      const correctOption = task.options.find((option) => option.correct);
      return {
        id: `im-${i}`,
        number: i + 1,
        correct: given === task.correctLetter,
        prompt: task.premises.map((premise) => premise.text).join(' '),
        correctText: correctOption.text,
        givenText: given ? task.options.find((option) => option.letter === given).text : 'keine Antwort',
        explanation: task.explanation,
        figure: task.figure,
        seconds: timings[i] ?? 0,
        task,
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
    setTasks(generateSyllogismSet(TEST.questionCount, difficulty, { onlyFigures: figuresFrom(focusTags) }));
    setResults([]);
    session.reset();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  }, [countdown, difficulty, focusTags, session]);

  useEffect(() => {
    if (embedded && tasks.length === 0) {
      startedAt.current = Date.now();
      setTasks(generateSyllogismSet(TEST.questionCount, difficulty, { onlyFigures: figuresFrom(focusTags) }));
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
            '10 Aufgaben in 10 Minuten',
            'Zwei Prämissen, vier Schlussfolgerungen plus „Keine ist richtig“',
            'Bewertet wird rein formal – inhaltliche Richtigkeit spielt keine Rolle',
            'Zur Auflösung gibt es jeweils ein Venn-Diagramm',
          ]}
          onStart={start}
        />
      </Screen>
    );
  }

  if (phase === 'result') {
    const score = results.filter((item) => item.correct).length;
    return (
      <Screen title="Implikationen – Ergebnis" onClose={closeScreen}>
        <ResultView
          title="Implikationen erkennen"
          score={score}
          max={TEST.questionCount}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          limitSeconds={TEST.testSeconds}
          renderReview={(item) => (
            <div className="space-y-3">
              <p className="text-[14px] text-black/60 dark:text-white/60">{item.explanation}</p>
              <VennDiagram
                id={`venn-result-${item.id}`}
                terms={item.task.terms}
                status={item.task.regionStatus}
              />
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
          progressLabel={`Aufgabe ${index + 1} von ${tasks.length}${examMode ? '' : ` · Figur ${task.figure}`}`}
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
          isCorrect={(i) => session.answers[i] === tasks[i]?.correctLetter}
          firstOpenIndex={session.firstOpen()}
          submitLabel={examMode ? 'Abgeben' : 'Auswerten'}
        />
      }
    >
      <div className="space-y-4">
        <Premises premises={task.premises} />

        <h2 className="px-1 text-[15px] font-semibold">Welche Schlussfolgerung ist zwingend richtig?</h2>

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
                {option.text}
              </AnswerOption>
            );
          })}
        </div>

        {revealed && (
          <section className="ios-card animate-slide-up space-y-3 px-4 py-4">
            <h3 className="text-[15px] font-semibold">Begründung</h3>
            <p className="text-[14px] leading-relaxed text-black/70 dark:text-white/70">{task.explanation}</p>
            <VennDiagram id={`venn-${index}`} terms={task.terms} status={task.regionStatus} />
          </section>
        )}
      </div>
    </Screen>
  );
}
