/**
 * Bildschirm-Grundgerüst.
 *
 * Kopfzeile bleibt fixiert (mit Safe-Area oben), der Inhalt scrollt darunter.
 * `footer` liegt über dem unteren Safe-Area-Bereich – dort sitzen z. B. die
 * Zahlentastatur oder der Weiter-Button.
 */
import Tappable from '../ui/Tappable.jsx';
import Icon from '../ui/Icon.jsx';

export function Screen({
  title,
  subtitle,
  onClose,
  closeLabel = 'Schließen',
  headerExtra,
  footer,
  children,
  padded = true,
  className = '',
}) {
  return (
    <div className={`flex h-full flex-col bg-surface-grouped dark:bg-night ${className}`}>
      <header
        className="sticky top-0 z-20 border-b border-black/5 bg-surface-grouped/85 backdrop-blur-xl dark:border-white/10 dark:bg-night/85"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {onClose && (
            <Tappable
              onClick={onClose}
              aria-label={closeLabel}
              className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/70"
            >
              <Icon name="close" className="h-5 w-5" />
            </Tappable>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[19px] font-bold leading-tight">{title}</h1>
            {subtitle && <p className="truncate text-[13px] text-black/50 dark:text-white/50">{subtitle}</p>}
          </div>
        </div>
        {headerExtra && <div className="px-4 pb-3">{headerExtra}</div>}
      </header>

      <main className={`scroll-area flex-1 ${padded ? 'px-4 py-4' : ''}`}>{children}</main>

      {footer && (
        <div
          className="border-t border-black/5 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-night-secondary/85"
          style={{ paddingBottom: 'var(--safe-bottom)' }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export default Screen;
