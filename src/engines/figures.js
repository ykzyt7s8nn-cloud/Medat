/**
 * Engine für den Untertest "Figuren zusammensetzen".
 *
 * Aufgabe: Aus mehreren Teilstücken soll genau eine von fünf gezeigten Figuren
 * lückenlos zusammengesetzt werden. Die Teile dürfen gedreht, aber nicht
 * gespiegelt werden – so wie im MedAT.
 *
 * Umsetzung auf einem Raster:
 *   1. Eine zusammenhängende Zielfigur aus n Zellen erzeugen (Polyomino).
 *   2. Sie in k zusammenhängende Teilstücke zerlegen.
 *   3. Vier Distraktoren mit gleicher Zellenzahl bilden – gleich viele Zellen,
 *      damit blosses Zählen nicht zur Lösung führt.
 *   4. Für jeden Distraktor per Backtracking beweisen, dass er sich aus den
 *      Teilstücken NICHT legen lässt. Ohne diesen Beweis könnte zufällig eine
 *      zweite richtige Antwort entstehen.
 */
import { pick, randInt, shuffle } from '../lib/random.js';

const key = (cell) => `${cell[0]},${cell[1]}`;
const parse = (text) => text.split(',').map(Number);
const NEIGHBOURS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/** Verschiebt eine Zellenmenge in die linke obere Ecke. */
export function normalize(cells) {
  const minX = Math.min(...cells.map((cell) => cell[0]));
  const minY = Math.min(...cells.map((cell) => cell[1]));
  return cells
    .map((cell) => [cell[0] - minX, cell[1] - minY])
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

/** Dreht um 90 Grad im Uhrzeigersinn. */
export const rotate = (cells) => normalize(cells.map(([x, y]) => [-y, x]));

/** Alle vier Drehlagen, Duplikate entfernt. */
export function orientations(cells) {
  const seen = new Map();
  let current = normalize(cells);
  for (let i = 0; i < 4; i += 1) {
    seen.set(current.map(key).join(' '), current);
    current = rotate(current);
  }
  return [...seen.values()];
}

/** Drehinvariante Kennung – zwei Figuren mit gleicher Kennung sind deckungsgleich. */
export const shapeId = (cells) =>
  orientations(cells)
    .map((variant) => variant.map(key).join(' '))
    .sort()[0];

/**
 * Hat die Figur ein eingeschlossenes Loch?
 *
 * Geflutet wird von ausserhalb des Rahmens: Jede freie Zelle, die dabei nicht
 * erreicht wird, ist eingeschlossen. Solche Ringformen kommen im MedAT nicht
 * vor und sehen als Antwortfigur unnatürlich aus.
 */
export function hasHole(cells) {
  const present = new Set(cells.map(key));
  const width = Math.max(...cells.map((cell) => cell[0])) + 1;
  const height = Math.max(...cells.map((cell) => cell[1])) + 1;

  const outside = new Set();
  const queue = [[-1, -1]];
  outside.add(key([-1, -1]));
  while (queue.length > 0) {
    const [x, y] = queue.pop();
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < -1 || ny < -1 || nx > width || ny > height) continue;
      const cellKey = key([nx, ny]);
      if (present.has(cellKey) || outside.has(cellKey)) continue;
      outside.add(cellKey);
      queue.push([nx, ny]);
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cellKey = key([x, y]);
      if (!present.has(cellKey) && !outside.has(cellKey)) return true;
    }
  }
  return false;
}

export const boundingBox = (cells) => ({
  width: Math.max(...cells.map((cell) => cell[0])) + 1,
  height: Math.max(...cells.map((cell) => cell[1])) + 1,
});

/**
 * Zufällige zusammenhängende Figur aus n Zellen.
 * Kompakte Formen werden bevorzugt – lange Schlangen wären zu leicht zu
 * erkennen und passen nicht zum Testbild.
 */
export function randomPolyomino(n) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const shape = growPolyomino(n);
    if (!hasHole(shape)) return shape;
  }
  return growPolyomino(n);
}

function growPolyomino(n) {
  const cells = new Set(['0,0']);
  while (cells.size < n) {
    const candidates = new Set();
    for (const cellKey of cells) {
      const [x, y] = parse(cellKey);
      for (const [dx, dy] of NEIGHBOURS) {
        const next = key([x + dx, y + dy]);
        if (!cells.has(next)) candidates.add(next);
      }
    }
    // Aus einer zufälligen Auswahl die Zelle nehmen, die die Figur am
    // kompaktesten hält.
    const options = shuffle([...candidates]).slice(0, 5);
    let best = options[0];
    let bestArea = Infinity;
    for (const option of options) {
      const trial = normalize([...cells, option].map(parse));
      const { width, height } = boundingBox(trial);
      const area = width * height + Math.abs(width - height);
      if (area < bestArea) {
        bestArea = area;
        best = option;
      }
    }
    cells.add(best);
  }
  return normalize([...cells].map(parse));
}

/**
 * Zerlegt eine Figur in k zusammenhängende Teilstücke.
 * Die Teile wachsen abwechselnd von zufälligen Startzellen aus, dadurch bleibt
 * jedes Teil zusammenhängend.
 */
export function splitIntoPieces(cells, k) {
  const remaining = new Set(cells.map(key));
  const seeds = shuffle([...remaining]).slice(0, k);
  const pieces = seeds.map((seed) => {
    remaining.delete(seed);
    return new Set([seed]);
  });

  let progress = true;
  while (remaining.size > 0 && progress) {
    progress = false;
    for (const piece of shuffle(pieces)) {
      const candidates = [];
      for (const cellKey of piece) {
        const [x, y] = parse(cellKey);
        for (const [dx, dy] of NEIGHBOURS) {
          const next = key([x + dx, y + dy]);
          if (remaining.has(next)) candidates.push(next);
        }
      }
      if (candidates.length === 0) continue;
      const chosen = pick(candidates);
      piece.add(chosen);
      remaining.delete(chosen);
      progress = true;
    }
  }
  // Übrig gebliebene Zellen an ein angrenzendes Teil hängen
  for (const cellKey of [...remaining]) {
    const [x, y] = parse(cellKey);
    const target = pieces.find((piece) =>
      NEIGHBOURS.some(([dx, dy]) => piece.has(key([x + dx, y + dy]))));
    (target ?? pieces[0]).add(cellKey);
    remaining.delete(cellKey);
  }

  // In Koordinaten der Zielfigur zurückgeben – daraus entsteht später die
  // Auflösungsgrafik, die zeigt, wo welches Teil liegt.
  return pieces.map((piece) => [...piece].map(parse).sort((a, b) => a[1] - b[1] || a[0] - b[0]));
}

/**
 * Lässt sich die Zielfigur lückenlos aus allen Teilstücken legen?
 *
 * Backtracking über die jeweils oberste noch freie Zelle: Sie muss von
 * irgendeinem Teil abgedeckt werden, also werden alle Teile in allen Drehlagen
 * und mit jeder ihrer Zellen an dieser Stelle ausprobiert.
 */
export function canAssemble(target, pieces) {
  const targetKeys = target.map(key);
  const targetSet = new Set(targetKeys);
  if (pieces.reduce((sum, piece) => sum + piece.length, 0) !== target.length) return false;

  const variants = pieces.map((piece) => orientations(piece));
  const covered = new Set();
  const used = new Array(pieces.length).fill(false);

  const firstFree = () => targetKeys.find((cellKey) => !covered.has(cellKey));

  const place = () => {
    const anchorKey = firstFree();
    if (anchorKey === undefined) return true;
    const anchor = parse(anchorKey);

    for (let index = 0; index < variants.length; index += 1) {
      if (used[index]) continue;
      for (const variant of variants[index]) {
        for (const cell of variant) {
          const offsetX = anchor[0] - cell[0];
          const offsetY = anchor[1] - cell[1];
          const placed = variant.map(([x, y]) => key([x + offsetX, y + offsetY]));
          if (!placed.every((cellKey) => targetSet.has(cellKey) && !covered.has(cellKey))) continue;

          placed.forEach((cellKey) => covered.add(cellKey));
          used[index] = true;
          if (place()) return true;
          placed.forEach((cellKey) => covered.delete(cellKey));
          used[index] = false;
        }
      }
    }
    return false;
  };

  return place();
}

/**
 * Erzeugt eine Figur mit gleicher Zellenzahl, die sich aus den Teilstücken
 * nicht legen lässt und mit keiner bereits vorhandenen Figur deckungsgleich ist.
 */
function buildDistractor(target, pieces, taken) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    // Mal eine Abwandlung der Zielfigur, mal eine ganz neue Figur – die
    // Abwandlung ist der schwerere Distraktor, weil sie sehr ähnlich aussieht.
    const candidate = attempt % 3 === 2
      ? randomPolyomino(target.length)
      : mutate(target);
    if (!candidate) continue;
    if (hasHole(candidate)) continue;
    const id = shapeId(candidate);
    if (taken.has(id)) continue;
    if (canAssemble(candidate, pieces)) continue;
    taken.add(id);
    return candidate;
  }
  return null;
}

/** Verschiebt eine Randzelle der Figur an eine andere Stelle. */
function mutate(cells) {
  const set = new Set(cells.map(key));
  const removable = shuffle([...set]).filter((cellKey) => {
    const rest = new Set(set);
    rest.delete(cellKey);
    return isConnected(rest);
  });
  if (removable.length === 0) return null;

  const removed = removable[0];
  const rest = new Set(set);
  rest.delete(removed);

  const spots = new Set();
  for (const cellKey of rest) {
    const [x, y] = parse(cellKey);
    for (const [dx, dy] of NEIGHBOURS) {
      const next = key([x + dx, y + dy]);
      if (!rest.has(next)) spots.add(next);
    }
  }
  const spot = pick([...spots].filter((candidate) => candidate !== removed));
  if (!spot) return null;
  rest.add(spot);
  return normalize([...rest].map(parse));
}

function isConnected(cellSet) {
  const cells = [...cellSet];
  if (cells.length === 0) return false;
  const seen = new Set([cells[0]]);
  const queue = [cells[0]];
  while (queue.length > 0) {
    const [x, y] = parse(queue.pop());
    for (const [dx, dy] of NEIGHBOURS) {
      const next = key([x + dx, y + dy]);
      if (cellSet.has(next) && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen.size === cells.length;
}

/** Zellenzahl und Teileanzahl je Schwierigkeitsstufe. */
export const DIFFICULTY_SETUP = {
  leicht: { cells: [7, 9], pieces: [2, 3] },
  mittel: { cells: [9, 11], pieces: [3, 3] },
  schwer: { cells: [11, 14], pieces: [3, 4] },
  medat: { cells: [10, 13], pieces: [3, 4] },
  gemischt: { cells: [7, 14], pieces: [2, 4] },
};

/** Erzeugt eine einzelne Aufgabe. */
export function generateFigureTask(options = {}) {
  const setup = DIFFICULTY_SETUP[options.difficulty] ?? DIFFICULTY_SETUP.medat;
  const pieceCount = options.pieceCount ?? randInt(setup.pieces[0], setup.pieces[1]);

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const cellCount = randInt(setup.cells[0], setup.cells[1]);
    const target = randomPolyomino(cellCount);
    const placements = splitIntoPieces(target, pieceCount);
    const pieces = placements.map(normalize);

    // Einzelzellen als Teil sind uninteressant, ebenso ein Teil, das fast die
    // ganze Figur ausmacht.
    if (pieces.length !== pieceCount) continue;
    if (pieces.some((piece) => piece.length < 2)) continue;
    if (pieces.some((piece) => piece.length > cellCount - 2)) continue;
    if (hasHole(target)) continue;
    if (pieces.some(hasHole)) continue;
    if (!canAssemble(target, pieces)) continue; // Sicherheitsnetz

    const taken = new Set([shapeId(target)]);
    const distractors = [];
    for (let i = 0; i < 4; i += 1) {
      const distractor = buildDistractor(target, pieces, taken);
      if (!distractor) break;
      distractors.push(distractor);
    }
    if (distractors.length < 4) continue;

    const letters = ['a', 'b', 'c', 'd', 'e'];
    const figures = shuffle([
      { cells: target, correct: true },
      ...distractors.map((cells) => ({ cells, correct: false })),
    ]);
    const answerOptions = figures.map((figure, index) => ({
      letter: letters[index],
      cells: figure.cells,
      correct: figure.correct,
    }));

    return {
      type: 'figures',
      /** Zum Anzeigen: jedes Teil in einer zufälligen Drehlage. */
      pieces: pieces.map((piece) => pick(orientations(piece))),
      /** Zum Nachrechnen: die Teile in Normallage. */
      solutionPieces: pieces,
      /** Zum Zeigen der Auflösung: wo jedes Teil in der Zielfigur liegt. */
      placements,
      target,
      cellCount,
      pieceCount,
      options: answerOptions,
      correctLetter: answerOptions.find((option) => option.correct).letter,
    };
  }
  return null;
}

/** Aufgabensatz für einen kompletten Durchgang. */
export function generateFigureSet(count, difficulty = 'medat', options = {}) {
  const tasks = [];
  const seen = new Set();
  let guard = 0;
  while (tasks.length < count && guard < count * 30) {
    guard += 1;
    const task = generateFigureTask({
      difficulty,
      pieceCount: options.pieceCounts?.length ? Number(pick(options.pieceCounts)) : undefined,
    });
    if (!task) continue;
    const id = shapeId(task.target);
    if (seen.has(id)) continue;
    seen.add(id);
    tasks.push({ ...task, index: tasks.length });
  }
  return tasks;
}
