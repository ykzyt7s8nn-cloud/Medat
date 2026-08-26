/*
 * Erzeugt die PWA-Icons als PNG - ohne externe Abhaengigkeiten.
 *
 * Gezeichnet wird ein abgerundetes Quadrat im iOS-Stil mit blauem Verlauf und
 * einem weissen medizinischen Kreuz. Die Dateien landen in public/icons/ und
 * werden vom Build (npm run build) automatisch neu erzeugt.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public/icons');

const crcTable = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, crc]);
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // Filter: None
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Weiche Kante fuer Anti-Aliasing: 0 ausserhalb, 1 innerhalb. */
function coverage(distance, edge = 1) {
  return Math.min(1, Math.max(0, 0.5 - distance / edge));
}

function roundedRectDistance(x, y, size, radius, inset) {
  const min = inset;
  const max = size - inset;
  const cx = Math.min(Math.max(x, min + radius), max - radius);
  const cy = Math.min(Math.max(y, min + radius), max - radius);
  return Math.hypot(x - cx, y - cy) - radius;
}

function blend(dst, i, r, g, b, a) {
  const inv = 1 - a;
  dst[i] = Math.round(r * a + dst[i] * inv);
  dst[i + 1] = Math.round(g * a + dst[i + 1] * inv);
  dst[i + 2] = Math.round(b * a + dst[i + 2] * inv);
  dst[i + 3] = Math.round(255 * a + dst[i + 3] * inv);
}

function drawIcon(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4, 0);
  const inset = maskable ? size * 0.06 : 0;
  const radius = maskable ? size * 0.5 : size * 0.225;
  const armThickness = size * 0.16;
  const armLength = size * (maskable ? 0.42 : 0.5);
  const center = size / 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const px5 = x + 0.5;
      const py5 = y + 0.5;

      // Hintergrund: abgerundetes Quadrat mit vertikalem Blauverlauf
      const bgAlpha = coverage(roundedRectDistance(px5, py5, size, radius, inset));
      if (bgAlpha > 0) {
        const t = y / size;
        const r = Math.round(0 + 10 * t);
        const g = Math.round(122 - 30 * t);
        const b = Math.round(255 - 40 * t);
        blend(px, i, r, g, b, bgAlpha);
      }

      // Weisses Kreuz
      const dx = Math.abs(px5 - center);
      const dy = Math.abs(py5 - center);
      const inVertical = dx <= armThickness / 2 && dy <= armLength / 2;
      const inHorizontal = dy <= armThickness / 2 && dx <= armLength / 2;
      if (inVertical || inHorizontal) {
        const edgeDist = inVertical
          ? Math.max(dx - armThickness / 2, dy - armLength / 2)
          : Math.max(dy - armThickness / 2, dx - armLength / 2);
        blend(px, i, 255, 255, 255, coverage(edgeDist));
      }
    }
  }
  return encodePng(size, size, px);
}

mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['icon-maskable-512.png', 512, { maskable: true }],
  ['apple-touch-icon.png', 180, {}],
];

for (const [name, size, options] of targets) {
  writeFileSync(resolve(OUT_DIR, name), drawIcon(size, options));
  process.stdout.write(`icon: ${name} (${size}x${size})\n`);
}
