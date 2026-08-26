/**
 * Eigene Zahlentastatur.
 *
 * Auf iOS öffnet ein <input type="number"> die Systemtastatur und schiebt das
 * Layout zusammen. Eine eigene Tastatur hält die Aufgabe sichtbar und erlaubt
 * genau die benötigten Zeichen: 0–9, Minus und Löschen.
 */
import Tappable from './Tappable.jsx';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '−', '0', '⌫'];

export function NumberKeypad({ onInput, onDelete, onToggleSign, disabled = false }) {
  const handle = (key) => {
    if (disabled) return;
    if (key === '⌫') onDelete();
    else if (key === '−') onToggleSign();
    else onInput(key);
  };

  return (
    <div className="grid grid-cols-3 gap-2 px-3 py-3" role="group" aria-label="Zahlentastatur">
      {KEYS.map((key) => (
        <Tappable
          key={key}
          onClick={() => handle(key)}
          disabled={disabled}
          aria-label={key === '⌫' ? 'Löschen' : key === '−' ? 'Vorzeichen wechseln' : key}
          className={`h-12 rounded-xl text-[22px] font-medium ${
            key === '⌫' || key === '−'
              ? 'bg-black/[0.06] text-black/70 dark:bg-white/10 dark:text-white/70'
              : 'bg-white text-black shadow-sm dark:bg-night-tertiary dark:text-white'
          } ${disabled ? 'opacity-40' : ''}`}
        >
          {key}
        </Tappable>
      ))}
    </div>
  );
}

export default NumberKeypad;
