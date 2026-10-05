/**
 * Basis für alle tappbaren Flächen.
 *
 * Simuliert Haptic Feedback: kurzes Einsinken beim Drücken (visuell) plus
 * optionaler Ton/Vibration. Rendert ein echtes <button>, damit VoiceOver und
 * Tastaturbedienung funktionieren.
 *
 * Auf dem iPhone gibt es Haptik nur über einen systemeigenen Schalter, und die
 * ist am Gerät nur zu spüren, wenn der Finger selbst darauf landet – ein
 * programmatisch ausgelöster Impuls bleibt still (siehe hooks/useFeedback.js).
 * Deshalb liegt dort ein nahezu durchsichtiger Schalter über der gesamten
 * Fläche: Jeder Tipp trifft ihn, das System gibt seinen Impuls, und der Klick
 * steigt von dort zum Button auf. Für die Bedienung ist er unsichtbar – er
 * bekommt keinen Fokus und ist für VoiceOver ausgeblendet.
 *
 * Wo es echte Vibration gibt (Android, Chrome), bleibt es beim schlichten
 * <button>; der Impuls kommt dann aus navigator.vibrate.
 *
 * Tipp oder Scrollen: Ein Klick allein beweist nicht, dass getippt wurde. Der
 * Schalter wertet Berührungen selbst aus und schaltet auch am Ende einer
 * Scrollbewegung, und Safari klickt auch nach kleinen Fingerbewegungen. Die
 * Fläche merkt sich deshalb jede Berührung und lässt den Klick nur durch, wenn
 * der Finger liegen geblieben ist und nichts drumherum gescrollt hat (Regeln in
 * lib/tapGuard.js). Sonst wird der Klick verworfen – samt Umschalten des
 * Schalters, nicht aber ein Impuls, den iOS dafür womöglich schon gegeben hat.
 */
import { forwardRef, useCallback, useRef } from 'react';
import { useFeedback, usesSwitchHaptics } from '../../hooks/useFeedback.js';
import { useSettings } from '../../store/useSettings.js';
import { exceedsTapSlop, isDeliberateTap } from '../../lib/tapGuard.js';

/* ------------------------------------------------------- Scroll-Beobachtung */

/**
 * Letzter Scrollschritt je scrollendem Bereich. Ein einziger Listener für die
 * ganze App; scroll steigt nicht auf, wird in der Capture-Phase aber überall
 * gesehen. Nach Bereich getrennt, damit etwa die seitlich mitlaufende
 * Aufgabenleiste keine Tipps auf die Antworten darunter sperrt.
 */
const lastScrollByTarget = new WeakMap();
let scrollWatcherInstalled = false;

function installScrollWatcher() {
  if (scrollWatcherInstalled || typeof window === 'undefined') return;
  scrollWatcherInstalled = true;
  window.addEventListener('scroll', (event) => {
    lastScrollByTarget.set(event.target, performance.now());
  }, { capture: true, passive: true });
}

/** Letzter Scrollschritt eines Bereichs, der das Element enthält. */
function lastScrollAround(element) {
  let latest = lastScrollByTarget.get(document) ?? 0;
  for (let node = element; node; node = node.parentElement) {
    const time = lastScrollByTarget.get(node);
    if (time && time > latest) latest = time;
  }
  return latest;
}

function pointOf(event) {
  const touch = event.touches?.[0] ?? event.changedTouches?.[0];
  const source = touch ?? event;
  return { x: source.clientX, y: source.clientY };
}

/**
 * Verfolgt die Berührungen einer Fläche und sagt beim Klick, ob er zählt.
 * Die Handler sind passiv: Sie verhindern nichts und bremsen kein Scrollen.
 */
function useTapGuard() {
  const gesture = useRef(null);
  installScrollWatcher();

  const begin = useCallback((event) => {
    gesture.current = {
      start: pointOf(event),
      downAt: performance.now(),
      endedAt: undefined,
      moved: false,
      cancelled: false,
    };
  }, []);

  const handlers = {
    onPointerDown: (event) => {
      // Mit der Maus gibt es kein Scrollen per Ziehen – dort zählt jeder Klick.
      if (event.pointerType === 'mouse') gesture.current = null;
      else begin(event);
    },
    onTouchStart: (event) => {
      // Normalerweise kam pointerdown schon; nur ergänzen, falls nicht.
      const current = gesture.current;
      if (!current || current.endedAt !== undefined) begin(event);
    },
    onPointerMove: (event) => {
      const current = gesture.current;
      if (current && exceedsTapSlop(current.start, pointOf(event))) current.moved = true;
    },
    onTouchMove: (event) => {
      const current = gesture.current;
      if (current && exceedsTapSlop(current.start, pointOf(event))) current.moved = true;
    },
    // Der Browser übernimmt die Berührung zum Scrollen.
    onPointerCancel: () => {
      if (gesture.current) {
        gesture.current.cancelled = true;
        gesture.current.endedAt = performance.now();
      }
    },
    onPointerUp: (event) => {
      const current = gesture.current;
      if (!current) return;
      if (exceedsTapSlop(current.start, pointOf(event))) current.moved = true;
      current.endedAt = performance.now();
    },
    onTouchEnd: (event) => {
      const current = gesture.current;
      if (!current) return;
      if (exceedsTapSlop(current.start, pointOf(event))) current.moved = true;
      if (current.endedAt === undefined) current.endedAt = performance.now();
    },
  };

  const accept = (element) => {
    const current = gesture.current;
    gesture.current = null;
    return isDeliberateTap(current, {
      now: performance.now(),
      lastScrollAt: lastScrollAround(element),
    });
  };

  return { handlers, accept };
}

/** Das switch-Attribut kennt React nicht – es muss von Hand gesetzt werden. */
function markAsSwitch(element) {
  element?.setAttribute('switch', '');
}

export const Tappable = forwardRef(function Tappable(
  {
    as: Component = 'button',
    className = '',
    onClick,
    silent = false,
    disabled = false,
    children,
    ...rest
  },
  ref,
) {
  const feedback = useFeedback();
  const haptics = useSettings((state) => state.haptics);
  // Der Schalter hängt auch unter stummen Flächen: `silent` unterdrückt den
  // *Ton* des Tippens, weil sofort die Auflösung folgt – der Impuls dagegen ist
  // auf iOS die einzige Rückmeldung, die der Finger überhaupt bekommen kann.
  const withSwitch = !disabled && haptics !== 'aus' && usesSwitchHaptics();
  const guard = useTapGuard();

  return (
    <Component
      ref={ref}
      disabled={disabled}
      {...guard.handlers}
      className={`touch-manipulation transition duration-150 ease-ios active:scale-[0.97] active:opacity-80 ${
        withSwitch ? 'relative ' : ''
      }${className}`}
      onClick={(event) => {
        // Gescrollt statt getippt: verwerfen. preventDefault nimmt auch das
        // Umschalten des Schalters zurück, von dem der Klick womöglich kommt.
        if (!guard.accept(event.currentTarget)) {
          event.preventDefault();
          return;
        }
        // Liegt ein Schalter darunter, hat iOS den Impuls schon gegeben.
        if (!silent) feedback.tap({ haptic: !withSwitch });
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
      {withSwitch && (
        // Der Rahmen darum kappt, was der Schalter an eigener Größe mitbringt:
        // Safari zeichnet ihn im festen Seitenverhältnis, und was über die
        // Fläche hinausragte, würde sonst Tipps auf die Nachbarfläche abfangen.
        <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <input
            ref={markAsSwitch}
            type="checkbox"
            tabIndex={-1}
            className="h-full w-full touch-manipulation opacity-[0.01]"
          />
        </span>
      )}
    </Component>
  );
});

export default Tappable;
