# Offene Punkte

Was noch aussteht, mit dem Stand, auf dem es liegen geblieben ist. Erledigtes
wird hier gelöscht, nicht abgehakt – die Geschichte steht im Git-Log.

## 1. SEK und TV an echten Altfragen ausrichten

**Das Problem.** Die selbst geschriebenen Aufgaben zu Textverständnis und zu
den drei SEK-Untertests erfüllen bisher die *formalen* Vorgaben: Aufgabenzahl,
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

1. Für Textverständnis prüfen, ob Textlänge, Themenwahl und Fragetypen den
   echten Aufgaben nahekommen.
2. Inhalte nachziehen – und das jeweils zugrunde liegende Prinzip im Kopf der
   Datendatei mit aktualisieren, sonst driften Inhalt und Erklärung auseinander.

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

## 2. Haptik am Gerät bestätigen

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
