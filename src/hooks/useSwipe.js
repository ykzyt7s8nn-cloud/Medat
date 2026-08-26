/**
 * Swipe-Gesten für Touch-Geräte.
 *
 * Liefert Props, die direkt auf ein Element gelegt werden können. Vertikales
 * Scrollen bleibt möglich: erst ab einer klar horizontalen Bewegung greift die
 * Geste.
 */
import { useRef } from 'react';

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 60 } = {}) {
  const start = useRef(null);

  return {
    onTouchStart: (event) => {
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd: (event) => {
      if (!start.current) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.current.x;
      const dy = touch.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
  };
}
