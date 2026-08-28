/**
 * Untertest "Figuren zusammensetzen".
 *
 * MedAT-Vorgabe: 15 Aufgaben in 15 Minuten. Aus den gezeigten Teilstücken lässt
 * sich genau eine der fünf Figuren lückenlos zusammensetzen. Die Teile dürfen
 * gedreht, aber nicht gespiegelt werden.
 *
 * Nach einer Antwort zeigt der Übungsmodus die Auflösung: die richtige Figur
 * mit farbig eingezeichneten Teilen – daran sieht man, wo man falsch gedacht
 * hat.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import ExamNavigator from '../../components/ExamNavigator.jsx';
import FigureShape from '../../components/FigureShape.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { DIFFICULTIES, TESTS } from '../../data/testConfig.js';
import { generateFigureSet } from '../../engines/figures.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useExamSession } from '../../hooks/useExamSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { secondsSince } from '../../lib/format.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

const TEST = TESTS.figures;

/** Farben der Teilstücke – auch in der Auflösungsgrafik verwendet. */
const PIECE_COLORS = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF2D55'];

/** Gemeinsamer Maßstab aller Figuren einer Aufgabe. */
const extentOf = (shapes) =>
  Math.max(...shapes.flatMap((cells) => [
    Math.max(...cells.map((cell) => cell[0])) + 1,
    Math.max(...cells.map((cell) => cell[1])) + 1,
  ]));

function Pieces({ pieces }) {
  const extent = extentOf(pieces);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {pieces.map((piece, index) => (
        <div key={index} className="rounded-xl bg-black/[0.04] p-1.5 dark:bg-white/10">
          <FigureShape
            cells={piece}
            extent={extent}
            cellSize={15}
            fill={PIECE_COLORS[index % PIECE_COLORS.length]}
            stroke={PIECE_COLORS[index % PIECE_COLORS.length]}
            label={`Teilstück ${index + 1} aus ${piece.length} Feldern`}
          />
        </div>
      ))}
    </div>
  );
}

export default function FiguresTest({ embedded = false, onFinish, focusTags = null }) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const difficulty = useSettings((state) => state.difficulty.figures ?? 'medat');
  const timerSetting = useSettings((state) => state.timers.figures ?? true);
  const examMode = useSettings((state) => state.mode === 'pruefung');
  const feedback = useFeedback();
  const exam = useExamSession(TEST.questionCount);

  const useTimer = embedded ? true : timerSetting;
  const [phase, setPhase] = useState(embedded ? 'running' : 'intro');
  const [tasks, setTasks] = useState([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const startedAt = useRef(Date.now());
  const taskStartedAt = useRef(Date.now());

  const index = examMode ? exam.index : practiceIndex;
  const task = tasks[index];

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
            tag: `teile-${item.pieceCount}`,
            label: `${item.pieceCount} Teilstücke`,
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

  const submitExam = useCallback(() => {
    const timings = exam.collectTimings();
    const items = tasks.map((item, i) => {
      const given = exam.answers[i];
      return {
        id: `fg-${i}`,
        number: i + 1,
        correct: given === item.correctLetter,
        prompt: `${item.pieceCount} Teilstücke, ${item.cellCount} Felder`,
        correctText: `Figur ${item.correctLetter.toUpperCase()}`,
        givenText: given ? `Figur ${given.toUpperCase()}` : 'keine Antwort',
        pieceCount: item.pieceCount,
        seconds: timings[i] ?? 0,
        task: item,
      };
    });
    setResults(items);
    finish(items);
  }, [exam, finish, tasks]);

  const countdown = useCountdown(TEST.testSeconds, {
    enabled: useTimer && phase === 'running',
    autoStart: embedded,
    onExpire: () => (examMode ? submitExam() : finish(results)),
  });

  const start = useCallback(() => {
    startedAt.current = Date.now();
    taskStartedAt.current = Date.now();
    setTasks(generateFigureSet(TEST.questionCount, difficulty, { pieceCounts: focusTags?.map((tag) => String(tag).replace('teile-', '')) }));
    setPracticeIndex(0);
    setSelected(null);
    setResults([]);
    exam.reset();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  }, [countdown, difficulty, exam, focusTags]);

  useEffect(() => {
    if (embedded && tasks.length === 0) {
      startedAt.current = Date.now();
      taskStartedAt.current = Date.now();
      setTasks(generateFigureSet(TEST.questionCount, difficulty));
    }
  }, [difficulty, embedded, tasks.length]);

  const answer = (option) => {
    if (examMode) {
      feedback.tap();
      exam.setAnswer(index, option.letter);
      return;
    }
    if (selected) return;
    setSelected(option.letter);
    if (option.correct) feedback.correct();
    else feedback.wrong();
    setResults((current) => [
      ...current,
      {
        id: `fg-${index}`,
        number: index + 1,
        correct: option.correct,
        prompt: `${task.pieceCount} Teilstücke, ${task.cellCount} Felder`,
        correctText: `Figur ${task.correctLetter.toUpperCase()}`,
        givenText: `Figur ${option.letter.toUpperCase()}`,
        pieceCount: task.pieceCount,
        seconds: secondsSince(taskStartedAt.current),
        task,
      },
    ]);
  };

  const advance = () => {
    if (index + 1 >= tasks.length) finish(results);
    else {
      setPracticeIndex(index + 1);
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
            '15 Aufgaben in 15 Minuten',
            'Aus allen Teilstücken entsteht genau eine der fünf Figuren',
            'Die Teile dürfen gedreht, aber nicht gespiegelt werden',
            'Kein Teil bleibt übrig, keine Lücke bleibt offen',
          ]}
          onStart={start}
        />
      </Screen>
    );
  }

  if (phase === 'result') {
    const score = results.filter((item) => item.correct).length;
    return (
      <Screen title="Figuren – Ergebnis" onClose={closeScreen}>
        <ResultView
          title="Figuren zusammensetzen"
          score={score}
          max={TEST.questionCount}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          limitSeconds={TEST.testSeconds}
          renderReview={(item) => (
            <div className="space-y-2">
              <p className="text-[13px] text-black/55 dark:text-white/55">So liegen die Teile:</p>
              <div className="flex justify-center">
                <FigureShape
                  cells={item.task.target}
                  cellSize={22}
                  groups={item.task.placements.map((cells, i) => ({
                    cells,
                    color: PIECE_COLORS[i % PIECE_COLORS.length],
                  }))}
                  label="Auflösung: Lage der Teilstücke"
                />
              </div>
            </div>
          )}
          onRestart={start}
          onClose={closeScreen}
        />
      </Screen>
    );
  }

  if (!task) return null;

  const chosenLetter = examMode ? exam.answers[index] : selected;
  const revealed = !examMode && Boolean(selected);
  const optionExtent = extentOf(task.options.map((option) => option.cells));

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
        examMode ? (
          <ExamNavigator
            count={tasks.length}
            index={index}
            answers={exam.answers}
            flags={exam.flags}
            answeredCount={exam.answeredCount}
            onGoTo={exam.goTo}
            onPrevious={exam.previous}
            onNext={exam.next}
            onToggleFlag={() => exam.toggleFlag(index)}
            onSubmit={submitExam}
          />
        ) : (
          revealed && (
            <div className="px-3 py-3">
              <Button size="lg" onClick={advance}>
                {index + 1 >= tasks.length ? 'Auswertung ansehen' : 'Nächste Aufgabe'}
                <Icon name="chevronRight" className="h-5 w-5" />
              </Button>
            </div>
          )
        )
      }
    >
      <div className="space-y-4">
        <section className="ios-card px-3 py-4">
          <h2 className="mb-3 text-center text-[12px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
            Diese {task.pieces.length} Teilstücke
          </h2>
          <Pieces pieces={task.pieces} />
        </section>

        <h2 className="px-1 text-[15px] font-semibold">
          Welche Figur lässt sich daraus zusammensetzen?
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {task.options.map((option) => {
            const state = !revealed
              ? 'idle'
              : option.correct
                ? 'correct'
                : option.letter === selected
                  ? 'wrong'
                  : 'idle';
            const ring = state === 'correct'
              ? 'ring-2 ring-ios-green bg-ios-green/10'
              : state === 'wrong'
                ? 'ring-2 ring-ios-red bg-ios-red/10'
                : option.letter === chosenLetter
                  ? 'ring-2 ring-ios-blue'
                  : 'ring-1 ring-transparent';
            return (
              <Tappable
                key={option.letter}
                onClick={() => answer(option)}
                disabled={revealed}
                aria-label={`Figur ${option.letter}${state === 'correct' ? ' (richtig)' : state === 'wrong' ? ' (falsch)' : ''}`}
                aria-pressed={option.letter === chosenLetter}
                className={`ios-card flex flex-col items-center gap-1 px-2 py-3 ${ring}`}
              >
                <span className="flex items-center gap-1.5 self-start text-[12px] font-bold uppercase text-black/45 dark:text-white/45">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      state === 'correct'
                        ? 'bg-ios-green text-white'
                        : state === 'wrong'
                          ? 'bg-ios-red text-white'
                          : 'bg-black/5 dark:bg-white/10'
                    }`}
                  >
                    {state === 'correct' ? <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                      : state === 'wrong' ? <Icon name="close" className="h-3 w-3" strokeWidth={3} />
                        : option.letter}
                  </span>
                </span>
                <FigureShape
                  cells={option.cells}
                  extent={optionExtent}
                  cellSize={17}
                  fill={TEST.accent}
                  stroke={TEST.accent}
                  label={`Figur ${option.letter}`}
                />
              </Tappable>
            );
          })}
        </div>

        {revealed && (
          <section className="ios-card animate-slide-up space-y-2 px-4 py-4">
            <h3 className="text-[15px] font-semibold">
              {results[results.length - 1]?.correct ? 'Richtig' : `Richtig wäre Figur ${task.correctLetter.toUpperCase()}`}
            </h3>
            <p className="text-[13px] text-black/55 dark:text-white/55">So liegen die Teile in der Figur:</p>
            <div className="flex justify-center pt-1">
              <FigureShape
                cells={task.target}
                cellSize={26}
                groups={task.placements.map((cells, i) => ({
                  cells,
                  color: PIECE_COLORS[i % PIECE_COLORS.length],
                }))}
                label="Auflösung: Lage der Teilstücke"
              />
            </div>
          </section>
        )}
      </div>
    </Screen>
  );
}
