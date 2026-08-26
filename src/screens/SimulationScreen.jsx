/**
 * MedAT-Simulation.
 *
 * Durchläuft die vier enthaltenen Untertests in der echten Testreihenfolge und
 * mit den Originalzeiten. "Figuren zusammensetzen" ist nicht Teil der App und
 * wird nur als Zeitblock mit Hinweis dargestellt.
 *
 * Besonderheit: Die Lernphase des Gedächtnistests liegt am Anfang, die
 * zugehörige Prüfphase erst drei Untertests später – genau wie im MedAT. Die
 * erzeugten Ausweise werden dafür über den gesamten Durchlauf gehalten.
 */
import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import Screen from '../components/layout/Screen.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import ProgressRing from '../components/ui/ProgressRing.jsx';
import { SIMULATION_STEPS, TESTS } from '../data/testConfig.js';
import { generateMemorySession } from '../engines/memory.js';
import { formatTime, useCountdown } from '../hooks/useCountdown.js';
import { useNavigation } from '../store/useNavigation.js';
import { useProgress } from '../store/useProgress.js';

const MemoryTest = lazy(() => import('./tests/MemoryTest.jsx'));
const NumberSeriesTest = lazy(() => import('./tests/NumberSeriesTest.jsx'));
const WordFluencyTest = lazy(() => import('./tests/WordFluencyTest.jsx'));
const ImplicationsTest = lazy(() => import('./tests/ImplicationsTest.jsx'));

const TEST_COMPONENTS = {
  numberSeries: NumberSeriesTest,
  wordFluency: WordFluencyTest,
  implications: ImplicationsTest,
};

/**
 * Grobe Einordnung des KFF-Ergebnisses.
 * Die tatsächlichen Prozentränge hängen vom Jahrgang ab – das hier ist
 * ausdrücklich nur eine Orientierung, keine Prognose.
 */
const PERCENTILE_BANDS = [
  { min: 90, label: 'über 95', hint: 'Sehr starkes Ergebnis' },
  { min: 80, label: '85–95', hint: 'Deutlich über dem Durchschnitt' },
  { min: 70, label: '70–85', hint: 'Über dem Durchschnitt' },
  { min: 60, label: '55–70', hint: 'Leicht über dem Durchschnitt' },
  { min: 50, label: '40–55', hint: 'Im Durchschnitt' },
  { min: 40, label: '25–40', hint: 'Unter dem Durchschnitt' },
  { min: 30, label: '10–25', hint: 'Deutlich unter dem Durchschnitt' },
  { min: 0, label: 'unter 10', hint: 'Hier ist noch viel Luft nach oben' },
];

const bandFor = (percent) => PERCENTILE_BANDS.find((band) => percent >= band.min) ?? PERCENTILE_BANDS[PERCENTILE_BANDS.length - 1];

/* ------------------------------------------------------- Hinweis-Zeitblock */

function NoticeStep({ step, onNext, onAbort }) {
  const countdown = useCountdown(step.seconds, { onExpire: onNext });
  return (
    <Screen title="MedAT-Simulation" subtitle={step.title}>
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <ProgressRing value={countdown.remaining / step.seconds} size={168} strokeWidth={12} color="#8E8E93">
          <span className="tabular text-[32px] font-bold">{formatTime(countdown.remaining)}</span>
        </ProgressRing>
        <div className="px-6">
          <h2 className="text-[19px] font-bold">{step.title}</h2>
          <p className="mt-2 text-[15px] text-black/60 dark:text-white/60">
            Dieser Untertest ist in dieser App nicht enthalten. Im echten MedAT stehen dafür
            {' '}{formatTime(step.seconds)} zur Verfügung – der Block bleibt hier nur der Vollständigkeit
            halber erhalten.
          </p>
        </div>
        <div className="w-full space-y-2 px-2">
          <Button size="lg" onClick={onNext}>
            Block überspringen
            <Icon name="chevronRight" className="h-5 w-5" />
          </Button>
          <Button size="lg" variant="neutral" onClick={onAbort}>
            Simulation abbrechen
          </Button>
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------------------- Auswertung */

function SimulationResult({ results, onClose, onRestart }) {
  const score = results.reduce((sum, item) => sum + item.score, 0);
  const max = results.reduce((sum, item) => sum + item.max, 0);
  const percent = max > 0 ? (score / max) * 100 : 0;
  const band = bandFor(percent);
  const seconds = results.reduce((sum, item) => sum + item.seconds, 0);

  return (
    <Screen title="Simulation – Gesamtauswertung" onClose={onClose}>
      <div className="space-y-4 pb-6">
        <section className="ios-card flex flex-col items-center gap-3 px-4 py-6 text-center">
          <ProgressRing value={percent / 100} size={140} strokeWidth={12} color="#007AFF">
            <div>
              <p className="tabular text-[30px] font-bold leading-none">
                {score}
                <span className="text-[18px] text-black/40 dark:text-white/40">/{max}</span>
              </p>
              <p className="tabular text-[15px] font-semibold text-ios-blue">{Math.round(percent)} %</p>
            </div>
          </ProgressRing>
          <div>
            <h2 className="text-[19px] font-bold">KFF-Gesamtergebnis</h2>
            <p className="text-[13px] text-black/50 dark:text-white/50">Bearbeitungszeit {formatTime(seconds)}</p>
          </div>
        </section>

        <section className="ios-card px-4 py-4 text-center">
          <p className="text-[13px] uppercase tracking-wide text-black/45 dark:text-white/45">
            Geschätzter Prozentrang
          </p>
          <p className="tabular mt-1 text-[28px] font-bold text-ios-blue">{band.label}</p>
          <p className="mt-1 text-[14px] text-black/60 dark:text-white/60">{band.hint}</p>
          <p className="mt-3 text-[12px] leading-relaxed text-black/45 dark:text-white/45">
            Nur eine grobe Orientierung: Der echte Prozentrang hängt vom jeweiligen Jahrgang ab und
            berücksichtigt zusätzlich den Untertest „Figuren zusammensetzen“.
          </p>
        </section>

        <section className="ios-list">
          {results.map((item) => {
            const test = TESTS[item.testId];
            const itemPercent = item.max > 0 ? (item.score / item.max) * 100 : 0;
            return (
              <div key={item.testId} className="ios-row">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${test.accent}1A`, color: test.accent }}
                  >
                    <Icon name={test.icon} className="h-4 w-4" />
                  </span>
                  <span className="truncate">{test.short}</span>
                </span>
                <span className="tabular shrink-0 font-semibold">
                  {item.score}/{item.max}
                  <span className="ml-2 text-[13px] font-normal text-black/45 dark:text-white/45">
                    {Math.round(itemPercent)} %
                  </span>
                </span>
              </div>
            );
          })}
        </section>

        <div className="flex gap-3">
          <Button size="lg" className="flex-1" onClick={onRestart}>
            <Icon name="refresh" className="h-5 w-5" />
            Nochmal
          </Button>
          <Button size="lg" variant="neutral" className="flex-1" onClick={onClose}>
            Fertig
          </Button>
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------------------ Hauptscreen */

export default function SimulationScreen() {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addResult = useProgress((state) => state.addResult);

  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState([]);
  // Die Ausweise werden einmal für den gesamten Durchlauf erzeugt: gelernt wird
  // in Schritt 2, abgefragt erst in Schritt 5.
  const [memorySession, setMemorySession] = useState(() =>
    generateMemorySession(TESTS.memory.cardCount, TESTS.memory.questionCount));

  const totalSeconds = useMemo(
    () => SIMULATION_STEPS.reduce((sum, step) => sum + step.seconds, 0),
    [],
  );

  const advance = useCallback(() => setStepIndex((index) => index + 1), []);

  const handleFinish = useCallback(
    (result) => {
      const { testId, score, max, seconds } = result;
      addResult({ testId, score, max, seconds, mode: 'simulation' });
      setResults((current) => [...current, result]);
      advance();
    },
    [addResult, advance],
  );

  const restart = () => {
    setResults([]);
    setMemorySession(generateMemorySession(TESTS.memory.cardCount, TESTS.memory.questionCount));
    setStepIndex(0);
    setStarted(true);
  };

  if (!started) {
    return (
      <Screen title="MedAT-Simulation" onClose={closeScreen}>
        <div className="space-y-4">
          <section className="ios-card px-4 py-5">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ios-blue/10 text-ios-blue">
              <Icon name="trophy" className="h-6 w-6" strokeWidth={2} />
            </span>
            <h2 className="text-[19px] font-bold">Alle Untertests am Stück</h2>
            <p className="mt-1 text-[15px] text-black/60 dark:text-white/60">
              Echte Reihenfolge, echte Zeitlimits. Die Timer laufen unabhängig von deinen
              Timer-Einstellungen immer mit.
            </p>
          </section>

          <section className="ios-list">
            {SIMULATION_STEPS.map((step, index) => (
              <div key={step.id} className="ios-row">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-[12px] font-bold dark:bg-white/10">
                    {index + 1}
                  </span>
                  <span className="truncate">{step.title}</span>
                </span>
                <span className="tabular shrink-0 text-[13px] text-black/45 dark:text-white/45">
                  {formatTime(step.seconds)}
                </span>
              </div>
            ))}
            <div className="ios-row font-semibold">
              <span>Gesamt</span>
              <span className="tabular">{formatTime(totalSeconds)}</span>
            </div>
          </section>

          <Button size="lg" onClick={() => setStarted(true)}>
            <Icon name="play" className="h-5 w-5" />
            Simulation starten
          </Button>
        </div>
      </Screen>
    );
  }

  if (stepIndex >= SIMULATION_STEPS.length) {
    return <SimulationResult results={results} onClose={closeScreen} onRestart={restart} />;
  }

  const step = SIMULATION_STEPS[stepIndex];

  if (step.kind === 'notice') {
    return <NoticeStep step={step} onNext={advance} onAbort={closeScreen} />;
  }

  if (step.kind === 'memoryLearn') {
    return (
      <Suspense fallback={null}>
        <MemoryTest embedded stage="learn" session={memorySession} onLearnComplete={advance} />
      </Suspense>
    );
  }

  if (step.kind === 'memoryQuiz') {
    return (
      <Suspense fallback={null}>
        <MemoryTest embedded stage="quiz" session={memorySession} onFinish={handleFinish} />
      </Suspense>
    );
  }

  const TestComponent = TEST_COMPONENTS[step.id];
  return (
    <Suspense fallback={null}>
      <TestComponent embedded onFinish={handleFinish} />
    </Suspense>
  );
}
