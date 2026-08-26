/**
 * Basis für alle tappbaren Flächen.
 *
 * Simuliert Haptic Feedback: kurzes Einsinken beim Drücken (visuell) plus
 * optionaler Ton/Vibration. Rendert ein echtes <button>, damit VoiceOver und
 * Tastaturbedienung funktionieren.
 */
import { forwardRef } from 'react';
import { useFeedback } from '../../hooks/useFeedback.js';

export const Tappable = forwardRef(function Tappable(
  { as: Component = 'button', className = '', onClick, silent = false, children, ...rest },
  ref,
) {
  const feedback = useFeedback();

  return (
    <Component
      ref={ref}
      className={`transition duration-150 ease-ios active:scale-[0.97] active:opacity-80 ${className}`}
      onClick={(event) => {
        if (!silent) feedback.tap();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default Tappable;
