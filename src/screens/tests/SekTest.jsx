/**
 * Die drei Untertests der sozial-emotionalen Kompetenzen.
 *
 * Sie teilen sich einen Bildschirm, weil sie denselben Ablauf haben: Aufgaben
 * laden, Situation lesen, antworten, frei zwischen den Aufgaben springen, am
 * Ende auswerten. Verschieden sind nur die Form der Antwort und die Zählung –
 * beides steckt in lib/sekScoring.js und in den drei Aufgabenkörpern unter
 * components/sek.
 *
 * Drei eigene Bildschirme wären dreimal derselbe Rahmen gewesen; jede spätere
 * Änderung an der Navigation hätte man dreimal machen müssen.
 *
 * Die Auflösung im Übungsmodus geschieht nicht überall gleich: Wo eine einzige
 * Auswahl genügt (Emotionen regulieren), wird sofort aufgelöst. Wo mehrere
 * Angaben zusammengehören (fünf Gefühle, fünf Plätze), erst auf Knopfdruck –
 * sonst stünde die Lösung da, bevor man fertig gedacht hat.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import TaskNavigator from '../../components/TaskNavigator.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import SituationCard from '../../components/sek/SituationCard.jsx';
import RecogniseTask from '../../components/sek/RecogniseTask.jsx';
import RegulateTask from '../../components/sek/RegulateTask.jsx';
import DecisionTask from '../../components/sek/DecisionTask.jsx';
import { TESTS } from '../../data/testConfig.js';
import { drawTasks, loadSekTasks } from '../../data/sek/index.js';
import {
  describeSekAnswer,
  describeSekSolution,
  isSekComplete,
  pointsPerTask,
  scoreSekTask,
} from '../../lib/sekScoring.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTaskSession } from '../../hooks/useTaskSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

/** Was im Einstieg über den Untertest steht. */
const FACTS = {
  emotionsRecognise: [
    '14 Aufgaben in 21 Minuten',
    'Zu jeder Situation fünf Gefühle, jedes einzeln einzuschätzen',
    'Alles oder nichts: Der Punkt zählt nur bei fünf richtigen Einschätzungen',
    'Mehrere Gefühle können gleichzeitig zutreffen, auch gegenläufige',
  ],
  emotionsRegulate: [
    '12 Aufgaben in 18 Minuten',
    'Situation mit einem belastenden Gefühl und einem klar genannten Ziel',
    'Vier Vorsätze in der Ich-Form, genau einer führt am ehesten zum Ziel',
    'Gefragt ist nicht, was sich am besten anfühlt, sondern was dem Ziel dient',
  ],
  socialDecision: [
    '14 Aufgaben in 21 Minuten',
    'Fünf Überlegungen auf die Plätze a bis e verteilen, a ist die wichtigste',
    'Teilpunkte: Jede richtig gesetzte Marke zählt einzeln',
    'Maßstab ist nicht die eigene Meinung, sondern das moralische Gewicht',
  ],
};

/** Wo im Übungsmodus erst auf Knopfdruck aufgelöst wird. */
const NEEDS_CHECK = { emotionsRecognise: true, socialDecision: true, emotionsRegulate: false };

export default function SekTest({ testId, embedded = false, onFinish }) {
  const TEST = TESTS[testId];
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const timerSetting = useSettings((state) => state.timers[testId]);
  const examMode = useSettings((state) => state.mode === 'pruefung');
  const feedback = useFeedback();

  const useTimer = embedded ? true : timerSetting;
  const [pool, setPool] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [phase, setPhase] = useState(embedded ? 'running' : 'intro');
  const [results, setResults] = useState([]);
  const startedAt = useRef(Date.now());

  const session = useTaskSession(tasks.length, {
    isComplete: (value, i) => isSekComplete(testId, tasks[i], value),
  });

  useEffect(() => {
    let active = true;
    loadSekTasks(testId).then((data) => { if (active) setPool(data); });
    return () => { active = false; };
  }, [testId]);

  const maxPoints = useMemo(
    () => tasks.reduce((sum, task) => sum + pointsPerTask(testId, task), 0),
    [tasks, testId],
  );

  const finish = useCallback((items) => {
    const score = items.reduce((sum, item) => sum + item.points, 0);
    const max = items.reduce((sum, item) => sum + item.maxPoints, 0);
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    if (!embedded) {
      // Ohne breakdown: Diese Untertests haben keine Aufgabenkategorien, an
      // denen sich eine Schwäche festmachen ließe – jede Aufgabe steht für
      // sich. Die Zeit je Aufgabe rechnet die Statistik aus dem Verlauf.
      addResult({ testId, score, max, seconds });
    }
    feedback.done();
    setResults(items);
    setPhase('result');
    onFinish?.({ testId, score, max, seconds, results: items });
  }, [addResult, embedded, feedback, onFinish, testId]);

  const submit = useCallback(() => {
    const timings = session.collectTimings();
    const items = tasks.map((task, i) => {
      const value = session.answers[i];
      const points = scoreSekTask(testId, task, value);
      const maxForTask = pointsPerTask(testId, task);
      return {
        id: task.id,
        number: i + 1,
        points,
        maxPoints: maxForTask,
        correct: points === maxForTask,
        prompt: task.situation,
        correctText: describeSekSolution(testId, task),
        givenText: describeSekAnswer(testId, task, value),
        explanation: task.explanation ?? '',
        seconds: timings[i] ?? 0,
        task,
      };
    });
    finish(items);
  }, [finish, session, tasks, testId]);

  const countdown = useCountdown(TEST.testSeconds, {
    enabled: useTimer && phase === 'running',
    autoStart: embedded,
    onExpire: () => submit(),
  });

  const start = useCallback(() => {
    if (!pool) return;
    startedAt.current = Date.now();
    setTasks(drawTasks(testId, pool, TEST.questionCount));
    setResults([]);
    session.reset();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  }, [TEST.questionCount, countdown, pool, session, testId]);

  // In der Simulation läuft der Untertest ohne Einstiegsbildschirm los.
  useEffect(() => {
    if (!pool || tasks.length > 0) return;
    if (!embedded && phase !== 'running') return;
    startedAt.current = Date.now();
    setTasks(drawTasks(testId, pool, TEST.questionCount));
  }, [TEST.questionCount, embedded, phase, pool, tasks.length, testId]);

  const { index } = session;
  const task = tasks[index];
  const value = session.answers[index];
  const revealed = !examMode && Boolean(session.revealed[index]);
  const complete = isSekComplete(testId, task, value);

  /** Auflösen samt Rückmeldung – volle Punktzahl gilt als richtig. */
  const check = useCallback(() => {
    session.reveal(index);
    const points = scoreSekTask(testId, task, value);
    if (points === pointsPerTask(testId, task)) feedback.correct();
    else feedback.wrong();
  }, [feedback, index, session, task, testId, value]);

  /* --------------------------------------------------------- Antwortwege */

  const setEmotion = (emotionIndex, likely) => {
    if (revealed) return;
    const next = [...(value ?? [])];
    next.length = task.emotions.length;
    next[emotionIndex] = likely;
    session.setAnswer(index, next);
  };

  const chooseOption = (optionIndex) => {
    if (revealed) return;
    session.setAnswer(index, optionIndex);
    if (examMode) return;
    session.reveal(index);
    if (task.options[optionIndex].correct) feedback.correct();
    else feedback.wrong();
  };

  const togglePlace = (displayIndex) => {
    if (revealed) return;
    const current = value ?? [];
    const at = current.indexOf(displayIndex);
    // Schon vergeben: herausnehmen, die dahinterliegenden rücken auf.
    session.setAnswer(index, at === -1
      ? [...current, displayIndex]
      : current.filter((entry) => entry !== displayIndex));
  };

  /* ------------------------------------------------------------ Anzeige */

  if (!pool) {
    return (
      <Screen title={TEST.name} onClose={embedded ? undefined : closeScreen}>
        <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">Aufgaben werden geladen …</p>
      </Screen>
    );
  }

  if (phase === 'intro') {
    return (
      <Screen title={TEST.name} onClose={closeScreen}>
        <TestIntro test={TEST} timerEnabled={timerSetting} facts={FACTS[testId]} onStart={start}>
          <p className="px-1 text-[12px] leading-snug text-black/45 dark:text-white/45">
            Die Aufgaben sind eigens für diese App geschrieben, keine Originalaufgaben. Format,
            Aufgabenzahl und Zeit entsprechen den offiziellen Vorgaben.
          </p>
        </TestIntro>
      </Screen>
    );
  }

  if (phase === 'result') {
    const score = results.reduce((sum, item) => sum + item.points, 0);
    const max = results.reduce((sum, item) => sum + item.maxPoints, 0);
    return (
      <Screen title={`${TEST.short} – Ergebnis`} onClose={closeScreen}>
        <ResultView
          title={TEST.name}
          score={score}
          max={max}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          limitSeconds={TEST.testSeconds}
          renderReview={(item) => (
            <div className="space-y-2">
              {item.maxPoints > 1 && (
                <p className="text-[13px] font-semibold" style={{ color: TEST.accent }}>
                  {item.points} von {item.maxPoints} Marken richtig gesetzt
                </p>
              )}
              {item.explanation && (
                <p className="text-[14px] leading-relaxed text-black/65 dark:text-white/65">
                  {item.explanation}
                </p>
              )}
            </div>
          )}
          onRestart={start}
          onClose={closeScreen}
        />
      </Screen>
    );
  }

  if (!task) return null;

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
        <>
          {!examMode && NEEDS_CHECK[testId] && !revealed && (
            <div className="px-3 pb-1">
              <Button size="lg" onClick={check} disabled={!complete}>
                {complete ? 'Prüfen' : 'Erst alle Angaben machen'}
              </Button>
            </div>
          )}
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
            isComplete={(i) => isSekComplete(testId, tasks[i], session.answers[i])}
            isCorrect={(i) => scoreSekTask(testId, tasks[i], session.answers[i])
              === pointsPerTask(testId, tasks[i])}
            firstOpenIndex={session.firstOpen()}
            submitLabel={examMode ? 'Abgeben' : 'Auswerten'}
          />
        </>
      }
    >
      <div className="space-y-4">
        <SituationCard situation={task.situation} goal={task.goal} accent={TEST.accent} />

        {testId === 'emotionsRecognise' && (
          <RecogniseTask task={task} value={value} revealed={revealed} onChange={setEmotion} />
        )}
        {testId === 'emotionsRegulate' && (
          <RegulateTask
            task={task}
            value={value}
            revealed={revealed}
            onChoose={chooseOption}
            silent={!examMode}
          />
        )}
        {testId === 'socialDecision' && (
          <DecisionTask
            task={task}
            value={value}
            revealed={revealed}
            onToggle={togglePlace}
            accent={TEST.accent}
          />
        )}

        {revealed && task.explanation && (
          <section className="ios-card animate-slide-up px-4 py-4">
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[15px] font-semibold">
              <Icon name="info" className="h-4 w-4" style={{ color: TEST.accent }} />
              Warum diese Reihung
            </h3>
            <p className="text-[14px] leading-relaxed text-black/70 dark:text-white/70">{task.explanation}</p>
          </section>
        )}

        <p className="px-1 pb-2 text-[11px] text-black/35 dark:text-white/35">
          Eigens geschriebene Übungsaufgabe, keine Originalaufgabe.
        </p>
      </div>
    </Screen>
  );
}
