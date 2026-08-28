/**
 * Ebene Geometrie für den Untertest "Figuren zusammensetzen".
 *
 * Alle Formen sind konvexe Polygonzüge. Runde Ränder (Halbkreis, Viertelkreis)
 * werden durch viele kurze Kanten angenähert – bei 96 Segmenten pro Vollkreis
 * ist davon nichts mehr zu sehen, dafür bleibt alles mit einer einzigen
 * Schnitt-Operation zerlegbar.
 *
 * Konvexität ist hier keine Bequemlichkeit, sondern der Kern: Eine Gerade
 * zerteilt ein konvexes Polygon immer in genau zwei konvexe Teile. Damit ist
 * jede Zerlegung gültig und jedes Teilstück wieder schneidbar.
 */

/** Fläche eines Polygons (Gauß'sche Trapezformel, immer positiv). */
export function polygonArea(points) {
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

/** Flächenschwerpunkt eines Polygons. */
export function centroid(points) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    const cross = x1 * y2 - x2 * y1;
    area += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  if (Math.abs(area) < 1e-9) {
    const n = points.length;
    return [points.reduce((s, p) => s + p[0], 0) / n, points.reduce((s, p) => s + p[1], 0) / n];
  }
  area /= 2;
  return [cx / (6 * area), cy / (6 * area)];
}

export function boundsOf(points) {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

/** Größter Abstand eines Punktes vom Schwerpunkt – Maß für den Platzbedarf. */
export function radiusOf(points) {
  const [cx, cy] = centroid(points);
  return Math.max(...points.map(([x, y]) => Math.hypot(x - cx, y - cy)));
}

export function translate(points, dx, dy) {
  return points.map(([x, y]) => [x + dx, y + dy]);
}

export function scale(points, factor) {
  return points.map(([x, y]) => [x * factor, y * factor]);
}

export function rotate(points, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map(([x, y]) => [x * cos - y * sin, x * sin + y * cos]);
}

/** Verschiebt den Schwerpunkt in den Ursprung. */
export function center(points) {
  const [cx, cy] = centroid(points);
  return translate(points, -cx, -cy);
}

/* ------------------------------------------------------------ Grundformen */

/** Regelmäßiges n-Eck mit gegebenem Umkreisradius. */
export function regularPolygon(sides, radius = 1, startAngle = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, i) => {
    const angle = startAngle + (i * 2 * Math.PI) / sides;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
}

/**
 * Kreissektor als Polygonzug.
 * `portion` 1 = Vollkreis, 0.5 = Halbkreis, 0.25 = Viertelkreis.
 * Bei einem Teilkreis kommt der Mittelpunkt als Eckpunkt dazu – daraus
 * entstehen die geraden Kanten, an denen im Test angelegt wird.
 */
export function circleSector(portion, radius = 1, segments = 96, startAngle = -Math.PI / 2) {
  const steps = Math.max(4, Math.round(segments * portion));
  const sweep = 2 * Math.PI * portion;
  const points = [];
  if (portion < 0.999) points.push([0, 0]);
  for (let i = 0; i <= steps; i += 1) {
    const angle = startAngle + (sweep * i) / steps;
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
  }
  return portion < 0.999 ? points : points.slice(0, -1);
}

/** Rechteck mit gegebener Breite und Höhe, um den Ursprung zentriert. */
export function rectangle(width, height) {
  return [
    [-width / 2, -height / 2],
    [width / 2, -height / 2],
    [width / 2, height / 2],
    [-width / 2, height / 2],
  ];
}

/* ---------------------------------------------------------------- Schnitt */

const EPSILON = 1e-9;

/** Vorzeichenbehafteter Abstand zur Geraden durch `point` mit Normale `normal`. */
const sideOf = (vertex, point, normal) =>
  (vertex[0] - point[0]) * normal[0] + (vertex[1] - point[1]) * normal[1];

/**
 * Zerteilt ein konvexes Polygon an einer Geraden in zwei konvexe Polygone.
 * Liegt die Gerade außerhalb, kommt nur ein Teil zurück.
 */
export function cutPolygon(points, linePoint, normal) {
  const positive = [];
  const negative = [];

  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const distanceCurrent = sideOf(current, linePoint, normal);
    const distanceNext = sideOf(next, linePoint, normal);

    if (distanceCurrent >= -EPSILON) positive.push(current);
    if (distanceCurrent <= EPSILON) negative.push(current);

    // Kante schneidet die Gerade -> Schnittpunkt in beide Teile aufnehmen
    if ((distanceCurrent > EPSILON && distanceNext < -EPSILON)
      || (distanceCurrent < -EPSILON && distanceNext > EPSILON)) {
      const t = distanceCurrent / (distanceCurrent - distanceNext);
      const intersection = [
        current[0] + (next[0] - current[0]) * t,
        current[1] + (next[1] - current[1]) * t,
      ];
      positive.push(intersection);
      negative.push(intersection);
    }
  }

  return [positive, negative].filter((part) => part.length >= 3 && polygonArea(part) > EPSILON);
}

/**
 * Entfernt Punkte, die praktisch aufeinander liegen.
 *
 * Achtung beim Aufruf: `list.map(simplify)` reicht den Array-Index als
 * Toleranz weiter und löscht damit das halbe Polygon. Immer
 * `list.map((p) => simplify(p))` schreiben.
 */
export function simplify(points, tolerance = 1e-6) {
  const out = [];
  for (const point of points) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(point[0] - last[0], point[1] - last[1]) > tolerance) out.push(point);
  }
  if (out.length > 2) {
    const first = out[0];
    const last = out[out.length - 1];
    if (Math.hypot(first[0] - last[0], first[1] - last[1]) <= tolerance) out.pop();
  }
  return out;
}

/** Polygon als SVG-Punkteliste. */
export const toSvgPoints = (points, digits = 2) =>
  points.map(([x, y]) => `${x.toFixed(digits)},${y.toFixed(digits)}`).join(' ');
