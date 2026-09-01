/** Schalter im iOS-Stil. */
import Tappable from './Tappable.jsx';

export function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <Tappable
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full ${checked ? 'bg-ios-green' : 'bg-black/15 dark:bg-white/20'} ${disabled ? 'opacity-40' : ''}`}
    >
      <span
        className="absolute top-[2px] block h-[27px] w-[27px] rounded-full bg-white shadow"
        style={{
          transform: `translateX(${checked ? 22 : 2}px)`,
          transition: 'transform 250ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />
    </Tappable>
  );
}

export default Toggle;
