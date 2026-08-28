/**
 * Zeichnet ein Polyomino (Zellenmenge auf einem Raster) als SVG.
 *
 * Innenkanten werden weggelassen – gezeichnet wird nur der Umriss, damit die
 * Figur als ein Stück wahrgenommen wird und nicht als Ansammlung von Kästchen.
 *
 * Alle Figuren einer Aufgabe bekommen dieselbe `extent`, also denselben
 * Maßstab. Sonst würde eine kleine Figur groß gerendert und die Aufgabe wäre
 * über die Größe statt über die Form lösbar.
 */

const cellKey = ([x, y]) => `${x},${y}`;

function outline(cells) {
  const present = new Set(cells.map(cellKey));
  const has = (x, y) => present.has(`${x},${y}`);
  const lines = [];
  for (const [x, y] of cells) {
    if (!has(x, y - 1)) lines.push([x, y, x + 1, y]);
    if (!has(x, y + 1)) lines.push([x, y + 1, x + 1, y + 1]);
    if (!has(x - 1, y)) lines.push([x, y, x, y + 1]);
    if (!has(x + 1, y)) lines.push([x + 1, y, x + 1, y + 1]);
  }
  return lines;
}

export function FigureShape({
  cells,
  extent,
  cellSize = 16,
  fill = '#007AFF',
  fillOpacity = 0.18,
  stroke = '#007AFF',
  groups = null,
  className = '',
  label,
}) {
  const width = Math.max(...cells.map((cell) => cell[0])) + 1;
  const height = Math.max(...cells.map((cell) => cell[1])) + 1;
  const span = extent ?? Math.max(width, height);
  // Figur im gemeinsamen Rahmen zentrieren
  const offsetX = (span - width) / 2;
  const offsetY = (span - height) / 2;
  const padding = 0.12;

  return (
    <svg
      width={span * cellSize}
      height={span * cellSize}
      viewBox={`${-padding} ${-padding} ${span + padding * 2} ${span + padding * 2}`}
      className={className}
      role="img"
      aria-label={label ?? `Figur aus ${cells.length} Feldern`}
    >
      <g transform={`translate(${offsetX} ${offsetY})`}>
        {groups
          ? groups.map((group, index) => (
            <g key={index}>
              {group.cells.map((cell) => (
                <rect
                  key={cellKey(cell)}
                  x={cell[0]}
                  y={cell[1]}
                  width="1"
                  height="1"
                  fill={group.color}
                  fillOpacity="0.3"
                />
              ))}
              {outline(group.cells).map((line, i) => (
                <line
                  key={i}
                  x1={line[0]}
                  y1={line[1]}
                  x2={line[2]}
                  y2={line[3]}
                  stroke={group.color}
                  strokeWidth="0.14"
                  strokeLinecap="round"
                />
              ))}
            </g>
          ))
          : (
            <>
              {cells.map((cell) => (
                <rect
                  key={cellKey(cell)}
                  x={cell[0]}
                  y={cell[1]}
                  width="1"
                  height="1"
                  fill={fill}
                  fillOpacity={fillOpacity}
                />
              ))}
              {outline(cells).map((line, index) => (
                <line
                  key={index}
                  x1={line[0]}
                  y1={line[1]}
                  x2={line[2]}
                  y2={line[3]}
                  stroke={stroke}
                  strokeWidth="0.14"
                  strokeLinecap="round"
                />
              ))}
            </>
          )}
      </g>
    </svg>
  );
}

export default FigureShape;
