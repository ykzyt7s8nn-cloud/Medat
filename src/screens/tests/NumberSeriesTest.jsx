/**
 * Untertest "Zahlenfolgen".
 *
 * MedAT-Vorgabe: 10 Aufgaben in 15 Minuten. Angezeigt werden 7 Zahlen, gesucht
 * sind die 8. und 9. Zahl. Nach dem Prüfen erscheint sofort das Feedback samt
 * Bildungsgesetz der Folge.
 *
 * Adaptive Schwierigkeit (in den Einstellungen abschaltbar): drei richtige
 * Aufgaben in Folge erhöhen das Level, zwei falsche senken es.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import NumberKeypad from '../../components/ui/NumberKeypad.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import TaskNavigator from '../../components/TaskNavigator.jsx';
import ResultView from '../../components/ResultView.jsx';
import SeriesAnalysis from '../../components/SeriesAnalysis.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { DIFFICULTIES, TESTS } from '../../data/testConfig.js';
import {
  MIN_LEVEL,
  START_LEVEL,
  checkNumberSeriesAnswer,
  generateNumberSeriesSet,
  generateNumberSeriesTask,
} from '../../engines/numberSeries.js';
import { pick } from '../../lib/random.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTaskSession } from '../../hooks/useTaskSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

const TEST = TESTS.numberSeries;

export default function NumberSeriesTest({ embedded = false, onFinish, focusTags = null }) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const difficulty = useSettings((state) => state.difficulty.numberSeries);
  const timerSetting = useSettings((state) => state.timers.numberSeries);
  const adaptive = useSettings((state) => state.adaptiveNumberSeries);
  const examMode = useSettings((state) => state.mode === 'pruefung');
  const feedback = useFeedback();
  const session = useTaskSession(TEST.questionCount);

  const [phase, setPhase] = useState(embedded ? 'running' : 'intro');
  // Ein Aufgabensatz für beide Modi, damit man frei zwischen den Aufgaben
  // springen kann. Nur im adaptiven Übungsmodus entstehen die Aufgaben nach und
  // nach – dort muss die Stufe die bisherigen Antworten kennen.
  const [tasks, setTasks] = useState([]);
  const [activeField, setActiveField] = useState(0);
  const [results, setResults] = useState([]);
  const levelRef = useRef(START_LEVEL[difficulty] ?? 3);
  const streakRef = useRef({ correct: 0, wrong: 0 });
  const lastFamilyRef = useRef(null);
  const startedAt = useRef(Date.now());

  // In der Simulation gilt immer das Originalzeitlimit.
  const useTimer = embedded ? true : timerSetting;

  // Adaptiv geht nur im Übungsmodus: Ohne sofortige Auflösung gibt es kein
  // Signal, an dem sich die Stufe ausrichten könnte.
  const usesAdaptive = !examMode && adaptive && difficulty !== 'gemischt';

  const buildTask = useCallback(() => {
    const floor = MIN_LEVEL[difficulty] ?? 1;
    // Im adaptiven Modus schwankt die Stufe um ±1 um den aktuellen Stand –
    // sonst kämen mehrere Aufgaben am Stück aus demselben Schwierigkeitsband.
    const jitter = pick([-1, 0, 0, 1]);
    const options = { level: Math.min(7, Math.max(floor, levelRef.current + jitter)), excludeFamily: lastFamilyRef.current };
    if (focusTags?.length) options.onlyFamilies = focusTags;
    const task = generateNumberSeriesTask(options);
    lastFamilyRef.current = task.family;
    return task;
  }, [difficulty, focusTags]);

  /** Aufgaben bis einschließlich upto bereitstellen (nur im adaptiven Modus nötig). */
  const ensureTasks = useCallback((upto) => {
    setTasks((current) => {
      if (current.length > upto) return current;
      const next = [...current];
      while (next.length <= upto) next.push(buildTask());
      return next;
    });
  }, [buildTask]);

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
            tag: item.family,
            label: item.familyLabel,
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
    // Im adaptiven Modus entstehen die Aufgaben nach und nach. Bricht der Timer
    // den Durchgang ab, fehlen die nie besuchten – dann stünde die Punktzahl
    // aus 10 neben einer Durchsicht mit drei Aufgaben. Deshalb hier auffüllen;
    // die nachgezogenen zählen wie unbeantwortete Aufgaben als falsch.
    const complete = [...tasks];
    while (complete.length < TEST.questionCount) complete.push(buildTask());
    const items = complete.map((item, i) => {
      const given = session.answers[i] ?? ['', ''];
      const outcome = checkNumberSeriesAnswer(item, given);
      return {
        id: `ns-${i}`,
        number: i + 1,
        correct: outcome.correct,
        prompt: `${item.visible.join(', ')}, __, __`,
        correctText: item.solution.join(', '),
        givenText: given.some((value) => value !== '') ? given.map((v) => v || '–').join(', ') : 'keine Eingabe',
        explanation: item.rule,
        level: item.level,
        family: item.family,
        familyLabel: item.familyLabel,
        full: item.full,
        seconds: timings[i] ?? 0,
      };
    });
    setResults(items);
    finish(items);
  }, [buildTask, finish, session, tasks]);

  const countdown = useCountdown(TEST.testSeconds, {
    enabled: useTimer && phase === 'running',
    autoStart: embedded,
    onExpire: () => submit(),
  });

  const begin = useCallback(() => {
    startedAt.current = Date.now();
    levelRef.current = START_LEVEL[difficulty] ?? 3;
    streakRef.current = { correct: 0, wrong: 0 };
    lastFamilyRef.current = null;
    setResults([]);
    setActiveField(0);
    session.reset();
    // Ohne Adaptivität steht der ganze Satz sofort fest – das sichert die
    // Mischung der Regelfamilien über den Durchgang hinweg.
    if (usesAdaptive) setTasks([buildTask()]);
    else setTasks(generateNumberSeriesSet(TEST.questionCount, difficulty, { onlyFamilies: focusTags ?? undefined }));
  }, [buildTask, difficulty, focusTags, session, usesAdaptive]);

  const start = () => {
    begin();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  };

  // In der Simulation gibt es keinen Intro-Screen: sofort loslegen.
  useEffect(() => {
    if (embedded && tasks.length === 0) begin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded, tasks.length]);

  const { index } = session;
  const currentTask = tasks[index];
  const currentAnswers = session.answers[index] ?? ['', ''];
  const revealed = !examMode && Boolean(session.revealed[index]);
  const checked = revealed && currentTask ? checkNumberSeriesAnswer(currentTask, currentAnswers) : null;

  /** Navigation: im adaptiven Modus wird die Zielaufgabe bei Bedarf erst erzeugt. */
  const goTo = (target) => {
    const i = Math.max(0, Math.min(TEST.questionCount - 1, target));
    if (usesAdaptive) ensureTasks(i);
    session.goTo(i);
    setActiveField(0);
  };

  const writeAnswers = (updater) => {
    session.setAnswer(index, updater(session.answers[index] ?? ['', '']));
  };

  const inputDigit = (digit) => {
    writeAnswers((current) => {
      const next = [...current];
      if (next[activeField].replace('-', '').length >= 8) return current;
      next[activeField] = next[activeField] + digit;
      return next;
    });
  };

  const deleteDigit = () => {
    writeAnswers((current) => {
      const next = [...current];
      if (next[activeField].length === 0 && activeField === 1) {
        setActiveField(0);
        return current;
      }
      next[activeField] = next[activeField].slice(0, -1);
      return next;
    });
  };

  const toggleSign = () => {
    writeAnswers((current) => {
      const next = [...current];
      next[activeField] = next[activeField].startsWith('-')
        ? next[activeField].slice(1)
        : `-${next[activeField]}`;
      return next;
    });
  };

  const check = () => {
    const outcome = checkNumberSeriesAnswer(currentTask, currentAnswers);
    session.reveal(index);
    if (outcome.correct) {
      feedback.correct();
      streakRef.current.correct += 1;
      streakRef.current.wrong = 0;
      if (streakRef.current.correct >= 3) {
        levelRef.current = Math.min(7, levelRef.current + 1);
        streakRef.current.correct = 0;
      }
    } else {
      feedback.wrong();
      streakRef.current.wrong += 1;
      streakRef.current.correct = 0;
      if (streakRef.current.wrong >= 2) {
        levelRef.current = Math.max(MIN_LEVEL[difficulty] ?? 1, levelRef.current - 1);
        streakRef.current.wrong = 0;
      }
    }
  };

  const canCheck = currentAnswers.every((value) => value !== '' && value !== '-');

  if (phase === 'intro') {
    return (
      <Screen title={TEST.name} onClose={closeScreen}>
        <TestIntro
          test={TEST}
          timerEnabled={timerSetting}
          difficultyLabel={DIFFICULTIES.find((d) => d.id === difficulty)?.label}
          facts={[
            '10 Aufgaben in 15 Minuten',
            '7 Zahlen sind vorgegeben, die 8. und 9. Zahl sind gesucht',
            'Nach dem Prüfen wird das Bildungsgesetz der Folge erklärt',
            adaptive ? 'Adaptiv: 3× richtig erhöht das Level, 2× falsch senkt es' : 'Festes Level laut Einstellungen',
          ]}
          onStart={start}
        />
      </Screen>
    );
  }

  if (phase === 'result') {
    const score = results.filter((item) => item.correct).length;
    return (
      <Screen title="Zahlenfolgen – Ergebnis" onClose={closeScreen}>
        <ResultView
          title="Zahlenfolgen"
          score={score}
          max={TEST.questionCount}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          limitSeconds={TEST.testSeconds}
          renderReview={(item) => (
            <div className="space-y-3">
              <p className="tabular text-[15px] font-medium">
                {item.prompt.replace('__, __', '')}
                <span className="text-ios-green">{item.correctText}</span>
              </p>
              <p className="text-[14px] text-black/60 dark:text-white/60">Regel: {item.explanation}</p>
              {item.full && <SeriesAnalysis values={item.full} family={item.family} />}
              <p className="text-[12px] text-black/40 dark:text-white/40">
                Stufe {item.level} · {item.familyLabel}
              </p>
            </div>
          )}
          onRestart={start}
          onClose={closeScreen}
        />
      </Screen>
    );
  }

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
          progressLabel={`Aufgabe ${index + 1} von ${TEST.questionCount}${examMode ? '' : ` · Stufe ${currentTask?.level ?? '–'}`}`}
        />
      }
      footer={
        <>
          {/* Nach dem Prüfen weicht die Tastatur der Erklärung */}
          {!checked && (
            <NumberKeypad onInput={inputDigit} onDelete={deleteDigit} onToggleSign={toggleSign} />
          )}
          {/* Im Übungsmodus wird erst geprüft, dann weitergeblättert. */}
          {!examMode && !checked && (
            <div className="px-3 pb-1">
              <Button size="lg" onClick={check} disabled={!canCheck}>
                Prüfen
              </Button>
            </div>
          )}
          <TaskNavigator
            count={TEST.questionCount}
            index={index}
            answers={session.answers}
            flags={session.flags}
            answeredCount={session.answeredCount}
            onGoTo={goTo}
            onPrevious={() => goTo(index - 1)}
            onSkip={() => {
              const target = session.nextOpenAfter(index);
              goTo(target === null ? index + 1 : target);
            }}
            onNext={() => goTo(index + 1)}
            onToggleFlag={() => session.toggleFlag(index)}
            onSubmit={submit}
            practice={!examMode}
            revealed={revealed}
            revealedMap={session.revealed}
            isCorrect={(i) => Boolean(tasks[i]) && checkNumberSeriesAnswer(tasks[i], session.answers[i] ?? ['', '']).correct}
            firstOpenIndex={session.firstOpen()}
            submitLabel={examMode ? 'Abgeben' : 'Auswerten'}
          />
        </>
      }
    >
      {currentTask && (
        <div className="space-y-4">
          <section className="ios-card px-3 py-5">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {currentTask.visible.map((value, index) => (
                <span
                  key={index}
                  className="tabular rounded-xl bg-black/[0.04] px-2.5 py-2 text-[19px] font-semibold dark:bg-white/10"
                >
                  {value}
                </span>
              ))}
              {[0, 1].map((index) => {
                const state = checked
                  ? (checked.correctFlags[index] ? 'correct' : 'wrong')
                  : 'idle';
                return (
                  <Tappable
                    key={`input-${index}`}
                    onClick={() => !checked && setActiveField(index)}
                    aria-label={`${index === 0 ? 'Achte' : 'Neunte'} Zahl`}
                    className={`tabular min-w-[64px] rounded-xl px-2.5 py-2 text-[19px] font-bold ${
                      state === 'correct'
                        ? 'bg-ios-green/15 text-ios-green ring-2 ring-ios-green'
                        : state === 'wrong'
                          ? 'bg-ios-red/15 text-ios-red ring-2 ring-ios-red'
                          : activeField === index
                            ? 'bg-ios-blue/10 text-ios-blue ring-2 ring-ios-blue'
                            : 'bg-black/[0.04] text-black/40 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/40 dark:ring-white/15'
                    }`}
                  >
                    {currentAnswers[index] || '?'}
                  </Tappable>
                );
              })}
            </div>
            {!checked && (
              <p className="mt-4 text-center text-[13px] text-black/45 dark:text-white/45">
                Tippe ein Feld an, um es zu füllen · Feld {activeField + 1} aktiv
              </p>
            )}
          </section>

          {checked && (
            <section
              className={`ios-card animate-slide-up px-4 py-4 ${
                checked.correct ? 'ring-2 ring-ios-green' : 'ring-2 ring-ios-red'
              }`}
            >
              <p className={`flex items-center gap-2 text-[17px] font-bold ${checked.correct ? 'text-ios-green' : 'text-ios-red'}`}>
                <Icon name={checked.correct ? 'check' : 'close'} className="h-5 w-5" strokeWidth={2.6} />
                {checked.correct ? 'Richtig' : 'Falsch'}
              </p>
              {!checked.correct && (
                <p className="mt-1 text-[15px]">
                  Richtige Lösung: <span className="tabular font-semibold">{currentTask.solution.join(', ')}</span>
                </p>
              )}
              <p className="mt-2 text-[14px] text-black/60 dark:text-white/60">{currentTask.rule}</p>
              {!checked.correct && (
                <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
                  <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45">
                    So kommst du drauf
                  </p>
                  <SeriesAnalysis values={currentTask.full} family={currentTask.family} />
                </div>
              )}
            </section>
          )}

          {!checked && (
            <p className="px-1 text-center text-[13px] text-black/45 dark:text-white/45">
              Setze die Zahlenfolge um zwei Zahlen fort.
            </p>
          )}
        </div>
      )}
    </Screen>
  );
}
