/**
 * Sicherung und Wiederherstellung der lokalen Daten.
 *
 * Der gesamte Fortschritt liegt im localStorage des Browsers. Der kann
 * verloren gehen – durch "Website-Daten löschen", ein neues Gerät oder die
 * automatische Aufräumung von Safari bei lange ungenutzten Seiten. Deshalb
 * lässt sich alles als JSON-Datei sichern und wieder einspielen.
 *
 * Die Datei enthält ausschließlich Übungsdaten: KFF-Ergebnisse, Kategorie-
 * Statistik, BMS-Fortschritt und Einstellungen. Keine Namen, keine Geräte-
 * Informationen.
 *
 * Version 2 sichert zusätzlich den BMS-Fortschritt. Ältere Dateien lassen sich
 * weiterhin einspielen – der BMS-Teil bleibt dann unangetastet.
 */
import { BMS_PROGRESS_KEY } from '../store/useBmsProgress.js';
import { PROGRESS_KEY } from '../store/useProgress.js';
import { SETTINGS_KEY } from '../store/useSettings.js';

export const BACKUP_FORMAT = 'medat-kff-backup';
export const BACKUP_VERSION = 2;

/** Alle sicherungswürdigen Daten als Objekt. */
export function collectBackup() {
  const read = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress: read(PROGRESS_KEY),
    settings: read(SETTINGS_KEY),
    bms: read(BMS_PROGRESS_KEY),
  };
}

/** Sicherung als eingerückter JSON-Text. */
export function backupToText() {
  return JSON.stringify(collectBackup(), null, 2);
}

/** Dateiname mit Datum, z. B. medat-kff-2026-08-26.json */
export function backupFileName(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `medat-kff-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;
}

/**
 * Prüft eine eingelesene Sicherung.
 * @returns {{ok: true, data: object, summary: object} | {ok: false, error: string}}
 */
export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Die Datei ist kein gültiges JSON.' };
  }
  if (!data || typeof data !== 'object') return { ok: false, error: 'Die Datei ist leer oder unlesbar.' };
  if (data.format !== BACKUP_FORMAT) {
    return { ok: false, error: 'Das ist keine Sicherung dieser App.' };
  }
  if (!data.progress && !data.settings && !data.bms) {
    return { ok: false, error: 'Die Sicherung enthält keine Daten.' };
  }

  const history = data.progress?.state?.history ?? [];
  const tagStats = data.progress?.state?.tagStats ?? {};
  const bmsHistory = data.bms?.state?.history ?? [];
  const readEntries = data.bms?.state?.readEntries ?? {};
  return {
    ok: true,
    data,
    summary: {
      exercises: Array.isArray(history) ? history.length : 0,
      tests: Object.keys(tagStats).length,
      bmsQuizzes: Array.isArray(bmsHistory) ? bmsHistory.length : 0,
      bmsRead: Object.values(readEntries).filter(Boolean).length,
      exportedAt: data.exportedAt ?? null,
      hasSettings: Boolean(data.settings),
    },
  };
}

/**
 * Spielt eine geprüfte Sicherung ein. Die Seite muss danach neu geladen
 * werden, damit die Stores den neuen Stand lesen.
 */
export function applyBackup(data) {
  if (data.progress) localStorage.setItem(PROGRESS_KEY, JSON.stringify(data.progress));
  if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
  if (data.bms) localStorage.setItem(BMS_PROGRESS_KEY, JSON.stringify(data.bms));
}

/**
 * Bittet den Browser, die Daten dauerhaft zu behalten.
 *
 * Ohne diese Zusage dürfen Browser Website-Daten bei Platzmangel oder langer
 * Nichtnutzung löschen. Der Aufruf ist ein Wunsch, keine Garantie – Safari
 * gewährt ihn zum Beispiel eher, wenn die App zum Home-Bildschirm hinzugefügt
 * wurde.
 */
export async function requestPersistentStorage() {
  try {
    if (!navigator.storage?.persist) return { supported: false, granted: false };
    const already = await navigator.storage.persisted?.();
    if (already) return { supported: true, granted: true };
    return { supported: true, granted: await navigator.storage.persist() };
  } catch {
    return { supported: false, granted: false };
  }
}
