/**
 * Eine BMS-Frage mit ihren fünf Antwortmöglichkeiten.
 *
 * Zwei Formate wie im MedAT:
 *   'single' – genau eine Antwort ist richtig ("1 aus 5")
 *   'multi'  – es sind genau so viele anzukreuzen, wie in der Frage steht
 *
 * Nach dem Auflösen erscheint zu jeder ausgewählten und zu jeder richtigen
 * Option die Begründung. Gerade bei einer falschen Wahl ist entscheidend zu
 * sehen, WARUM sie falsch war – das ist der eigentliche Lerneffekt.
 */
import AnswerOption from '../ui/AnswerOption.jsx';

const LETTERS = ['a', 'b', 'c', 'd', 'e'];

export function correctCount(question) {
  return question.options.filter((option) => option.correct).length;
}

/** Ist die Auswahl vollständig richtig? */
export function isAnswerCorrect(question, selection = []) {
  const chosen = new Set(selection);
  if (chosen.size !== correctCount(question)) return false;
  return question.options.every((option, index) => option.correct === chosen.has(index));
}

/**
 * Zerlegt "Welche Aussagen …? (I) … (II) … (III) …" in Fragestamm und
 * Aussagen, damit sie untereinander stehen statt in einem Absatz.
 * Ohne römisch nummerierte Aussagen bleibt der Text, wie er ist.
 */
export function splitStatements(prompt) {
  const parts = prompt.split(/\s*\((I{1,3}|IV|V)\)\s+/);
  if (parts.length < 5) return { stem: prompt, statements: [] };
  const statements = [];
  for (let i = 1; i < parts.length; i += 2) statements.push({ numeral: parts[i], text: parts[i + 1].trim() });
  return { stem: parts[0].trim(), statements };
}

export function QuestionCard({ question, selection = [], onToggle, revealed = false }) {
  const multi = question.kind === 'multi';
  const needed = correctCount(question);
  const { stem, statements } = splitStatements(question.prompt);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-[17px] font-semibold leading-snug">{stem}</h2>
        {statements.length > 0 && (
          <ol className="space-y-1.5 pt-1">
            {statements.map((statement) => (
              <li key={statement.numeral} className="flex gap-3 text-[15px] leading-snug">
                <span className="w-7 shrink-0 font-semibold text-black/45 dark:text-white/45">{statement.numeral}.</span>
                <span>{statement.text}</span>
              </li>
            ))}
          </ol>
        )}
        {multi && (
          <p className="text-[13px] font-medium text-ios-orange">
            Genau {needed} Antworten auswählen
          </p>
        )}
      </div>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const chosen = selection.includes(index);
          const state = !revealed
            ? 'idle'
            : option.correct
              ? 'correct'
              : chosen
                ? 'wrong'
                : 'idle';
          return (
            <div key={index} className="space-y-1">
              <AnswerOption
                letter={LETTERS[index]}
                state={state}
                selected={chosen}
                disabled={revealed}
                onClick={() => onToggle(index)}
              >
                {option.text}
              </AnswerOption>
              {revealed && (option.correct || chosen) && (
                <p
                  className={`px-3 text-[13px] leading-snug ${
                    option.correct ? 'text-ios-green' : 'text-ios-red'
                  }`}
                >
                  {option.why}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;
