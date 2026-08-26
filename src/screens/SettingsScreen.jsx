/**
 * Tab "Einstellungen".
 *
 * Alle Werte landen über store/useSettings.js direkt im localStorage.
 */
import { useState } from 'react';
import Screen from '../components/layout/Screen.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Segmented from '../components/ui/Segmented.jsx';
import Toggle from '../components/ui/Toggle.jsx';
import { BREAK_DURATIONS, DIFFICULTIES, TESTS, TEST_ORDER } from '../data/testConfig.js';
import { useProgress } from '../store/useProgress.js';
import { useSettings } from '../store/useSettings.js';

function Section({ title, footnote, children }) {
  return (
    <section className="space-y-1.5">
      <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
        {title}
      </h2>
      <div className="ios-list">{children}</div>
      {footnote && <p className="px-1 pt-0.5 text-[12px] text-black/45 dark:text-white/45">{footnote}</p>}
    </section>
  );
}

export default function SettingsScreen() {
  const settings = useSettings();
  const resetProgress = useProgress((state) => state.resetAll);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Screen title="Einstellungen">
      <div className="space-y-6 pb-6">
        <Section title="Timer" footnote="Ohne Timer wird im Übungsmodus ohne Zeitdruck geübt. In der MedAT-Simulation gelten immer die Originalzeiten.">
          {TEST_ORDER.map((id) => (
            <div key={id} className="ios-row">
              <span>{TESTS[id].short}</span>
              <Toggle
                checked={settings.timers[id]}
                onChange={(value) => settings.setTimer(id, value)}
                label={`Timer für ${TESTS[id].name}`}
              />
            </div>
          ))}
        </Section>

        <Section title="Schwierigkeit">
          {TEST_ORDER.filter((id) => id !== 'memory').map((id) => (
            <div key={id} className="px-4 py-3">
              <p className="mb-2 text-[15px]">{TESTS[id].short}</p>
              <Segmented
                ariaLabel={`Schwierigkeit ${TESTS[id].name}`}
                options={DIFFICULTIES.map((d) => ({ value: d.id, label: d.label }))}
                value={settings.difficulty[id]}
                onChange={(value) => settings.setDifficulty(id, value)}
              />
            </div>
          ))}
          <div className="ios-row">
            <span className="min-w-0 flex-1 pr-2">
              Adaptive Zahlenfolgen
              <span className="block text-[12px] text-black/45 dark:text-white/45">
                3× richtig erhöht das Level, 2× falsch senkt es
              </span>
            </span>
            <Toggle
              checked={settings.adaptiveNumberSeries}
              onChange={() => settings.toggle('adaptiveNumberSeries')}
              label="Adaptive Schwierigkeit bei Zahlenfolgen"
            />
          </div>
        </Section>

        <Section title="Gedächtnis-Untertest" footnote="Im echten MedAT liegen rund 40 Minuten zwischen Lern- und Prüfphase.">
          <div className="px-4 py-3">
            <p className="mb-2 text-[15px]">Pause zwischen Lern- und Prüfphase</p>
            <Segmented
              ariaLabel="Pausendauer"
              options={BREAK_DURATIONS.map((minutes) => ({ value: minutes, label: `${minutes} Min` }))}
              value={settings.breakMinutes}
              onChange={settings.setBreakMinutes}
            />
          </div>
        </Section>

        <Section title="Darstellung & Feedback">
          <div className="px-4 py-3">
            <p className="mb-2 text-[15px]">Erscheinungsbild</p>
            <Segmented
              ariaLabel="Erscheinungsbild"
              options={[
                { value: 'system', label: 'System' },
                { value: 'light', label: 'Hell' },
                { value: 'dark', label: 'Dunkel' },
              ]}
              value={settings.theme}
              onChange={settings.setTheme}
            />
          </div>
          <div className="ios-row">
            <span>Sound-Effekte</span>
            <Toggle checked={settings.sound} onChange={() => settings.toggle('sound')} label="Sound-Effekte" />
          </div>
          <div className="ios-row">
            <span className="min-w-0 flex-1 pr-2">
              Haptisches Feedback
              <span className="block text-[12px] text-black/45 dark:text-white/45">
                Vibration, sofern das Gerät sie unterstützt
              </span>
            </span>
            <Toggle checked={settings.haptics} onChange={() => settings.toggle('haptics')} label="Haptisches Feedback" />
          </div>
        </Section>

        <Section title="Daten">
          <div className="px-4 py-3">
            {confirmReset ? (
              <div className="space-y-2">
                <p className="text-[14px] text-black/60 dark:text-white/60">
                  Alle Ergebnisse, Statistiken und Einstellungen werden dauerhaft gelöscht.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="solidDanger"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      resetProgress();
                      settings.resetSettings();
                      setConfirmReset(false);
                    }}
                  >
                    Endgültig löschen
                  </Button>
                  <Button variant="neutral" size="sm" className="flex-1" onClick={() => setConfirmReset(false)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="danger" size="sm" className="w-full" onClick={() => setConfirmReset(true)}>
                <Icon name="refresh" className="h-4 w-4" />
                Alle Daten zurücksetzen
              </Button>
            )}
          </div>
        </Section>
      </div>
    </Screen>
  );
}
