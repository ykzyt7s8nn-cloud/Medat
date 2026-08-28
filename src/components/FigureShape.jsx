/**
 * Zeichnet die Figuren des Untertests "Figuren zusammensetzen" als SVG.
 *
 * Entscheidend ist der gemeinsame Maßstab: Teilstücke und Antwortfiguren
 * werden mit demselben Faktor gezeichnet. Würde jede Form ihre Box ausfüllen,
 * liesse sich die Aufgabe über die Größe statt über die Form lösen – und die
 * Teile wären nicht mehr mit den Antworten vergleichbar.
 */
import { boundsOf, toSvgPoints } from '../lib/geometry.js';

/** Pixel je Zeichen-Einheit für eine quadratische Box der Kantenlänge `size`. */
export const pixelsPerUnit = (size, extent) => size / (extent * 2);

/** Halbe Kantenlänge des Zeichenbereichs, in dem alle Figuren Platz finden. */
export const viewExtent = (shapes) =>
  Math.max(...shapes.map((points) => {
    const { minX, maxX, minY, maxY } = boundsOf(points);
    return Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY));
  })) * 1.08;

/** Einzelne Figur, im Zeichenbereich zentriert. */
export function FigureShape({
  points,
  extent,
  size = 96,
  fill = '#5856D6',
  fillOpacity = 0.16,
  stroke = '#5856D6',
  strokeWidth = 0.02,
  className = '',
  label,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
      className={className}
      role="img"
      aria-label={label ?? 'Figur'}
    >
      <polygon
        points={toSvgPoints(points, 4)}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth * extent}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Die Teilstücke nebeneinander.
 *
 * `pixelsPerUnit` ist derselbe Wert wie bei den Antwortfiguren – nur so lässt
 * sich mit dem Auge vergleichen, ob die Teile in eine Figur passen. Ohne das
 * wäre die Aufgabe nicht fair lösbar.
 */
export function PieceRow({ pieces, colors, extent, pixelsPerUnit, gap = 0.14, label }) {
  const boxes = pieces.map((points) => boundsOf(points));
  const totalWidth = boxes.reduce((sum, box) => sum + box.width, 0) + gap * (pieces.length + 1);
  const maxHeight = Math.max(...boxes.map((box) => box.height)) + gap * 2;

  let cursor = gap;
  const placed = pieces.map((points, index) => {
    const box = boxes[index];
    const offsetX = cursor - box.minX;
    const offsetY = -box.minY - box.height / 2;
    cursor += box.width + gap;
    return { points: points.map(([x, y]) => [x + offsetX, y + offsetY]), color: colors[index % colors.length] };
  });

  return (
    <svg
      width={totalWidth * pixelsPerUnit}
      height={maxHeight * pixelsPerUnit}
      viewBox={`0 ${-maxHeight / 2} ${totalWidth} ${maxHeight}`}
      role="img"
      aria-label={label ?? `${pieces.length} Teilstücke`}
    >
      {placed.map((piece, index) => (
        <polygon
          key={index}
          points={toSvgPoints(piece.points, 4)}
          fill={piece.color}
          fillOpacity="0.22"
          stroke={piece.color}
          strokeWidth={0.02 * (extent ?? 1)}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** Auflösung: die Zielfigur mit den Teilstücken an ihrem Platz. */
export function SolutionShape({ placements, colors, extent, size = 150, label }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
      role="img"
      aria-label={label ?? 'Auflösung: Lage der Teilstücke'}
    >
      {placements.map((points, index) => (
        <polygon
          key={index}
          points={toSvgPoints(points, 4)}
          fill={colors[index % colors.length]}
          fillOpacity="0.3"
          stroke={colors[index % colors.length]}
          strokeWidth={0.018 * extent}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export default FigureShape;
