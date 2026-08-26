/**
 * Startbildschirm (Tab "Üben").
 *
 * Oben der Gesamtfortschritt als Kreisdiagramm, darunter je eine Karte pro
 * Untertest mit letztem Ergebnis, Fortschrittsring und Anzahl der Übungen.
 * Ganz unten der Einstieg in die MedAT-Simulation.
 */
import Screen from '../components/layout/Screen.jsx';
import Icon from '../components/ui/Icon.jsx';
import ProgressRing from '../components/ui/ProgressRing.jsx';
import Tappable from '../components/ui/Tappable.jsx';
import { TESTS, TEST_ORDER } from '../data/testConfig.js';
import { useNavigation } from '../store/useNavigation.js';
import { useProgress } from '../store/useProgress.js';
import { formatTime } from '../hooks/useCountdown.js';

function TestCard({ test, onOpen }) {
  const history = useProgress((state) => state.history);
  const items = history.filter((item) => item.testId === test.id);
  const last = items.length > 0 ? items[items.length - 1] : null;
  const percent = last ? (last.score / last.max) * 100 : 0;

  return (
    <Tappable
      onClick={onOpen}
      className="ios-card flex w-full items-center gap-4 px-4 py-4 text-left"
      aria-label={`${test.name} üben`}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${test.accent}1A`, color: test.accent }}
      >
        <Icon name={test.icon} className="h-6 w-6" strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold leading-tight">{test.name}</span>
        <span className="mt-0.5 block truncate text-[13px] text-black/50 dark:text-white/50">
          {test.tagline}
        </span>
        <span className="mt-1 block text-[12px] text-black/40 dark:text-white/40">
          {items.length === 0
            ? 'Noch nicht geübt'
            : `${items.length} ${items.length === 1 ? 'Übung' : 'Übungen'} · zuletzt ${last.score}/${last.max}`}
        </span>
      </span>

      <ProgressRing value={percent / 100} size={46} strokeWidth={4.5} color={test.accent} label={`Letztes Ergebnis ${Math.round(percent)} Prozent`}>
        <span className="tabular text-[11px] font-bold" style={{ color: test.accent }}>
          {items.length === 0 ? '–' : `${Math.round(percent)}`}
        </span>
      </ProgressRing>
    </Tappable>
  );
}

export default function HomeScreen() {
  const openScreen = useNavigation((state) => state.openScreen);
  const history = useProgress((state) => state.history);
  const streak = useProgress((state) => state.streak)();
  const totalSeconds = useProgress((state) => state.totalSeconds)();

  const testsWithData = TEST_ORDER.filter((id) => history.some((item) => item.testId === id));
  const overall = testsWithData.length === 0
    ? 0
    : testsWithData.reduce((sum, id) => {
      const items = history.filter((item) => item.testId === id);
      const avg = items.reduce((acc, item) => acc + (item.score / item.max) * 100, 0) / items.length;
      return sum + avg;
    }, 0) / testsWithData.length;

  return (
    <Screen title="KFF Trainer" subtitle="Kognitive Fähigkeiten und Fertigkeiten – MedAT">
      <div className="space-y-4">
        <section className="ios-card flex items-center gap-4 px-4 py-4">
          <ProgressRing value={overall / 100} size={78} strokeWidth={7} color="#007AFF" label={`Gesamtschnitt ${Math.round(overall)} Prozent`}>
            <span className="tabular text-[18px] font-bold">{Math.round(overall)}%</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold">Gesamtfortschritt</h2>
            <p className="text-[13px] text-black/50 dark:text-white/50">
              Durchschnitt über {testsWithData.length} von 4 Untertests
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-black/50 dark:text-white/50">
              <span className="inline-flex items-center gap-1">
                <Icon name="flame" className="h-4 w-4 text-ios-orange" />
                {streak} {streak === 1 ? 'Tag' : 'Tage'} Streak
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="clock" className="h-4 w-4" />
                {formatTime(totalSeconds)} geübt
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
            Untertests
          </h2>
          {TEST_ORDER.map((id) => (
            <TestCard key={id} test={TESTS[id]} onOpen={() => openScreen(id)} />
          ))}
        </section>

        <section>
          <Tappable
            onClick={() => openScreen('simulation')}
            className="flex w-full items-center gap-4 rounded-card bg-gradient-to-br from-ios-blue to-ios-indigo px-4 py-4 text-left text-white shadow-card"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <Icon name="trophy" className="h-6 w-6" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold">MedAT-Simulation</span>
              <span className="mt-0.5 block text-[13px] opacity-90">
                Alle Untertests in echter Reihenfolge mit Originalzeiten
              </span>
            </span>
            <Icon name="chevronRight" className="h-5 w-5 opacity-80" />
          </Tappable>
        </section>
      </div>
    </Screen>
  );
}
