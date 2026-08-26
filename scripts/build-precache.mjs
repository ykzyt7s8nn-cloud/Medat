/*
 * Erzeugt nach dem Vite-Build eine Liste aller ausgelieferten Dateien
 * (dist/precache.json). Der Service Worker lädt diese Liste beim Installieren
 * und legt alles im Cache ab.
 *
 * Dadurch funktioniert die App nach dem ersten Laden vollständig offline –
 * auch Untertests, die man vorher noch nie geöffnet hat (sie liegen wegen des
 * Lazy Loadings in eigenen Bundles).
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const EXCLUDED = new Set(['sw.js', 'precache.json']);

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const full = join(directory, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(DIST)
  .map((file) => relative(DIST, file).split(sep).join('/'))
  .filter((file) => !EXCLUDED.has(file))
  // index.html wird als './' zusätzlich geführt (Navigations-Fallback)
  .map((file) => `./${file}`);

const urls = ['./', ...files];
writeFileSync(join(DIST, 'precache.json'), JSON.stringify(urls, null, 2));
process.stdout.write(`precache: ${urls.length} Dateien\n`);
