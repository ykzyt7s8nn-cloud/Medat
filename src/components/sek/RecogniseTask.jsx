/**
 * Aufgabenkörper „Emotionen erkennen“.
 *
 * Fünf Emotionen, jede einzeln als eher wahrscheinlich oder eher
 * unwahrscheinlich einzuordnen. Bewusst zwei getrennte Schaltflächen statt
 * eines Schalters: Ein Schalter kennt keinen dritten Zustand, und „noch nicht
 * entschieden“ muss sichtbar bleiben – sonst zählte eine Aufgabe als fertig,
 * bevor man sie angesehen hat.
 *
 * Nach dem Auflösen steht neben jeder Zeile, was richtig gewesen wäre, und
 * darunter, woran man es erkennt. Die Begründung ist hier der eigentliche
 * Lerninhalt: Welche Emotion sich auf was richtet.
 */
import Icon from '../ui/Icon.jsx';
import Tappable from '../ui/Tappable.jsx';

function Choice({ label, active, tone, disabled, onClick }) {
  const activeClass = tone === 'yes'
    ? 'bg-ios-green text-white'
    : 'bg-ios-red text-white';
  return (
    <Tappable
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold ${
        active ? activeClass : 'bg-black/[0.06] text-black/55 dark:bg-white/10 dark:text-white/60'
      } ${disabled ? 'active:scale-100' : ''}`}
    >
      {label}
    </Tappable>
  );
}

export default function RecogniseTask({ task, value = [], revealed, onChange }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[15px] font-semibold">
        Wie wahrscheinlich empfindet die Person diese Gefühle?
      </h2>

      {task.emotions.map((emotion, i) => {
        const chosen = value[i];
        const right = revealed && chosen === emotion.likely;
        const wrong = revealed && chosen !== undefined && chosen !== emotion.likely;
        const missing = revealed && chosen === undefined;

        return (
          <div
            key={emotion.emotion}
            className={`ios-card px-3.5 py-3 ${
              right ? 'ring-2 ring-ios-green' : wrong || missing ? 'ring-2 ring-ios-red' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 text-[15px] font-medium">{emotion.emotion}</span>
              {revealed ? (
                <span
                  className={`flex shrink-0 items-center gap-1 text-[13px] font-semibold ${
                    emotion.likely ? 'text-ios-green' : 'text-ios-red'
                  }`}
                >
                  <Icon name={emotion.likely ? 'check' : 'close'} className="h-4 w-4" strokeWidth={2.6} />
                  {emotion.likely ? 'wahrscheinlich' : 'unwahrscheinlich'}
                </span>
              ) : (
                <span className="flex shrink-0 gap-1.5">
                  <Choice
                    label="eher ja"
                    tone="yes"
                    active={chosen === true}
                    onClick={() => onChange(i, true)}
                  />
                  <Choice
                    label="eher nein"
                    tone="no"
                    active={chosen === false}
                    onClick={() => onChange(i, false)}
                  />
                </span>
              )}
            </div>

            {revealed && (
              <p className="mt-1.5 text-[13px] leading-snug text-black/60 dark:text-white/60">
                {missing ? 'Nicht beantwortet. ' : ''}
                {emotion.why}
              </p>
            )}
          </div>
        );
      })}

      {!revealed && (
        <p className="px-1 pt-0.5 text-[12px] text-black/45 dark:text-white/45">
          Es zählt nur die vollständig richtige Aufgabe – eine einzige Fehleinschätzung kostet den Punkt.
        </p>
      )}
    </section>
  );
}
