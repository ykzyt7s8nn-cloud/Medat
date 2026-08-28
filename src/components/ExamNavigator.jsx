/**
 * Fußzeile im Prüfungsmodus: Aufgabenübersicht, Markieren, Blättern, Abgeben.
 *
 * Die Zahlenleiste zeigt auf einen Blick, was beantwortet (gefüllt), was
 * markiert (Punkt) und wo man gerade ist – und man springt per Tap direkt hin.
 */
import { useEffect, useRef } from 'react';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import Tappable from './ui/Tappable.jsx';

export function ExamNavigator({
  count,
  index,
  answers,
  flags,
  onGoTo,
  onPrevious,
  onNext,
  onToggleFlag,
  onSubmit,
  answeredCount,
}) {
  const stripRef = useRef(null);

  // Aktuelle Aufgabe immer sichtbar halten
  useEffect(() => {
    const active = stripRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [index]);

  return (
    <div className="space-y-2 px-3 py-3">
      <div ref={stripRef} className="scroll-area flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Aufgabenübersicht">
        {Array.from({ length: count }, (_, i) => {
          const answered = answers[i] !== undefined && answers[i] !== null && answers[i] !== '';
          const flagged = flags[i];
          const active = i === index;
          return (
            <Tappable
              key={i}
              role="tab"
              aria-selected={active}
              aria-label={`Aufgabe ${i + 1}${answered ? ', beantwortet' : ', offen'}${flagged ? ', markiert' : ''}`}
              data-active={active}
              onClick={() => onGoTo(i)}
              silent
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold ${
                active
                  ? 'bg-ios-blue text-white'
                  : answered
                    ? 'bg-ios-blue/15 text-ios-blue dark:bg-ios-blue/25'
                    : 'bg-black/[0.06] text-black/45 dark:bg-white/10 dark:text-white/45'
              }`}
            >
              {i + 1}
              {flagged && (
                <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-ios-orange" />
              )}
            </Tappable>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="neutral" size="md" onClick={onPrevious} disabled={index === 0} aria-label="Vorherige Aufgabe">
          <Icon name="chevronLeft" className="h-5 w-5" />
        </Button>

        <Tappable
          onClick={onToggleFlag}
          aria-pressed={Boolean(flags[index])}
          className={`flex h-11 items-center gap-1.5 rounded-2xl px-3 text-[14px] font-medium ${
            flags[index]
              ? 'bg-ios-orange/15 text-ios-orange'
              : 'bg-black/5 text-black/55 dark:bg-white/10 dark:text-white/55'
          }`}
        >
          <Icon name="target" className="h-4 w-4" />
          {flags[index] ? 'Markiert' : 'Merken'}
        </Tappable>

        {index + 1 < count ? (
          <Button size="md" className="flex-1" onClick={onNext}>
            Weiter
            <Icon name="chevronRight" className="h-5 w-5" />
          </Button>
        ) : (
          <Button size="md" className="flex-1" onClick={onSubmit}>
            Abgeben
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between text-[12px] text-black/45 dark:text-white/45">
        <span>{answeredCount} von {count} beantwortet</span>
        {index + 1 < count && (
          <Tappable onClick={onSubmit} className="font-medium text-ios-blue" silent>
            Jetzt abgeben
          </Tappable>
        )}
      </div>
    </div>
  );
}

export default ExamNavigator;
