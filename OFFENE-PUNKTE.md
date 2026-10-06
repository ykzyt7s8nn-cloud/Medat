# Offene Punkte

Was noch aussteht, mit dem Stand, auf dem es liegen geblieben ist. Erledigtes
wird hier gelöscht, nicht abgehakt – die Geschichte steht im Git-Log.

## 1. SEK: offene Fragen nach dem Abgleich

Die drei SEK-Untertests sind an dem Muster ausgerichtet, das offizielle
Hinweise und Erfahrungsberichte beschreiben – bei „Emotionen erkennen“ und
„Soziales Entscheiden“ zählt die Auswahl bzw. Rangfolge, die die
Testerstellenden erwarten, nicht das im Einzelfall individuell Plausible.
Trainiert die App an diesem Muster vorbei, sehen die Aufgaben richtig aus, und
die Rückmeldung ist trotzdem systematisch falsch. Deshalb bleibt festgehalten,
was am Muster noch unbestätigt ist.

**Stand SEK.** Recherchiert, abgeglichen und nachgezogen; das Muster samt
Quellen steht jetzt im Kopf jeder der drei Datendateien unter `src/data/sek/`.
Offen sind nur noch Punkte, die sich ohne bessere Quellen nicht klären lassen:

* **Das Zusammenhangsmaß beim Sozialen Entscheiden.** Offiziell heißt es nur,
  die Übereinstimmung der Rangreihen werde über ein Zusammenhangsmaß bestimmt.
  Umgesetzt ist die Spearman-Korrelation (negativ als null), weil sie genau
  die in Erfahrungsberichten genannten Teilpunkte 0,9 und 0,7 erzeugt. Ob der
  Test wirklich Spearman nimmt oder z. B. Kendall, und ob negative Werte auf
  null gesetzt werden, ist nicht bestätigt. Prüfen, sobald die
  Informationsbroschüre des Testjahrs zur Hand ist – die Seiten von
  medizinstudieren.at und den Anbietern waren aus der Arbeitsumgebung nicht
  abrufbar, ausgewertet wurden nur Suchergebnisse.
* **Gibt es bei „Emotionen erkennen“ Aufgaben mit null oder fünf
  wahrscheinlichen Gefühlen?** Der Bestand mischt jetzt eins bis vier; ob die
  Ränder im echten Test vorkommen, sagt keine der gefundenen Quellen. Der
  Selbsttest verbietet sie derzeit – fällt die Antwort „ja“ aus, dort
  lockern und ein paar Aufgaben ergänzen.
* **Altfragensammlungen und Übungsbücher** (MedGurus, SEK-TV-Breaker, ÖH-
  Skripten) sind nicht eingesehen. Sie könnten zeigen, ob die Rangleiter in
  Grenzfällen anders sortiert – etwa wenn eine Regel und das Wohl eines
  Einzelnen gegeneinander stehen – und wie oft beim Regulieren die richtige
  Antwort Neubewertung statt Handeln ist (hier etwa jede vierte
  Aufgabe).

**Wo die Grenze liegt.** Nachgebildet wird das Muster, nicht die Aufgabe. Keine
Originalaufgaben und keine Originaltexte übernehmen. Was übernommen wird, bleibt
offengelegt: In den Datendateien steht, welchem Prinzip der Lösungsschlüssel
folgt, und die App sagt an drei Stellen selbst, dass es eigene Aufgaben sind.

## 2. Textverständnis an Originalunterlagen gegenprüfen

Format, Fragetypen und Umfang folgen inzwischen dem, was Vorbereitungsanbieter
und Erfahrungsberichte zum MedAT 2023–2025 übereinstimmend beschreiben (siehe
Kopf von `src/data/tv/texts.js`). Die offiziellen Seiten selbst
(medizinstudieren.at, Verordnung der MedUni Wien, ÖH-Probetest) waren bei der
Recherche nicht abrufbar. **Offen ist der Abgleich mit dem offiziellen
Probetest:** ob die Texte dort deutlich länger sind als die hier geschriebenen
200–340 Wörter und wie oft eine Aussagenkombination „Alle“ oder „Keine“ als
Lösung hat – Letzteres kommt hier bislang nicht vor. Falls ja, Texte verlängern
bzw. solche Lösungen ergänzen; der Selbsttest prüft Länge und Kombinationen
bereits und muss nur in seinen Grenzen nachgezogen werden.

## 3. Haptik am Gerät bestätigen

Auf iOS gibt es Haptik nur über den systemeigenen Schalter, und die ist – am
Gerät nachgeprüft – ausschließlich unter dem Finger zu spüren; ein
programmatisch ausgelöster Impuls bleibt still. Deshalb trägt seit
`70199f3` jede tappbare Fläche ihren eigenen, nahezu durchsichtigen Schalter
(siehe `src/components/ui/Tappable.jsx`).

Im Browser mit nachgebauter iOS-Umgebung ist das geprüft: genau eine echte
Aktivierung je Tipp, keine Doppelauslösung, Zugänglichkeit unverändert. **Was
fehlt, ist die Bestätigung am echten iPhone** – ob der Impuls dort ankommt und
ob er auch am Rand einer Antwortfläche auslöst. Falls nur die Mitte trägt, liegt
es daran, wie Safari den Schalter zeichnet; dann ist an der Größe des Schalters
nachzujustieren, nicht am Verfahren.

**Zielkonflikt mit dem Scrollen.** Der Schalter wertet Berührungen selbst aus
und schaltete am Ende einer Scrollbewegung um – so kam beim Scrollen eine
Antwort durch. Seit dem Tipp-Wächter (`src/lib/tapGuard.js`) wählt eine
Scrollbewegung nichts mehr; im Browser mit nachgebautem Schalter geprüft
(Scrollgeste von 40 px wählt in keinem Untertest etwas, ein Tipp weiterhin).
Am iPhone zu klären bleibt:

* Wählt beim Scrollen über die Antworten wirklich nichts mehr – auch bei sehr
  kurzen, schnellen Wischern und beim Anhalten einer auslaufenden Bewegung?
* Gibt es beim Scrollen über eine Antwort trotzdem einen Impuls? Das wäre der
  bekannte Zielkonflikt (der Impuls lässt sich nicht zurücknehmen) – störend,
  aber harmlos. Falls er sehr lästig ist: Haptik nur noch auf Knöpfen statt auf
  Antwortflächen, oder Haptik standardmäßig aus.
* Lässt sich überhaupt flüssig scrollen, wenn der Finger auf einer Antwort
  aufsetzt, oder hält der Schalter die Bewegung fest? Falls er sie festhält,
  sind die Schalter auf großen Flächen nicht zu halten; dann dort entfernen.
* Fühlen sich normale Tipps unverändert an, also keine verschluckten Tipps
  (Toleranz 10 px, Sperre 120 ms nach dem letzten Scrollschritt)?

## 4. Folgeaufgaben aus dem Niveau-Vergleich

Begründung und Quellen stehen in `docs/recherche/niveau-vergleich.md`
(Abschnitt 5). Die Recherche stützt sich nur auf Suchergebnis-Auszüge, weil
alle Seiten aus der Arbeitsumgebung gesperrt waren. Was auf
Anbieter-Abschriften der Stichwortliste beruht, vor dem Umsetzen an der
aktuellen Liste im VMC prüfen (kostenloses Konto).

**Testtreue – zuerst:**

* **Figuren: 20 statt 15 Minuten.** Offiziell sind es 15 Aufgaben in 20 min.
  `TESTS.figures.testSeconds` steht auf 15 min, die README-Tabelle ebenso;
  die KFF-Simulation ist dadurch 5 min zu kurz. Der Selbsttest schreibt die
  15 min derzeit fest („Figuren zusammensetzen: 15 Aufgaben, 15 Min“) und
  muss mitgezogen werden. Prozentrang-Schätzung danach prüfen.
* **Allergieausweis: Ausweisnummer und Ausstellungsland statt Blutdruck und
  Brille.** Die offizielle Beschreibung nennt eine fünfstellige Nummer und
  einen existierenden Staat. `src/engines/memory.js` (Kopfkommentar
  „exakt die acht MedAT-Felder“ ist falsch), Ausweiskarte, Fragetypen
  (Nummer ↔ Person, Teilziffern, Land ↔ Person), README und Selbsttest
  anpassen. Fantasienamen statt realer Namen erwägen.
* **Figuren: Vierecke als Lösung zulassen.** Seit 2024 kommen Quadrat,
  Rechteck und Trapez als richtige Antwort vor, 2025 wurden Parallelogramm
  und Dreieck angekündigt. Heute sind sie in `figures.js` reine Distraktoren.
  Teilezahl der MedAT-Stufe auf 3–7 erweitern.

**BMS-Stoff nach Stichwortliste:** Die genannten Lücken sind inzwischen
geschlossen (Vektoren, Analysis, Fluide, Schwingungen, Elektrostatik, Impuls,
Kernphysik, Orbitale, Elementgruppen, „Der menschliche Körper“ mit 60 Fragen,
genetischer Fingerabdruck/GVO). Offen bleibt der Abgleich mit der aktuellen
Stichwortliste im VMC – vor allem, ob „Statistik“ in Mathe überhaupt verlangt
wird und ob Analysis dazugehört.

**Formate:**

* **Zahlenfolgen:** MC-Modus mit Zahlenpaaren A–D und E anbieten. Primzahl-
  und Quadratzahlregeln aus der MedAT-Stufe nehmen (Test: nur
  Grundrechenarten), dreifach verschachtelte Folgen und die rekursiven
  Mischsysteme seit 2024 ergänzen.
* **Implikationen:** einen Teil der Begriffstripel absurd bzw.
  weltwissenswidrig wählen, damit die Glaubensfalle geübt wird.
