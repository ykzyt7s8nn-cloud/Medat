/**
 * Startbildschirm (Tab "Üben").
 *
 * Oben Testtermin und Gesamtfortschritt, darunter die Untertests – gruppiert
 * nach Testteil, weil die drei Teile im MedAT verschieden viel zählen und man
 * beim Planen wissen will, woran man gerade arbeitet. Ganz unten der Einstieg
 * in die KFF-Simulation.
 *
 * Der BMS hat einen eigenen Tab; er ist nach Fächern gegliedert, nicht nach
 * Untertests, und passt deshalb nicht in dieselbe Liste.
 */
import CountdownCard from '../components/CountdownCard.jsx';
import Screen from '../components/layout/Screen.jsx';
import Icon from '../components/ui/Icon.jsx';
import ProgressRing from '../components/ui/ProgressRing.jsx';
import Tappable from '../components/ui/Tappable.jsx';
import { SECTIONS, TESTS, TEST_ORDER, testsInSection } from '../data/testConfig.js';
import { daysUntilExam } from '../lib/examDate.js';
import { useActivity } from '../hooks/useActivity.js';
import { useNavigation } from '../store/useNavigation.js';
import { useProgress } from '../store/useProgress.js';
import { useSettings } from '../store/useSettings.js';

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
  const setTab = useNavigation((state) => state.setTab);
  const history = useProgress((state) => state.history);
  const examDate = useSettings((state) => state.examDate);
  // Strähne und Gesamtzeit zählen beide Testteile – wer BMS übt, übt.
  const activity = useActivity();

  const testsWithData = TEST_ORDER.filter((id) => history.some((item) => item.testId === id));
  const overall = testsWithData.length === 0
    ? 0
    : testsWithData.reduce((sum, id) => {
      const items = history.filter((item) => item.testId === id);
      const avg = items.reduce((acc, item) => acc + (item.score / item.max) * 100, 0) / items.length;
      return sum + avg;
    }, 0) / testsWithData.length;

  return (
    <Screen title="Üben" subtitle="Kognitiv, Textverständnis und sozial-emotional">
      <div className="space-y-4">
        <CountdownCard
          daysLeft={daysUntilExam(examDate)}
          examDate={examDate}
          streak={activity.streak}
          seconds={activity.seconds}
          onOpenSettings={() => setTab('settings')}
        />

        <section className="ios-card flex items-center gap-4 px-4 py-4">
          <ProgressRing value={overall / 100} size={78} strokeWidth={7} color="#007AFF" label={`Gesamtschnitt ${Math.round(overall)} Prozent`}>
            <span className="tabular text-[18px] font-bold">{Math.round(overall)}%</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold">Gesamtfortschritt</h2>
            <p className="text-[13px] text-black/50 dark:text-white/50">
              Durchschnitt über {testsWithData.length} von {TEST_ORDER.length} Untertests
            </p>
            <p className="mt-1 text-[12px] text-black/40 dark:text-white/40">
              {activity.sessions === 0
                ? 'Noch keine abgeschlossene Übung'
                : `${activity.sessions} ${activity.sessions === 1 ? 'Durchgang' : 'Durchgänge'} insgesamt, davon ${activity.bmsSessions} im BMS`}
            </p>
          </div>
        </section>

        {['kff', 'tv', 'sek'].map((sectionId) => (
          <section key={sectionId} className="space-y-3">
            {/* Der Name darf umbrechen – abgeschnitten wäre „Kognitive
                Fähigkeiten und …“ weniger nützlich als zwei Zeilen. */}
            <h2 className="flex items-baseline gap-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
              <span className="min-w-0 flex-1 leading-snug">{SECTIONS[sectionId].name}</span>
              <span className="shrink-0 tabular font-normal normal-case tracking-normal">
                {Math.round(SECTIONS[sectionId].weight * 100)} % des MedAT
              </span>
            </h2>
            {testsInSection(sectionId).map((id) => (
              <TestCard key={id} test={TESTS[id]} onOpen={() => openScreen(id)} />
            ))}
          </section>
        ))}

        <section>
          <Tappable
            onClick={() => openScreen('simulation')}
            className="flex w-full items-center gap-4 rounded-card bg-gradient-to-br from-ios-blue to-ios-indigo px-4 py-4 text-left text-white shadow-card"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <Icon name="trophy" className="h-6 w-6" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold">KFF-Simulation</span>
              <span className="mt-0.5 block text-[13px] opacity-90">
                Die fünf kognitiven Untertests in echter Reihenfolge mit Originalzeiten
              </span>
            </span>
            <Icon name="chevronRight" className="h-5 w-5 opacity-80" />
          </Tappable>
        </section>
      </div>
    </Screen>
  );
}
