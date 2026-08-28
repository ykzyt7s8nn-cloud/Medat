/**
 * Schwachstellen-Training.
 *
 * Zeigt je Untertest die Trefferquote und den Zeitbedarf pro Aufgaben-
 * Kategorie – bei Zahlenfolgen die Regelfamilie, beim Gedächtnistest den
 * Fragetyp, bei den Implikationen die Figur, bei der Wortflüssigkeit die
 * Wortlänge. Von dort aus lässt sich ein Durchgang starten, der nur die
 * schwachen Kategorien zieht.
 *
 * Kategorien mit weniger als drei Versuchen gelten als noch nicht belastbar und
 * werden als solche gekennzeichnet, statt sie als Schwäche auszugeben.
 */
import { useState } from 'react';
import Screen from '../components/layout/Screen.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Tappable from '../components/ui/Tappable.jsx';
import { TESTS, TEST_ORDER } from '../data/testConfig.js';
import { useNavigation } from '../store/useNavigation.js';
import { useProgress } from '../store/useProgress.js';

const percent = (value) => `${Math.round(value * 100)} %`;

function accuracyColor(accuracy) {
  if (accuracy >= 0.8) return '#34C759';
  if (accuracy >= 0.55) return '#FF9500';
  return '#FF3B30';
}

function TagRow({ item, accent, selected, onToggle }) {
  return (
    <Tappable
      onClick={onToggle}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left ${selected ? 'bg-ios-blue/5 dark:bg-ios-blue/10' : ''}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          selected ? 'border-ios-blue bg-ios-blue text-white' : 'border-black/20 dark:border-white/25'
        }`}
      >
        {selected && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px]">{item.label}</span>
        <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
          <span
            className="block h-full rounded-full"
            style={{ width: `${item.accuracy * 100}%`, backgroundColor: accuracyColor(item.accuracy) }}
          />
        </span>
        <span className="mt-1 block text-[12px] text-black/45 dark:text-white/45">
          {item.correct}/{item.attempts} richtig
          {item.secondsPerTask > 0 && ` · ⌀ ${Math.round(item.secondsPerTask)} s`}
          {!item.reliable && ' · zu wenige Daten'}
        </span>
      </span>

      <span className="tabular shrink-0 text-[15px] font-semibold" style={{ color: accuracyColor(item.accuracy) }}>
        {percent(item.accuracy)}
      </span>
    </Tappable>
  );
}

function TestSection({ testId, openScreen }) {
  const tags = useProgress((state) => state.tagsFor)(testId);
  const weak = useProgress((state) => state.weakTags)(testId);
  const test = TESTS[testId];
  const [selection, setSelection] = useState(null);

  if (tags.length === 0) {
    return (
      <section className="ios-card px-4 py-4">
        <header className="mb-1 flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${test.accent}1A`, color: test.accent }}
          >
            <Icon name={test.icon} className="h-4 w-4" />
          </span>
          <h2 className="text-[15px] font-semibold">{test.short}</h2>
        </header>
        <p className="text-[13px] text-black/50 dark:text-white/50">
          Noch keine Daten – schließe einen Durchgang ab, dann erscheint hier die Auswertung nach
          Aufgabentyp.
        </p>
      </section>
    );
  }

  // Vorauswahl: die schwachen Kategorien, sonst nichts
  const chosen = selection ?? weak.map((item) => item.tag);
  const toggle = (tag) =>
    setSelection((current) => {
      const base = current ?? chosen;
      return base.includes(tag) ? base.filter((t) => t !== tag) : [...base, tag];
    });

  return (
    <section className="space-y-1.5">
      <header className="flex items-center gap-2.5 px-1">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${test.accent}1A`, color: test.accent }}
        >
          <Icon name={test.icon} className="h-4 w-4" />
        </span>
        <h2 className="flex-1 text-[15px] font-semibold">{test.short}</h2>
        {weak.length > 0 && (
          <span className="rounded-full bg-ios-red/10 px-2 py-0.5 text-[12px] font-medium text-ios-red">
            {weak.length} {weak.length === 1 ? 'Schwachstelle' : 'Schwachstellen'}
          </span>
        )}
      </header>

      <div className="ios-list">
        {tags.map((item) => (
          <TagRow
            key={item.tag}
            item={item}
            accent={test.accent}
            selected={chosen.includes(item.tag)}
            onToggle={() => toggle(item.tag)}
          />
        ))}
      </div>

      <Button
        size="sm"
        variant={chosen.length > 0 ? 'primary' : 'neutral'}
        className="w-full"
        disabled={chosen.length === 0}
        onClick={() => openScreen(testId, { focusTags: chosen })}
      >
        <Icon name="target" className="h-4 w-4" />
        {chosen.length === tags.length
          ? 'Alle Kategorien üben'
          : `Gezielt üben (${chosen.length} ${chosen.length === 1 ? 'Kategorie' : 'Kategorien'})`}
      </Button>
    </section>
  );
}

export default function TrainingScreen() {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const openScreen = useNavigation((state) => state.openScreen);
  const hasAny = useProgress((state) => Object.keys(state.tagStats).length > 0);

  return (
    <Screen title="Schwachstellen-Training" subtitle="Trefferquote nach Aufgabentyp" onClose={closeScreen}>
      <div className="space-y-5 pb-6">
        {!hasAny && (
          <section className="ios-card px-4 py-4">
            <p className="text-[14px] leading-relaxed text-black/65 dark:text-white/65">
              Sobald du Durchgänge abgeschlossen hast, wird hier sichtbar, welche Aufgabentypen dir
              liegen und welche nicht – und du kannst gezielt nur die schwachen üben.
            </p>
          </section>
        )}
        {TEST_ORDER.map((testId) => (
          <TestSection key={testId} testId={testId} openScreen={openScreen} />
        ))}
      </div>
    </Screen>
  );
}
