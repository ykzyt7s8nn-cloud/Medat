/**
 * Einheitlicher Startbildschirm eines Untertests.
 *
 * Zeigt die offiziellen MedAT-Eckdaten, die aktuell eingestellte Schwierigkeit
 * und den Timer-Status – damit vor dem Start klar ist, worauf man sich einlässt.
 */
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import { formatTime } from '../hooks/useCountdown.js';

export function TestIntro({ test, facts = [], timerEnabled, difficultyLabel, onStart, children, startLabel = 'Übung starten' }) {
  return (
    <div className="space-y-4">
      <section className="ios-card px-4 py-5">
        <span
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${test.accent}1A`, color: test.accent }}
        >
          <Icon name={test.icon} className="h-6 w-6" strokeWidth={2} />
        </span>
        <h2 className="text-[19px] font-bold leading-tight">{test.name}</h2>
        <p className="mt-1 text-[15px] text-black/60 dark:text-white/60">{test.tagline}</p>

        <ul className="mt-4 space-y-2">
          {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-2 text-[14px]">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-ios-green" strokeWidth={2.4} />
              <span className="text-black/70 dark:text-white/70">{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ios-list">
        <div className="ios-row">
          <span className="text-black/60 dark:text-white/60">Zeitlimit</span>
          <span className="tabular font-medium">
            {timerEnabled ? formatTime(test.testSeconds) : 'ohne Timer'}
          </span>
        </div>
        {difficultyLabel && (
          <div className="ios-row">
            <span className="text-black/60 dark:text-white/60">Schwierigkeit</span>
            <span className="font-medium">{difficultyLabel}</span>
          </div>
        )}
        <div className="ios-row">
          <span className="text-black/60 dark:text-white/60">Aufgaben</span>
          <span className="tabular font-medium">{test.questionCount}</span>
        </div>
      </section>

      {children}

      <Button size="lg" onClick={onStart}>
        <Icon name="play" className="h-5 w-5" />
        {startLabel}
      </Button>
    </div>
  );
}

export default TestIntro;
