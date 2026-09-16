/**
 * Aufgabenkörper „Emotionen regulieren“.
 *
 * Vier Vorsätze in der Ich-Form, genau einer führt am ehesten zum genannten
 * Ziel. Das ist formal eine gewöhnliche Einfachauswahl und nutzt deshalb
 * dieselbe Antwortfläche wie die übrigen Untertests.
 *
 * Nach dem Auflösen steht unter *jeder* Möglichkeit, warum sie trägt oder
 * nicht – nicht nur unter der gewählten. Die vier falschen Wege sind hier
 * immer dieselben Muster (Vermeiden, Unterdrücken, Grübeln, Ziel aufgeben),
 * und wer sie nebeneinander liest, erkennt sie beim nächsten Mal wieder.
 */
import AnswerOption from '../ui/AnswerOption.jsx';

const LETTERS = ['a', 'b', 'c', 'd', 'e'];

export default function RegulateTask({ task, value, revealed, onChoose, silent }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[15px] font-semibold">
        Womit erreicht die Person das genannte Ziel am ehesten?
      </h2>

      {task.options.map((option, i) => {
        const state = !revealed
          ? 'idle'
          : option.correct
            ? 'correct'
            : i === value
              ? 'wrong'
              : 'idle';
        return (
          <div key={option.text}>
            <AnswerOption
              letter={LETTERS[i]}
              state={state}
              selected={i === value}
              disabled={revealed}
              silent={silent}
              onClick={() => onChoose(i)}
            >
              {option.text}
            </AnswerOption>
            {revealed && (
              <p className="px-3.5 pt-1 text-[13px] leading-snug text-black/55 dark:text-white/55">
                {option.why}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
