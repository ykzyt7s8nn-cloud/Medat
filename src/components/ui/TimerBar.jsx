/**
 * Countdown-Anzeige für die Untertests.
 *
 * Zeigt verbleibende Zeit, Fortschrittsbalken und den Aufgabenstand. Unter
 * 60 Sekunden wird die Anzeige orange, unter 15 Sekunden rot und pulsiert.
 *
 * Zusätzlich meldet sie sich beim Unterschreiten fester Marken kurz haptisch:
 * Beim Üben schaut man auf die Aufgabe, nicht auf die Uhr, und im echten MedAT
 * entscheidet die Zeiteinteilung mit über das Ergebnis. Weil diese Leiste in
 * allen Untertests steckt, liegt die Logik hier statt sechsmal in den Screens.
 */
import { useEffect, useRef } from 'react';
import { formatTime } from '../../hooks/useCountdown.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { crossedMarks } from '../../lib/timeWarnings.js';
import { useSettings } from '../../store/useSettings.js';

export function TimerBar({ remaining, total, enabled = true, progressLabel, accent = '#007AFF' }) {
  const feedback = useFeedback();
  const timeWarnings = useSettings((state) => state.timeWarnings);
  const previous = useRef(remaining);
  const fired = useRef(new Set());

  useEffect(() => {
    const before = previous.current;
    previous.current = remaining;
    // Neustart des Durchgangs: Marken wieder scharf schalten.
    if (remaining > before) { fired.current = new Set(); return; }
    if (!enabled || !timeWarnings) return;
    for (const mark of crossedMarks(before, remaining, total)) {
      if (fired.current.has(mark)) continue;
      fired.current.add(mark);
      feedback.warning();
    }
  }, [enabled, feedback, remaining, timeWarnings, total]);

  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const critical = enabled && remaining <= 15;
  const warning = enabled && remaining <= 60 && !critical;
  const color = critical ? '#FF3B30' : warning ? '#FF9500' : accent;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
          <div
            className="h-full rounded-full"
            style={{
              width: enabled ? `${ratio * 100}%` : '100%',
              backgroundColor: color,
              transition: 'width 400ms linear, background-color 300ms ease',
            }}
          />
        </div>
        {progressLabel && (
          <p className="mt-1 text-[12px] text-black/50 dark:text-white/50">{progressLabel}</p>
        )}
      </div>
      <div
        className={`tabular font-bold ${enabled ? 'text-[17px]' : 'text-[12px] text-black/40 dark:text-white/40'} ${critical ? 'animate-pulse' : ''}`}
        style={{ color: enabled ? color : undefined }}
        role="timer"
        aria-live="off"
      >
        {enabled ? formatTime(remaining) : 'ohne Timer'}
      </div>
    </div>
  );
}

export default TimerBar;
