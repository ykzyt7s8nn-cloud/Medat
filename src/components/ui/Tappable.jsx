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
 */
import { forwardRef } from 'react';
import { useFeedback, usesSwitchHaptics } from '../../hooks/useFeedback.js';
import { useSettings } from '../../store/useSettings.js';

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

  return (
    <Component
      ref={ref}
      disabled={disabled}
      className={`transition duration-150 ease-ios active:scale-[0.97] active:opacity-80 ${
        withSwitch ? 'relative ' : ''
      }${className}`}
      onClick={(event) => {
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
            className="h-full w-full opacity-[0.01]"
          />
        </span>
      )}
    </Component>
  );
});

export default Tappable;
