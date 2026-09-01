/**
 * Haptik- und Sound-Feedback.
 *
 * Zwei Eigenheiten von iOS bestimmen den Aufbau:
 *
 * 1. Safari kennt navigator.vibrate nicht – weder auf dem iPhone noch auf dem
 *    Mac. Echte Haptik gibt es dort nur über einen Umweg: Seit iOS 17.4 löst
 *    das Umschalten eines <input type="checkbox" switch> das systemeigene
 *    Haptik-Muster aus. Ein solches Element hängt unsichtbar im Dokument und
 *    wird programmatisch umgeschaltet. Das ist ein Kunstgriff und keine
 *    zugesicherte Schnittstelle; wo er nicht greift, bleibt es beim visuellen
 *    Feedback der Tappable-Komponente.
 *
 * 2. Der AudioContext gehört ins Modul, nicht in den Hook. Jede tappbare Fläche
 *    ruft useFeedback auf; läge der Kontext im Hook, entstünde pro Button ein
 *    eigener. Safari begrenzt deren Zahl hart – danach schlägt die Erzeugung
 *    fehl und der Ton bliebe stillschweigend weg.
 *
 * Töne werden über die Web Audio API erzeugt, ohne Audiodateien, damit die App
 * vollständig offline funktioniert.
 */
import { useCallback } from 'react';
import { useSettings } from '../store/useSettings.js';

const TONES = {
  tap: { frequency: 660, duration: 0.05, gain: 0.05 },
  correct: { frequency: 880, duration: 0.12, gain: 0.08 },
  wrong: { frequency: 220, duration: 0.18, gain: 0.08 },
  warning: { frequency: 440, duration: 0.25, gain: 0.07 },
  done: { frequency: 1046, duration: 0.2, gain: 0.08 },
};

/* ------------------------------------------------------------------ Audio */

let audioContext = null;

/** Ein einziger Kontext für die gesamte App, erst beim ersten Ton erzeugt. */
function getAudioContext() {
  if (audioContext) return audioContext;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext = new AudioContextClass();
  return audioContext;
}

function playTone(kind) {
  if (!TONES[kind]) return;
  try {
    const context = getAudioContext();
    if (!context) return;
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
}

/* ----------------------------------------------------------------- Haptik */

let hapticSwitch = null;

/**
 * Unsichtbares Switch-Element, dessen Umschalten iOS zum Vibrieren bringt.
 * Es muss im Dokument hängen und darf nicht per display:none entfernt werden,
 * sonst löst iOS die Haptik nicht aus – deshalb wird es stattdessen auf einen
 * Punkt außerhalb des sichtbaren Bereichs geschoben.
 */
function getHapticSwitch() {
  if (hapticSwitch) return hapticSwitch;
  if (typeof document === 'undefined') return null;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  input.setAttribute('aria-hidden', 'true');
  input.tabIndex = -1;
  input.style.cssText = 'position:fixed;top:-100px;left:-100px;width:1px;height:1px;opacity:0;pointer-events:none;';
  document.body.appendChild(input);
  hapticSwitch = input;
  return hapticSwitch;
}

/** true, wenn der Browser das Switch-Element kennt (iOS 17.4+ / Safari 17.4+). */
export function supportsSwitchHaptics() {
  if (typeof document === 'undefined') return false;
  const probe = document.createElement('input');
  probe.type = 'checkbox';
  return 'switch' in probe;
}

/** true, wenn überhaupt eine Form von Haptik zur Verfügung steht. */
export function supportsHaptics() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) return true;
  return supportsSwitchHaptics();
}

function buzz(pattern) {
  // Android und Desktop-Chrome: die echte Vibration-API, inklusive Muster.
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
    return;
  }
  // iOS: ein Tick je Musterschritt, denn die Dauer lässt sich nicht steuern.
  if (!supportsSwitchHaptics()) return;
  const input = getHapticSwitch();
  if (!input) return;
  const ticks = Array.isArray(pattern) ? Math.ceil(pattern.length / 2) : 1;
  for (let i = 0; i < ticks; i += 1) {
    // Die Abstände orientieren sich am Muster, damit ein „richtig" anders
    // klingt als ein „falsch".
    window.setTimeout(() => { input.checked = !input.checked; }, i * 90);
  }
}

/* ------------------------------------------------------------------- Hook */

export function useFeedback() {
  const sound = useSettings((state) => state.sound);
  const haptics = useSettings((state) => state.haptics);

  const signal = useCallback(
    (kind, pattern) => {
      if (sound) playTone(kind);
      if (haptics) buzz(pattern);
    },
    [haptics, sound],
  );

  return {
    tap: useCallback(() => signal('tap', 8), [signal]),
    correct: useCallback(() => signal('correct', [12, 40, 12]), [signal]),
    wrong: useCallback(() => signal('wrong', 45), [signal]),
    warning: useCallback(() => signal('warning', [20, 60, 20]), [signal]),
    done: useCallback(() => signal('done', [15, 50, 15, 50, 25]), [signal]),
  };
}
