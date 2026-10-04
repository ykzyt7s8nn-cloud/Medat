# Offene Punkte

Was noch aussteht, mit dem Stand, auf dem es liegen geblieben ist. Erledigtes
wird hier gelöscht, nicht abgehakt – die Geschichte steht im Git-Log.

## 1. SEK an echten Altfragen ausrichten

**Das Problem.** Die selbst geschriebenen Aufgaben zu den drei
SEK-Untertests erfüllen bisher die *formalen* Vorgaben: Aufgabenzahl,
Zeitlimit, Antwortformat, Wertung. Ob sie den echten Aufgaben der letzten Jahre
auch *inhaltlich* ähneln, ist ungeprüft.

Bei SEK wiegt das schwer. In Erfahrungsberichten heißt es immer wieder, dass es
bei „Emotionen erkennen“ und „Soziales Entscheiden“ ein erwartetes Muster gibt –
eine Auswahl an Emotionen bzw. eine Rangfolge, die die Testerstellenden hören
wollen, unabhängig davon, was im Einzelfall individuell plausibel wäre. Eine
Lern-App muss genau dieses Muster nachbilden. Tut sie es nicht, trainiert sie am
Test vorbei, und zwar besonders heimtückisch: Die Aufgaben sehen richtig aus,
und die Rückmeldung ist trotzdem systematisch falsch.

**Zu tun.**

1. Recherchieren, welche Muster in Erfahrungsberichten, Vorbereitungsbüchern und
   Altfragensammlungen zu den SEK-Untertests beschrieben werden: typische
   Emotionskombinationen, bevorzugte Rangordnungen, wiederkehrende
   Situationstypen.
2. Prüfen, ob die Kohlberg-Rangleiter in `src/data/sek/socialDecision.js` dem
   entspricht oder ob das erwartete Muster davon abweicht.
3. Dasselbe für die Verteilung von `likely`/`unlikely` in
   `emotionsRecognise.js` und für die vier Fehlermuster (vermeiden,
   unterdrücken, grübeln, Ziel aufgeben) in `emotionsRegulate.js`.
4. Inhalte nachziehen – und das jeweils zugrunde liegende Prinzip im Kopf der
   Datendatei mit aktualisieren, sonst driften Inhalt und Erklärung auseinander.

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
