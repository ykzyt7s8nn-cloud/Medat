/**
 * Venn-Diagramm zur Erklärung eines Syllogismus.
 *
 * Die Engine (engines/syllogism.js) liefert für jede der 7 Regionen einen
 * Status:
 *   empty     – die Region ist in jedem zulässigen Modell leer   → schraffiert
 *   occupied  – die Region ist in jedem Modell besetzt           → Punkt
 *   unknown   – mal so, mal so                                   → leer gelassen
 *
 * Genau so arbeitet die klassische Venn-Methode zur Prüfung von Syllogismen.
 * Die Regionen werden über verschachtelte clip-paths (eingeschlossene Kreise)
 * und eine Maske (ausgeschlossene Kreise) gezeichnet.
 */

const CIRCLES = {
  S: { cx: 88, cy: 84, r: 56, color: '#007AFF' },
  M: { cx: 120, cy: 140, r: 56, color: '#FF9500' },
  P: { cx: 152, cy: 84, r: 56, color: '#AF52DE' },
};

/** Reihenfolge identisch zu REGIONS in engines/syllogism.js. */
const REGION_LAYOUT = [
  { key: 'S', inside: ['S'], outside: ['M', 'P'], marker: [60, 60] },
  { key: 'M', inside: ['M'], outside: ['S', 'P'], marker: [120, 182] },
  { key: 'P', inside: ['P'], outside: ['S', 'M'], marker: [180, 60] },
  { key: 'SM', inside: ['S', 'M'], outside: ['P'], marker: [82, 132] },
  { key: 'SP', inside: ['S', 'P'], outside: ['M'], marker: [120, 62] },
  { key: 'MP', inside: ['M', 'P'], outside: ['S'], marker: [158, 132] },
  { key: 'SMP', inside: ['S', 'M', 'P'], outside: [], marker: [120, 110] },
];

function Region({ layout, status, id }) {
  if (status === 'unknown') return null;
  const maskId = `${id}-mask-${layout.key}`;

  let content = status === 'empty'
    ? <rect x="0" y="0" width="240" height="220" fill={`url(#${id}-hatch)`} />
    : <rect x="0" y="0" width="240" height="220" fill="rgba(52,199,89,0.22)" />;

  if (layout.outside.length > 0) {
    content = <g mask={`url(#${maskId})`}>{content}</g>;
  }
  for (const term of layout.inside) {
    content = <g clipPath={`url(#${id}-clip-${term})`}>{content}</g>;
  }

  return (
    <>
      {layout.outside.length > 0 && (
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="240" height="220" fill="white" />
            {layout.outside.map((term) => (
              <circle key={term} cx={CIRCLES[term].cx} cy={CIRCLES[term].cy} r={CIRCLES[term].r} fill="black" />
            ))}
          </mask>
        </defs>
      )}
      {content}
    </>
  );
}

export function VennDiagram({ terms, status, id = 'venn' }) {
  const description = REGION_LAYOUT
    .map((layout, index) => {
      if (status[index] === 'empty') return `${layout.inside.map((t) => terms[t]).join(' und ')}: leer`;
      if (status[index] === 'occupied') return `${layout.inside.map((t) => terms[t]).join(' und ')}: besetzt`;
      return null;
    })
    .filter(Boolean)
    .join('; ');

  return (
    <figure className="w-full">
      <svg viewBox="0 0 240 220" className="w-full" role="img" aria-label={`Venn-Diagramm. ${description}`}>
        <defs>
          <pattern id={`${id}-hatch`} width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="7" height="7" fill="rgba(120,120,128,0.12)" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(120,120,128,0.55)" strokeWidth="2" />
          </pattern>
          {Object.entries(CIRCLES).map(([term, circle]) => (
            <clipPath key={term} id={`${id}-clip-${term}`}>
              <circle cx={circle.cx} cy={circle.cy} r={circle.r} />
            </clipPath>
          ))}
        </defs>

        {REGION_LAYOUT.map((layout, index) => (
          <Region key={layout.key} layout={layout} status={status[index]} id={id} />
        ))}

        {Object.entries(CIRCLES).map(([term, circle]) => (
          <circle
            key={term}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill="none"
            stroke={circle.color}
            strokeWidth="2"
            opacity="0.9"
          />
        ))}

        {REGION_LAYOUT.map((layout, index) =>
          status[index] === 'occupied' ? (
            <g key={`marker-${layout.key}`}>
              <circle cx={layout.marker[0]} cy={layout.marker[1]} r="5.5" fill="#34C759" />
              <circle cx={layout.marker[0]} cy={layout.marker[1]} r="5.5" fill="none" stroke="white" strokeWidth="1.5" />
            </g>
          ) : null,
        )}
      </svg>

      <figcaption className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px]">
        {Object.entries(CIRCLES).map(([term, circle]) => (
          <span key={term} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: circle.color }} />
            <span className="text-black/70 dark:text-white/70">{terms[term]}</span>
          </span>
        ))}
      </figcaption>
      <p className="mt-1 text-center text-[11px] text-black/45 dark:text-white/45">
        Schraffiert = zwingend leer · grüner Punkt = mindestens ein Element
      </p>
    </figure>
  );
}

export default VennDiagram;
