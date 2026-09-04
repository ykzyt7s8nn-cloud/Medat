/**
 * Antwortmöglichkeit einer MC-Frage (a–e).
 *
 * Zustände: neutral, ausgewählt, richtig, falsch. Die Farbe allein trägt nie
 * die Information – zusätzlich gibt es ein Symbol und ein aria-label.
 *
 * Das allgemeine Tipp-Feedback ist hier abgeschaltet: Der Screen meldet nach
 * dem Antworten ohnehin richtig oder falsch, und zwei Signale im Abstand von
 * Millisekunden verwischen einander zu einem unklaren Rumpeln.
 */
import Tappable from './Tappable.jsx';
import Icon from './Icon.jsx';

export function AnswerOption({
  letter,
  children,
  selected = false,
  state = 'idle', // idle | correct | wrong
  disabled = false,
  onClick,
}) {
  const base = 'ios-card flex w-full items-start gap-3 px-3.5 py-3 text-left';
  const styles = {
    idle: selected
      ? 'ring-2 ring-ios-blue'
      : 'ring-1 ring-transparent',
    correct: 'ring-2 ring-ios-green bg-ios-green/10 dark:bg-ios-green/15',
    wrong: 'ring-2 ring-ios-red bg-ios-red/10 dark:bg-ios-red/15',
  };
  const badge = {
    idle: selected ? 'bg-ios-blue text-white' : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/70',
    correct: 'bg-ios-green text-white',
    wrong: 'bg-ios-red text-white',
  };
  const stateLabel = state === 'correct' ? ' (richtige Antwort)' : state === 'wrong' ? ' (falsch)' : '';

  return (
    <Tappable
      onClick={onClick}
      disabled={disabled}
      silent
      aria-pressed={selected}
      aria-label={`Antwort ${letter}${stateLabel}`}
      className={`${base} ${styles[state]} ${disabled ? 'active:scale-100' : ''}`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold uppercase ${badge[state]}`}
      >
        {state === 'correct' ? <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
          : state === 'wrong' ? <Icon name="close" className="h-4 w-4" strokeWidth={2.6} />
            : letter}
      </span>
      <span className="min-w-0 flex-1 text-[15px] leading-snug">{children}</span>
    </Tappable>
  );
}

export default AnswerOption;
