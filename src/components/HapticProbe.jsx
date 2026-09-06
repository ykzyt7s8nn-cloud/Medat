/**
 * Probierschalter für die Haptik.
 *
 * Warum ein echter Schalter und kein Knopf: Auf iOS erzeugt das Umschalten
 * eines <input type="checkbox" switch> die systemeigene Haptik. Sicher ist das
 * nur, wenn der Nutzer den Schalter selbst antippt – ein programmatischer Klick
 * ist ein Kunstgriff, der nicht überall greift.
 *
 * Dieser Schalter ist deshalb der eindeutige Gerätetest: Spürt man hier nichts,
 * kann die Haptik auf diesem Gerät grundsätzlich nicht funktionieren, und keine
 * Änderung an der App würde daran etwas ändern.
 *
 * Zusätzlich bestätigt er sichtbar, dass er ausgelöst hat. Ohne das ließe sich
 * „nichts passiert“ nicht von „nichts zu spüren“ unterscheiden – etwa wenn der
 * Stummschalter des iPhones den Ton unterdrückt.
 */
import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';

export default function HapticProbe({ onTrigger, disabled = false }) {
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);
  const resetRef = useRef(null);

  // Das switch-Attribut kennt React nicht als Eigenschaft – von Hand setzen.
  useEffect(() => {
    inputRef.current?.setAttribute('switch', '');
  }, []);

  useEffect(() => () => window.clearTimeout(resetRef.current), []);

  const trigger = () => {
    if (disabled) return;
    onTrigger?.();
    setCount((current) => current + 1);
    window.clearTimeout(resetRef.current);
    resetRef.current = window.setTimeout(() => setCount(0), 2500);
  };

  return (
    <label
      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2 text-[15px] font-semibold transition ${
        disabled
          ? 'bg-black/5 text-black/30 dark:bg-white/10 dark:text-white/30'
          : 'bg-ios-blue/10 text-ios-blue active:scale-[0.97] dark:bg-ios-blue/20'
      }`}
    >
      {/* Der Schalter selbst bleibt gezeichnet, aber unscheinbar: Ein
          ausgeblendetes Element löst auf iOS keine Haptik aus. */}
      <input
        ref={inputRef}
        type="checkbox"
        tabIndex={0}
        disabled={disabled}
        onChange={trigger}
        aria-label="Haptik ausprobieren"
        className="h-px w-px shrink-0 opacity-[0.01]"
      />
      {count > 0 ? (
        <>
          <Icon name="check" className="h-4 w-4" />
          {count === 1 ? 'Ausgelöst – spürst du es?' : `${count}× ausgelöst`}
        </>
      ) : (
        'Ausprobieren'
      )}
    </label>
  );
}
