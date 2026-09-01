/**
 * Untertest "Figuren zusammensetzen".
 *
 * MedAT-Vorgabe: 15 Aufgaben in 15 Minuten. Aus den gezeigten Teilstücken lässt
 * sich genau eine der fünf Figuren lückenlos zusammensetzen. Die Teile dürfen
 * gedreht, aber nicht gespiegelt werden.
 *
 * Aufbau wie im Test: a bis d zeigen Figuren, e lautet immer "Keine der
 * Antwortmöglichkeiten ist richtig" – und stimmt in etwa jeder fünften Aufgabe.
 * Als Lösung kommen nur regelmäßige Vielecke (Fünf- bis Achteck) und
 * Kreissegmente (Viertel-, Halb-, Dreiviertelkreis, Kreis) vor.
 *
 * Nach einer Antwort zeigt der Übungsmodus die Auflösung: die richtige Figur
 * mit farbig eingezeichneten Teilen – daran sieht man, wo man falsch gedacht
 * hat.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Icon from '../../components/ui/Icon.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import AnswerOption from '../../components/ui/AnswerOption.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import TaskNavigator from '../../components/TaskNavigator.jsx';
import FigureShape, {
  PieceRow,
  SolutionShape,
  pixelsPerUnit,
  viewExtent,
} from '../../components/FigureShape.jsx';
import ResultView from '../../components/ResultView.jsx';
import TestIntro from '../../components/TestIntro.jsx';
import { DIFFICULTIES, TESTS } from '../../data/testConfig.js';
import { generateFigureSet } from '../../engines/figures.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTaskSession } from '../../hooks/useTaskSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useProgress } from '../../store/useProgress.js';
import { useSettings } from '../../store/useSettings.js';

const TEST = TESTS.figures;

/** Farben der Teilstücke – auch in der Auflösungsgrafik verwendet. */
const PIECE_COLORS = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF2D55'];



export default function FiguresTest({ embedded = false, onFinish, focusTags = null }) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);
  const difficulty = useSettings((state) => state.difficulty.figures ?? 'medat');
  const timerSetting = useSettings((state) => state.timers.figures ?? true);
  const examMode = useSettings((state) => state.mode === 'pruefung');
  const feedback = useFeedback();
  const session = useTaskSession(TEST.questionCount);

  const useTimer = embedded ? true : timerSetting;
  const [phase, setPhase] = useState(embedded ? 'running' : 'intro');
  const [tasks, setTasks] = useState([]);
  const [results, setResults] = useState([]);
  const startedAt = useRef(Date.now());

  const { index } = session;
  const task = tasks[index];
  const revealed = !examMode && Boolean(session.revealed[index]);

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

  /** Auswertung – in beiden Modi derselbe Weg, aus Aufgaben und Antworten. */
  const submit = useCallback(() => {
    const timings = session.collectTimings();
    const items = tasks.map((item, i) => {
      const given = session.answers[i];
      return {
        id: `fg-${i}`,
        number: i + 1,
        correct: given === item.correctLetter,
        prompt: `${item.shapeLabel} aus ${item.pieceCount} Teilstücken`,
        correctText: item.noneCorrect
          ? 'e) Keine der Antwortmöglichkeiten ist richtig'
          : `Figur ${item.correctLetter.toUpperCase()}`,
        givenText: given ? (given === 'e' ? 'e) Keine ist richtig' : `Figur ${given.toUpperCase()}`) : 'keine Antwort',
        pieceCount: item.pieceCount,
        seconds: timings[i] ?? 0,
        task: item,
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
    setTasks(generateFigureSet(TEST.questionCount, difficulty, { pieceCounts: focusTags?.map((tag) => String(tag).replace('teile-', '')) }));
    setResults([]);
    session.reset();
    setPhase('running');
    countdown.reset(TEST.testSeconds);
  }, [countdown, difficulty, focusTags, session]);

  useEffect(() => {
    if (embedded && tasks.length === 0) {
      startedAt.current = Date.now();
      setTasks(generateFigureSet(TEST.questionCount, difficulty));
    }
  }, [difficulty, embedded, tasks.length]);

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
            '15 Aufgaben in 15 Minuten',
            'a bis d zeigen Figuren, e lautet „Keine der Antwortmöglichkeiten ist richtig“',
            'In etwa jeder fünften Aufgabe ist die gesuchte Figur nicht dabei',
            'Lösungsfiguren: Fünf- bis Achteck und Viertel-/Halb-/Dreiviertel-/Vollkreis',
            'Die Teile dürfen gedreht, aber nicht gespiegelt werden',
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
              <p className="text-[13px] text-black/55 dark:text-white/55">
                {item.task.noneCorrect
                  ? `Aus den Teilen entsteht ein ${item.task.shapeLabel} – der stand nicht zur Auswahl:`
                  : 'So liegen die Teile:'}
              </p>
              <div className="flex justify-center">
                <SolutionShape
                  placements={item.task.placements}
                  colors={PIECE_COLORS}
                  extent={viewExtent([item.task.target])}
                  size={150}
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

  const chosenLetter = session.answers[index];
  // Ein Maßstab für Teilstücke und alle fünf Antwortfiguren
  const figureOptions = task.options.filter((option) => option.points);
  const extent = viewExtent([...figureOptions.map((option) => option.points), task.target, ...task.pieces]);
  const optionSize = 128;
  const scaleFactor = pixelsPerUnit(optionSize, extent);

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
          isCorrect={(i) => session.answers[i] === tasks[i]?.correctLetter}
          firstOpenIndex={session.firstOpen()}
          submitLabel={examMode ? 'Abgeben' : 'Auswerten'}
        />
      }
    >
      <div className="space-y-4">
        <section className="ios-card px-3 py-4">
          <h2 className="mb-3 text-center text-[12px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
            Diese {task.pieces.length} Teilstücke
          </h2>
          <div className="scroll-area flex justify-center overflow-x-auto">
            <PieceRow
              pieces={task.pieces}
              colors={PIECE_COLORS}
              extent={extent}
              pixelsPerUnit={scaleFactor}
              label={`${task.pieces.length} Teilstücke`}
            />
          </div>
        </section>

        <h2 className="px-1 text-[15px] font-semibold">
          Welche Figur lässt sich daraus zusammensetzen?
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {figureOptions.map((option) => {
            const state = !revealed
              ? 'idle'
              : option.correct
                ? 'correct'
                : option.letter === chosenLetter
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
                  points={option.points}
                  extent={extent}
                  size={optionSize}
                  fill={TEST.accent}
                  stroke={TEST.accent}
                  label={`Figur ${option.letter}`}
                />
              </Tappable>
            );
          })}
        </div>

        {(() => {
          const noneOption = task.options[task.options.length - 1];
          const state = !revealed
            ? 'idle'
            : noneOption.correct
              ? 'correct'
              : noneOption.letter === chosenLetter
                ? 'wrong'
                : 'idle';
          return (
            <AnswerOption
              letter={noneOption.letter}
              state={state}
              selected={noneOption.letter === chosenLetter}
              disabled={revealed}
              onClick={() => answer(noneOption)}
            >
              {noneOption.text}
            </AnswerOption>
          );
        })()}

        {revealed && (
          <section className="ios-card animate-slide-up space-y-2 px-4 py-4">
            <h3 className="text-[15px] font-semibold">
              {results[results.length - 1]?.correct
                ? 'Richtig'
                : task.noneCorrect
                  ? 'Richtig wäre e) – die Figur war nicht dabei'
                  : `Richtig wäre Figur ${task.correctLetter.toUpperCase()}`}
            </h3>
            <p className="text-[13px] text-black/55 dark:text-white/55">
              {task.noneCorrect
                ? `Aus den Teilen entsteht ein ${task.shapeLabel} – keine der gezeigten Figuren:`
                : 'So liegen die Teile in der Figur:'}
            </p>
            <div className="flex justify-center pt-1">
              <SolutionShape
                placements={task.placements}
                colors={PIECE_COLORS}
                extent={extent}
                size={170}
              />
            </div>
          </section>
        )}
      </div>
    </Screen>
  );
}
