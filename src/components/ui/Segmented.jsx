/**
 * Segmented Control (iOS) – für Schwierigkeit, Pausendauer, Theme.
 *
 * Unter 360 px Breite passen fünf gleich breite Felder mit „MedAT-Niveau“
 * nicht nebeneinander, das letzte ragte über den Rand. Dort richtet sich die
 * Breite nach dem Inhalt, die Schrift wird etwas kleiner, eine Option kann
 * eine Kurzform (`short`) tragen – und reicht es trotzdem nicht, bricht die
 * Zeile um, statt abzuschneiden.
 */
import Tappable from './Tappable.jsx';

export function Segmented({ options, value, onChange, className = '', ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`flex gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10 max-[359px]:flex-wrap max-[359px]:gap-0.5 ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Tappable
            key={option.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`min-h-[36px] flex-1 rounded-[10px] px-2 py-1.5 max-[359px]:flex-auto max-[359px]:px-1 max-[359px]:text-[12px] text-[13px] font-medium ${
              active ? 'bg-white text-black shadow-sm dark:bg-night-tertiary dark:text-white' : 'text-black/60 dark:text-white/60'
            }`}
          >
            {option.short ? (
              <>
                <span className="max-[359px]:hidden">{option.label}</span>
                <span className="hidden max-[359px]:inline">{option.short}</span>
              </>
            ) : option.label}
          </Tappable>
        );
      })}
    </div>
  );
}

export default Segmented;
