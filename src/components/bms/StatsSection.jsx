/**
 * BMS-Teil des Statistik-Tabs.
 *
 * Wie im KFF-Teil ist hier alles abgeleitet: Gespeichert werden nur die
 * Ergebnisliste, die Themensummen und das Fehlerarchiv (store/useBmsProgress).
 *
 * Die Reihenfolge folgt der Frage, die man sich vor dem Lernen stellt: Wie
 * steht es insgesamt, wo hakt es, und was ist heute fällig.
 */
import Icon from '../ui/Icon.jsx';
import ProgressRing from '../ui/ProgressRing.jsx';
import Tappable from '../ui/Tappable.jsx';
import LineChart from '../charts/LineChart.jsx';
import { MIXED_SOURCES, SUBJECTS, SUBJECT_ORDER } from '../../data/bms/index.js';
import { useBmsProgress } from '../../store/useBmsProgress.js';

const BMS_ACCENT = '#34C759';

export default function BmsStatsSection({ onOpenQuiz }) {
  const history = useBmsProgress((state) => state.history);
  const topicStats = useBmsProgress((state) => state.topicStats);
  const archive = useBmsProgress((state) => state.archive);
  const subjectAccuracy = useBmsProgress((state) => state.subjectAccuracy);
  const weakTopics = useBmsProgress((state) => state.weakTopics);
  const archiveCounts = useBmsProgress((state) => state.archiveCounts);

  // topicStats und archive werden mitgelesen, damit sich die abgeleiteten
  // Werte nach jedem Durchgang neu berechnen – die Selektoren allein sind nur
  // Funktionen und lösen kein Neuzeichnen aus.
  const counts = archive && archiveCounts();
  const weak = topicStats && weakTopics({ limit: 3 });
  const percents = history.slice(-30).map((item) => (item.score / item.max) * 100);
  const attempts = SUBJECT_ORDER.reduce(
    (sum, id) => sum + Object.values(topicStats[id] ?? {}).reduce((n, topic) => n + topic.attempts, 0),
    0,
  );
  const correct = SUBJECT_ORDER.reduce(
    (sum, id) => sum + Object.values(topicStats[id] ?? {}).reduce((n, topic) => n + topic.correct, 0),
    0,
  );
  const overall = attempts > 0 ? correct / attempts : null;

  if (history.length === 0 && attempts === 0) {
    return (
      <section className="ios-card px-4 py-4">
        <header className="mb-1.5 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ios-green/10 text-ios-green">
            <Icon name="cell" className="h-[18px] w-[18px]" />
          </span>
          <h2 className="text-[15px] font-semibold">Basiskenntnistest</h2>
        </header>
        <p className="text-[13px] text-black/50 dark:text-white/50">
          Noch keine BMS-Übung abgeschlossen. Sobald du ein Quiz beendest, stehen hier
          Trefferquote je Fach, Verlauf und deine schwächsten Themen.
        </p>
      </section>
    );
  }

  return (
    <section className="ios-card px-4 py-4">
      <header className="mb-3 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ios-green/10 text-ios-green">
          <Icon name="cell" className="h-[18px] w-[18px]" />
        </span>
        <h2 className="flex-1 text-[15px] font-semibold">Basiskenntnistest</h2>
        <span className="tabular text-[13px] text-black/50 dark:text-white/50">
          {attempts} {attempts === 1 ? 'Frage' : 'Fragen'}
        </span>
      </header>

      {percents.length > 1 && (
        <LineChart values={percents} color={BMS_ACCENT} label="Verlauf der BMS-Quiz" />
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        {SUBJECT_ORDER.map((id) => {
          const subject = SUBJECTS[id];
          const accuracy = subjectAccuracy(id);
          return (
            <div key={id} className="flex items-center gap-2.5 rounded-xl bg-black/[0.03] px-2.5 py-2 dark:bg-white/[0.06]">
              <ProgressRing
                value={accuracy ?? 0}
                size={34}
                strokeWidth={3.5}
                color={subject.accent}
                label={`${subject.name} ${Math.round((accuracy ?? 0) * 100)} Prozent richtig`}
              >
                <span className="tabular text-[9px] font-bold" style={{ color: subject.accent }}>
                  {accuracy === null ? '–' : Math.round(accuracy * 100)}
                </span>
              </ProgressRing>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium">{subject.short}</span>
                <span className="block text-[11px] text-black/45 dark:text-white/45">
                  {accuracy === null ? 'ungeübt' : `${Math.round(accuracy * 100)} % richtig`}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {overall !== null && (
        <p className="mt-2.5 text-center text-[12px] text-black/45 dark:text-white/45">
          Über alle vier Fächer: {Math.round(overall * 100)} % richtig
        </p>
      )}

      {weak.length > 0 && (
        <div className="mt-3 border-t border-black/5 pt-3 dark:border-white/10">
          <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
            Da hakt es
          </h3>
          <ul className="space-y-1">
            {weak.map((row) => (
              <li key={`${row.subjectId}-${row.topicId}`} className="flex items-baseline gap-2 text-[13px]">
                <span className="min-w-0 flex-1 truncate">
                  {row.title}
                  <span className="text-black/40 dark:text-white/40"> · {SUBJECTS[row.subjectId].short}</span>
                </span>
                <span className="tabular shrink-0 font-semibold text-ios-red">
                  {Math.round(row.accuracy * 100)} %
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Tappable
        onClick={() => onOpenQuiz(counts.due > 0 ? 'archiv' : 'taeglich')}
        className="mt-3 flex w-full items-center gap-2.5 rounded-xl bg-black/[0.04] px-3 py-2.5 text-left dark:bg-white/[0.08]"
      >
        <Icon
          name={counts.due > 0 ? MIXED_SOURCES.archiv.icon : MIXED_SOURCES.taeglich.icon}
          className="h-[18px] w-[18px] shrink-0"
          style={{ color: counts.due > 0 ? MIXED_SOURCES.archiv.accent : MIXED_SOURCES.taeglich.accent }}
        />
        <span className="min-w-0 flex-1 text-[13px]">
          {counts.due > 0
            ? `${counts.due} ${counts.due === 1 ? 'Frage ist' : 'Fragen sind'} zur Wiederholung fällig`
            : counts.total > 0
              ? `Nichts fällig – ${counts.total} ${counts.total === 1 ? 'Frage wartet' : 'Fragen warten'} im Archiv`
              : 'Archiv leer – üb die Tägliche 10'}
        </span>
        <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-black/25 dark:text-white/25" />
      </Tappable>
    </section>
  );
}
