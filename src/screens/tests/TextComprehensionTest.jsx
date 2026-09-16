/**
 * Untertest „Textverständnis“.
 *
 * MedAT-Vorgabe: 12 Aufgaben in 35 Minuten, Single Choice a bis e, verteilt
 * auf mehrere Sachtexte. Hier trägt jeder Text vier Fragen; ein Durchgang zieht
 * drei Texte.
 *
 * Zur Anzeige: Text und Frage stehen untereinander, nicht auf zwei Seiten.
 * Auf einem Telefon ist das Hin- und Herwechseln zwischen zwei Ansichten
 * teurer als das Scrollen, und im Test kostet jeder verlorene Handgriff Zeit.
 * Der Text lässt sich einklappen, sobald man ihn gelesen hat – beim Wechsel zu
 * einem neuen Text klappt er von selbst wieder auf, denn dann muss man ihn
 * ohnehin lesen.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import AnswerOption from '../../components/ui/AnswerOption.jsx';
import Icon from '../../components/ui/Icon.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import TaskNavigator from '../../components/TaskNavigator.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { TESTS } from '../../data/testConfig.js';
import { drawTextTasks, loadTexts } from '../../data/tv/index.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTaskSession } from '../../hooks/useTaskSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

const TEST = TESTS.textComprehension;
const LETTERS = ['a', 'b', 'c', 'd', 'e'];

function TextPanel({ task, position, total, open, onToggle }) {
  return (
    <section className="ios-card overflow-hidden">
      <Tappable
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
      >
        <Icon name="text" className="h-[18px] w-[18px] shrink-0" style={{ color: TEST.accent }} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold">{task.title}</span>
          <span className="block text-[12px] text-black/45 dark:text-white/45">
            Text {position} von {total}
          </span>
        </span>
        <span className="shrink-0 text-[13px] font-medium text-ios-blue">
          {open ? 'Einklappen' : 'Aufklappen'}
        </span>
      </Tappable>
      {open && (
        <div className="space-y-3 border-t border-black/5 px-4 py-3.5 dark:border-white/10">
          {task.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-[15px] leading-relaxed text-black/80 dark:text-white/85">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

export default function TextComprehensionTest({ embedded = false, onFinish }) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const timerSetting = useSettings((state) => state.timers.textComprehension);
  const examMode = useSettings((state) => state.mode === 'pruefung');
  const feedback = useFeedback();

  const useTimer = embedded ? true : timerSetting;
  const [texts, setTexts] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [phase, setPhase] = useState(embedded ? 'running' : 'intro');
  const [results, setResults] = useState([]);
  const [textOpen, setTextOpen] = useState(true);
  const startedAt = useRef(Date.now());
  const session = useTaskSession(tasks.length);

  useEffect(() => {
    let active = true;
    loadTexts().then((data) => { if (active) setTexts(data); });
    return () => { active = false; };
  }, []);

  const finish = useCallback((items) => {
    const score = items.filter((item) => item.correct).length;
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    if (!embedded) {
      // Kategorie ist der Text: So zeigt die Statistik, an welchen Texten es
      // hakt – die einzige Einteilung, die dieser Untertest hergibt.
      addResult({
        testId: TEST.id,
        score,
        max: items.length,
        seconds,
        breakdown: items.map((item) => ({
          tag: item.textId,
          label: item.title,
          correct: item.correct,
          seconds: item.seconds,
        })),
      });
    }
    feedback.done();
    setResults(items);
    setPhase('result');
    onFinish?.({ testId: TEST.id, score, max: items.length, seconds, results: items });
  }, [addResult, embedded, feedback, onFinish]);

  const submit = useCallback(() => {
    const timings = session.collectTimings();
    const items = tasks.map((task, i) => {
      const given = session.answers[i];
      const correctIndex = task.options.findIndex((option) => option.correct);
      return {
        id: task.id,
        number: i + 1,
        correct: given === correctIndex,
        prompt: task.prompt,
        correctText: `${LETTERS[correctIndex]}) ${task.options[correctIndex].text}`,
        givenText: typeof given === 'number'
          ? `${LETTERS[given]}) ${task.options[given].text}`
          : 'keine Antwort',
        explanation: task.explanation,
        textId: task.textId,
        title: task.title,
        seconds: timings[i] ?? 0,
      };
    });
    finish(items);
  }, [finish, session, tasks]);

  const countdown = useCountdown(TEST.testSeconds, {
    enabled: useTimer && phase === 'running',
    autoStart: embedded,
    onExpire: () => submit(),
  });

  const start = useCallback(() => {
    if (!texts) return;
    startedAt.current = Date.now();
    setTasks(drawTextTasks(texts, TEST.questionCount));
    setResults([]);
    setTextOpen(true);
    session.reset();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  }, [countdown, session, texts]);

  useEffect(() => {
    if (!texts || tasks.length > 0) return;
    if (!embedded && phase !== 'running') return;
    startedAt.current = Date.now();
    setTasks(drawTextTasks(texts, TEST.questionCount));
  }, [embedded, phase, tasks.length, texts]);

  const { index } = session;
  const task = tasks[index];

  // Beim Wechsel zu einem anderen Text wieder aufklappen: Ein frischer Text
  // will gelesen werden, und ein eingeklappter wäre hier eine Stolperfalle.
  const lastTextId = useRef(null);
  useEffect(() => {
    if (!task) return;
    if (lastTextId.current !== null && lastTextId.current !== task.textId) setTextOpen(true);
    lastTextId.current = task.textId;
  }, [task]);

  if (!texts) {
    return (
      <Screen title={TEST.name} onClose={embedded ? undefined : closeScreen}>
        <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">Texte werden geladen …</p>
      </Screen>
    );
  }

  if (phase === 'intro') {
    return (
      <Screen title={TEST.name} onClose={closeScreen}>
        <TestIntro
          test={TEST}
          timerEnabled={timerSetting}
          facts={[
            '12 Aufgaben in 35 Minuten',
            'Drei Sachtexte mit je vier Fragen, Single Choice a bis e',
            'Alles ist allein aus dem Text zu beantworten – Vorwissen hilft nicht',
            'Der Text bleibt beim Beantworten sichtbar und lässt sich einklappen',
          ]}
          onStart={start}
        >
          <p className="px-1 text-[12px] leading-snug text-black/45 dark:text-white/45">
            Die Texte sind eigens für diese App geschrieben und enthalten keine Originaltexte.
          </p>
        </TestIntro>
      </Screen>
    );
  }

  if (phase === 'result') {
    const score = results.filter((item) => item.correct).length;
    return (
      <Screen title="Textverständnis – Ergebnis" onClose={closeScreen}>
        <ResultView
          title={TEST.name}
          score={score}
          max={results.length}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          limitSeconds={TEST.testSeconds}
          renderReview={(item) => (
            <div className="space-y-1.5">
              <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: TEST.accent }}>
                {item.title}
              </p>
              <p className="text-[14px] leading-relaxed text-black/65 dark:text-white/65">{item.explanation}</p>
            </div>
          )}
          onRestart={start}
          onClose={closeScreen}
        />
      </Screen>
    );
  }

  if (!task) return null;

  const revealed = !examMode && Boolean(session.revealed[index]);
  const given = session.answers[index];
  const textIds = [...new Set(tasks.map((entry) => entry.textId))];
  const questionInText = tasks
    .slice(0, index + 1)
    .filter((entry) => entry.textId === task.textId).length;

  const answer = (optionIndex) => {
    if (revealed) return;
    session.setAnswer(index, optionIndex);
    if (examMode) return;
    session.reveal(index);
    if (task.options[optionIndex].correct) feedback.correct();
    else feedback.wrong();
  };

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
          progressLabel={`Aufgabe ${index + 1} von ${tasks.length} · Frage ${questionInText} zum Text`}
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
          isCorrect={(i) => tasks[i]?.options[session.answers[i]]?.correct === true}
          firstOpenIndex={session.firstOpen()}
          submitLabel={examMode ? 'Abgeben' : 'Auswerten'}
        />
      }
    >
      <div className="space-y-4">
        <TextPanel
          task={task}
          position={textIds.indexOf(task.textId) + 1}
          total={textIds.length}
          open={textOpen}
          onToggle={() => setTextOpen((current) => !current)}
        />

        <h2 className="px-1 text-[15px] font-semibold leading-snug">{task.prompt}</h2>

        <div className="space-y-2">
          {task.options.map((option, i) => {
            const state = !revealed
              ? 'idle'
              : option.correct
                ? 'correct'
                : i === given
                  ? 'wrong'
                  : 'idle';
            return (
              <AnswerOption
                key={option.text}
                letter={LETTERS[i]}
                state={state}
                selected={i === given}
                disabled={revealed}
                silent={!examMode}
                onClick={() => answer(i)}
              >
                {option.text}
              </AnswerOption>
            );
          })}
        </div>

        {revealed && (
          <section className="ios-card animate-slide-up px-4 py-4">
            <h3 className="mb-1.5 text-[15px] font-semibold">Warum</h3>
            <p className="text-[14px] leading-relaxed text-black/70 dark:text-white/70">{task.explanation}</p>
          </section>
        )}
      </div>
    </Screen>
  );
}
