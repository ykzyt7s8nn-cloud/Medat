/**
 * Lernhilfe für Zahlenfolgen: zeigt den Rechenweg statt nur das Ergebnis.
 *
 * Welche Darstellung hilft, hängt von der Regelfamilie ab – deshalb wird sie
 * danach ausgewählt:
 *
 *   verschachtelt  → die beiden Teilfolgen getrennt untereinander
 *   multiplikativ  → die Quotienten zwischen den Zahlen
 *   fibonacci      → die Summen, aus denen die nächste Zahl entsteht
 *   sonst          → erste und (falls aufschlussreich) zweite Differenzen
 *
 * Die Differenzenreihe ist die Standardtechnik für diesen Untertest: Wer sie
 * routiniert hinschreibt, erkennt das Bildungsgesetz meist sofort.
 */

const CELL = 'flex h-8 min-w-[42px] shrink-0 items-center justify-center rounded-lg px-1.5 text-[13px] tabular';

function Row({ label, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[92px] shrink-0 text-[11px] text-black/45 dark:text-white/45">{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

const numberCell = (value, key, highlight = false) => (
  <span
    key={key}
    className={`${CELL} ${highlight ? 'bg-ios-blue/10 font-semibold text-ios-blue dark:bg-ios-blue/20' : 'bg-black/[0.05] dark:bg-white/10'}`}
  >
    {value}
  </span>
);

const stepCell = (value, key) => (
  <span key={key} className={`${CELL} bg-ios-green/10 font-medium text-ios-green dark:bg-ios-green/20`}>
    {value > 0 ? `+${value}` : value}
  </span>
);

/** Abstände zwischen aufeinanderfolgenden Zahlen. */
const differences = (values) => values.slice(1).map((value, i) => value - values[i]);

/** Quotienten – nur sinnvoll, wenn sie durchgehend gleich und ganzzahlig sind. */
function constantRatio(values) {
  if (values.length < 3 || values.some((value) => value === 0)) return null;
  const ratio = values[1] / values[0];
  if (!Number.isInteger(ratio) || Math.abs(ratio) < 2) return null;
  return values.every((value, i) => i === 0 || value / values[i - 1] === ratio) ? ratio : null;
}

const ratioCell = (ratio, key) => (
  <span key={key} className={`${CELL} bg-ios-orange/10 font-medium text-ios-orange dark:bg-ios-orange/20`}>
    ×{ratio}
  </span>
);

/**
 * Schrittzeile einer (Teil-)Folge: Quotienten bei geometrischem Verlauf,
 * sonst Differenzen. Bei "18, 23, 28" hilft +5, bei "8, 24, 72" hilft ×3.
 */
function StepRow({ values, label }) {
  const ratio = constantRatio(values);
  if (ratio !== null) {
    return <Row label={label}>{values.slice(1).map((_, i) => ratioCell(ratio, i))}</Row>;
  }
  return <Row label={label}>{differences(values).map((d, i) => stepCell(d, i))}</Row>;
}

export function SeriesAnalysis({ values, family, solutionCount = 2 }) {
  const shown = values.length;
  const firstSolution = shown - solutionCount;

  let body = null;

  if (family === 'verschachtelt') {
    const odd = values.filter((_, i) => i % 2 === 0);
    const even = values.filter((_, i) => i % 2 === 1);
    body = (
      <>
        <Row label="1., 3., 5., …">
          {odd.map((value, i) => numberCell(value, i, i * 2 >= firstSolution))}
        </Row>
        <StepRow values={odd} label="Schritte" />
        <Row label="2., 4., 6., …">
          {even.map((value, i) => numberCell(value, i, i * 2 + 1 >= firstSolution))}
        </Row>
        <StepRow values={even} label="Schritte" />
      </>
    );
  } else if (family === 'multiplikativ') {
    const ratios = values.slice(1).map((value, i) => (values[i] !== 0 ? value / values[i] : null));
    body = (
      <>
        <Row label="Folge">{values.map((value, i) => numberCell(value, i, i >= firstSolution))}</Row>
        <Row label="Quotienten">
          {ratios.map((ratio, i) => (
            <span key={i} className={`${CELL} bg-ios-orange/10 font-medium text-ios-orange dark:bg-ios-orange/20`}>
              {ratio === null ? '–' : `×${Number.isInteger(ratio) ? ratio : ratio.toFixed(2)}`}
            </span>
          ))}
        </Row>
      </>
    );
  } else if (family === 'fibonacci') {
    body = (
      <>
        <Row label="Folge">{values.map((value, i) => numberCell(value, i, i >= firstSolution))}</Row>
        <div className="flex flex-wrap gap-1.5 pl-[100px]">
          {values.slice(2, 6).map((value, i) => (
            <span
              key={i}
              className="rounded-lg bg-ios-purple/10 px-2 py-1 text-[12px] tabular text-ios-purple dark:bg-ios-purple/20"
            >
              {values[i]} · {values[i + 1]} → {value}
            </span>
          ))}
        </div>
      </>
    );
  } else {
    const first = differences(values);
    const second = differences(first);
    const secondHelps = new Set(second).size <= 2 && second.length > 0;
    body = (
      <>
        <Row label="Folge">{values.map((value, i) => numberCell(value, i, i >= firstSolution))}</Row>
        <Row label="1. Differenz">{first.map((d, i) => stepCell(d, i))}</Row>
        {secondHelps && <Row label="2. Differenz">{second.map((d, i) => stepCell(d, i))}</Row>}
      </>
    );
  }

  return (
    <div className="scroll-area -mx-1 overflow-x-auto px-1 pb-1">
      <div className="inline-block min-w-full space-y-1.5">{body}</div>
    </div>
  );
}

export default SeriesAnalysis;
