/** Segmented Control (iOS) – für Schwierigkeit, Pausendauer, Theme. */
import Tappable from './Tappable.jsx';

export function Segmented({ options, value, onChange, className = '', ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`flex gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10 ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Tappable
            key={option.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-[10px] px-2 py-1.5 text-[13px] font-medium ${
              active ? 'bg-white text-black shadow-sm dark:bg-night-tertiary dark:text-white' : 'text-black/60 dark:text-white/60'
            }`}
          >
            {option.label}
          </Tappable>
        );
      })}
    </div>
  );
}

export default Segmented;
