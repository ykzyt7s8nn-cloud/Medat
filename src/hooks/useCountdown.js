/**
 * Countdown mit zeitstempelbasierter Berechnung.
 *
 * Wichtig für iOS: Wird der Tab in den Hintergrund geschickt, werden Timer
 * gedrosselt. Deshalb wird die verbleibende Zeit immer aus der Systemzeit
 * abgeleitet und nicht hochgezählt.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCountdown(totalSeconds, { enabled = true, onExpire, autoStart = true } = {}) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(autoStart && enabled);
  const deadlineRef = useRef(Date.now() + totalSeconds * 1000);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const reset = useCallback(
    (seconds = totalSeconds) => {
      deadlineRef.current = Date.now() + seconds * 1000;
      expiredRef.current = false;
      setRemaining(seconds);
      setRunning(true);
    },
    [totalSeconds],
  );

  const pause = useCallback(() => {
    setRunning((wasRunning) => {
      if (wasRunning) setRemaining(Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000)));
      return false;
    });
  }, []);

  const resume = useCallback(() => {
    setRunning((wasRunning) => {
      if (!wasRunning) deadlineRef.current = Date.now() + remaining * 1000;
      return true;
    });
  }, [remaining]);

  useEffect(() => {
    if (!enabled || !running) return undefined;
    const tick = () => {
      const left = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        setRunning(false);
        onExpireRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    const onVisible = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, running]);

  return { remaining, running, reset, pause, resume, elapsed: totalSeconds - remaining };
}

/** Sekunden als m:ss bzw. h:mm:ss. */
export function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
