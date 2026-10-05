/**
 * Klicktest der ganzen App im Browser.
 *
 * Ergänzt den Selbsttest um das, was nur im Browser auffällt: Laufzeitfehler,
 * Fehlermeldungen in der Konsole, Inhalte, die über den Bildschirmrand ragen,
 * abgeschnittener Text, überlappende Bedienelemente, zu schwacher Kontrast im
 * Dunkelmodus und Zahlen, die als „9.799999“ oder „NaN“ auf dem Schirm landen.
 *
 * Gefahren wird mit Touch-Eingabe (hasTouch, isMobile) auf 390 × 844 und
 * 320 × 568, jeweils hell und dunkel: jeder Untertest mit Antworten,
 * Überspringen, Markieren, Zurück, Abgabe und Rückblick, Übungs- und
 * Prüfungsmodus, der BMS-Bereich samt Lexikon, Suche, Quiz je Fach,
 * Aussagenkombination, Tägliche 10, Fehlerarchiv und Simulation, dazu
 * Statistik, Einstellungen, Info und Datensicherung. Am Ende wird neu geladen
 * und geprüft, ob die Ergebnisse noch da sind.
 *
 *   node scripts/smoketest.mjs
 *
 * Playwright ist bewusst keine Abhängigkeit des Projekts. Das Skript lädt es
 * aus PLAYWRIGHT_MODULE (Pfad zum Paketordner) oder, falls nicht gesetzt, aus
 * /opt/node-tools/node_modules/playwright. Den Entwicklungsserver startet und
 * beendet es selbst (Port über SMOKE_PORT, Standard 5182). SMOKE_SHOTS=<Ordner>
 * legt dort zu jeder Auffälligkeit ein Bildschirmfoto ab.
 *
 * Exit-Code 0, wenn nichts auffiel, sonst 1.
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAYWRIGHT = process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright';
const PORT = Number(process.env.SMOKE_PORT || 5182);
const BASE = `http://localhost:${PORT}/`;
const SHOTS = process.env.SMOKE_SHOTS || '';

const VARIANTS = [
  { name: '390x844 hell', viewport: { width: 390, height: 844 }, colorScheme: 'light' },
  { name: '390x844 dunkel', viewport: { width: 390, height: 844 }, colorScheme: 'dark' },
  { name: '320x568 hell', viewport: { width: 320, height: 568 }, colorScheme: 'light' },
  { name: '320x568 dunkel', viewport: { width: 320, height: 568 }, colorScheme: 'dark' },
];

/**
 * Unter diesem Kontrastverhältnis gilt Text im Dunkelmodus als unlesbar.
 * Bewusst niedriger als WCAG: Weiß auf iOS-Orange (2,2) ist gewollt und
 * lesbar, schwarzer Text auf dunklem Grund (um 1,2) nicht.
 */
const MIN_DARK_CONTRAST = 2;

let chromium;
try {
  ({ chromium } = require(PLAYWRIGHT));
} catch (error) {
  console.error(`Playwright nicht gefunden unter ${PLAYWRIGHT} – PLAYWRIGHT_MODULE setzen.\n${error.message}`);
  process.exit(2);
}

/* --------------------------------------------------------------- Server */

async function startServer() {
  const vite = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
  const server = spawn(process.execPath, [vite, '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  server.stdout.on('data', (chunk) => { log += chunk; });
  server.stderr.on('data', (chunk) => { log += chunk; });
  for (let i = 0; i < 100; i += 1) {
    if (server.exitCode !== null) throw new Error(`Entwicklungsserver beendet:\n${log}`);
    try {
      const response = await fetch(BASE);
      if (response.ok) return server;
    } catch { /* noch nicht bereit */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  server.kill();
  throw new Error(`Entwicklungsserver antwortet nicht:\n${log}`);
}

/* ------------------------------------------------------------- Prüfungen */

/**
 * Läuft im Browser und sammelt Darstellungsprobleme des aktuellen Bildschirms.
 * Gemessen wird am sichtbaren Ausschnitt jedes Elements, also nach Abzug
 * dessen, was ein umgebender Scrollbereich ohnehin verdeckt.
 */
function auditPage({ dark, minContrast }) {
  const issues = [];
  const vw = window.innerWidth;
  const describe = (el) => {
    const label = el.getAttribute('aria-label') || el.innerText || el.textContent || '';
    return `<${el.tagName.toLowerCase()}> „${label.replace(/\s+/g, ' ').trim().slice(0, 50)}“`;
  };
  const visibleNow = (el) => {
    const style = getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none' && el.getClientRects().length > 0;
  };
  /** Nur für VoiceOver da (sr-only, auch als max-[…]:sr-only): 1 × 1 px, gekappt. */
  const isSrOnly = (el) => {
    for (let node = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.position === 'absolute' && parseFloat(style.width) <= 1 && style.overflow === 'hidden') return true;
    }
    return false;
  };

  /** Sichtbarer Ausschnitt: Rechteck geschnitten mit allen kappenden Vorfahren. */
  const clippedRect = (el) => {
    const r = el.getBoundingClientRect();
    let { left, right, top, bottom } = r;
    for (let node = el.parentElement; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.overflowX !== 'visible' || style.overflowY !== 'visible') {
        const p = node.getBoundingClientRect();
        if (style.overflowX !== 'visible') { left = Math.max(left, p.left); right = Math.min(right, p.right); }
        if (style.overflowY !== 'visible') { top = Math.max(top, p.top); bottom = Math.min(bottom, p.bottom); }
      }
    }
    return { left, right, top, bottom, width: right - left, height: bottom - top };
  };
  /**
   * Gewollt seitlich scrollende Leisten (Aufgabenleiste, Fächer-Chips). Am
   * berechneten Stil allein nicht zu erkennen: Ein senkrechter Scrollbereich
   * hat automatisch auch overflow-x: auto. Deshalb zählt die Tailwind-Klasse.
   */
  const isHorizontalScroller = (node) => /\boverflow-x-(auto|scroll)\b/.test(node.className?.baseVal ?? node.className ?? '');
  const insideHorizontalScroller = (el) => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      if (isHorizontalScroller(node)) return true;
    }
    return false;
  };

  // 1. Seite breiter als der Bildschirm
  const scrollWidth = document.documentElement.scrollWidth;
  if (scrollWidth > vw + 1) issues.push(`horizontaler Overflow: scrollWidth ${scrollWidth} > ${vw}`);

  const all = [...document.body.querySelectorAll('*')].filter((el) => !isSrOnly(el) && visibleNow(el));

  // 1b. Senkrechte Scrollbereiche, die auch seitlich scrollen
  for (const el of all) {
    const style = getComputedStyle(el);
    if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && !isHorizontalScroller(el)
        && el.scrollWidth > el.clientWidth + 1) {
      issues.push(`Scrollbereich seitlich verschiebbar (${el.scrollWidth} > ${el.clientWidth}): ${describe(el)}`);
    }
  }

  // 2. Elemente über den rechten/linken Rand hinaus (außer in seitlichen Scrollbereichen)
  for (const el of all) {
    if (el instanceof SVGElement && el.tagName.toLowerCase() !== 'svg') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if ((r.right > vw + 1 || r.left < -1) && !insideHorizontalScroller(el)) {
      // Nur das äußerste betroffene Element melden
      const parent = el.parentElement?.getBoundingClientRect();
      if (parent && (parent.right > vw + 1 || parent.left < -1)) continue;
      issues.push(`ragt über den Rand (${Math.round(r.left)}–${Math.round(r.right)} bei ${vw}): ${describe(el)}`);
    }
  }

  // 3. Abgeschnittener Text: Inhalt breiter als die Box, gekappt, ohne Auslassungspunkte
  for (const el of all) {
    if (!(el instanceof HTMLElement) || !el.innerText?.trim()) continue;
    const style = getComputedStyle(el);
    if (style.overflowX !== 'hidden' && style.overflowX !== 'clip') continue;
    if (style.textOverflow === 'ellipsis' || el.closest('[style*="line-clamp"], .line-clamp-2, .line-clamp-3')) continue;
    if (el.scrollWidth > el.clientWidth + 2 && !insideHorizontalScroller(el)) {
      issues.push(`Text abgeschnitten (${el.scrollWidth} > ${el.clientWidth}): ${describe(el)}`);
    }
  }

  // 4. Überlappende Bedienelemente
  const controls = all.filter((el) => el.matches('button, [role=button], [role=radio], [role=switch], input:not([type=checkbox]), select, textarea'));
  const boxes = controls.map((el) => ({ el, r: clippedRect(el) })).filter(({ r }) => r.width > 2 && r.height > 2);
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const b = boxes[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (w > 3 && h > 3) issues.push(`Überlappung (${Math.round(w)}×${Math.round(h)} px): ${describe(a.el)} / ${describe(b.el)}`);
    }
  }

  // 5. Kontrast im Dunkelmodus
  if (dark) {
    const parse = (color) => {
      const m = color.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return { r, g, b, a };
    };
    const over = (top, bottom) => ({
      r: top.r * top.a + bottom.r * (1 - top.a),
      g: top.g * top.a + bottom.g * (1 - top.a),
      b: top.b * top.a + bottom.b * (1 - top.a),
      a: 1,
    });
    const luminance = ({ r, g, b }) => {
      const channel = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    /** Hintergrund hinter dem Element; null, wenn ein Verlauf oder Bild darunter liegt. */
    const backgroundOf = (el) => {
      const layers = [];
      for (let node = el; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.backgroundImage !== 'none') return null;
        const color = parse(style.backgroundColor);
        if (color && color.a > 0) {
          layers.push(color);
          if (color.a >= 1) break;
        }
      }
      let result = { r: 0, g: 0, b: 0, a: 1 };
      for (let i = layers.length - 1; i >= 0; i -= 1) result = over(layers[i], result);
      return result;
    };
    const seen = new Set();
    for (const el of all) {
      // Nur echte Wörter und Zahlen; ein Platzhalter wie „–“ darf blass sein.
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && /[\p{L}\p{N}]/u.test(n.textContent));
      if (!hasText || el.closest('[disabled], [aria-disabled=true]')) continue;
      let dimmed = false;
      for (let node = el; node; node = node.parentElement) {
        if (Number(getComputedStyle(node).opacity) < 0.95) { dimmed = true; break; }
      }
      if (dimmed) continue;
      const fg = parse(getComputedStyle(el).color);
      const bg = backgroundOf(el);
      if (!fg || !bg) continue;
      const text = over(fg, bg);
      const [l1, l2] = [luminance(text), luminance(bg)].sort((x, y) => y - x);
      const ratio = (l1 + 0.05) / (l2 + 0.05);
      if (ratio < minContrast) {
        const key = `${getComputedStyle(el).color}|${el.className}`;
        if (seen.has(key)) continue;
        seen.add(key);
        issues.push(`Kontrast ${ratio.toFixed(2)}: ${describe(el)} (${getComputedStyle(el).color})`);
      }
    }
  }

  // 6. Zahlen und Werte, die so nicht auf den Schirm gehören
  const text = document.body.innerText;
  const leaks = text.match(/NaN|undefined|\[object Object\]|Infinity|(?<![\d.])\d+\.\d{3,}(?![\d.])/g);
  if (leaks) issues.push(`verdächtiger Text: ${[...new Set(leaks)].join(', ')}`);

  return issues;
}

/* ---------------------------------------------------------------- Ablauf */

const findings = [];

async function runVariant(browser, variant) {
  const context = await browser.newContext({
    viewport: variant.viewport,
    colorScheme: variant.colorScheme,
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
    locale: 'de-AT',
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const dark = variant.colorScheme === 'dark';
  let where = 'Start';

  const report = (kind, message) => {
    const key = `${variant.name}|${kind}|${where}|${message}`;
    if (findings.some((f) => f.key === key)) return;
    findings.push({ key, variant: variant.name, where, kind, message });
    if (process.env.SMOKE_VERBOSE) console.log(`  [${variant.name}] ${where} · ${kind}: ${message}`);
  };
  page.on('pageerror', (error) => report('pageerror', error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') report('console.error', message.text());
  });
  page.on('dialog', (dialog) => dialog.accept());

  const pause = (ms) => page.waitForTimeout(ms);
  const has = async (locator) => (await locator.count()) > 0 && locator.first().isVisible();
  const button = (name, exact = false) => page.getByRole('button', { name, exact }).first();
  /**
   * Tippt wie ein Finger. Vorher in Ruhe ins Bild scrollen: Ein Tipp direkt
   * nach einem Scrollschritt wird vom Tipp-Wächter mit Absicht verworfen.
   */
  const tap = async (locator, { optional = false } = {}) => {
    try {
      if (optional && !(await has(locator))) return false;
      await locator.scrollIntoViewIfNeeded({ timeout: 8000 });
      await pause(150);
      await locator.tap({ timeout: 4000 });
      await pause(250);
      return true;
    } catch (error) {
      if (!optional) report('Bedienung', `nicht tippbar: ${locator} (${error.message.split('\n')[0]})`);
      return false;
    }
  };
  const check = async (label) => {
    where = label;
    await pause(250);
    const t0 = Date.now();
    const issues = await page.evaluate(auditPage, { dark, minContrast: MIN_DARK_CONTRAST });
    if (process.env.SMOKE_VERBOSE) console.log(`${variant.name} · ${label} (Prüfung ${Date.now() - t0} ms)`);
    for (const issue of issues) report('Darstellung', issue);
    if (issues.length && SHOTS) {
      const file = path.join(SHOTS, `${variant.name}-${label}`.replace(/[^\wäöüÄÖÜ-]+/g, '_') + '.png');
      await page.screenshot({ path: file });
    }
  };
  const tab = (name) => tap(page.getByRole('navigation').getByRole('button', { name, exact: true }));
  const radio = (name) => tap(page.getByRole('radio', { name, exact: true }).first());
  const closeScreen = async () => {
    if (!(await tap(button('Schließen', true), { optional: true }))) await tap(button('Fertig', true), { optional: true });
    // Laufende Übung: Rückfrage bestätigen, falls die App eine stellt
    await tap(button(/^(Beenden|Verwerfen|Abbrechen und schließen)$/), { optional: true });
  };

  /**
   * Der übliche Gang durch einen Untertest: beantworten, weiter,
   * überspringen, markieren, zurück, abgeben, Rückblick.
   */
  const workThrough = async (label, answer) => {
    await check(`${label} – Aufgabe 1`);
    await answer();
    await check(`${label} – beantwortet`);
    if (!(await tap(button('Weiter', true), { optional: true }))) await tap(button('Überspringen', true), { optional: true });
    await tap(button('Überspringen', true), { optional: true });
    await tap(button('Merken', true), { optional: true });
    await answer();
    await tap(button('Vorherige Aufgabe', true), { optional: true });
    await tap(page.getByRole('tab', { name: /^Aufgabe 1,/ }).first(), { optional: true });
    await check(`${label} – Navigation`);
    const submit = page.getByRole('button', { name: /^(Trotzdem auswerten|Trotzdem abgeben|Auswerten|Abgeben)$/ }).last();
    await tap(submit);
    await pause(300);
    await check(`${label} – Ergebnis`);
    // Erste Aufgabe im Rückblick aufklappen
    const review = page.getByRole('button', { name: /^1\s/ }).first();
    if (await tap(review, { optional: true })) await check(`${label} – Rückblick`);
  };

  /**
   * Eine laufende Simulation lässt sich bewusst nicht einfach schließen –
   * also jeden Abschnitt abgeben, bis die Gesamtauswertung kommt.
   */
  const finishSimulation = async (label, done) => {
    const next = page.getByRole('button', {
      name: /^(Lernphase beenden|Pause überspringen.*|Trotzdem auswerten|Trotzdem abgeben|Auswerten|Abgeben|Weiter.*)$/,
    }).last();
    for (let step = 0; step < 16; step += 1) {
      if (await has(page.getByText(done))) break;
      // Die Lernphase der Simulation lässt sich wie im Test nicht abkürzen
      if (await has(page.getByRole('tab', { name: 'Ausweis 1', exact: true })) && !(await has(button('Lernphase beenden', true)))) {
        await page.clock.fastForward('08:05');
        await pause(400);
        continue;
      }
      if (!(await tap(next, { optional: true }))) await pause(500);
      if (step % 3 === 0) await check(`${label} – Abschnitt ${step + 1}`);
    }
    if (await has(page.getByText(done))) await check(`${label} – Gesamtergebnis`);
    else {
      report('Bedienung', `${label}: Gesamtauswertung nicht erreicht`);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${variant.name}-${label}-haengt.png`.replace(/\s+/g, '_')) });
    }
  };

  const openTest = async (name) => {
    await tab('Üben');
    await tap(button(`${name} üben`));
    await check(`${name} – Einstieg`);
    await tap(button(/starten/i));
  };

  const answerOption = (letter = 'a') => async () => {
    await tap(page.getByRole('button', { name: new RegExp(`^(Antwort|Figur) ${letter}`) }).first(), { optional: true });
  };

  // Uhr unter Kontrolle des Tests, sie läuft aber normal weiter. Gebraucht
  // für die Lernphase der Simulation (8 min) und das Fehlerarchiv (Tage).
  await page.clock.install();
  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await pause(800);
  await check('Startseite');

  /* ------------------------------------------------------------ KFF */
  await openTest('Figuren zusammensetzen');
  await workThrough('Figuren', answerOption('a'));
  await closeScreen();

  await openTest('Gedächtnis & Merkfähigkeit');
  await check('Gedächtnis – Lernphase');
  await tap(page.getByRole('tab', { name: 'Ausweis 2', exact: true }));
  await check('Gedächtnis – Ausweis');
  await tap(button('Lernphase beenden', true));
  await check('Gedächtnis – Pause');
  await tap(button(/Pause überspringen/));
  await workThrough('Gedächtnis', answerOption('b'));
  await closeScreen();

  await openTest('Zahlenfolgen');
  await workThrough('Zahlenfolgen', async () => {
    if (!(await has(button('Prüfen', true)))) return;
    await tap(button('Achte Zahl', true), { optional: true });
    await tap(button('1', true), { optional: true });
    await tap(button('2', true), { optional: true });
    await tap(button('Neunte Zahl', true), { optional: true });
    await tap(button('Vorzeichen wechseln', true), { optional: true });
    await tap(button('3', true), { optional: true });
    await tap(button('Prüfen', true), { optional: true });
  });
  await closeScreen();

  await openTest('Wortflüssigkeit');
  await workThrough('Wortflüssigkeit', answerOption('c'));
  await closeScreen();

  await openTest('Implikationen erkennen');
  await workThrough('Implikationen', answerOption('a'));
  await closeScreen();

  /* ------------------------------------------------- TV und SEK */
  await openTest('Textverständnis');
  await tap(page.getByRole('button', { name: /Einklappen|Ausklappen/ }).first(), { optional: true });
  await check('Textverständnis – Text eingeklappt');
  await tap(page.getByRole('button', { name: /Einklappen|Ausklappen/ }).first(), { optional: true });
  await workThrough('Textverständnis', answerOption('a'));
  await closeScreen();

  const answerRecognise = async () => {
    const yes = page.getByRole('button', { name: 'eher ja', exact: true });
    const no = page.getByRole('button', { name: 'eher nein', exact: true });
    const count = await yes.count();
    for (let i = 0; i < count; i += 1) await tap(i % 2 ? no.nth(i) : yes.nth(i), { optional: true });
    await tap(button('Prüfen', true), { optional: true });
  };
  await openTest('Emotionen erkennen');
  await workThrough('Emotionen erkennen', answerRecognise);
  await closeScreen();

  await openTest('Emotionen regulieren');
  await workThrough('Emotionen regulieren', async () => {
    await answerOption('a')();
    await tap(button('Prüfen', true), { optional: true });
  });
  await closeScreen();

  /** Reiht die Überlegungen so, wie sie dastehen – das gibt fast immer Teilpunkte. */
  const answerDecision = async () => {
    for (let i = 0; i < 5; i += 1) {
      const open = page.getByRole('button', { name: /, noch kein Platz$/ }).first();
      if (!(await has(open))) break;
      await tap(open, { optional: true });
    }
    await tap(button('Prüfen', true), { optional: true });
  };
  await openTest('Soziales Entscheiden');
  await workThrough('Soziales Entscheiden', answerDecision);
  const decisionResult = await page.locator('body').innerText();
  await closeScreen();

  /* ----------------------------------- Einstellungen und Prüfungsmodus */
  await tab('Einstellungen');
  await check('Einstellungen');
  await radio('Prüfung');
  await radio('Schwer');
  await tap(page.getByRole('switch', { name: /^Timer für/ }).first(), { optional: true });
  await check('Einstellungen – Prüfung');

  await openTest('Soziales Entscheiden');
  await workThrough('Soziales Entscheiden (Prüfung)', answerDecision);
  const examResult = await page.locator('body').innerText();
  await closeScreen();
  await openTest('Implikationen erkennen');
  await workThrough('Implikationen (Prüfung)', answerOption('b'));
  await closeScreen();

  await tab('Einstellungen');
  await radio('Übung');
  await radio('Dunkel');
  await check('Einstellungen – Erscheinungsbild Dunkel');
  await radio('System');

  // Teilpunkte: im Rückblick „0,9 von 1 Punkt“, nie „0.9“ oder lange Brüche
  const partial = `${decisionResult}\n${examResult}`.match(/(\S+) von 1 Punkt/g) ?? [];
  if (partial.length === 0) report('Teilpunkte', 'Rückblick „Soziales Entscheiden“ zeigt keine Punkte je Aufgabe');
  for (const text of partial) {
    if (!/^(0|1|0,\d) von/.test(text)) report('Teilpunkte', `falsch formatiert: „${text}“`);
  }
  if (/\d\.\d+\s*(\/|von)/.test(`${decisionResult}\n${examResult}`)) {
    report('Teilpunkte', 'Punkte mit Dezimalpunkt statt Komma');
  }

  /* -------------------------------------------------------------- BMS */
  await tab('BMS');
  await check('BMS – Lexikon');
  await tap(button('Physik', true));
  await check('BMS – Lexikon Physik');
  await tap(button('Geschwindigkeit und Beschleunigung'));
  await check('BMS – Lexikoneintrag');
  // Formeln sind Strings; leere Kästen hießen, die Ansicht liest ein falsches Feld
  const formulas = await page.locator('section', { hasText: 'Formeln' }).locator('li').allInnerTexts();
  if (formulas.length === 0 || formulas.some((text) => !text.trim())) {
    report('Lexikon', `Formeln leer oder fehlend (${JSON.stringify(formulas)})`);
  }
  await tap(page.getByRole('button', { name: /Die Newtonschen Gesetze|Kräfte/ }).last(), { optional: true });
  await check('BMS – Querverweis');
  await closeScreen();
  await tab('BMS');
  await page.getByLabel('Lexikon durchsuchen').fill('Enzym');
  await pause(400);
  await check('BMS – Suche');
  await page.getByLabel('Lexikon durchsuchen').fill('');

  await radio('Quiz');
  await check('BMS – Quiz');

  const answerBms = async () => {
    for (let i = 0; i < 5; i += 1) {
      const pending = button(/^Noch \d auswählen$/);
      const options = page.getByRole('button', { name: /^Antwort [a-e]/ });
      if (!(await has(pending)) && i > 0) break;
      await tap(options.nth(i), { optional: true });
    }
    await tap(button('Prüfen', true), { optional: true });
  };

  let sawCombination = false;
  for (const subject of ['Biologie', 'Chemie', 'Physik', 'Mathematik']) {
    await tab('BMS');
    await radio('Quiz');
    await tap(page.getByRole('button', { name: new RegExp(`^${subject}\\b.*Fragen in`) }).first());
    await check(`BMS ${subject} – Frage 1`);
    await answerBms();
    await check(`BMS ${subject} – aufgelöst`);
    // Eine Aussagenkombination suchen (I., II. … untereinander)
    const count = await page.getByRole('tab', { name: /^Aufgabe \d+,/ }).count();
    for (let i = 2; i <= count && !sawCombination; i += 1) {
      const target = page.getByRole('tab', { name: new RegExp(`^Aufgabe ${i},`) }).first();
      await target.scrollIntoViewIfNeeded();
      await pause(150);
      await target.tap();
      await pause(120);
      if (await page.locator('ol li').count() >= 2) {
        sawCombination = true;
        await check(`BMS ${subject} – Aussagenkombination`);
        await answerBms();
        await check(`BMS ${subject} – Aussagenkombination aufgelöst`);
      }
    }
    await tap(page.getByRole('button', { name: /^(Trotzdem auswerten|Auswerten)$/ }).last());
    await check(`BMS ${subject} – Ergebnis`);
    await tap(page.getByRole('button', { name: /^1\s/ }).first(), { optional: true });
    await check(`BMS ${subject} – Rückblick`);
    await closeScreen();
  }
  if (!sawCombination) report('Bedienung', 'keine BMS-Aussagenkombination (I., II. …) gefunden');

  await tab('BMS');
  await radio('Quiz');
  await tap(page.getByRole('button', { name: /^Themen in Chemie wählen/ }));
  await check('BMS – Themenwahl');
  await closeScreen();

  await tab('BMS');
  await radio('Quiz');
  await tap(page.getByRole('button', { name: /^Tägliche 10/ }));
  await check('BMS – Tägliche 10');
  await answerBms();
  await tap(page.getByRole('button', { name: /^(Trotzdem auswerten|Auswerten)$/ }).last());
  await check('BMS – Tägliche 10 Ergebnis');
  await closeScreen();

  await tab('BMS');
  await radio('Quiz');
  await tap(page.getByRole('button', { name: /^BMS-Simulation/ }));
  await check('BMS-Simulation – Einstieg');
  await tap(button(/starten/i));
  await check('BMS-Simulation – läuft');
  await answerBms();
  await finishSimulation('BMS-Simulation', /BMS – Gesamtauswertung|BMS-Gesamtergebnis/);
  await closeScreen();

  /* ------------------------------------------------ KFF-Simulation */
  await tab('Üben');
  await tap(page.getByRole('button', { name: /^KFF-Simulation/ }));
  await check('KFF-Simulation – Einstieg');
  await tap(button(/starten/i));
  await check('KFF-Simulation – läuft');
  await finishSimulation('KFF-Simulation', /KFF-Gesamtergebnis/);
  await closeScreen();

  /* -------------------------------------------- Statistik, Info, Sicherung */
  await tab('Statistik');
  await check('Statistik');
  const statsBefore = await page.locator('body').innerText();
  await tab('Info');
  await check('Info');

  await tab('Einstellungen');
  const download = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
  await tap(button('Sichern', true));
  const file = await download;
  await check('Einstellungen – Sicherung');
  if (!file) report('Sicherung', 'Sichern hat keine Datei geliefert');
  else {
    await page.getByLabel('Sicherungsdatei auswählen').setInputFiles(await file.path());
    await pause(300);
    await check('Einstellungen – Sicherung einspielen');
    await tap(button('Ersetzen', true));
    await pause(300);
    await check('Einstellungen – Sicherung eingespielt');
  }

  /* ------------------------------------------- Fehlerarchiv nach zwei Tagen */
  await page.clock.fastForward('48:00:00');
  await tab('Statistik');
  await tab('BMS');
  await radio('Quiz');
  const archive = page.getByRole('button', { name: /^Fehlerarchiv/ });
  if (!(await has(archive))) report('Fehlerarchiv', 'Eintrag nicht gefunden');
  else if (await archive.isDisabled()) report('Fehlerarchiv', 'nach zwei Tagen nichts fällig, obwohl falsch geantwortet wurde');
  else {
    await tap(archive);
    await check('BMS – Fehlerarchiv');
    await answerBms();
    await tap(page.getByRole('button', { name: /^(Trotzdem auswerten|Auswerten)$/ }).last());
    await check('BMS – Fehlerarchiv Ergebnis');
    await closeScreen();
  }

  /* -------------------------------------------------------- Persistenz */
  await page.reload();
  await pause(800);
  await tab('Statistik');
  await check('Statistik nach Neuladen');
  const statsAfter = await page.locator('body').innerText();
  const results = (text) => (text.match(/\d+(,\d)?\/\d+/g) ?? []).length;
  if (results(statsBefore) === 0) report('Persistenz', 'Statistik zeigt nach den Übungen keine Ergebnisse');
  if (results(statsAfter) < results(statsBefore)) {
    report('Persistenz', `Statistik nach Neuladen unvollständig (${results(statsAfter)} statt ${results(statsBefore)} Ergebnisse)`);
  }

  await context.close();
}

/* ------------------------------------------------------------- Ausführung */

if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const server = await startServer();
const browser = await chromium.launch();
try {
  const only = process.env.SMOKE_VARIANTS;
  for (const variant of VARIANTS.filter((v) => !only || only.split(',').includes(v.name))) {
    const started = Date.now();
    try {
      await runVariant(browser, variant);
    } catch (error) {
      findings.push({ variant: variant.name, where: '–', kind: 'Abbruch', message: error.message.split('\n')[0] });
    }
    console.log(`${variant.name}: ${Math.round((Date.now() - started) / 1000)} s`);
  }
} finally {
  await browser.close();
  server.kill();
}

if (findings.length === 0) {
  console.log('\nKlicktest: keine Auffälligkeiten.');
  process.exit(0);
}
console.log(`\nKlicktest: ${findings.length} Auffälligkeiten\n`);
for (const f of findings) console.log(`[${f.variant}] ${f.where} · ${f.kind}: ${f.message}`);
process.exit(1);
