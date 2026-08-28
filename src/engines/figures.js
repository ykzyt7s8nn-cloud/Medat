/**
 * Engine für den Untertest "Figuren zusammensetzen".
 *
 * Aufgabe: Aus mehreren Teilstücken entsteht genau eine der fünf gezeigten
 * Figuren. Die Teile dürfen gedreht, aber nicht gespiegelt werden.
 *
 * Formensprache wie im MedAT: Halb- und Viertelkreise, Fünf- bis Achtecke,
 * dazu Dreieck, Quadrat und Rechteck. Alle Grundformen sind konvex – dadurch
 * zerteilt jede Schnittgerade eine Figur in genau zwei gültige Teile, und die
 * Zerlegung ist per Konstruktion lösbar.
 *
 * Die Distraktoren sind nicht bloß "andere Formen": Für jeden ist beweisbar,
 * dass er sich aus den Teilstücken nicht legen lässt, denn seine Fläche weicht
 * von der Summe der Teilflächen ab. Eine Fläche, die nicht passt, kann nicht
 * lückenlos ausgelegt werden – das ist unabhängig von jeder Anordnung.
 * Der Unterschied liegt bei wenigen Prozent und ist mit dem Auge nicht zu
 * messen; gelöst wird über die Form, nicht über die Größe.
 */
import { chance, pick, randInt, shuffle } from '../lib/random.js';
import {
  boundsOf,
  center,
  centroid,
  circleSector,
  cutPolygon,
  polygonArea,
  radiusOf,
  rectangle,
  regularPolygon,
  rotate,
  scale,
  simplify,
} from '../lib/geometry.js';

/** Einheitsfläche aller Grundformen – so sind sie direkt vergleichbar. */
const UNIT_AREA = 1;

/** Auf eine Zielfläche skalieren. */
function withArea(points, area) {
  return scale(points, Math.sqrt(area / polygonArea(points)));
}

/**
 * Katalog der Grundformen. `family` steuert die Auswahl der Distraktoren:
 * Zu einem Halbkreis passen andere Rundformen als zu einem Achteck.
 */
export const SHAPES = {
  dreieck: { label: 'Dreieck', family: 'eckig', build: () => regularPolygon(3) },
  quadrat: { label: 'Quadrat', family: 'eckig', build: () => regularPolygon(4) },
  rechteck: { label: 'Rechteck', family: 'eckig', build: () => rectangle(1.7, 1) },
  fuenfeck: { label: 'Fünfeck', family: 'eckig', build: () => regularPolygon(5) },
  sechseck: { label: 'Sechseck', family: 'eckig', build: () => regularPolygon(6) },
  siebeneck: { label: 'Siebeneck', family: 'eckig', build: () => regularPolygon(7) },
  achteck: { label: 'Achteck', family: 'eckig', build: () => regularPolygon(8) },
  viertelkreis: { label: 'Viertelkreis', family: 'rund', build: () => circleSector(0.25) },
  halbkreis: { label: 'Halbkreis', family: 'rund', build: () => circleSector(0.5) },
  dreiviertelkreis: { label: 'Dreiviertelkreis', family: 'rund', build: () => circleSector(0.75) },
  kreis: { label: 'Kreis', family: 'rund', build: () => circleSector(1) },
  drittelkreis: { label: 'Drittelkreis', family: 'rund', build: () => circleSector(1 / 3) },
};

/** Grundform auf Einheitsfläche, im Ursprung zentriert. */
function baseShape(id) {
  return center(withArea(SHAPES[id].build(), UNIT_AREA));
}

/* ------------------------------------------------------------- Zerlegung */

/** Zufällige Schnittgerade durch die Nähe des Schwerpunkts. */
function randomCut(points) {
  const [cx, cy] = centroid(points);
  const reach = radiusOf(points);
  const angle = Math.random() * Math.PI;
  const normal = [Math.cos(angle), Math.sin(angle)];
  // Versatz gegen die Mitte, damit nicht immer halbiert wird. Zu weit außen
  // entstünden Splitter, die ohnehin verworfen würden.
  const offset = (Math.random() - 0.5) * reach * 0.6;
  return { point: [cx + normal[0] * offset, cy + normal[1] * offset], normal };
}

/**
 * Zerlegt eine Figur in `count` Teilstücke.
 * Geschnitten wird jeweils das größte Teil – das vermeidet Splitter und ergibt
 * Teile, die sich in der Größe ähneln und deshalb schwerer zuzuordnen sind.
 */
/**
 * Wie gut füllt ein Teil seine Hüllbox aus?
 * Ein sehr spitzer Keil hat zwar Fläche, sieht aber wie ein Splitter aus und
 * lässt sich kaum zuordnen – solche Schnitte werden verworfen.
 */
function fillRatio(points) {
  const { width, height } = boundsOf(points);
  const box = width * height;
  return box > 0 ? polygonArea(points) / box : 0;
}

export function dissect(shape, count, minShare = 0.10, minFill = 0.3) {
  const total = polygonArea(shape);
  let pieces = [shape];

  // Großzügig ansetzen: Ein Schnittversuch kostet Mikrosekunden, ein
  // fehlgeschlagener Durchgang dagegen eine komplette Neugenerierung.
  const maxAttempts = 1200 * count;
  let guard = 0;
  while (pieces.length < count && guard < maxAttempts) {
    guard += 1;
    const largest = pieces.reduce(
      (best, piece, index) => (polygonArea(piece) > polygonArea(pieces[best]) ? index : best), 0,
    );
    const { point, normal } = randomCut(pieces[largest]);
    const parts = cutPolygon(pieces[largest], point, normal).map((part) => simplify(part));
    if (parts.length !== 2) continue;
    if (parts.some((part) => polygonArea(part) < total * minShare)) continue;
    if (parts.some((part) => fillRatio(part) < minFill)) continue;
    pieces = [...pieces.slice(0, largest), ...parts, ...pieces.slice(largest + 1)];
  }

  return pieces.length === count ? pieces : null;
}

/* ----------------------------------------------------------- Distraktoren */

/**
 * Abgewandelte Zielfigur: eine Ecke oder ein Randstück wird abgeschnitten.
 * Sieht der Lösung sehr ähnlich und ist trotzdem beweisbar unlösbar, weil
 * Fläche fehlt.
 */
function trimmedVariant(shape, minDrop, maxDrop) {
  const total = polygonArea(shape);
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const vertex = pick(shape);
    const [cx, cy] = centroid(shape);
    const direction = [vertex[0] - cx, vertex[1] - cy];
    const length = Math.hypot(direction[0], direction[1]) || 1;
    const normal = [direction[0] / length, direction[1] / length];
    const depth = 0.55 + Math.random() * 0.4;
    const point = [cx + normal[0] * length * depth, cy + normal[1] * length * depth];
    const parts = cutPolygon(shape, point, [-normal[0], -normal[1]]).map((part) => simplify(part));
    const kept = parts.reduce((best, part) => (polygonArea(part) > polygonArea(best) ? part : best), parts[0] ?? []);
    if (!kept || kept.length < 3) continue;
    const drop = 1 - polygonArea(kept) / total;
    if (drop < minDrop || drop > maxDrop) continue;
    return center(kept);
  }
  return null;
}

/** Andere Grundform, bevorzugt aus derselben Familie. */
function otherShape(targetId, usedIds) {
  const family = SHAPES[targetId].family;
  const sameFamily = Object.keys(SHAPES).filter(
    (id) => SHAPES[id].family === family && id !== targetId && !usedIds.has(id),
  );
  const others = Object.keys(SHAPES).filter((id) => id !== targetId && !usedIds.has(id));
  const pool = sameFamily.length > 0 && chance(0.75) ? sameFamily : others;
  return pool.length > 0 ? pick(pool) : null;
}

/* ------------------------------------------------------------ Aufgaben */

/**
 * Schwierigkeitsstufen.
 * `areaGap` ist der Flächenunterschied der Distraktoren zur Lösung – je kleiner,
 * desto weniger hilft ein Größenvergleich und desto genauer muss man die Form
 * betrachten.
 */
export const DIFFICULTY_SETUP = {
  leicht: {
    pieces: [2, 3],
    areaGap: [0.12, 0.22],
    shapes: ['dreieck', 'quadrat', 'rechteck', 'halbkreis', 'sechseck'],
  },
  mittel: {
    pieces: [3, 4],
    areaGap: [0.08, 0.15],
    shapes: ['quadrat', 'rechteck', 'fuenfeck', 'sechseck', 'halbkreis', 'viertelkreis'],
  },
  schwer: {
    pieces: [4, 5],
    areaGap: [0.04, 0.09],
    shapes: Object.keys(SHAPES),
  },
  medat: {
    pieces: [4, 5],
    areaGap: [0.04, 0.10],
    shapes: Object.keys(SHAPES),
  },
  gemischt: {
    pieces: [2, 5],
    areaGap: [0.05, 0.18],
    shapes: Object.keys(SHAPES),
  },
};

/** Kleinste zulässige Flächenabweichung – darunter wäre der Beweis wacklig. */
export const MIN_AREA_GAP = 0.03;

function gapFactor([min, max]) {
  const gap = min + Math.random() * (max - min);
  return chance(0.5) ? 1 - gap : 1 + gap;
}

/**
 * Erzeugt eine Aufgabe.
 * @param {{difficulty?: string, pieceCount?: number}} options
 */
export function generateFigureTask(options = {}) {
  const setup = DIFFICULTY_SETUP[options.difficulty] ?? DIFFICULTY_SETUP.medat;
  const pieceCount = options.pieceCount ?? randInt(setup.pieces[0], setup.pieces[1]);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const targetId = pick(setup.shapes);
    const target = baseShape(targetId);
    const placements = dissect(target, pieceCount);
    if (!placements) continue;

    const pieceArea = placements.reduce((sum, piece) => sum + polygonArea(piece), 0);

    // Vier Distraktoren: teils abgewandelte Zielfigur, teils andere Grundform.
    const distractors = [];
    const usedIds = new Set([targetId]);
    let guard = 0;
    while (distractors.length < 4 && guard < 60) {
      guard += 1;
      const wantTrim = distractors.length < 2 ? chance(0.6) : chance(0.35);

      let candidate = null;
      if (wantTrim) {
        candidate = trimmedVariant(target, setup.areaGap[0], setup.areaGap[1]);
      } else {
        const id = otherShape(targetId, usedIds);
        if (id) {
          usedIds.add(id);
          candidate = center(withArea(SHAPES[id].build(), pieceArea * gapFactor(setup.areaGap)));
        }
      }
      if (!candidate) continue;

      // Der Beweis: abweichende Fläche kann nicht lückenlos ausgelegt werden.
      const relativeGap = Math.abs(polygonArea(candidate) - pieceArea) / pieceArea;
      if (relativeGap < MIN_AREA_GAP) continue;
      distractors.push(candidate);
    }
    if (distractors.length < 4) continue;

    const letters = ['a', 'b', 'c', 'd', 'e'];
    const shuffled = shuffle([
      { points: target, correct: true },
      ...distractors.map((points) => ({ points, correct: false })),
    ]);
    const answerOptions = shuffled.map((option, index) => ({
      letter: letters[index],
      points: option.points,
      correct: option.correct,
    }));

    return {
      type: 'figures',
      shapeId: targetId,
      shapeLabel: SHAPES[targetId].label,
      pieceCount,
      /** Teile in zufälliger Drehlage und Reihenfolge – so werden sie gezeigt. */
      pieces: shuffle(placements.map((piece) => rotate(center(piece), Math.random() * 2 * Math.PI))),
      /** Teile an ihrem Platz in der Zielfigur – für die Auflösungsgrafik. */
      placements,
      target,
      pieceArea,
      options: answerOptions,
      correctLetter: answerOptions.find((option) => option.correct).letter,
    };
  }
  return null;
}

/** Aufgabensatz für einen kompletten Durchgang. */
export function generateFigureSet(count, difficulty = 'medat', options = {}) {
  const tasks = [];
  let lastShape = null;
  let guard = 0;
  while (tasks.length < count && guard < count * 20) {
    guard += 1;
    const task = generateFigureTask({
      difficulty,
      pieceCount: options.pieceCounts?.length ? Number(pick(options.pieceCounts)) : undefined,
    });
    if (!task) continue;
    // Nicht zweimal dieselbe Grundform hintereinander
    if (task.shapeId === lastShape && count > 3) continue;
    lastShape = task.shapeId;
    tasks.push({ ...task, index: tasks.length });
  }
  return tasks;
}
