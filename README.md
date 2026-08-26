# MedAT KFF Trainer

Übungs-App für die vier KFF-Untertests des österreichischen Medizin-Aufnahmetests
(MedAT). React + Vite + TailwindCSS, als PWA installierbar, vollständig offline
nutzbar – **kein Backend, keine externen APIs, keine Anmeldung**. Alle Aufgaben
werden auf dem Gerät erzeugt, Fortschritt und Einstellungen liegen ausschließlich
im `localStorage`.

Optimiert für iPhone 15 Pro (393 × 852) inklusive Safe-Area-Insets, funktioniert
aber auch auf iPad und Desktop.

## Enthaltene Untertests

| Untertest | Aufgaben | Zeit | Besonderheit |
|---|---|---|---|
| Gedächtnis & Merkfähigkeit | 8 Ausweise + 25 Fragen | 8 min lernen, 15 min prüfen | Pause dazwischen einstellbar (2/5/10/20/40 min) |
| Zahlenfolgen | 10 | 15 min | 7 Zahlen sichtbar, 2 gesucht; 7 Schwierigkeitslevel, optional adaptiv |
| Wortflüssigkeit | 15 | 20 min | Buchstabensalat, Anfangsbuchstabe gesucht |
| Implikationen erkennen | 10 | 10 min | Syllogismen mit Venn-Diagramm-Auflösung |

Dazu ein **Simulationsmodus**, der alle Untertests in der echten MedAT-Reihenfolge
mit Originalzeiten durchläuft (inklusive Platzhalter-Block für „Figuren
zusammensetzen“, das nicht Teil dieser App ist) und am Ende einen geschätzten
KFF-Prozentrang ausgibt.

## Befehle

```bash
npm install
npm run dev        # Entwicklungsserver
npm run build      # Icons + Produktionsbuild nach dist/ + Precache-Liste
npm run preview    # Produktionsbuild lokal ansehen
npm run selftest   # Daten- und Engine-Prüfungen (46 Checks)
npm run icons      # PWA-Icons neu generieren
```

`npm run selftest` prüft unter anderem, ob die Syllogismus-Engine exakt die 24
klassisch gültigen Modi liefert, ob jede erzeugte MC-Frage genau eine richtige
Antwort hat und ob die Wortdatenbank anagramm-eindeutig bleibt.

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
    nouns.js           1274 Substantive ohne Umlaute/ß, anagramm-eindeutig
    syllogismTerms.js  70 Begriffstripel
    testConfig.js      Zeitlimits, Aufgabenzahlen, Simulationsablauf
  engines/         Aufgabengenerierung, frei von React
    memory.js          Allergieausweise + 13 Fragetypen
    numberSeries.js    7 Level Zahlenfolgen mit Regelbeschreibung
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

**Zahlenfolgen** – Sieben Generatoren (konstante Differenz, Multiplikation,
wachsende Differenzen, verschachtelte Folgen, Fibonacci-artig, Quadrat-/Kubik-/
Primzahlen, kombinierte Regeln) liefern je 9 ganzzahlige Werte plus die
Regelbeschreibung, die nach dem Prüfen als Erklärung erscheint.

**Wortflüssigkeit** – Der Buchstabensalat weicht an mindestens 3 Positionen vom
Original ab und beginnt nie mit dem gesuchten Buchstaben. In ~20 % der Aufgaben
ist e) „Keine Antwort ist richtig“ korrekt.

**Gedächtnis** – Jeder Fragetyp prüft vor der Erzeugung, ob die zugrunde liegende
Tatsache eindeutig ist (z. B. wird nach einem Allergen nur gefragt, wenn genau
eine Person es hat). In ~15 % der Fragen ist e) korrekt.

## Veröffentlichen

Der Build verwendet relative Pfade (`base: './'`), läuft also auf jedem Host –
auch in einem Unterverzeichnis wie `https://name.github.io/Medat/`.

**Vercel oder Netlify** (funktioniert auch mit privaten Repositories):

1. Auf vercel.com bzw. netlify.com mit GitHub anmelden und dieses Repository
   importieren.
2. Build-Befehl `npm run build`, Ausgabeverzeichnis `dist` (wird meist
   automatisch erkannt).
3. Nach dem Deploy gibt es eine HTTPS-Adresse – diese auf dem iPhone öffnen.

**GitHub Pages**: `.github/workflows/deploy-pages.yml` ist vorbereitet. Unter
Settings → Pages als Source „GitHub Actions“ wählen. Für private Repositories
ist Pages allerdings kostenpflichtig; das Repo müsste also öffentlich sein.

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
