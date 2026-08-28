/**
 * Countdown-Anzeige für die Untertests.
 *
 * Zeigt verbleibende Zeit, Fortschrittsbalken und den Aufgabenstand. Unter
 * 60 Sekunden wird die Anzeige orange, unter 15 Sekunden rot und pulsiert.
 */
import { formatTime } from '../../hooks/useCountdown.js';

export function TimerBar({ remaining, total, enabled = true, progressLabel, accent = '#007AFF' }) {
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
