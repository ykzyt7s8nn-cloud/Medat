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
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import VennDiagram from '../../components/charts/VennDiagram.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { DIFFICULTIES, TESTS } from '../../data/testConfig.js';
import { generateSyllogismSet } from '../../engines/syllogism.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { secondsSince } from '../../lib/format.js';
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
  const feedback = useFeedback();

  const useTimer = embedded ? true : timerSetting;
  const [phase, setPhase] = useState(embedded ? 'running' : 'intro');
  const [tasks, setTasks] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const startedAt = useRef(Date.now());
  const taskStartedAt = useRef(Date.now());

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

  const countdown = useCountdown(TEST.testSeconds, {
    enabled: useTimer && phase === 'running',
    autoStart: embedded,
    onExpire: () => finish(results),
  });

  const start = useCallback(() => {
    startedAt.current = Date.now();
    setTasks(generateSyllogismSet(TEST.questionCount, difficulty, { onlyFigures: figuresFrom(focusTags) }));
    setIndex(0);
    setSelected(null);
    setResults([]);
    taskStartedAt.current = Date.now();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  }, [countdown, difficulty, focusTags]);

  useEffect(() => {
    if (embedded && tasks.length === 0) {
      startedAt.current = Date.now();
      setTasks(generateSyllogismSet(TEST.questionCount, difficulty, { onlyFigures: figuresFrom(focusTags) }));
    }
  }, [difficulty, embedded, focusTags, tasks.length]);

  const task = tasks[index];

  const answer = (option) => {
    if (selected) return;
    setSelected(option.letter);
    if (option.correct) feedback.correct();
    else feedback.wrong();
    setResults((current) => [
      ...current,
      {
        id: `im-${index}`,
        number: index + 1,
        correct: option.correct,
        prompt: task.premises.map((p) => p.text).join(' '),
        correctText: task.options.find((o) => o.correct).text,
        givenText: option.text,
        explanation: task.explanation,
        figure: task.figure,
        seconds: secondsSince(taskStartedAt.current),
        task,
      },
    ]);
  };

  const advance = () => {
    if (index + 1 >= tasks.length) finish(results);
    else {
      setIndex(index + 1);
      setSelected(null);
      taskStartedAt.current = Date.now();
    }
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
  const revealed = Boolean(selected);

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
          progressLabel={`Aufgabe ${index + 1} von ${tasks.length} · Figur ${task.figure}`}
        />
      }
      footer={
        revealed && (
          <div className="px-3 py-3">
            <Button size="lg" onClick={advance}>
              {index + 1 >= tasks.length ? 'Auswertung ansehen' : 'Nächste Aufgabe'}
              <Icon name="chevronRight" className="h-5 w-5" />
            </Button>
          </div>
        )
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
                : option.letter === selected
                  ? 'wrong'
                  : 'idle';
            return (
              <AnswerOption
                key={option.letter}
                letter={option.letter}
                state={state}
                selected={option.letter === selected}
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
