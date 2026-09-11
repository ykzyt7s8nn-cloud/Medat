/**
 * Ton- und Haptik-Feedback.
 *
 * Drei Eigenheiten bestimmen den Aufbau:
 *
 * 1. Safari kennt navigator.vibrate nicht – weder auf dem iPhone noch auf dem
 *    Mac. Echte Haptik gibt es dort nur über einen Umweg: Seit iOS 17.4 löst
 *    das Umschalten eines <input type="checkbox" switch> das systemeigene
 *    Haptik-Muster aus.
 *
 *    Dabei kommt es auf zwei Dinge an, die leicht zu übersehen sind: Es zählt
 *    die *Aktivierung* des Schalters, nicht das Setzen seiner checked-
 *    Eigenschaft – deshalb click() statt checked = !checked. Und das Element
 *    muss tatsächlich gezeichnet werden; bei opacity:0 oder display:none
 *    passiert nichts. Es hängt deshalb als 1 Pixel großes, nahezu
 *    durchsichtiges Label in der Ecke.
 *
 *    Das bleibt ein Kunstgriff und keine zugesicherte Schnittstelle. Sicher
 *    ausgelöst wird die Haptik nur, wenn der Nutzer selbst auf einen solchen
 *    Schalter tippt – genau das macht der Probierschalter in den Einstellungen.
 *    Ein programmatischer Klick braucht zusätzlich eine frische Nutzeraktion,
 *    weshalb etwa die Zeitwarnung auf iOS stumm bleiben kann.
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
  // Das Label gehört dazu: iOS behandelt Schalter innerhalb eines Labels als
  // eine bedienbare Einheit. Nicht ausgeblendet, nur winzig und fast
  // durchsichtig – ein nicht gezeichnetes Element löst keine Haptik aus.
  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;'
    + 'overflow:hidden;opacity:0.01;pointer-events:none;z-index:-1;';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  input.tabIndex = -1;
  label.appendChild(input);
  document.body.appendChild(label);
  hapticSwitch = input;
  return hapticSwitch;
}

/** Einen Impuls auslösen – über die Aktivierung, nicht über die Eigenschaft. */
export function pulse() {
  if (!supportsSwitchHaptics()) return false;
  const input = getHapticSwitch();
  if (!input) return false;
  input.click();
  return true;
}

/** Welcher Weg genutzt wird – für die Anzeige in den Einstellungen. */
export function hapticMethod() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) return 'vibration';
  if (supportsSwitchHaptics()) return 'ios-switch';
  return 'keiner';
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
  // iOS: ein Impuls je Tick, denn Dauer und Stärke lassen sich nicht steuern.
  for (let i = 0; i < ticks; i += 1) {
    if (i === 0) pulse();
    else window.setTimeout(pulse, i * event.gap);
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
     * Nur der Ton, ohne Impuls. Der Probierschalter in den Einstellungen löst
     * seine Impulse selbst aus und gezielt einzeln – dort wäre ein zusätzliches
     * Muster nicht mehr auseinanderzuhalten.
     */
    tone: (kind = 'correct') => {
      const event = EVENTS[kind];
      if (event && sound !== 'aus') playTone(event.tone);
    },
  }), [haptics, signal, sound]);
}
