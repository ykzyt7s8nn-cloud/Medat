/**
 * Aufgabenkörper „Soziales Entscheiden“.
 *
 * Fünf Überlegungen sind auf die Plätze a bis e zu verteilen, a ist die
 * wichtigste. Die Bedienung ist bewusst ein Antippen in der gewünschten
 * Reihenfolge und kein Ziehen: Auf einem Telefon ist Drag-and-drop mit fünf
 * mehrzeiligen Texten fummelig, und im Test zählt Tempo. Der erste Tipp
 * vergibt a, der zweite b, und so fort; ein Tipp auf eine bereits gesetzte
 * Aussage nimmt sie wieder heraus und rückt die dahinter liegenden nach.
 *
 * Nach dem Auflösen steht neben jeder Aussage der richtige Platz, damit man
 * die Abweichung sieht, statt sie sich zusammensuchen zu müssen.
 */
import Icon from '../ui/Icon.jsx';
import Tappable from '../ui/Tappable.jsx';

const LETTERS = ['a', 'b', 'c', 'd', 'e'];

export default function DecisionTask({ task, value = [], revealed, onToggle, accent }) {
  const placed = value.length;

  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[15px] font-semibold">
        Reihe die Überlegungen nach ihrem Gewicht für eine moralisch richtige Entscheidung.
      </h2>
      {!revealed && (
        <p className="px-1 text-[13px] text-black/55 dark:text-white/55">
          {placed === 0
            ? 'Tippe zuerst die wichtigste an – sie bekommt Platz a.'
            : placed < task.statements.length
              ? `Platz ${LETTERS[placed]} ist als Nächstes zu vergeben. Nochmal antippen nimmt wieder heraus.`
              : 'Alle Plätze vergeben. Antippen ändert die Reihung.'}
        </p>
      )}

      {task.statements.map((statement, displayIndex) => {
        const place = value.indexOf(displayIndex);
        const chosen = place !== -1;
        const right = revealed && place === statement.rank;
        const wrong = revealed && chosen && place !== statement.rank;

        return (
          <Tappable
            key={statement.text}
            onClick={() => onToggle(displayIndex)}
            disabled={revealed}
            aria-pressed={chosen}
            aria-label={`${statement.text}${chosen ? `, Platz ${LETTERS[place]}` : ', noch kein Platz'}`}
            className={`ios-card flex w-full items-start gap-3 px-3.5 py-3 text-left ${
              right ? 'ring-2 ring-ios-green' : wrong ? 'ring-2 ring-ios-red' : chosen ? 'ring-2' : 'ring-1 ring-transparent'
            } ${revealed ? 'active:scale-100' : ''}`}
            style={chosen && !revealed ? { '--tw-ring-color': accent } : undefined}
          >
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                chosen ? 'text-white' : 'bg-black/5 text-black/35 dark:bg-white/10 dark:text-white/35'
              }`}
              style={chosen ? { backgroundColor: right ? '#34C759' : wrong ? '#FF3B30' : accent } : undefined}
            >
              {chosen ? LETTERS[place] : '–'}
            </span>

            <span className="min-w-0 flex-1 text-[15px] leading-snug">
              {statement.text}
              {revealed && (
                <span
                  className={`mt-1 flex items-center gap-1 text-[13px] font-semibold ${
                    right ? 'text-ios-green' : 'text-ios-red'
                  }`}
                >
                  <Icon name={right ? 'check' : 'close'} className="h-3.5 w-3.5" strokeWidth={2.6} />
                  gehört auf Platz {LETTERS[statement.rank]}
                </span>
              )}
            </span>
          </Tappable>
        );
      })}

      {!revealed && (
        <p className="px-1 pt-0.5 text-[12px] text-black/45 dark:text-white/45">
          Hier zählt jede richtig gesetzte Marke einzeln – auch eine teilweise richtige Reihung bringt Punkte.
        </p>
      )}
    </section>
  );
}
