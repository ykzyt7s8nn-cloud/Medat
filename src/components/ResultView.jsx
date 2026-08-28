/**
 * Ergebnisansicht nach einem Durchgang.
 *
 * Zeigt Punkte, Prozent und – aufklappbar – jede falsch beantwortete Aufgabe
 * mit der richtigen Lösung. `renderReview` erlaubt es jedem Untertest, eigene
 * Details zu ergänzen (z. B. den zugehörigen Allergieausweis).
 */
import { useState } from 'react';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import ProgressRing from './ui/ProgressRing.jsx';
import Tappable from './ui/Tappable.jsx';
import { formatTime } from '../hooks/useCountdown.js';
import { formatDuration } from '../lib/format.js';

function scoreColor(percent) {
  if (percent >= 80) return '#34C759';
  if (percent >= 55) return '#FF9500';
  return '#FF3B30';
}

/**
 * Tempo-Auswertung: Wie lange hat eine Aufgabe im Schnitt gedauert, und wie
 * lange bräuchte man in diesem Tempo für den ganzen Untertest?
 *
 * Das ist im MedAT oft entscheidender als das reine Können – wer pro Aufgabe
 * 20 Sekunden zu lang braucht, kommt nicht durch.
 */
function PaceCard({ items, max, limitSeconds }) {
  const timed = items.filter((item) => typeof item.seconds === 'number' && item.seconds > 0);
  if (timed.length === 0 || !limitSeconds) return null;

  const average = timed.reduce((sum, item) => sum + item.seconds, 0) / timed.length;
  const projected = average * max;
  const budget = limitSeconds / max;
  const ratio = projected / limitSeconds;
  const color = ratio <= 0.85 ? '#34C759' : ratio <= 1 ? '#FF9500' : '#FF3B30';
  const slowest = [...timed].sort((a, b) => b.seconds - a.seconds)[0];

  return (
    <section className="ios-card space-y-2 px-4 py-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[15px] font-semibold">Tempo</h3>
        <span className="tabular text-[15px] font-semibold" style={{ color }}>
          ⌀ {formatDuration(average)} pro Aufgabe
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, ratio * 100)}%`, backgroundColor: color, transition: 'width 600ms ease' }}
        />
      </div>

      <p className="text-[13px] text-black/60 dark:text-white/60">
        In diesem Tempo brauchst du für alle {max} Aufgaben {formatDuration(projected)} – erlaubt sind{' '}
        {formatDuration(limitSeconds)} (also {formatDuration(budget)} pro Aufgabe).{' '}
        {ratio <= 0.85
          ? 'Du liegst komfortabel im Zeitrahmen.'
          : ratio <= 1
            ? 'Das ist knapp – im Test kostet jede Unsicherheit Zeit.'
            : 'So reicht die Zeit nicht. Übe, unlösbare Aufgaben früher zu überspringen.'}
      </p>

      {slowest && slowest.seconds > average * 1.5 && (
        <p className="text-[12px] text-black/45 dark:text-white/45">
          Längste Aufgabe: Nr. {slowest.number} mit {formatDuration(slowest.seconds)}.
        </p>
      )}
    </section>
  );
}

export function ResultView({
  title = 'Ergebnis',
  score,
  max,
  seconds,
  items = [],
  limitSeconds,
  renderReview,
  onRestart,
  onClose,
  extra,
}) {
  const [openId, setOpenId] = useState(null);
  const percent = max > 0 ? (score / max) * 100 : 0;
  const wrongItems = items.filter((item) => !item.correct);

  return (
    <div className="space-y-4 pb-6">
      <section className="ios-card animate-slide-up flex flex-col items-center gap-3 px-4 py-6 text-center">
        <ProgressRing value={percent / 100} size={132} strokeWidth={11} color={scoreColor(percent)}>
          <div>
            <p className="tabular text-[30px] font-bold leading-none">
              {score}
              <span className="text-[18px] font-semibold text-black/40 dark:text-white/40">/{max}</span>
            </p>
            <p className="tabular text-[15px] font-semibold" style={{ color: scoreColor(percent) }}>
              {Math.round(percent)} %
            </p>
          </div>
        </ProgressRing>
        <div>
          <h2 className="text-[19px] font-bold">{title}</h2>
          {typeof seconds === 'number' && (
            <p className="text-[13px] text-black/50 dark:text-white/50">
              Bearbeitungszeit: {formatTime(seconds)}
            </p>
          )}
        </div>
        {extra}
      </section>

      <PaceCard items={items} max={max} limitSeconds={limitSeconds} />

      {wrongItems.length > 0 && (
        <section className="space-y-2">
          <h3 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
            Falsch beantwortet ({wrongItems.length})
          </h3>
          {wrongItems.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} className="ios-card overflow-hidden">
                <Tappable
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ios-red/15 text-[12px] font-bold text-ios-red">
                    {item.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium leading-snug">{item.prompt}</span>
                    <span className="mt-1 block text-[13px] text-ios-green">Richtig: {item.correctText}</span>
                    {item.givenText && (
                      <span className="block text-[13px] text-black/45 line-through dark:text-white/45">
                        Deine Antwort: {item.givenText}
                      </span>
                    )}
                    {typeof item.seconds === 'number' && item.seconds > 0 && (
                      <span className="block text-[12px] text-black/40 dark:text-white/40">
                        {formatDuration(item.seconds)} gebraucht
                      </span>
                    )}
                  </span>
                  <Icon
                    name="chevronRight"
                    className={`mt-1 h-4 w-4 shrink-0 text-black/30 transition-transform duration-200 dark:text-white/30 ${open ? 'rotate-90' : ''}`}
                  />
                </Tappable>
                {open && (
                  <div className="border-t border-black/5 px-4 py-3 dark:border-white/10">
                    {renderReview ? renderReview(item) : (
                      <p className="text-[14px] text-black/60 dark:text-white/60">{item.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {wrongItems.length === 0 && (
        <section className="ios-card px-4 py-5 text-center">
          <p className="text-[15px] font-medium text-ios-green">Alle Aufgaben richtig gelöst.</p>
        </section>
      )}

      <div className="flex gap-3 pt-1">
        {onRestart && (
          <Button variant="primary" size="lg" onClick={onRestart} className="flex-1">
            <Icon name="refresh" className="h-5 w-5" />
            Neuer Durchgang
          </Button>
        )}
        {onClose && (
          <Button variant="neutral" size="lg" onClick={onClose} className="flex-1">
            Fertig
          </Button>
        )}
      </div>
    </div>
  );
}

export default ResultView;
