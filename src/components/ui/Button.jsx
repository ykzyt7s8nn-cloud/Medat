/** Buttons im iOS-Stil (gefüllt, dezent, destruktiv). */
import Tappable from './Tappable.jsx';

const VARIANTS = {
  primary: 'bg-ios-blue text-white shadow-sm',
  secondary: 'bg-ios-blue/10 text-ios-blue dark:bg-ios-blue/20',
  neutral: 'bg-black/5 text-black dark:bg-white/10 dark:text-white',
  danger: 'bg-ios-red/10 text-ios-red dark:bg-ios-red/20',
  solidDanger: 'bg-ios-red text-white',
};

const SIZES = {
  sm: 'px-4 py-2 text-[15px]',
  md: 'px-5 py-3 text-[17px]',
  lg: 'w-full px-6 py-4 text-[17px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  ...rest
}) {
  return (
    <Tappable
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold ${VARIANTS[variant]} ${SIZES[size]} ${disabled ? 'pointer-events-none opacity-40' : ''} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Tappable>
  );
}

export default Button;
