# MedAT Trainer

Übungs-App für den österreichischen Medizin-Aufnahmetest (MedAT-H). Abgedeckt
sind alle vier Testteile mit ihren offiziellen Gewichten:

| Teil | Gewicht | Umfang |
|---|---|---|
| **BMS** – Basiskenntnistest | 40 % | 94 Fragen in 75 min (Bio 40, Chemie 24, Physik 18, Mathe 12) |
| **KFF** – kognitive Fähigkeiten | 40 % | fünf Untertests |
| **TV** – Textverständnis | 10 % | 12 Aufgaben in 35 min |
| **SEK** – sozial-emotionale Kompetenzen | 10 % | drei Untertests, zusammen 60 min |

React + Vite + TailwindCSS, als PWA installierbar, vollständig offline
nutzbar – **kein Backend, keine externen APIs, keine Anmeldung**. Die KFF-Aufgaben
werden auf dem Gerät erzeugt, die übrigen sind geschriebene Inhalte; Fortschritt
und Einstellungen liegen ausschließlich im `localStorage`.

Optimiert für iPhone 15 Pro (393 × 852) inklusive Safe-Area-Insets, funktioniert
aber auch auf iPad und Desktop.

## Enthaltene Untertests

Kognitive Fähigkeiten und Fertigkeiten (KFF):

| Untertest | Aufgaben | Zeit | Besonderheit |
|---|---|---|---|
| Figuren zusammensetzen | 15 | 15 min | Vielecke und Kreissegmente aus Teilstücken erkennen; e) = „keine ist richtig“ |
| Gedächtnis & Merkfähigkeit | 8 Ausweise + 25 Fragen | 8 min lernen, 15 min prüfen | Pause dazwischen einstellbar (2/5/10/20/40 min) |
| Zahlenfolgen | 10 | 15 min | 7 Zahlen sichtbar, 2 gesucht; 7 Stufen, optional adaptiv |
| Wortflüssigkeit | 15 | 20 min | Buchstabensalat, Anfangsbuchstabe gesucht |
| Implikationen erkennen | 10 | 10 min | Syllogismen mit Venn-Diagramm-Auflösung |

Textverständnis und sozial-emotionale Kompetenzen:

| Untertest | Aufgaben | Zeit | Besonderheit |
|---|---|---|---|
| Textverständnis | 12 | 35 min | 3 Sachtexte mit je 4 Fragen; der Text bleibt beim Antworten sichtbar |
| Emotionen erkennen | 14 | 21 min | 5 Gefühle je Situation, alles oder nichts |
| Emotionen regulieren | 12 | 18 min | 4 Vorsätze, genau einer führt zum genannten Ziel |
| Soziales Entscheiden | 14 | 21 min | 5 Überlegungen auf a–e reihen, Teilpunkte je Marke |

Dazu ein **Simulationsmodus** je Testteil: die fünf KFF-Untertests in der echten
Reihenfolge mit Originalzeiten (mit geschätztem KFF-Prozentrang am Ende) und
die vier BMS-Fächer am Stück.

### Zur Verlässlichkeit der Inhalte

Aufgabenzahlen, Zeitlimits, Formate und Gewichte folgen den offiziellen
MedAT-H-Vorgaben. Die Aufgaben selbst sind sämtlich eigens geschrieben; die App
enthält keine Originalaufgaben und keine Originaltexte.

Bei den sozial-emotionalen Untertests gibt es keinen objektiven Lösungsschlüssel,
sondern nur den, den der Test erwartet. Deshalb folgt hier jede Aufgabe einem
offengelegten Prinzip, das in den Datendateien beschrieben steht: bei „Emotionen
regulieren“ der Bezug auf das genannte Ziel, bei „Soziales Entscheiden“ eine
Rangleiter nach Kohlberg (Wohl der Betroffenen → Pflicht und Allgemeinheit →
Erwartungen des Umfelds → eigener Vorteil → vermiedene Nachteile). Wer das
Prinzip lernt, hat das Übertragbare gelernt; die einzelne Aufgabe ist nur das
Material dafür.

## BMS – Basiskenntnistest

Der BMS macht 40 % der MedAT-Gesamtwertung aus. Der Bereich hat zwei Ansichten:

**Lexikon** – 140 Stichwörter auf Maturaniveau, nach Fach und Thema geordnet und
über alle Fächer hinweg durchsuchbar. Jeder Eintrag hat eine Erklärung in
mehreren Sätzen, Schlüsselfakten als Stichpunkte, bei Bedarf Formeln und eine
Merkhilfe sowie Querverweise auf verwandte Stichwörter. Gelesene Einträge werden
mitgezählt.

**Quiz** – Fragen im MedAT-Format (1 aus 5, gelegentlich x aus 5, letzte Option
teilweise „Keine der angegebenen Antwortmöglichkeiten ist korrekt"). Nach jeder
Antwort erklärt die App, warum die richtige Antwort richtig und die gewählte
falsch ist, und verlinkt den passenden Lexikoneintrag.

| Fach | Themen | Einträge | Fragen | Simulation |
|---|---|---|---|---|
| Biologie | 9 | 65 | 110 | 40 Fragen / 30 min |
| Chemie | 10 | 43 | 120 | 24 Fragen / 18 min |
| Physik | 5 | 19 | 60 | 18 Fragen / 16 min |
| Mathematik | 4 | 13 | 48 | 12 Fragen / 11 min |
| **Gesamt** | **28** | **140** | **338** | **94 Fragen / 75 min** |

Trainieren lässt sich ein einzelnes Fach, ein einzelnes Thema oder die komplette
BMS-Simulation mit allen vier Fächern nacheinander.

## Lernfunktionen

**Schwachstellen-Training** – Für jede Aufgabe wird die Kategorie mitgeschrieben:
bei Zahlenfolgen die Regelfamilie, beim Gedächtnistest der Fragetyp, bei den
Implikationen die Figur, bei der Wortflüssigkeit die Wortlänge, bei den Figuren
die Anzahl der Teilstücke. Der gleichnamige Screen zeigt Trefferquote und
Zeitbedarf je Kategorie und startet auf Wunsch einen Durchgang, der nur die
schwachen Kategorien zieht.

**Freie Navigation in jedem Untertest** – Wie im echten MedAT arbeitet man einen
Untertest nicht zwingend der Reihe nach ab: Jede Aufgabe lässt sich
überspringen und bleibt im Stapel, über die Zahlenleiste springt man direkt zu
jeder anderen, Aufgaben lassen sich zum Wiederkommen markieren, und „x offen ·
zur nächsten" führt zur nächsten unbeantworteten. So bleibt man nicht an einer
Aufgabe hängen, holt anderswo Punkte und knobelt am Ende an den offenen.

**Übungs- und Prüfungsmodus** – Beide nutzen dieselbe Mechanik; der Unterschied
ist allein die Auflösung. Im Übungsmodus wird eine Aufgabe nach dem Beantworten
sofort aufgedeckt und bleibt danach unveränderlich – in der Zahlenleiste sieht
man dann auch, was richtig und was falsch war. Im Prüfungsmodus bleibt alles bis
zur Abgabe verdeckt, so wie im echten Test.

**Ton, Haptik und Zeitwarnung** – Beides ist dreistufig einstellbar. Der Ton
steht auf „Auflösung“, gibt also nur bei richtig, falsch und am Ende einen
Laut; „Alles“ ergänzt den Ton bei jedem Tippen. Zusätzlich meldet sich die App
bei 5 Minuten, 1 Minute und 10 Sekunden Restzeit, damit man beim Üben nicht auf
die Uhr schauen muss.

Die Haptik geht zwei verschiedene Wege, weil die Geräte verschieden sind. Wo es
`navigator.vibrate` gibt, wird pro Ereignis ein eigenes Muster gefahren und
„Deutlich“ unterscheidet sie zusätzlich über die Zahl der Impulse. Safari kennt
die Schnittstelle nicht; dort bleibt seit iOS 17.4 nur der systemeigene
Schalter, und der ist – am Gerät nachgeprüft – ausschließlich unter dem Finger
zu spüren, ein programmatisch ausgelöster Impuls bleibt still. Deshalb trägt
jede tappbare Fläche ihren eigenen, nahezu durchsichtigen Schalter über ihrer
ganzen Breite: Jeder Tipp trifft ihn, das System gibt seinen Impuls, der Klick
steigt von dort zum Button auf. Auf dem iPhone gibt es damit einen Impuls je
Tipp – richtig, falsch und fertig unterscheidet dort der Ton, und die
Zeitwarnung bleibt ein reiner Ton, weil zu ihr kein Finger gehört. Der
Probierknopf in den Einstellungen ist bewusst eine ganz gewöhnliche Fläche: Er
löst dieselbe Haptik aus wie jede Antwort im Untertest und zeigt darunter den
genutzten Weg. Wo das Gerät nichts anbietet, ist der Regler abgeschaltet und
sagt das auch.

**Fehlerarchiv mit Wiedervorlage** – Eine falsch beantwortete BMS-Frage kommt
nach einem Tag wieder, bei erneut richtiger Antwort nach drei, dann nach sieben
Tagen; dreimal in Folge richtig heißt gelernt. Ein Fehler zwischendurch setzt
zurück. Die Abstände sind bewusst kurz – längere Ketten bringen erst über
Monate etwas und wären vor einem Aufnahmetest in wenigen Wochen verschenkt.

**Tägliche 10** – Zehn Fragen quer über alle vier BMS-Fächer: erst das heute
Fällige, dann die schwächsten Themen, notfalls aufgefüllt, damit die Zehn auch
am ersten Tag vollzählig sind.

**Testtermin und Strähne** – Das Datum des MedAT lässt sich eintragen, dann
zählt der Startbildschirm die Tage; ab zwei Wochen Restzeit wechselt die Karte
die Farbe. Die Strähne zählt Tage mit mindestens einer Übung, gleich in welchem
Testteil.

**Gewichteter Gesamtwert** – Die Statistik rechnet die vier Testteile nach den
offiziellen Gewichten zusammen und zeigt, wo Übung am meisten bringt: Zehn
Prozentpunkte im BMS wiegen viermal so schwer wie zehn im Textverständnis. Was
dabei ausdrücklich nicht herauskommt, ist ein Prozentrang – im echten Test wird
der Rang gegenüber allen Mitschreibenden gewertet, nicht der Anteil richtiger
Antworten.

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
npm run selftest   # Daten- und Engine-Prüfungen (199 Checks)
npm run icons      # PWA-Icons neu generieren
```

`npm run selftest` prüft unter anderem, ob die Syllogismus-Engine exakt die 24
klassisch gültigen Modi liefert, ob jede MC-Frage genau eine richtige Antwort
hat, ob die Wortdatenbank anagramm-eindeutig bleibt, ob jede Zahlenfolgen-Stufe
mehrere Regelfamilien mischt, ob sich bei den Figuren genau eine der fünf
Antwortfiguren aus den Teilstücken legen lässt – und, seit es einmal
schiefging, ob die richtige Antwort nach dem Mischen nicht mehr an fester
Stelle steht.

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
    testConfig.js      Testteile samt Gewichten, Zeitlimits, Aufgabenzahlen
    bms/               BMS-Inhalte, ein Modul je Thema
      index.js           Fächer, Zeiten, Datenschema, Lazy-Loader
      biologie/          9 Themenmodule
      chemie/            10 Themenmodule
      physik/            5 Themenmodule
      mathematik/        4 Themenmodule
    sek/               Sozial-emotionale Aufgaben, ein Modul je Untertest
    tv/                Textverständnis: Sachtexte mit je vier Fragen
  engines/         Aufgabengenerierung, frei von React
    figures.js         Konvexe Grundformen, Zerlegung, widerlegte Distraktoren
    memory.js          Allergieausweise + 13 Fragetypen
    numberSeries.js    30 Generatoren in 7 Stufen und 7 Regelfamilien
    wordFluency.js     Buchstabensalat mit Shuffle-Garantie
    syllogism.js       Venn-Modellprüfung über alle 128 Modelle
  store/           Zustand-Stores (settings/progress persistiert, navigation nicht)
  hooks/           useCountdown, useTaskSession, useFeedback, useSwipe, useTheme,
                   useActivity (Strähne und Zeit über beide Testteile)
  lib/             geometry, format, backup, timeWarnings, spacedRepetition,
                   examDate, sekScoring, overallScore
  components/      UI-Bausteine, Layout, Diagramme, Ausweiskarte
  screens/         Tabs und Untertests (lazy geladen)
    bms/               Lexikon, Eintragsdetail, Quiz, BMS-Simulation
```

### Grundsätze für Daten und Dateien

* **Datenlisten enthalten keine Logik.** Alles unter `src/data/` ist eine reine
  Liste bzw. Konfiguration; jede Generierung liegt in `src/engines/`.
* **Zahlen stehen genau einmal.** Zeitlimits und Aufgabenzahlen kommen
  ausschließlich aus `src/data/testConfig.js` – Screens, Simulation und
  Statistik lesen von dort.
* **Gespeichert wird nur das Minimum.** Im `localStorage` liegt pro Übung ein
  schlanker Eintrag (`{ testId, score, max, seconds, at, mode }`); Schnitt,
  Strähne, Bestwert und Verlauf werden beim Lesen berechnet und nie doppelt
  abgelegt. Die Strähne gilt für KFF und BMS zusammen und wird deshalb in
  `hooks/useActivity.js` aus beiden Verläufen gebildet – eine zweite Zählung
  im Store hätte ihr früher oder später widersprochen.
* **Die richtige Antwort steht in den Quelldateien zuerst.** So lässt sich eine
  Frage beim Schreiben in einem Blick prüfen. Gemischt wird ausnahmslos erst
  beim Ziehen, und der Selbsttest hält beides fest: die Konvention in der Datei
  und das Mischen beim Ziehen.
* **Speicherschlüssel sind versioniert** (`medat-kff.settings.v1`,
  `medat-kff.progress.v1`, `medat-bms.progress.v1`) und werden beim Laden
  zusammengeführt, damit neue Felder alte Daten nicht zerstören.
* **Ein Thema, eine Datei.** Die BMS-Inhalte liegen als je ein Modul pro
  Hauptthema unter `src/data/bms/<fach>/`; zusammengesetzt wird erst in der
  `index.js` des Fachs. So lässt sich ein Thema überarbeiten, ohne die übrigen
  anzufassen, und jedes Fach wird als eigener Chunk nachgeladen.
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
