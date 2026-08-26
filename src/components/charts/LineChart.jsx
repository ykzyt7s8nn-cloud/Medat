/**
 * Schlichtes Liniendiagramm (SVG) für den Punkteverlauf.
 *
 * Erwartet Werte in Prozent (0–100). Bei einem einzelnen Wert wird ein Punkt
 * gezeichnet, bei keinem Wert ein Hinweistext.
 */
export function LineChart({ values, color = '#007AFF', height = 96, label = 'Verlauf' }) {
  if (!values || values.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-[13px] text-black/40 dark:text-white/40">
        Noch keine Daten
      </div>
    );
  }

  const width = 320;
  const padding = 8;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const step = values.length > 1 ? usableWidth / (values.length - 1) : 0;
  const points = values.map((value, index) => {
    const x = padding + index * step + (values.length === 1 ? usableWidth / 2 : 0);
    const y = padding + usableHeight * (1 - Math.max(0, Math.min(100, value)) / 100);
    return [x, y];
  });
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${height - padding} L${points[0][0].toFixed(1)},${height - padding} Z`;
  const gradientId = `grad-${color.replace('#', '')}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={`${label}: ${values.map((v) => `${Math.round(v)} Prozent`).join(', ')}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 50, 100].map((gridValue) => {
        const y = padding + usableHeight * (1 - gridValue / 100);
        return (
          <line
            key={gridValue}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            className="stroke-black/10 dark:stroke-white/15"
            strokeWidth="1"
            strokeDasharray={gridValue === 0 || gridValue === 100 ? undefined : '3 4'}
          />
        );
      })}
      {values.length > 1 && <path d={area} fill={`url(#${gradientId})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={values.length > 20 ? 2 : 3} fill={color} />
      ))}
    </svg>
  );
}

export default LineChart;
