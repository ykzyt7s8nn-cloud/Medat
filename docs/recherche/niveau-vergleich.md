# Niveau-Vergleich: echte MedAT-Aufgaben und App

Stand 5.10.2026, App-Stand `490a382`. Quellen siehe [quellen.md](quellen.md),
Muster siehe [aufgabenmuster.md](aufgabenmuster.md). Die Einschätzung der
echten Aufgaben beruht **nur auf Suchergebnis-Auszügen** (alle Seiten waren
für den Proxy gesperrt). Die offizielle Stichwortliste und die Übungsbeispiele
im VMC waren nicht einsehbar. Wo eine Angabe unsicher ist, steht das dabei.

Die App-Seite ist am Code geprüft: Daten unter `src/data/`, Beispielaufgaben
mit kleinen Node-Skripten aus `src/engines/` erzeugt.

## Kurzfassung

| Testteil | Echter Test (laut Quellen) | App | Urteil |
|---|---|---|---|
| BMS Biologie | überwiegend Standardstoff, jedes Jahr einige Detailfragen; Schwerpunkt Organsysteme | 110 Fragen, kurz (Ø 8,5 Wörter Fragetext), gut zur Stichwortliste passend, aber nur **14 Fragen** zu „Der menschliche Körper“ | **leichter**, Gewichtung schief |
| BMS Chemie | seit 2025/26 mehr Verständnisfragen (Diagramme, PSE-Aussagen, Anwendungen) | 120 Fragen, gute Breite bei Grundlagen, Lücken bei „Mikrokosmos“, Orbitalen und „Elemente und Verbindungen“ | **leichter**, Lücken |
| BMS Physik | Definitionen, wenig Rechnen; breite Stichwortliste | 60 Fragen in 5 Themen; Schwingungen, Wellenoptik, Elektrostatik, Impuls, Gravitation, Kernspaltung/-fusion fehlen | **ähnlich schwer, aber deutlich schmaler** |
| BMS Mathematik | Kopfrechnen ≤ 1 min, inkl. Vektoren, Differential/Integral | 48 Fragen; Vektorrechnung und Differential/Integral fehlen ganz; dafür Statistik (nicht auf der Liste) | **leichter**, falscher Zuschnitt |
| Figuren | 15 Aufg./**20 min**, 3–7 Teile, seit 2024 auch Vierecke als Lösung | **15 min**, 4–5 Teile (MedAT-Stufe), Vierecke/Dreieck **nur** als Distraktor | **schwerer** (Zeit), Formen veraltet |
| Gedächtnis | 8 Ausweise mit Foto, Name, Geburtstag, Medikamente, Blutgruppe, Allergien, **Ausweisnummer, Ausstellungsland** | statt Nummer und Land: **Blutdruck und Brille**; Name statt Fantasiename | **anderes Material**, Kernschwierigkeit (5-stellige Zahl) fehlt |
| Zahlenfolgen | nur Grundrechenarten, MC mit Zahlenpaaren + E, 2- und 3-fach verschachtelt, rekursive Mischsysteme | freie Eingabe beider Zahlen, Stufen 4–7 mit Quadrat-, Kubik- und Primzahlen, nur 2-fach verschachtelt | **ähnlich bis schwerer**, aber teils testfremde Muster |
| Wortflüssigkeit | 6–10 Buchstaben, Komposita, A–D + E | 8–9 Buchstaben, Komposita, A–D + E (≈ 20 % E) | **ähnlich** |
| Implikationen | 4 Quantoren, teils absurde Begriffe, E | 4 Quantoren, 4 Figuren, E (≈ 18 %), realistische Begriffstripel | **ähnlich**, Glaubens-Falle wenig trainiert |
| TV | 4–5 Texte, 75–300+ Wörter, Trend länger | 20 Texte, 205–340 Wörter, drei Fragetypen | **ähnlich** (offizieller Probetest nicht geprüft) |
| SEK | Muster nach offizieller Beschreibung | an Muster ausgerichtet (38/30/34 Aufgaben) | **ähnlich**, Schlüssel nicht verifizierbar |

---

## 1. BMS

### 1.1 Biologie

**Echter Test.** Gefragt wird überwiegend Standardstoff. 2026 hieß es,
Biologie sei „sehr oberflächlich“ gewesen und die Zeit habe gereicht [20].
2024 kamen dagegen mehrere neue Detailfragen [21]. Der Altfragen-Bestand
(medinaut) hat zu „Der menschliche Körper“ über 100 Fragen, zu den Zell- und
Genetik-Themen je rund 30 [15]. Seit 2026 stehen neu PCR,
DNA-Sequenzierung, Genomanalyse, genetischer Fingerabdruck und GVO auf der
Liste [27]. Seit 2023 gehört „Zelltypen und Strukturen“ zum Stichwort Gewebe
[25].

**App.** Neun Themen, die Stichwortliste ist gut abgebildet (Zelle mit allen
Organellen, Zellkontakte und Zelltod, Organsysteme, Frühentwicklung,
klassische, molekulare und Humangenetik, Evolution, Ökologie, Immunbiologie).
Die Fragen sind kurz und prüfen meist ein einzelnes Faktum. Beispiele: Ort der
Glykolyse; welche Zelle Antikörper bildet; welche Muskulatur quergestreift und
unwillkürlich ist.

**Vergleich.** Das Niveau einer einzelnen Frage entspricht dem leichteren
Teil des echten Tests. Es fehlen:

- *Gewichtung.* „Der menschliche Körper“ hat 11 Lexikoneinträge, aber nur 14
  von 110 Fragen, also etwa eine je Organsystem. Im echten Test und im
  Altfragen-Bestand ist das der größte Block.
- *Detailfragen zu Organsystemen.* Histologie (Zelltypen einzelner Gewebe,
  z. B. Hoden, Niere, Magen), Hormone samt Bildungsort und Wirkung, Herz und
  Gefäßentwicklung, Nephron-Abschnitte, Reizleitung.
- *Gentechnik 2026.* Genetischer Fingerabdruck und GVO fehlen. PCR und
  Sequenzierung sind vorhanden, Genomanalyse nur am Rand.
- *Formate.* Es gibt keine Aussagenkombination (1–4) und nur eine echte
  Negativfrage („… NICHT …“, Zelle).
  Dafür hat die App 7 „x aus 5“-Fragen, ein Format, das der echte Antwortbogen
  nicht kennt.

### 1.2 Chemie

**Echter Test.** Laut Berichten seit 2025/26 mehr Verständnis gefragt [20],
[24]. Stichwortliste laut Anbietern [31], [32], [33]: Atombau (mit Nukliden),
**Mikrokosmos** (Unschärferelation, Licht als elektromagnetische Strahlung,
Welle-Teilchen-Dualismus), **Gasgesetze**, Aggregatzustände, Periodensystem,
Bindung, Reaktionen, Gleichgewicht (MWG, Katalyse, Aktivierungsenergie),
**Elemente und deren Verbindungen** (Wasserstoff, Sauerstoff/Wasser,
Kohlenstoff mit Oxiden und Kohlensäure, Stickstoff, Halogene, seit 2026
Schwefel), Säure-Base, Redox (mit Redoxpotenzial), organische Chemie (mit
Nomenklatur, **Thiole, Ether, Anhydride**) und Naturstoffe.

**App.** 10 Themen, 43 Einträge, 120 Fragen. Stark bei Stöchiometrie,
Säure-Base, Redox, Kohlenwasserstoffen und Naturstoffen. Beispiele:
Neutronenzahl aus Ordnungs- und Massenzahl; welches Metall mit Salzsäure
Wasserstoff bildet.

**Lücken** (Abgleich der Stichworte mit `grep` über `src/data/bms/chemie`):
Quantenzahlen und Orbitale, Unschärferelation und Welle-Teilchen-Dualismus,
eigene Einträge zu den Elementgruppen H/O/N/C/Halogene/S, Thiole, Ether,
Anhydride, systematische Nomenklatur und das Massenwirkungsgesetz als Rechnung.
Gasgesetze stehen nur in Physik. Fragen zum Deuten von Energiediagrammen
(z. B. freie Enthalpie) gibt es nicht. **Urteil:** leichter und mit Lücken.

### 1.3 Physik

**Echter Test.** Viele Definitionen, kaum Rechnen; 2026 nur eine Rechnung
(Brechkraft) [20]. 2025 eher Verständnis als Auswendiglernen [24].
Stichwortliste laut Anbietern [30], [32], [33]: Größen und Einheiten;
Mechanik (Erhaltungssätze, Translation und Rotation, Impuls, Gravitation,
Reibung, Dichte, Auftrieb, Bernoulli); **Schwingungen und Wellen** (Pendel,
harmonische und gedämpfte Schwingung, Überlagerung, Polarisation);
Wärmelehre; Elektrizität (**Elektrostatik**, Gleichstrom, Magnetfeld,
Wechselstrom); Optik (geometrische und **Wellenoptik**, optische Geräte,
Auge); Atom- und Kernphysik (Orbitale, Kernkräfte, **Kernspaltung und
-fusion, Antiteilchen**, Aktivität, Absorption ionisierender Strahlung,
**kosmische Strahlung**).

**App.** 5 Themen, 19 Einträge, 60 Fragen. Beispiele: mittlere
Geschwindigkeit aus 300 m in 20 s; Anteil nach drei Halbwertszeiten.

**Vergleich.** Die einzelne Aufgabe liegt auf ähnlichem Niveau. Die
Stichwortliste ist aber nur zu etwa der Hälfte abgedeckt. Es fehlen
Schwingungen (ganz), Wellenoptik/Interferenz/Polarisation, Elektrostatik
(Coulomb, Feld, Kondensator), Impuls und Erhaltungssätze, Rotation,
Gravitation, Bernoulli, Kernspaltung und -fusion, Antiteilchen, kosmische
Strahlung und der Doppler-Effekt. Physik ist das Fach mit dem größten
Rückstand.

### 1.4 Mathematik

**Echter Test.** Ohne Taschenrechner, unter einer Minute je Aufgabe [29].
Stichwortliste [30], [32], [33]: Zehnerpotenzen und Präfixe; Algebra
(Schlussrechnung, Prozent, Bruch, Gleichungen und **Ungleichungen**);
Geometrie (Winkel, Kreis, Dreieck, Prisma, Quader, Zylinder, Kugel, Pyramide,
Tetraeder); Einheiten; Funktionen (Winkelfunktionen, e-Funktion, Logarithmus,
Potenzfunktion, **Differential, Integral**, Gerade); **Vektorrechnung**
(Betrag, Winkel, Einheits- und Normalvektor, Addition, Skalarprodukt).

**App.** 4 Themen, 48 Fragen. Beispiele: 1/3 + 1/6; 3x + 7 = 22; Logarithmus
von 1000 zur Basis 10; Flächenmaßstab.

**Vergleich.** Die Aufgaben sind leichter als im Test und entsprechen etwa
der Unterstufe bis frühen Oberstufe. **Vektorrechnung, Differential und
Integral fehlen ganz.** Das Thema „Statistik und Wahrscheinlichkeit“ mit 12
Fragen steht nach den verfügbaren Auszügen **nicht** auf der Stichwortliste
und verbraucht ein Viertel des Mathe-Bestands. (Vor einer Streichung am VMC
prüfen.)

---

## 2. KFF

### 2.1 Figuren zusammensetzen

- **Zeitlimit falsch:** Offiziell sind es 15 Aufgaben in **20 min** [7],
  [29]. Die App rechnet mit **15 min** (`TESTS.figures.testSeconds`, auch in
  der README-Tabelle und in der Simulation). Der Zeitdruck ist dadurch rund
  33 % höher als im Test, und die KFF-Simulation ist 5 min zu kurz.
- **Teilezahl:** Im Test sind es 3–7 Teile, auf der MedAT-Stufe der App 4–5.
  Die App ist hier schmaler, aber nicht leichter, weil ihre
  Flächenunterschiede bei Distraktoren nur 4–10 % betragen. 2025 waren die
  Teile im Test größer, also leichter [22].
- **Lösungsformen veraltet:** In der App treten Quadrat, Rechteck, Trapez und
  Dreieck nur als Distraktor auf. Seit 2024 kommen Vierecke als Antwort vor,
  für 2025 wurden Parallelogramm und Dreieck angekündigt [21], [22]. Wer mit
  der App übt, lernt „Viereck heißt falsch“, und das stimmt nicht mehr.

### 2.2 Gedächtnis und Merkfähigkeit

- **Ausweis-Felder weichen ab:** Die offizielle Beschreibung [2] und alle
  Anbieter nennen eine **fünfstellige Ausweisnummer** und ein
  **Ausstellungsland**. Die App erzeugt stattdessen **Blutdruck** und
  **Brillenträger/in**. Ihr Kopfkommentar in `src/engines/memory.js` spricht
  trotzdem von „exakt den acht MedAT-Feldern“. Damit fehlt die schwerste
  Merkaufgabe des echten Tests: eine fünfstellige Zahl je Person, typischerweise
  mit dem Major-System gelernt.
- **Namen:** Im Test sind es laut Anbietern Fantasienamen [34], in der App
  echte österreichische Namen, die sich leichter merken lassen.
- **Fragetypen:** Die 13 Fragetypen der App decken Person ↔ Merkmal gut ab.
  Es fehlen Fragen zu Nummer (auch Teilziffern) und Land sowie die
  Zuordnung Foto → Merkmal. Die App hat nur farbige Initialen und keine
  Gesichter.
- **Urteil:** Eine Testsimulation ist das noch nicht. Die App ist eher
  leichter, weil zwei binäre bzw. grob gerasterte Felder die fünfstellige
  Zahl und das Land ersetzen.

### 2.3 Zahlenfolgen

- **Format:** Im Test wird aus A–D ein Zahlenpaar gewählt, E lautet „keine
  Antwort richtig“ [30]. In der App werden beide Zahlen frei eingegeben. Das
  ist strenger, weil man nicht raten und nicht rückwärts prüfen kann, trainiert
  aber weder die E-Falle noch das Prüfen mit Antworten.
- **Muster:** Die Folgen der App gehen auf MedAT-Stufe teils über das
  Testmuster hinaus und teils daran vorbei. Erzeugte Beispiele:
  „aufeinanderfolgende Primzahlen“, „addiere 1², 2², 3², …“, „×3 plus
  wachsender Summand“, „Vorgänger ×2 plus Vorvorgänger“. Primzahl- und
  Quadratzahl-Folgen sind laut Quellen **nicht** Teil des Tests (nur
  Grundrechenarten [30]). Rekursive Regeln (Fibonacci-artig) und
  verschachtelte Folgen passen dagegen. Es **fehlen** Folgen mit **drei**
  ineinander verschachtelten Teilfolgen („Dreiersprünge“, 2025 häufig [22])
  und Zyklen aus drei Operationen.
- **Urteil:** ähnlich bis schwerer, aber teils mit testfremden Mustern.

### 2.4 Wortflüssigkeit

Länge, Komposita, Format A–D + E und die Wortauswahl ohne Umlaute und ß
passen zum Test. 2024 genannte Testwörter haben 8–10 Buchstaben [21]. Die
MedAT-Stufe der App nimmt 8–9 Buchstaben, beispielsweise *Radkranz*,
*Geraschel*, *Dampflok*, *Grabstein*. **Urteil: ähnlich.** Nachschärfen ließe
sich höchstens bei 10 Buchstaben.

### 2.5 Implikationen erkennen

Format, Quantoren-Wortlaut („Alle … sind keine …“) und E-Option entsprechen
dem Test. Die App verwendet die traditionelle Logik mit existenzieller
Voraussetzung (24 Modi) und gibt immer den stärksten gültigen Schluss als
Lösung aus. Das ist mit den „19 Figuren“ der Anbieter vereinbar, weil die
abgeschwächten Modi nie als zweite richtige Option erscheinen. Ein
Unterschied bleibt: Die Begriffstripel der App sind realistisch und
hierarchisch (Motoren/Elektromotoren/Maschinen). Im Test kommen auch absurde
oder dem Weltwissen widersprechende Begriffe vor [31]. Die App übt die Falle
„Weltwissen gegen Logik“ also nur zufällig. **Urteil: ähnlich.**

---

## 3. Textverständnis

Die App hat 20 Texte mit 205–340 Wörtern und 2–4 Fragen sowie die drei
Fragetypen des Tests. Das passt zu den Angaben „bis ~300 Wörter, Trend
länger“ [30]. Offen bleibt der Abgleich mit dem offiziellen Übungsmaterial im
VMC (siehe OFFENE-PUNKTE). Sehr kurze Texte (≈ 75–150 Wörter, 1 Frage), die
früher vorkamen, hat die App nicht. Das schadet wenig, solange der Trend zu
langen Texten anhält. **Urteil: ähnlich.**

## 4. SEK

Die drei Untertests folgen bereits dem offiziell beschriebenen Muster. Format,
Aufgabenzahl und Zeit stimmen, der Bestand umfasst 38/30/34 Aufgaben. Neue
Erkenntnisse brachte diese Recherche nicht. Die Informationsbroschüre im VMC
bleibt die einzige Quelle, die den Lösungsschlüssel klären könnte. **Urteil:
ähnlich, nicht verifizierbar.**

---

## 5. Empfehlungen (priorisiert)

**P1 – Testtreue, falsche Fakten**

1. **Figuren auf 20 min stellen** (`TESTS.figures.testSeconds`, README-Tabelle,
   Simulationsdauer, ggf. Prozentrang-Schätzung). Ein einzelner Wert in
   `testConfig.js`, große Wirkung.
2. **Allergieausweis an den Test angleichen:** Blutdruck und Brille durch eine
   fünfstellige Ausweisnummer und ein Ausstellungsland ersetzen, Fragetypen
   ergänzen (Nummer der Person X, Person mit Nummer auf …, Land der Person X,
   Person aus Land Y) und Distraktoren mit vertauschten Ziffern bzw. Ländern
   derselben Region bauen. Den Kopfkommentar in `memory.js` und die README
   korrigieren.
3. **Figuren: Vierecke (und Dreieck/Parallelogramm) als mögliche Lösung**
   zulassen, mit kleiner Quote. Die README-Aussage „ausschließlich als
   Distraktor“ anpassen. Die Teilezahl auf MedAT-Stufe auf 3–7 erweitern.

**P2 – Stoffabdeckung BMS**

4. **Mathematik:** neue Themen Vektorrechnung (Betrag, Skalarprodukt, Winkel,
   Einheits- und Normalvektor) sowie Differential/Integral (Ableitung und
   Stammfunktion einfacher Potenz-, e- und Winkelfunktionen, Fläche unter
   einer Geraden). Statistik/Wahrscheinlichkeit gegen die aktuelle
   VMC-Stichwortliste prüfen und gegebenenfalls zurückfahren.
5. **Physik:** Themen Schwingungen und Wellen (inkl. Doppler, Polarisation,
   Interferenz), Elektrostatik, Impuls und Erhaltungssätze, Gravitation,
   Bernoulli, Kernspaltung/-fusion, Antiteilchen, kosmische Strahlung.
6. **Biologie: „Der menschliche Körper“ aufstocken**, auf etwa ein Drittel
   des Bio-Bestands (Histologie, Hormone, Niere, Herz, Nervensystem,
   Fortpflanzung inkl. Zelltypen im Hoden und Eierstock, Gefäßentwicklung).
   Gentechnik 2026 ergänzen (genetischer Fingerabdruck, GVO, Genomanalyse).
7. **Chemie:** „Mikrokosmos“ (Orbitale und Quantenzahlen, Welle-Teilchen,
   Unschärfe), Elementgruppen H/O/N/C/Halogene/S, Thiole, Ether, Anhydride,
   Nomenklatur, MWG-Rechnung und Fragen zum Deuten von Energiediagrammen.

**P3 – Formate und Feinschliff**

8. **BMS-Formate:** „x aus 5“ in Aussagenkombinationen (ein Kreuz)
   umwandeln, Negativfragen ergänzen, Option E „keine richtig“ gelegentlich
   als Lösung (heute 1 von 338).
9. **Zahlenfolgen:** wahlweise MC-Modus mit Zahlenpaaren A–D + E. Primzahl-
   und Quadratzahlregeln aus der MedAT-Stufe nehmen (in „Schwer“ behalten),
   dafür dreifach verschachtelte Folgen, Zyklen aus drei Operationen und die
   rekursiven Mischsysteme ergänzen.
10. **Implikationen:** einen Teil der Begriffstripel absurd bzw.
    weltwissenswidrig wählen.
11. **BMS-Fragen länger und kontextreicher** machen: ein Teil mit
    Fallvignette oder Diagramm, statt durchgehend ein Faktum in acht Wörtern.

**Zur Absicherung vor Umsetzung:** Die P2-Punkte stützen sich auf
Abschriften der Stichwortliste durch Anbieter. Vor dem Schreiben neuer
Inhalte die aktuelle Liste im VMC (kostenloses Konto) gegenlesen und die
Fundstelle mit Jahrgang im Kopf der jeweiligen Datendatei vermerken.
