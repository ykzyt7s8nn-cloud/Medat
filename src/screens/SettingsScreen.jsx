/**
 * Tab "Einstellungen".
 *
 * Alle Werte landen über store/useSettings.js direkt im localStorage.
 */
import { useState } from 'react';
import BackupSection from '../components/BackupSection.jsx';
import Screen from '../components/layout/Screen.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Segmented from '../components/ui/Segmented.jsx';
import Toggle from '../components/ui/Toggle.jsx';
import { supportsHaptics, useFeedback } from '../hooks/useFeedback.js';
import { BREAK_DURATIONS, DIFFICULTIES, TESTS, TEST_ORDER } from '../data/testConfig.js';
import { useProgress } from '../store/useProgress.js';
import { HAPTIC_LEVELS, SOUND_LEVELS, useSettings } from '../store/useSettings.js';

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

// Einmal je Sitzung ermitteln – das Ergebnis ändert sich zur Laufzeit nicht.
const hapticsAvailable = supportsHaptics();

export default function SettingsScreen() {
  const feedback = useFeedback();
  const settings = useSettings();
  const resetProgress = useProgress((state) => state.resetAll);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Screen title="Einstellungen">
      <div className="space-y-6 pb-6">
        <Section
          title="Modus"
          footnote="Überspringen, Markieren und freies Springen zwischen den Aufgaben gibt es in beiden Modi. Der Unterschied: Im Übungsmodus wird nach dem Beantworten sofort aufgelöst, im Prüfungsmodus erst bei der Abgabe – so wie im echten MedAT. Der Gedächtnistest arbeitet immer so."
        >
          <div className="px-4 py-3">
            <Segmented
              ariaLabel="Modus"
              options={[
                { value: 'uebung', label: 'Übung' },
                { value: 'pruefung', label: 'Prüfung' },
              ]}
              value={settings.mode}
              onChange={settings.setMode}
            />
            <p className="mt-2 text-[13px] text-black/55 dark:text-white/55">
              {settings.mode === 'uebung'
                ? 'Nach jeder Aufgabe siehst du sofort die Lösung samt Erklärung.'
                : 'Keine Auflösung während des Durchgangs – die Auswertung kommt am Ende.'}
            </p>
          </div>
        </Section>

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
          <div className="px-4 py-3">
            <p className="mb-2 text-[15px]">Ton</p>
            <Segmented
              ariaLabel="Ton"
              options={SOUND_LEVELS.map((level) => ({ value: level.id, label: level.label }))}
              value={settings.sound}
              onChange={settings.setSound}
            />
            <p className="mt-2 text-[12px] text-black/45 dark:text-white/45">
              „Auflösung“ gibt nur bei richtig, falsch und am Ende einen Ton – „Alles“ zusätzlich
              bei jedem Tippen.
            </p>
          </div>

          <div className="px-4 py-3">
            <p className="mb-2 text-[15px]">Haptik</p>
            <Segmented
              ariaLabel="Haptik"
              options={HAPTIC_LEVELS.map((level) => ({
                value: level.id,
                label: level.label,
              }))}
              value={hapticsAvailable ? settings.haptics : 'aus'}
              onChange={hapticsAvailable ? settings.setHaptics : () => {}}
              className={hapticsAvailable ? '' : 'opacity-40'}
            />
            <p className="mt-2 text-[12px] text-black/45 dark:text-white/45">
              {hapticsAvailable
                ? '„Dezent“ gibt überall einen einzelnen Impuls, „Deutlich“ unterscheidet die Ereignisse: einmal beim Tippen, zweimal bei richtig, dreimal bei falsch.'
                : 'Dieses Gerät gibt keine Vibration aus. Auf dem iPhone braucht es iOS 17.4 oder neuer.'}
            </p>
            {hapticsAvailable && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-3 w-full"
                silent
                onClick={() => feedback.preview('correct')}
              >
                Ausprobieren
              </Button>
            )}
          </div>

          <div className="ios-row">
            <span className="min-w-0 flex-1 pr-2">
              Zeitwarnung
              <span className="block text-[12px] text-black/45 dark:text-white/45">
                Kurzes Signal bei 5 Minuten, 1 Minute und 10 Sekunden Restzeit
              </span>
            </span>
            <Toggle
              checked={settings.timeWarnings}
              onChange={() => settings.toggle('timeWarnings')}
              label="Zeitwarnung"
            />
          </div>
        </Section>

        <Section title="Datensicherung">
          <BackupSection />
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
