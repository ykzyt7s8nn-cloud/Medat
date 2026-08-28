# MedAT KFF Trainer

Übungs-App für die vier KFF-Untertests des österreichischen Medizin-Aufnahmetests
(MedAT). React + Vite + TailwindCSS, als PWA installierbar, vollständig offline
nutzbar – **kein Backend, keine externen APIs, keine Anmeldung**. Alle Aufgaben
werden auf dem Gerät erzeugt, Fortschritt und Einstellungen liegen ausschließlich
im `localStorage`.

Optimiert für iPhone 15 Pro (393 × 852) inklusive Safe-Area-Insets, funktioniert
aber auch auf iPad und Desktop.

## Enthaltene Untertests

Alle fünf KFF-Untertests des MedAT:

| Untertest | Aufgaben | Zeit | Besonderheit |
|---|---|---|---|
| Figuren zusammensetzen | 15 | 15 min | Vielecke und Kreissegmente aus Teilstücken erkennen; e) = „keine ist richtig“ |
| Gedächtnis & Merkfähigkeit | 8 Ausweise + 25 Fragen | 8 min lernen, 15 min prüfen | Pause dazwischen einstellbar (2/5/10/20/40 min) |
| Zahlenfolgen | 10 | 15 min | 7 Zahlen sichtbar, 2 gesucht; 7 Stufen, optional adaptiv |
| Wortflüssigkeit | 15 | 20 min | Buchstabensalat, Anfangsbuchstabe gesucht |
| Implikationen erkennen | 10 | 10 min | Syllogismen mit Venn-Diagramm-Auflösung |

Dazu ein **Simulationsmodus**, der alle fünf Untertests in der echten
MedAT-Reihenfolge mit Originalzeiten durchläuft und am Ende einen geschätzten
KFF-Prozentrang ausgibt.

## Lernfunktionen

**Schwachstellen-Training** – Für jede Aufgabe wird die Kategorie mitgeschrieben:
bei Zahlenfolgen die Regelfamilie, beim Gedächtnistest der Fragetyp, bei den
Implikationen die Figur, bei der Wortflüssigkeit die Wortlänge, bei den Figuren
die Anzahl der Teilstücke. Der gleichnamige Screen zeigt Trefferquote und
Zeitbedarf je Kategorie und startet auf Wunsch einen Durchgang, der nur die
schwachen Kategorien zieht.

**Übungs- und Prüfungsmodus** – Im Übungsmodus wird nach jeder Aufgabe
aufgelöst. Im Prüfungsmodus gibt es keine Auflösung, dafür Überspringen,
Markieren zum Wiederkommen, eine Aufgabenübersicht und Abgabe am Ende – so wie
im echten Test, wo die Zeiteinteilung mit über das Ergebnis entscheidet.

**Tempo-Auswertung** – Jede Aufgabe wird auf eine Zehntelsekunde genau gemessen.
Das Ergebnis rechnet hoch, ob das Tempo für das Zeitlimit reicht, und benennt
Ausreißer.

**Rechenweg statt Ergebnis** – Bei falsch gelösten Zahlenfolgen erscheint die
Differenzen- bzw. Quotientenreihe, bei den Figuren die Zielfigur mit farbig
eingezeichneten Teilstücken, bei den Implikationen das Venn-Diagramm.

**Datensicherung** – Fortschritt und Einstellungen lassen sich als JSON-Datei
sichern und wieder einspielen (Einstellungen → Datensicherung).

## Befehle

```bash
npm install
npm run dev        # Entwicklungsserver
npm run build      # Icons + Produktionsbuild nach dist/ + Precache-Liste
npm run preview    # Produktionsbuild lokal ansehen
npm run selftest   # Daten- und Engine-Prüfungen (84 Checks)
npm run icons      # PWA-Icons neu generieren
```

`npm run selftest` prüft unter anderem, ob die Syllogismus-Engine exakt die 24
klassisch gültigen Modi liefert, ob jede erzeugte MC-Frage genau eine richtige
Antwort hat, ob die Wortdatenbank anagramm-eindeutig bleibt, ob jede
Zahlenfolgen-Stufe mehrere Regelfamilien mischt und ob sich bei den Figuren
genau eine der fünf Antwortfiguren aus den Teilstücken legen lässt.

## Projektstruktur

```
public/            manifest.webmanifest, sw.js, generierte Icons
scripts/
  generate-icons.mjs   erzeugt die PWA-Icons als PNG (ohne Abhängigkeiten)
  selftest.mjs         Daten- und Engine-Prüfungen
src/
  data/            reine Datenlisten, keine Logik
    names.js           100 Vornamen + 100 Nachnamen, Avatar-Farben
    allergens.js       52 Allergene nach Kategorie, Blutgruppen
    nouns.js           1427 Substantive ohne Umlaute/ß, anagramm-eindeutig
    syllogismTerms.js  70 Begriffstripel
    testConfig.js      Zeitlimits, Aufgabenzahlen, Simulationsablauf
  engines/         Aufgabengenerierung, frei von React
    figures.js         Konvexe Grundformen, Zerlegung, widerlegte Distraktoren
    memory.js          Allergieausweise + 13 Fragetypen
    numberSeries.js    30 Generatoren in 7 Stufen und 7 Regelfamilien
    wordFluency.js     Buchstabensalat mit Shuffle-Garantie
    syllogism.js       Venn-Modellprüfung über alle 128 Modelle
  store/           Zustand-Stores (settings/progress persistiert, navigation nicht)
  hooks/           useCountdown, useFeedback, useSwipe, useTheme
  components/      UI-Bausteine, Layout, Diagramme, Ausweiskarte
  screens/         Tabs und Untertests (lazy geladen)
```

### Grundsätze für Daten und Dateien

* **Datenlisten enthalten keine Logik.** Alles unter `src/data/` ist eine reine
  Liste bzw. Konfiguration; jede Generierung liegt in `src/engines/`.
* **Zahlen stehen genau einmal.** Zeitlimits und Aufgabenzahlen kommen
  ausschließlich aus `src/data/testConfig.js` – Screens, Simulation und
  Statistik lesen von dort.
* **Gespeichert wird nur das Minimum.** Im `localStorage` liegt pro Übung ein
  schlanker Eintrag (`{ testId, score, max, seconds, at, mode }`); Schnitt,
  Streak, Bestwert und Verlauf werden beim Lesen berechnet und nie doppelt
  abgelegt.
* **Speicherschlüssel sind versioniert** (`medat-kff.settings.v1`,
  `medat-kff.progress.v1`) und werden beim Laden zusammengeführt, damit neue
  Felder alte Daten nicht zerstören.
* **Datenbank-Invarianten werden geprüft, nicht gehofft** – siehe
  `npm run selftest`.

## Logik der Untertests

**Implikationen** – Statt einer Tabelle gültiger Modi wird die Gültigkeit
semantisch bestimmt: Das Venn-Diagramm dreier Mengen hat 7 Regionen, ein Modell
legt für jede Region fest, ob sie leer oder besetzt ist (2⁷ = 128 Modelle). Eine
Schlussfolgerung ist gültig, wenn sie in allen Modellen wahr ist, die beide
Prämissen erfüllen. Verwendet wird die traditionelle Logik mit existenzieller
Voraussetzung. Nebenprodukt ist der Status jeder Region – daraus entsteht die
Erklärungsgrafik.

**Zahlenfolgen** – 30 Generatoren liefern je 9 ganzzahlige Werte plus die
Regelbeschreibung, die nach dem Prüfen als Erklärung erscheint. Jeder Generator
trägt zwei Angaben: eine Schwierigkeitsstufe (1–7) und eine Regelfamilie
(Addition, Multiplikation, Potenzen, Fibonacci, alternierend, verschachtelt,
kombiniert).

Entscheidend ist, dass eine Stufe **keine** Regelfamilie ist: Auf jeder Stufe
mischen sich mindestens drei Familien. Andernfalls bekäme man – gerade im
adaptiven Modus, der auf einer Stufe verweilt – mehrere Aufgaben hintereinander
nach demselben Schema. Innerhalb eines Durchgangs wird zusätzlich verhindert,
dass zwei Aufgaben derselben Familie direkt aufeinander folgen, und die adaptive
Stufe schwankt um ±1.

„MedAT-Niveau“ verwendet die Stufen 4–7; ein Filter verwirft außerdem Folgen,
die trotz komplizierter Vorschrift auf eine konstante Differenz oder einen
konstanten Faktor hinauslaufen.

**Wortflüssigkeit** – Der Buchstabensalat weicht an mindestens 3 Positionen vom
Original ab, beginnt nie mit dem gesuchten Buchstaben und wird aus mehreren
Mischungen so gewählt, dass möglichst wenige benachbarte Buchstabenpaare des
Originals übrig bleiben (in der Praxis unter 1 %).

„MedAT-Niveau“ stellt vier Bedingungen an ein Wort:

1. **8–9 Buchstaben** – kürzer ist zu schnell gelesen, länger verrät sich über
   die Wortstruktur.
2. **Sperrige Buchstabenfolge** (`decipherScore`): seltene Buchstabenpaare,
   seltene Einzelbuchstaben, niedriger Vokalanteil. Die nötigen Häufigkeiten
   werden aus der Wortdatenbank selbst berechnet. „Kerbholz“ und „Grenzwall“
   landen dadurch oben, „Marmelade“ und „Teekanne“ unten – Länge allein sagt
   wenig.
3. **Mehrere glaubwürdige Fehlanfänge** (`distractionScore`): wie viele der
   übrigen Buchstaben selbst ein Wort anführen könnten. Aus derselben Statistik
   werden die Distraktoren gewählt, und alle angebotenen Buchstaben stammen aus
   dem Salat – ein Distraktor wie „Y“ ließe sich ohne Nachdenken ausschließen.
4. **Keine Fremd- und Fachwörter** – gepflegt als Liste in
   `FOREIGN_OR_TECHNICAL` (siehe `src/data/nouns.js`), bewusst nicht als
   Endungsheuristik, die auch „Meinung“ oder „Musik“ träfe.

Leicht/Mittel/Schwer bleiben rein längenbasiert (5–6, 7–9, 10–14 Buchstaben).
In ~20 % der Aufgaben ist e) „Keine Antwort ist richtig“ korrekt.

**Gedächtnis** – Jeder Fragetyp prüft vor der Erzeugung, ob die zugrunde liegende
Tatsache eindeutig ist (z. B. wird nach einem Allergen nur gefragt, wenn genau
eine Person es hat). In ~15 % der Fragen ist e) korrekt.

**Figuren zusammensetzen** – Antwortaufbau wie im Test: a bis d zeigen Figuren,
e lautet immer „Keine der Antwortmöglichkeiten ist richtig“ und trifft in etwa
jeder fünften Aufgabe tatsächlich zu.

Als Lösung kommen nur die beiden Kategorien des Tests vor: regelmäßige Vielecke
(Fünf- bis Achteck) und Kreissegmente (Viertel-, Halb-, Dreiviertel-,
Vollkreis). Trapez, Dreieck, Quadrat und Rechteck treten ausschließlich als
Distraktor auf. Runde Ränder sind mit 96 Segmenten pro Vollkreis angenähert;
alle Formen sind konvex, weshalb jede Schnittgerade sie in genau zwei gültige
Teile zerlegt. Die Zerlegung schneidet immer das größte Teil, damit keine
Splitter entstehen.

Die Distraktoren bilden die vier im Test üblichen Sorten ab: andere Eckenzahl
bzw. anderes Kreissegment, abgeschnittene Ecke, andere Proportionen und – bei
runden Lösungen – eine leicht andere Krümmung. Für jeden ist beweisbar, dass er
sich nicht legen lässt: Seine Fläche weicht von der Summe der Teilflächen ab,
und eine Fläche, die nicht passt, lässt sich in keiner Anordnung lückenlos
auslegen. Der Unterschied liegt bei 4–10 % und ist mit dem Auge nicht messbar –
gelöst wird über die Form.

Teilstücke und Antwortfiguren werden mit demselben Faktor gezeichnet. Ohne das
liesse sich die Aufgabe über die Größe statt über die Form entscheiden.

## Veröffentlichen

Der Build verwendet relative Pfade (`base: './'`), läuft also auf jedem Host –
auch in einem Unterverzeichnis wie `https://name.github.io/Medat/`.

**GitHub Pages** (eingerichtet): Einmalig unter Settings → Pages als Source
„GitHub Actions" wählen. Danach läuft bei jedem Push auf den Standard-Branch
`.github/workflows/deploy-pages.yml` – Selbsttest, Build und Deploy. Ergebnis:
`https://ykzyt7s8nn-cloud.github.io/Medat/`

**Alternativ Vercel oder Netlify** (nötig, falls das Repository privat ist):

1. Auf vercel.com bzw. netlify.com mit GitHub anmelden und dieses Repository
   importieren.
2. Build-Befehl `npm run build`, Ausgabeverzeichnis `dist` (wird meist
   automatisch erkannt).
3. Nach dem Deploy gibt es eine HTTPS-Adresse – diese auf dem iPhone öffnen.

## Installation auf dem iPhone

1. Die HTTPS-Adresse **in Safari** öffnen (nicht in Chrome – nur Safari kann
   Web-Apps auf den Home-Bildschirm legen).
2. Teilen-Symbol → „Zum Home-Bildschirm“ → Hinzufügen.
3. Die App startet danach im Vollbild ohne Safari-Leiste.

Nach dem ersten Laden ist alles offline verfügbar: Der Service Worker cacht beim
Installieren sämtliche Dateien aus `dist/precache.json`, also auch die
nachgeladenen Bundles der einzelnen Untertests.

Hinweis zum Fortschritt: Die Daten liegen im lokalen Speicher des jeweiligen
Browsers. Übungen, die vorher im Safari-Tab gemacht wurden, tauchen in der
installierten Web-App unter Umständen nicht auf.

Zum Ausprobieren im eigenen WLAN reicht `npm run dev -- --host` – „Zum
Home-Bildschirm“ funktioniert dann zwar, Offline-Betrieb jedoch nicht, weil
Safari Service Worker nur über HTTPS zulässt.

## Hinweis

Privates Übungsprojekt ohne Verbindung zu den offiziellen MedAT-Veranstaltern.
Der geschätzte Prozentrang im Simulationsmodus ist eine grobe Orientierung, keine
Prognose.
