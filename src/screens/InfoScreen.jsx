/**
 * Tab "Info".
 *
 * Kurzer Überblick über den KFF-Teil des MedAT, die Regeln jedes Untertests
 * und Hinweise zur App selbst (Offline-Betrieb, Datenspeicherung).
 */
import Screen from '../components/layout/Screen.jsx';
import Icon from '../components/ui/Icon.jsx';
import { TESTS, TEST_ORDER } from '../data/testConfig.js';
import { formatTime } from '../hooks/useCountdown.js';

const DETAILS = {
  figures: [
    '15 Aufgaben in 15 Minuten. Die Antworten a bis d zeigen Figuren, e lautet immer „Keine der Antwortmöglichkeiten ist richtig“.',
    'In etwa jeder fünften Aufgabe ist e) tatsächlich die Lösung – die gesuchte Figur steht dann gar nicht zur Auswahl.',
    'Als Lösung kommen nur zwei Kategorien vor: regelmäßige Vielecke (Fünf- bis Achteck) und Kreissegmente (Viertel-, Halb-, Dreiviertel-, Vollkreis). Trapez, Dreieck und Quadrat tauchen nur als Distraktor auf.',
    'Die falschen Figuren unterscheiden sich in der Eckenzahl, in den Proportionen oder in der Krümmung – oft nur geringfügig.',
    'Die Teile dürfen gedreht, aber nicht gespiegelt werden. Teilstücke und Antwortfiguren sind im selben Maßstab gezeichnet.',
  ],
  memory: [
    '8 Allergieausweise mit je 8 Feldern: Foto, Name, Geburtsdatum (TT.MM.), Blutgruppe, Medikamenteneinnahme, Allergien, Blutdruck, Brille.',
    'Lernphase 8 Minuten, danach folgen im echten Test andere Untertests, erst danach die 25 Fragen in 15 Minuten.',
    'Antwort e) lautet immer „Keine Antwort ist richtig“.',
  ],
  numberSeries: [
    '10 Aufgaben in 15 Minuten. Sieben Zahlen sind vorgegeben, die 8. und 9. Zahl sind gesucht.',
    'Typische Bildungsgesetze: konstante Differenz, Multiplikation, wachsende Differenzen, verschachtelte Folgen, Fibonacci, Quadrat-/Primzahlen und Kombinationen.',
  ],
  wordFluency: [
    '15 Aufgaben in 20 Minuten. Aus einem Buchstabensalat ist der Anfangsbuchstabe des gesuchten Wortes zu bestimmen.',
    'Das Lösungswort ist immer ein deutsches Substantiv im Nominativ Singular, ohne Umlaute und ohne ß.',
  ],
  implications: [
    '10 Aufgaben in 10 Minuten, klassische Syllogismen mit zwei Prämissen.',
    'Die vier Aussageformen: „Alle A sind B“, „Einige A sind B“, „Alle A sind keine B“, „Einige A sind keine B“.',
    'Entscheidend ist ausschließlich die formale Logik, nicht das Weltwissen.',
  ],
};

export default function InfoScreen() {
  return (
    <Screen title="Info" subtitle="Die Testteile im MedAT">
      <div className="space-y-4 pb-6">
        <section className="ios-card px-4 py-4">
          <h2 className="text-[17px] font-bold">Kognitive Fähigkeiten und Fertigkeiten</h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-black/65 dark:text-white/65">
            Der KFF-Teil des MedAT besteht aus fünf Untertests. Diese App trainiert alle fünf – in
            der Simulation laufen sie in der echten Reihenfolge mit den Originalzeiten ab.
          </p>
        </section>

        <section className="ios-card px-4 py-4">
          <h2 className="text-[17px] font-bold">Basiskenntnistest (BMS)</h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-black/65 dark:text-white/65">
            Der BMS macht 40 % der Gesamtwertung aus und prüft Biologie, Chemie, Physik und
            Mathematik auf Maturaniveau: 94 Fragen in 75 Minuten, aufgeteilt in 40 Biologie,
            24 Chemie, 18 Physik und 12 Mathematik.
          </p>
          <ul className="mt-2 space-y-1.5 text-[14px] leading-snug text-black/65 dark:text-white/65">
            <li>Im Lexikon steht zu jedem Stichwort eine Erklärung mit Schlüsselfakten und Querverweisen.</li>
            <li>Im Quiz lässt sich ein einzelnes Thema, ein ganzes Fach oder die volle Simulation üben.</li>
            <li>Nach jeder Antwort wird erklärt, warum sie richtig oder falsch ist – mit Link ins Lexikon.</li>
          </ul>
        </section>

        {TEST_ORDER.map((id) => {
          const test = TESTS[id];
          const seconds = id === 'memory' ? test.learnSeconds + test.testSeconds : test.testSeconds;
          return (
            <section key={id} className="ios-card px-4 py-4">
              <header className="mb-2 flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${test.accent}1A`, color: test.accent }}
                >
                  <Icon name={test.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold leading-tight">{test.name}</h2>
                  <p className="tabular text-[12px] text-black/45 dark:text-white/45">
                    {test.questionCount} Aufgaben · {formatTime(seconds)}
                  </p>
                </div>
              </header>
              <ul className="space-y-1.5">
                {DETAILS[id].map((line) => (
                  <li key={line} className="flex gap-2 text-[14px] leading-snug text-black/65 dark:text-white/65">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: test.accent }} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="ios-card px-4 py-4">
          <h2 className="text-[15px] font-semibold">Zur App</h2>
          <ul className="mt-2 space-y-1.5 text-[14px] leading-snug text-black/65 dark:text-white/65">
            <li>Alle Aufgaben werden auf dem Gerät erzeugt – es gibt keinen Server und keine Anmeldung.</li>
            <li>Fortschritt und Einstellungen liegen ausschließlich im lokalen Speicher des Browsers.</li>
            <li>Nach dem ersten Laden funktioniert die App vollständig offline und lässt sich auf dem iPhone über „Zum Home-Bildschirm“ installieren.</li>
            <li>Die App ist ein privates Übungsprojekt und steht in keiner Verbindung zu den offiziellen MedAT-Veranstaltern.</li>
          </ul>
        </section>
      </div>
    </Screen>
  );
}
