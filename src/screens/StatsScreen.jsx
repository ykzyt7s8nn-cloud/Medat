/**
 * Tab "Statistik".
 *
 * Alles hier ist abgeleitet – gespeichert wird nur die Ergebnisliste
 * (siehe store/useProgress.js). Das verhindert widersprüchliche Kennzahlen.
 */
import Screen from '../components/layout/Screen.jsx';
import Icon from '../components/ui/Icon.jsx';
import LineChart from '../components/charts/LineChart.jsx';
import Tappable from '../components/ui/Tappable.jsx';
import { TESTS, TEST_ORDER } from '../data/testConfig.js';
import { useNavigation } from '../store/useNavigation.js';
import { useProgress } from '../store/useProgress.js';
import { formatTime } from '../hooks/useCountdown.js';
import { formatDuration } from '../lib/format.js';

function StatCard({ icon, label, value, tint }) {
  return (
    <div className="ios-card flex flex-1 items-center gap-3 px-3.5 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${tint}1A`, color: tint }}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block tabular text-[17px] font-bold leading-tight">{value}</span>
        <span className="block truncate text-[12px] text-black/50 dark:text-white/50">{label}</span>
      </span>
    </div>
  );
}

export default function StatsScreen() {
  const openScreen = useNavigation((state) => state.openScreen);
  const history = useProgress((state) => state.history);
  const streak = useProgress((state) => state.streak)();
  const totalSeconds = useProgress((state) => state.totalSeconds)();

  const tagStats = useProgress((state) => state.tagStats);

  const perTest = TEST_ORDER.map((id) => {
    const items = history.filter((item) => item.testId === id).slice(-30);
    const percents = items.map((item) => (item.score / item.max) * 100);
    const average = percents.length > 0 ? percents.reduce((a, b) => a + b, 0) / percents.length : null;
    const best = percents.length > 0 ? Math.max(...percents) : null;

    // Zeit pro Aufgabe aus der Kategorie-Statistik (dort wird sie pro Aufgabe
    // gemessen, während history nur die Gesamtdauer kennt).
    const tags = Object.values(tagStats[id] ?? {});
    const attempts = tags.reduce((sum, tag) => sum + tag.attempts, 0);
    const tagSeconds = tags.reduce((sum, tag) => sum + tag.seconds, 0);
    const perTask = attempts > 0 && tagSeconds > 0 ? tagSeconds / attempts : null;
    const budget = TESTS[id].testSeconds / TESTS[id].questionCount;

    return { test: TESTS[id], items, percents, average, best, perTask, budget };
  });

  const withData = perTest.filter((entry) => entry.average !== null);
  const weakest = withData.length > 1
    ? withData.reduce((min, entry) => (entry.average < min.average ? entry : min), withData[0])
    : null;

  return (
    <Screen title="Statistik" subtitle={`${history.length} abgeschlossene Übungen`}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <StatCard icon="flame" tint="#FF9500" value={`${streak}`} label={streak === 1 ? 'Tag Streak' : 'Tage Streak'} />
          <StatCard icon="clock" tint="#007AFF" value={formatTime(totalSeconds)} label="Gesamt geübt" />
        </div>

        <Tappable
          onClick={() => openScreen('training')}
          className="ios-card flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ios-blue/10 text-ios-blue">
            <Icon name="target" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">Schwachstellen-Training</span>
            <span className="block text-[13px] text-black/55 dark:text-white/55">
              Trefferquote nach Aufgabentyp – und gezielt das üben, was hakt
            </span>
          </span>
          <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-black/25 dark:text-white/25" />
        </Tappable>

        {weakest && (
          <section className="ios-card flex items-start gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ios-red/10 text-ios-red">
              <Icon name="target" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold">Schwächster Bereich</h2>
              <p className="text-[13px] text-black/55 dark:text-white/55">
                {weakest.test.name} – Schnitt {Math.round(weakest.average)} %. Hier lohnt sich das nächste Training.
              </p>
            </div>
          </section>
        )}

        {perTest.map(({ test, items, percents, average, best, perTask, budget }) => (
          <section key={test.id} className="ios-card px-4 py-4">
            <header className="mb-3 flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${test.accent}1A`, color: test.accent }}
              >
                <Icon name={test.icon} className="h-[18px] w-[18px]" />
              </span>
              <h2 className="flex-1 text-[15px] font-semibold">{test.short}</h2>
              <span className="tabular text-[13px] text-black/50 dark:text-white/50">
                {items.length} {items.length === 1 ? 'Übung' : 'Übungen'}
              </span>
            </header>

            <LineChart values={percents} color={test.accent} label={`Verlauf ${test.name}`} />

            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <dt className="text-[11px] text-black/45 dark:text-white/45">Schnitt</dt>
                <dd className="tabular text-[15px] font-semibold">{average === null ? '–' : `${Math.round(average)} %`}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-black/45 dark:text-white/45">Bestwert</dt>
                <dd className="tabular text-[15px] font-semibold">{best === null ? '–' : `${Math.round(best)} %`}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-black/45 dark:text-white/45">Zuletzt</dt>
                <dd className="tabular text-[15px] font-semibold">
                  {items.length === 0 ? '–' : `${items[items.length - 1].score}/${items[items.length - 1].max}`}
                </dd>
              </div>
            </dl>

            {perTask !== null && (
              <p className="mt-2 text-center text-[12px] text-black/45 dark:text-white/45">
                ⌀ {formatDuration(perTask)} pro Aufgabe ·{' '}
                <span className={perTask > budget ? 'text-ios-red' : 'text-ios-green'}>
                  {perTask > budget ? 'über' : 'im'} Zeitbudget von {formatDuration(budget)}
                </span>
              </p>
            )}
          </section>
        ))}

        {history.length === 0 && (
          <p className="px-2 pb-4 text-center text-[14px] text-black/45 dark:text-white/45">
            Noch keine Daten. Sobald du einen Untertest abschließt, erscheint hier dein Verlauf.
          </p>
        )}
      </div>
    </Screen>
  );
}
