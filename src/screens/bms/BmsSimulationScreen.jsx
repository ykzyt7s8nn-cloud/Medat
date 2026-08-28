/**
 * BMS-Simulation: alle vier Fächer nacheinander mit den Originalzeiten.
 *
 * Biologie 40 Fragen / 30 min, Chemie 24 / 18, Physik 18 / 16,
 * Mathematik 12 / 11 – zusammen 94 Fragen in 75 Minuten.
 */
import { Suspense, lazy, useCallback, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import ProgressRing from '../../components/ui/ProgressRing.jsx';
import { BMS_TOTAL, SUBJECTS, SUBJECT_ORDER } from '../../data/bms/index.js';
import { formatTime } from '../../hooks/useCountdown.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useBmsProgress } from '../../store/useBmsProgress.js';

const BmsQuizScreen = lazy(() => import('./BmsQuizScreen.jsx'));

export default function BmsSimulationScreen() {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const addQuizResult = useBmsProgress((state) => state.addQuizResult);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);

  const handleFinish = useCallback((result) => {
    addQuizResult({
      subjectId: result.subjectId,
      mode: 'simulation',
      score: result.score,
      max: result.max,
      seconds: result.seconds,
      breakdown: result.results.map((item) => ({ topicId: item.topicId, correct: item.correct })),
    });
    setResults((current) => [...current, result]);
    setStep((current) => current + 1);
  }, [addQuizResult]);

  if (!started) {
    return (
      <Screen title="BMS-Simulation" onClose={closeScreen}>
        <div className="space-y-4">
          <section className="ios-card px-4 py-5">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ios-green/10 text-ios-green">
              <Icon name="trophy" className="h-6 w-6" strokeWidth={2} />
            </span>
            <h2 className="text-[19px] font-bold">Alle vier Fächer am Stück</h2>
            <p className="mt-1 text-[15px] text-black/60 dark:text-white/60">
              Originalreihenfolge und Originalzeiten. Die Timer laufen unabhängig von deinen
              Timer-Einstellungen immer mit.
            </p>
          </section>

          <section className="ios-list">
            {SUBJECT_ORDER.map((id, position) => (
              <div key={id} className="ios-row">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-[12px] font-bold dark:bg-white/10">
                    {position + 1}
                  </span>
                  <span className="truncate">{SUBJECTS[id].name}</span>
                </span>
                <span className="tabular shrink-0 text-[13px] text-black/45 dark:text-white/45">
                  {SUBJECTS[id].questionCount} Fragen · {formatTime(SUBJECTS[id].seconds)}
                </span>
              </div>
            ))}
            <div className="ios-row font-semibold">
              <span>Gesamt</span>
              <span className="tabular">
                {BMS_TOTAL.questionCount} Fragen · {formatTime(BMS_TOTAL.seconds)}
              </span>
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

  if (step >= SUBJECT_ORDER.length) {
    const score = results.reduce((sum, item) => sum + item.score, 0);
    const max = results.reduce((sum, item) => sum + item.max, 0);
    const percent = max > 0 ? (score / max) * 100 : 0;
    return (
      <Screen title="BMS – Gesamtauswertung" onClose={closeScreen}>
        <div className="space-y-4 pb-6">
          <section className="ios-card flex flex-col items-center gap-3 px-4 py-6 text-center">
            <ProgressRing value={percent / 100} size={140} strokeWidth={12} color="#34C759">
              <div>
                <p className="tabular text-[30px] font-bold leading-none">
                  {score}
                  <span className="text-[18px] text-black/40 dark:text-white/40">/{max}</span>
                </p>
                <p className="tabular text-[15px] font-semibold text-ios-green">{Math.round(percent)} %</p>
              </div>
            </ProgressRing>
            <h2 className="text-[19px] font-bold">BMS-Gesamtergebnis</h2>
          </section>

          <section className="ios-list">
            {results.map((item) => {
              const subject = SUBJECTS[item.subjectId];
              return (
                <div key={item.subjectId} className="ios-row">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Icon name={subject.icon} className="h-4 w-4 shrink-0" style={{ color: subject.accent }} />
                    <span className="truncate">{subject.name}</span>
                  </span>
                  <span className="tabular shrink-0 font-semibold">
                    {item.score}/{item.max}
                    <span className="ml-2 text-[13px] font-normal text-black/45 dark:text-white/45">
                      {item.max ? Math.round((item.score / item.max) * 100) : 0} %
                    </span>
                  </span>
                </div>
              );
            })}
          </section>

          <Button size="lg" variant="neutral" onClick={closeScreen}>Fertig</Button>
        </div>
      </Screen>
    );
  }

  const subjectId = SUBJECT_ORDER[step];
  return (
    <Suspense fallback={null}>
      <BmsQuizScreen key={subjectId} subjectId={subjectId} embedded onFinish={handleFinish} />
    </Suspense>
  );
}
