/**
 * Gewichteter Gesamtwert über die vier Testteile.
 *
 * Die Karte zeigt drei Dinge in dieser Reihenfolge: den Wert, woraus er sich
 * zusammensetzt, und wo Übung am meisten bringt. Der Hinweis, dass es sich
 * nicht um einen Prozentrang handelt, steht bewusst dabei und nicht im
 * Kleingedruckten – eine Zahl mit Prozentzeichen wird sonst zwangsläufig als
 * Prognose gelesen.
 */
import Icon from './ui/Icon.jsx';
import ProgressRing from './ui/ProgressRing.jsx';
import { SECTIONS } from '../data/testConfig.js';
import { biggestGain, weightedScore } from '../lib/overallScore.js';

const TINT = { bms: '#34C759', kff: '#007AFF', tv: '#5AC8FA', sek: '#FF2D55' };

export default function OverallScoreCard({ percents }) {
  const { percent, coverage, missing, parts } = weightedScore(percents);
  const gain = biggestGain(percents);

  if (percent === null) {
    return (
      <section className="ios-card px-4 py-4">
        <h2 className="text-[15px] font-semibold">Gewichteter Gesamtwert</h2>
        <p className="mt-1 text-[13px] text-black/50 dark:text-white/50">
          Sobald du in einem Testteil etwas geübt hast, steht hier, wie sich deine Ergebnisse
          nach den offiziellen Gewichten zusammensetzen: BMS 40 %, KFF 40 %, TV 10 %, SEK 10 %.
        </p>
      </section>
    );
  }

  return (
    <section className="ios-card px-4 py-4">
      <div className="flex items-center gap-4">
        <ProgressRing
          value={percent}
          size={72}
          strokeWidth={6.5}
          color="#5856D6"
          label={`Gewichteter Gesamtwert ${Math.round(percent * 100)} Prozent`}
        >
          <span className="tabular text-[17px] font-bold">{Math.round(percent * 100)}%</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold">Gewichteter Gesamtwert</h2>
          <p className="text-[13px] text-black/55 dark:text-white/55">
            {coverage >= 0.999
              ? 'Alle vier Testteile fließen ein.'
              : `Erst ${Math.round(coverage * 100)} % des Tests abgedeckt – es fehlt noch ${missing.join(' und ')}.`}
          </p>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {parts.map((part) => (
          <li key={part.id} className="flex items-center gap-2.5">
            <span className="tabular w-9 shrink-0 text-[11px] font-semibold text-black/40 dark:text-white/40">
              {Math.round(part.weight * 100)} %
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px]">{SECTIONS[part.id].short}</span>
              <span className="mt-0.5 block h-1.5 w-full overflow-hidden rounded-full bg-black/[0.08] dark:bg-white/10">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${(part.value ?? 0) * 100}%`,
                    backgroundColor: TINT[part.id],
                    transition: 'width 500ms ease',
                  }}
                />
              </span>
            </span>
            <span className="tabular w-11 shrink-0 text-right text-[13px] font-semibold">
              {part.value === null ? '–' : `${Math.round(part.value * 100)} %`}
            </span>
          </li>
        ))}
      </ul>

      {gain && gain.value < 0.99 && (
        <p className="mt-3 flex items-start gap-1.5 text-[13px] text-black/60 dark:text-white/60">
          <Icon name="target" className="mt-0.5 h-4 w-4 shrink-0 text-ios-blue" />
          <span>
            Am meisten holst du gerade in <strong>{SECTIONS[gain.id].name}</strong> heraus – dort ist
            der Abstand nach oben, mit dem Gewicht verrechnet, am größten.
          </span>
        </p>
      )}

      <p className="mt-2.5 text-[11px] leading-snug text-black/40 dark:text-white/40">
        Kein Prozentrang und keine Prognose: Im echten Test wird nicht der Anteil richtiger
        Antworten gewichtet, sondern der Rang gegenüber allen Mitschreibenden.
      </p>
    </section>
  );
}
