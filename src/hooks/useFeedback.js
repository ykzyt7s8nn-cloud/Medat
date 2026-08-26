/**
 * Haptik- und Sound-Feedback.
 *
 * iOS Safari kennt keine Vibration-API, deshalb wird zusätzlich ein kurzes
 * visuelles Feedback genutzt (siehe Tappable-Komponente) und optional ein
 * kurzer Ton über die Web Audio API erzeugt – ohne externe Audiodateien,
 * damit die App vollständig offline funktioniert.
 */
import { useCallback, useRef } from 'react';
import { useSettings } from '../store/useSettings.js';

const TONES = {
  tap: { frequency: 660, duration: 0.05, gain: 0.05 },
  correct: { frequency: 880, duration: 0.12, gain: 0.08 },
  wrong: { frequency: 220, duration: 0.18, gain: 0.08 },
  warning: { frequency: 440, duration: 0.25, gain: 0.07 },
  done: { frequency: 1046, duration: 0.2, gain: 0.08 },
};

export function useFeedback() {
  const sound = useSettings((state) => state.sound);
  const haptics = useSettings((state) => state.haptics);
  const contextRef = useRef(null);

  const playTone = useCallback(
    (kind) => {
      if (!sound || !TONES[kind]) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!contextRef.current) contextRef.current = new AudioContextClass();
        const context = contextRef.current;
        if (context.state === 'suspended') context.resume();
        const { frequency, duration, gain } = TONES[kind];
        const oscillator = context.createOscillator();
        const amplifier = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        amplifier.gain.setValueAtTime(gain, context.currentTime);
        amplifier.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
        oscillator.connect(amplifier).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + duration);
      } catch {
        // Audio ist ein Extra – Fehler dürfen die App nie stören.
      }
    },
    [sound],
  );

  const vibrate = useCallback(
    (pattern) => {
      if (!haptics) return;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
    },
    [haptics],
  );

  return {
    tap: useCallback(() => { playTone('tap'); vibrate(8); }, [playTone, vibrate]),
    correct: useCallback(() => { playTone('correct'); vibrate([12, 40, 12]); }, [playTone, vibrate]),
    wrong: useCallback(() => { playTone('wrong'); vibrate(45); }, [playTone, vibrate]),
    warning: useCallback(() => { playTone('warning'); vibrate([20, 60, 20]); }, [playTone, vibrate]),
    done: useCallback(() => { playTone('done'); vibrate([15, 50, 15, 50, 25]); }, [playTone, vibrate]),
  };
}
