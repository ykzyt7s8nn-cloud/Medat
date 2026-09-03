/**
 * Fußzeile eines Durchgangs: Aufgabenübersicht, Markieren, Überspringen, Abgeben.
 *
 * Die Zahlenleiste zeigt auf einen Blick, was beantwortet, was markiert und wo
 * man gerade ist – und man springt per Tap direkt hin. Damit lässt sich ein
 * Untertest wie im echten MedAT frei einteilen, statt an einer Aufgabe hängen
 * zu bleiben.
 *
 * Im Übungsmodus (practice) ist zusätzlich sichtbar, welche Aufgabe richtig und
 * welche falsch beantwortet wurde – im Prüfungsmodus bleibt das bis zur Abgabe
 * verborgen, sonst wäre es keine Prüfung mehr.
 */
import { useEffect, useRef } from 'react';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import Tappable from './ui/Tappable.jsx';
import { isAnswered } from '../hooks/useTaskSession.js';

/** Farbgebung einer Zahl in der Leiste. */
function cellClass({ active, answered, resolved, correct }) {
  if (active) return 'bg-ios-blue text-white';
  if (resolved) {
    return correct
      ? 'bg-ios-green/20 text-ios-green dark:bg-ios-green/25'
      : 'bg-ios-red/20 text-ios-red dark:bg-ios-red/25';
  }
  if (answered) return 'bg-ios-blue/15 text-ios-blue dark:bg-ios-blue/25';
  return 'bg-black/[0.06] text-black/45 dark:bg-white/10 dark:text-white/45';
}

export function TaskNavigator({
  count,
  index,
  answers,
  flags,
  onGoTo,
  onPrevious,
  onSkip,
  onNext,
  onToggleFlag,
  onSubmit,
  answeredCount,
  /** Übungsmodus: Auflösung erfolgt sofort. */
  practice = false,
  /** Übungsmodus: i => true|false, ob die Aufgabe richtig beantwortet wurde. */
  isCorrect,
  /** Übungsmodus: Die aktuelle Aufgabe ist bereits aufgelöst. */
  revealed = false,
  /** Übungsmodus: welche Aufgaben bereits aufgelöst sind (i => true). */
  revealedMap = null,
  /** i => true, wenn die Antwort vollständig ist (x-aus-5 braucht x Kreuze). */
  isComplete,
  /** Erste noch offene Aufgabe, oder null. */
  firstOpenIndex = null,
  submitLabel = 'Abgeben',
}) {
  const stripRef = useRef(null);

  // Aktuelle Aufgabe immer sichtbar halten
  useEffect(() => {
    const active = stripRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [index]);

  const openCount = count - answeredCount;
  const currentAnswered = isComplete ? isComplete(index) : isAnswered(answers[index]);
  // Im Übungsmodus zählt die Aufgabe erst als erledigt, wenn sie aufgelöst ist.
  const currentDone = practice ? revealed : currentAnswered;
  const isLast = index + 1 >= count;

  return (
    <div className="space-y-2 px-3 py-3">
      <div ref={stripRef} className="scroll-area flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Aufgabenübersicht">
        {Array.from({ length: count }, (_, i) => {
          const answered = isComplete ? isComplete(i) : isAnswered(answers[i]);
          // Richtig/falsch erst zeigen, wenn die Aufgabe auch aufgelöst ist.
          // Bei Zahlenfolgen und im BMS liegen Antworten und Prüfen auseinander –
          // sonst verriete die Leiste das Ergebnis vor dem Tippen auf „Prüfen“.
          const resolved = practice && answered && (revealedMap ? Boolean(revealedMap[i]) : true);
          const correct = resolved ? Boolean(isCorrect?.(i)) : false;
          const flagged = flags[i];
          const active = i === index;
          const state = !answered ? 'offen' : resolved ? (correct ? 'richtig' : 'falsch') : 'beantwortet';
          return (
            <Tappable
              key={i}
              role="tab"
              aria-selected={active}
              aria-label={`Aufgabe ${i + 1}, ${state}${flagged ? ', markiert' : ''}`}
              data-active={active}
              onClick={() => onGoTo(i)}
              silent
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold ${cellClass({ active, answered, resolved, correct })}`}
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
          className={`flex h-11 shrink-0 items-center gap-1.5 rounded-2xl px-3 text-[14px] font-medium ${
            flags[index]
              ? 'bg-ios-orange/15 text-ios-orange'
              : 'bg-black/5 text-black/55 dark:bg-white/10 dark:text-white/55'
          }`}
        >
          <Icon name="target" className="h-4 w-4" />
          {flags[index] ? 'Markiert' : 'Merken'}
        </Tappable>

        {/* Unbeantwortet: überspringen und später zurückkommen. Auf der letzten
            Aufgabe führt „Weiter“ ins Leere, deshalb geht es dort zu den noch
            offenen Aufgaben bzw. zur Abgabe. */}
        {!currentDone ? (
          <Button variant="neutral" size="md" className="flex-1" onClick={onSkip}>
            Überspringen
            <Icon name="chevronRight" className="h-5 w-5" />
          </Button>
        ) : !isLast ? (
          <Button size="md" className="flex-1" onClick={onNext}>
            Weiter
            <Icon name="chevronRight" className="h-5 w-5" />
          </Button>
        ) : openCount > 0 && firstOpenIndex !== null ? (
          <Button size="md" className="flex-1" onClick={() => onGoTo(firstOpenIndex)}>
            Zu den offenen
            <Icon name="chevronRight" className="h-5 w-5" />
          </Button>
        ) : (
          <Button size="md" className="flex-1" onClick={onSubmit}>
            {submitLabel}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between text-[12px] text-black/45 dark:text-white/45">
        {openCount > 0 && firstOpenIndex !== null ? (
          <Tappable onClick={() => onGoTo(firstOpenIndex)} className="font-medium text-ios-blue" silent>
            {openCount} offen · zur nächsten
          </Tappable>
        ) : (
          <span>{answeredCount} von {count} beantwortet</span>
        )}
        <Tappable onClick={onSubmit} className="font-medium text-ios-blue" silent>
          {openCount > 0 ? `Trotzdem ${submitLabel.toLowerCase()}` : submitLabel}
        </Tappable>
      </div>
    </div>
  );
}

export default TaskNavigator;
