/**
 * Datensicherung in den Einstellungen.
 *
 * Export als JSON-Datei, zusätzlich als Text zum Kopieren – in einer zum
 * Home-Bildschirm hinzugefügten Web-App ist ein Datei-Download auf dem iPhone
 * nicht immer möglich, der Umweg über die Zwischenablage dagegen schon.
 *
 * Der Import zeigt erst, was in der Sicherung steckt, und ersetzt die aktuellen
 * Daten erst nach ausdrücklicher Bestätigung.
 */
import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import {
  applyBackup,
  backupFileName,
  backupToText,
  parseBackup,
  requestPersistentStorage,
} from '../lib/backup.js';

function formatDate(iso) {
  if (!iso) return 'unbekannt';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? 'unbekannt'
    : date.toLocaleString('de-AT', { dateStyle: 'medium', timeStyle: 'short' });
}

export function BackupSection() {
  const fileInput = useRef(null);
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState(null);
  const [showText, setShowText] = useState(false);
  const [persistence, setPersistence] = useState(null);

  useEffect(() => {
    let active = true;
    requestPersistentStorage().then((result) => { if (active) setPersistence(result); });
    return () => { active = false; };
  }, []);

  const exportFile = () => {
    try {
      const blob = new Blob([backupToText()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = backupFileName();
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus({ kind: 'ok', text: `Sicherung als ${backupFileName()} erstellt.` });
    } catch {
      setStatus({ kind: 'error', text: 'Download nicht möglich – nutze „Als Text kopieren“.' });
    }
  };

  const copyText = async () => {
    const text = backupToText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus({ kind: 'ok', text: 'Sicherung in die Zwischenablage kopiert.' });
    } catch {
      setShowText(true);
      setStatus({ kind: 'info', text: 'Kopieren nicht erlaubt – markiere den Text unten selbst.' });
    }
  };

  const readFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseBackup(String(reader.result));
      if (!result.ok) {
        setStatus({ kind: 'error', text: result.error });
        setPending(null);
        return;
      }
      setStatus(null);
      setPending(result);
    };
    reader.onerror = () => setStatus({ kind: 'error', text: 'Die Datei konnte nicht gelesen werden.' });
    reader.readAsText(file);
  };

  const confirmImport = () => {
    applyBackup(pending.data);
    setPending(null);
    // Neu laden, damit alle Stores den eingespielten Stand übernehmen
    window.location.reload();
  };

  const statusColor = status?.kind === 'error' ? 'text-ios-red' : status?.kind === 'ok' ? 'text-ios-green' : 'text-black/60 dark:text-white/60';

  return (
    <div className="space-y-3 px-4 py-3">
      <p className="text-[13px] leading-relaxed text-black/55 dark:text-white/55">
        Dein Fortschritt liegt nur in diesem Browser. Eine Sicherung schützt ihn vor gelöschten
        Website-Daten und lässt sich auf ein anderes Gerät übertragen.
      </p>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={exportFile}>
          <Icon name="check" className="h-4 w-4" />
          Sichern
        </Button>
        <Button size="sm" variant="secondary" className="flex-1" onClick={copyText}>
          Als Text kopieren
        </Button>
      </div>

      <Button size="sm" variant="neutral" className="w-full" onClick={() => fileInput.current?.click()}>
        <Icon name="refresh" className="h-4 w-4" />
        Sicherung einspielen
      </Button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={readFile}
        aria-label="Sicherungsdatei auswählen"
      />

      {status && <p className={`text-[13px] ${statusColor}`}>{status.text}</p>}

      {showText && (
        <textarea
          readOnly
          value={backupToText()}
          onFocus={(event) => event.target.select()}
          className="h-32 w-full rounded-xl bg-black/5 p-2 font-mono text-[11px] dark:bg-white/10"
          aria-label="Sicherung als Text"
        />
      )}

      {pending && (
        <div className="animate-slide-up space-y-2 rounded-xl bg-ios-orange/10 p-3 dark:bg-ios-orange/15">
          <p className="text-[14px] font-medium">Sicherung einspielen?</p>
          <p className="text-[13px] text-black/65 dark:text-white/65">
            Enthält {pending.summary.exercises} {pending.summary.exercises === 1 ? 'Übung' : 'Übungen'}
            {pending.summary.tests > 0
              && ` und Kategorie-Statistik für ${pending.summary.tests} ${pending.summary.tests === 1 ? 'Untertest' : 'Untertests'}`}
            {pending.summary.bmsQuizzes > 0
              && `, ${pending.summary.bmsQuizzes} ${pending.summary.bmsQuizzes === 1 ? 'BMS-Durchgang' : 'BMS-Durchgänge'}`}
            {pending.summary.bmsRead > 0 && ` und ${pending.summary.bmsRead} gelesene Lexikoneinträge`}
            {pending.summary.hasSettings && ', dazu die Einstellungen'}. Erstellt am{' '}
            {formatDate(pending.summary.exportedAt)}.
          </p>
          <p className="text-[13px] font-medium text-ios-red">
            Deine aktuellen Daten werden dabei ersetzt.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="solidDanger" className="flex-1" onClick={confirmImport}>
              Ersetzen
            </Button>
            <Button size="sm" variant="neutral" className="flex-1" onClick={() => setPending(null)}>
              Abbrechen
            </Button>
          </div>
        </div>
      )}

      {persistence && (
        <p className="text-[12px] text-black/45 dark:text-white/45">
          {persistence.granted
            ? 'Der Browser hat zugesagt, die Daten dauerhaft zu behalten.'
            : persistence.supported
              ? 'Der Browser behält die Daten nur so lange, wie er möchte – sichere sie regelmäßig. Als Web-App auf dem Home-Bildschirm stehen die Chancen besser.'
              : 'Dieser Browser kann keine dauerhafte Speicherung zusagen – sichere deine Daten regelmäßig.'}
        </p>
      )}
    </div>
  );
}

export default BackupSection;
