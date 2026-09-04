/**
 * Ton- und Haptik-Feedback.
 *
 * Drei Eigenheiten bestimmen den Aufbau:
 *
 * 1. Safari kennt navigator.vibrate nicht – weder auf dem iPhone noch auf dem
 *    Mac. Echte Haptik gibt es dort nur über einen Umweg: Seit iOS 17.4 löst
 *    das Umschalten eines <input type="checkbox" switch> das systemeigene
 *    Haptik-Muster aus. Ein solches Element hängt unsichtbar im Dokument und
 *    wird programmatisch umgeschaltet. Das ist ein Kunstgriff und keine
 *    zugesicherte Schnittstelle; wo er nicht greift, bleibt es beim visuellen
 *    Feedback der Tappable-Komponente.
 *
 * 2. Über diesen Weg lässt sich weder Dauer noch Stärke steuern – es gibt genau
 *    einen Impuls. Die Ereignisse werden deshalb über die *Anzahl* der Impulse
 *    und ihren Abstand unterscheidbar gemacht: einmal tippen, zweimal richtig,
 *    dreimal falsch. Auf Geräten mit echter Vibration wird zusätzlich das
 *    passende Muster gefahren.
 *
 * 3. Der AudioContext gehört ins Modul, nicht in den Hook. Jede tappbare Fläche
 *    ruft useFeedback auf; läge der Kontext im Hook, entstünde pro Button ein
 *    eigener. Safari begrenzt deren Zahl hart – danach schlägt die Erzeugung
 *    fehl und der Ton bliebe stillschweigend weg.
 *
 * Töne werden über die Web Audio API erzeugt, ohne Audiodateien, damit die App
 * vollständig offline funktioniert.
 */
import { useCallback, useMemo } from 'react';
import { useSettings } from '../store/useSettings.js';

/**
 * Ein Ereignis je Zeile: Ton, Vibrationsmuster für echte Vibration und die
 * Impulsfolge für den iOS-Weg. `beiJedemTippen` markiert die Ereignisse, die
 * nur auf der Tonstufe „alles“ zu hören sind.
 */
const EVENTS = {
  tap: {
    tone: { frequency: 660, duration: 0.05, gain: 0.05 },
    vibrate: 8,
    ticks: 1,
    gap: 0,
    onEveryTap: true,
  },
  correct: {
    tone: { frequency: 880, duration: 0.12, gain: 0.08 },
    vibrate: [12, 40, 12],
    ticks: 2,
    gap: 80,
  },
  wrong: {
    tone: { frequency: 220, duration: 0.18, gain: 0.08 },
    vibrate: [45, 50, 45, 50, 45],
    ticks: 3,
    gap: 70,
  },
  warning: {
    tone: { frequency: 440, duration: 0.25, gain: 0.07 },
    vibrate: [20, 60, 20],
    ticks: 2,
    gap: 150,
  },
  done: {
    tone: { frequency: 1046, duration: 0.2, gain: 0.08 },
    vibrate: [15, 50, 15, 50, 25],
    ticks: 3,
    gap: 140,
  },
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

function playTone(tone) {
  try {
    const context = getAudioContext();
    if (!context) return;
    if (context.state === 'suspended') context.resume();
    const { frequency, duration, gain } = tone;
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

function buzz(event, level) {
  // Auf der Stufe „dezent“ bleibt es überall bei einem einzelnen Impuls.
  const ticks = level === 'dezent' ? 1 : event.ticks;
  const pattern = level === 'dezent' ? 12 : event.vibrate;

  // Android und Desktop-Chrome: die echte Vibration-API, inklusive Muster.
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
    return;
  }
  // iOS: ein Tick je Impuls, denn Dauer und Stärke lassen sich nicht steuern.
  if (!supportsSwitchHaptics()) return;
  const input = getHapticSwitch();
  if (!input) return;
  for (let i = 0; i < ticks; i += 1) {
    if (i === 0) input.checked = !input.checked;
    else window.setTimeout(() => { input.checked = !input.checked; }, i * event.gap);
  }
}

/* ------------------------------------------------------------------- Hook */

export function useFeedback() {
  const sound = useSettings((state) => state.sound);
  const haptics = useSettings((state) => state.haptics);

  const signal = useCallback(
    (kind) => {
      const event = EVENTS[kind];
      if (!event) return;
      const audible = sound === 'alles' || (sound === 'ergebnisse' && !event.onEveryTap);
      if (audible) playTone(event.tone);
      if (haptics !== 'aus') buzz(event, haptics);
    },
    [haptics, sound],
  );

  return useMemo(() => ({
    tap: () => signal('tap'),
    correct: () => signal('correct'),
    wrong: () => signal('wrong'),
    warning: () => signal('warning'),
    done: () => signal('done'),
    /**
     * Zum Ausprobieren in den Einstellungen: spielt das Ereignis unabhängig von
     * der Tonstufe, damit man hört und spürt, was eingestellt ist.
     */
    preview: (kind = 'correct') => {
      const event = EVENTS[kind];
      if (!event) return;
      if (sound !== 'aus') playTone(event.tone);
      if (haptics !== 'aus') buzz(event, haptics);
    },
  }), [haptics, signal, sound]);
}
