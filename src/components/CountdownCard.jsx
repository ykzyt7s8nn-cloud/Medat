/**
 * Testtermin, Strähne und Gesamtzeit in einer Karte.
 *
 * Ohne hinterlegten Termin bleibt die Karte trotzdem nützlich: Sie zeigt dann
 * Strähne und Gesamtzeit und lädt dazu ein, den Termin einzutragen. Eine
 * leere Karte, die nur nach Daten fragt, wäre es nicht wert.
 */
import Icon from './ui/Icon.jsx';
import Tappable from './ui/Tappable.jsx';
import { describeDaysLeft, formatExamDate } from '../lib/examDate.js';
import { formatTime } from '../hooks/useCountdown.js';

/** Ab hier wird es eng – dann bekommt die Karte einen dringlicheren Ton. */
const SOON_DAYS = 14;

export default function CountdownCard({ daysLeft, examDate, streak, seconds, onOpenSettings }) {
  const past = daysLeft !== null && daysLeft < 0;
  const soon = daysLeft !== null && daysLeft >= 0 && daysLeft <= SOON_DAYS;
  const accent = past ? '#8E8E93' : soon ? '#FF3B30' : '#007AFF';

  return (
    <section className="ios-card px-4 py-4">
      <div className="flex items-center gap-3.5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          <Icon name="calendar" className="h-6 w-6" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          {daysLeft === null ? (
            <>
              <h2 className="text-[15px] font-semibold">Dein Testtermin</h2>
              <p className="text-[13px] text-black/50 dark:text-white/50">
                Trag ihn ein, dann zählt die App die Tage mit.
              </p>
            </>
          ) : (
            <>
              <p className="tabular text-[22px] font-bold leading-tight" style={{ color: accent }}>
                {past ? 'Termin vorbei' : daysLeft === 0 ? 'Heute!' : `noch ${daysLeft} ${daysLeft === 1 ? 'Tag' : 'Tage'}`}
              </p>
              <p className="text-[13px] text-black/50 dark:text-white/50">
                MedAT am {formatExamDate(examDate)}
                {!past && daysLeft > 1 && ` · ${describeDaysLeft(daysLeft)}`}
              </p>
            </>
          )}
        </div>
        {onOpenSettings && (
          <Tappable
            onClick={onOpenSettings}
            aria-label={daysLeft === null ? 'Testtermin eintragen' : 'Testtermin ändern'}
            className="shrink-0 rounded-xl bg-black/5 px-3 py-2 text-[13px] font-medium text-ios-blue dark:bg-white/10"
          >
            {daysLeft === null ? 'Eintragen' : 'Ändern'}
          </Tappable>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-black/5 pt-2.5 text-[12px] text-black/50 dark:border-white/10 dark:text-white/50">
        <span className="inline-flex items-center gap-1">
          <Icon name="flame" className="h-4 w-4 text-ios-orange" />
          {streak} {streak === 1 ? 'Tag' : 'Tage'} am Stück
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="clock" className="h-4 w-4" />
          {formatTime(seconds)} geübt
        </span>
      </div>
    </section>
  );
}
