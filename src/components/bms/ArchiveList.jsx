/**
 * Fehlerarchiv im Überblick: Fortschritt über die Leitner-Stufen und die
 * Liste aller archivierten Fragen mit Stufe und nächstem Termin.
 *
 * Die Fragetexte liegen in den nachgeladenen Fach-Chunks. Sie werden erst
 * geholt, wenn die Liste aufgeklappt wird – der Überblick selbst kommt mit
 * dem aus, was im Store steht.
 */
import { useEffect, useMemo, useState } from 'react';
import Tappable from '../ui/Tappable.jsx';
import Icon from '../ui/Icon.jsx';
import { MIXED_SOURCES, SUBJECTS, loadAllSubjects } from '../../data/bms/index.js';
import { useBmsProgress } from '../../store/useBmsProgress.js';
import {
  INTERVALS_DAYS,
  STAGE_COUNT,
  archiveSummary,
  daysUntilDue,
  isLearned,
} from '../../lib/spacedRepetition.js';

const ACCENT = MIXED_SOURCES.archiv.accent;
const LEARNED = '#34C759';

/** Termin in Worten: „heute“, „morgen“, „in 5 Tagen“, „seit 2 Tagen fällig“. */
export function describeDue(entry, now) {
  if (isLearned(entry)) return 'gelernt';
  const days = daysUntilDue(entry, now);
  if (days === null) return '–';
  if (days < -1) return `seit ${-days} Tagen fällig`;
  if (days === -1) return 'seit gestern fällig';
  if (days === 0) return 'heute fällig';
  if (days === 1) return 'morgen';
  return `in ${days} Tagen`;
}

export default function ArchiveList() {
  const archive = useBmsProgress((state) => state.archive);
  const [open, setOpen] = useState(false);
  const [prompts, setPrompts] = useState(null);
  const now = Date.now();
  const summary = archiveSummary(archive, now);

  useEffect(() => {
    if (!open || prompts) return undefined;
    let active = true;
    loadAllSubjects().then((all) => {
      if (!active) return;
      const map = new Map();
      for (const subject of Object.values(all)) {
        for (const question of subject.questions) map.set(question.id, question.prompt);
      }
      setPrompts(map);
    });
    return () => { active = false; };
  }, [open, prompts]);

  // Fällige zuerst, dann nach Termin; gelernte ans Ende, zuletzt gelernte oben.
  const rows = useMemo(() => Object.entries(archive)
    .map(([questionId, entry]) => ({ questionId, ...entry }))
    .sort((a, b) => {
      const la = isLearned(a);
      const lb = isLearned(b);
      if (la !== lb) return la ? 1 : -1;
      if (la) return b.learnedAt - a.learnedAt;
      return a.due - b.due;
    }), [archive]);

  if (summary.total === 0) return null;

  return (
    <section className="ios-card px-4 py-4" aria-label="Fortschritt im Fehlerarchiv">
      <header className="flex items-baseline gap-2">
        <h3 className="flex-1 text-[15px] font-semibold">Wiederholung</h3>
        <span className="tabular text-[13px] text-black/50 dark:text-white/50">
          {summary.learned} gelernt · {summary.active} in Wiederholung
        </span>
      </header>

      {/* Ein Kästchen je Stufe, wie im Karteikasten: links frisch, rechts gelernt. */}
      <div className="mt-3 grid grid-cols-6 gap-1.5" data-testid="archive-stages">
        {INTERVALS_DAYS.map((days, index) => (
          <div
            key={days}
            className="rounded-lg bg-black/[0.04] px-1 py-1.5 text-center dark:bg-white/[0.08]"
            title={`Stufe ${index + 1}: nach ${days} ${days === 1 ? 'Tag' : 'Tagen'}`}
          >
            <span
              className="tabular block text-[15px] font-bold"
              style={{ color: summary.byStage[index] > 0 ? ACCENT : undefined }}
            >
              {summary.byStage[index]}
            </span>
            <span className="block text-[10px] text-black/45 dark:text-white/45">{days} T</span>
          </div>
        ))}
        <div className="rounded-lg bg-ios-green/10 px-1 py-1.5 text-center">
          <span className="tabular block text-[15px] font-bold" style={{ color: LEARNED }}>
            {summary.learned}
          </span>
          <span className="block text-[10px] text-black/45 dark:text-white/45">
            <Icon name="check" className="inline h-2.5 w-2.5" strokeWidth={3} />
          </span>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-black/45 dark:text-white/45">
        Stufen 1–{STAGE_COUNT}: richtig bei Fälligkeit rückt eine Stufe vor, ein Fehler setzt auf
        Stufe 1 zurück. Vorzeitig richtig zählt nicht.
      </p>

      <Tappable
        onClick={() => setOpen((value) => !value)}
        className="mt-2 flex w-full items-center gap-2 py-1 text-left text-[13px] font-medium text-ios-blue"
        aria-expanded={open}
      >
        <span className="flex-1">{open ? 'Fragen ausblenden' : `Alle ${summary.total} Fragen anzeigen`}</span>
        <Icon name="chevronRight" className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`} />
      </Tappable>

      {open && (
        <ul className="mt-1 divide-y divide-black/5 dark:divide-white/10" data-testid="archive-list">
          {rows.map((row) => {
            const learned = isLearned(row);
            const days = learned ? null : daysUntilDue(row, now);
            const due = !learned && days !== null && days <= 0;
            const subject = SUBJECTS[row.subjectId];
            return (
              <li key={row.questionId} className="flex items-start gap-3 py-2">
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-[13px]">
                    {prompts ? (prompts.get(row.questionId) ?? 'Frage nicht mehr im Bestand') : '…'}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-black/45 dark:text-white/45">
                    {subject?.short ?? row.subjectId}
                    {' · '}
                    {learned ? `alle ${STAGE_COUNT} Stufen geschafft` : `Stufe ${row.stage + 1} von ${STAGE_COUNT}`}
                  </span>
                </span>
                <span
                  className="tabular shrink-0 text-[12px] font-semibold"
                  style={{ color: learned ? LEARNED : due ? ACCENT : undefined }}
                >
                  {describeDue(row, now)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
