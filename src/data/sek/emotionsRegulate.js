/**
 * SEK – Emotionen regulieren.
 *
 * Format nach den offiziellen Vorgaben: 12 Aufgaben in 18 Minuten. Jede
 * Aufgabe beschreibt eine Situation, in der eine Person eine belastende
 * Emotion erlebt, nennt die Rahmenbedingungen und das Ziel, das die Person
 * erreichen will. Darunter stehen vier Vorsätze in der Ich-Form. Gesucht ist
 * der eine, mit dem sich das genannte Ziel am ehesten erreichen lässt.
 *
 * Wichtig für die Lösung: Gefragt ist nicht, was sich am besten anfühlt oder
 * was man selbst täte, sondern was dem *genannten Ziel* dient. Ein Vorsatz,
 * der die Anspannung senkt, aber das Ziel aufgibt, ist hier falsch.
 *
 * Die typischen falschen Wege sind immer dieselben vier Muster, und wer sie
 * kennt, erkennt sie wieder:
 *   - Vermeiden und Aufschieben ("ich mache das später")
 *   - Unterdrücken ("ich lasse mir nichts anmerken")
 *   - Grübeln und Schuld suchen ("ich frage mich, warum immer ich")
 *   - Das Ziel fallen lassen ("dann eben nicht")
 *
 * Schreibkonvention wie im BMS: Die richtige Antwort steht an erster Stelle;
 * gemischt wird erst beim Ziehen (siehe data/sek/index.js).
 *
 * Diese Aufgaben sind selbst geschrieben, keine Originalaufgaben. Der
 * Lösungsschlüssel folgt dem, was der Untertest laut Beschreibung misst:
 * zielgerichtete Selbstregulation unter Belastung.
 */

export const TASKS = [
  {
    id: 'er-1',
    situation: 'Marie hat sich für morgen früh zum Lernen mit einer Gruppe verabredet. Am Abend davor schreibt ihr die Organisatorin, der Raum sei doch nicht frei. Marie ärgert sich, weil sie den Tag extra freigehalten hat.',
    goal: 'Marie will morgen trotzdem die geplanten vier Stunden lernen.',
    options: [
      { text: 'Ich suche jetzt noch eine Alternative – Bibliothek, Café oder mein Zimmer – und schreibe der Gruppe, wo wir uns treffen.', correct: true, why: 'Der Ärger wird nicht wegdiskutiert, sondern in eine Handlung überführt, die das Ziel direkt sichert.' },
      { text: 'Ich schlafe erst mal drüber und sehe morgen früh, ob mir noch etwas einfällt.', correct: false, why: 'Aufschieben kostet genau die Vorbereitungszeit, die das Ziel braucht.' },
      { text: 'Ich schreibe der Organisatorin, dass sie sich das früher hätte überlegen können.', correct: false, why: 'Die Schuldfrage ändert nichts an der Raumlage und belastet die Gruppe zusätzlich.' },
      { text: 'Ich verschiebe den Lerntag, damit der Ärger sich legt.', correct: false, why: 'Das gibt das Ziel auf, statt es zu erreichen.' },
    ],
  },
  {
    id: 'er-2',
    situation: 'Jonas bekommt die Rückmeldung zu einer Probeklausur: deutlich schlechter als erwartet. Er ist niedergeschlagen und zweifelt, ob die Vorbereitung überhaupt Sinn hat. Bis zum echten Test sind es noch acht Wochen.',
    goal: 'Jonas will die verbleibende Zeit so nutzen, dass er beim echten Test besser abschneidet.',
    options: [
      { text: 'Ich gehe die Klausur Aufgabe für Aufgabe durch und notiere, woran es jeweils lag – Wissen, Zeit oder Flüchtigkeit.', correct: true, why: 'Die Fehleranalyse macht aus einem diffusen schlechten Gefühl konkrete Ansatzpunkte für die acht Wochen.' },
      { text: 'Ich lege die Klausur weg und fange mit einem neuen Kapitel an, damit ich vorankomme.', correct: false, why: 'Ohne zu wissen, woran es lag, wiederholt sich derselbe Fehler im neuen Kapitel.' },
      { text: 'Ich frage mich, warum ich mir das überhaupt zutraue.', correct: false, why: 'Grübeln über die eigene Eignung verbraucht Zeit und bringt keinen Schritt Richtung Ziel.' },
      { text: 'Ich erzähle niemandem davon und tue so, als wäre nichts.', correct: false, why: 'Unterdrücken ändert am Ergebnis nichts und schneidet mögliche Hilfe ab.' },
    ],
  },
  {
    id: 'er-3',
    situation: 'Sarah arbeitet im Praktikum mit einem Kollegen zusammen, der ihre Vorschläge in Besprechungen regelmäßig übergeht. Sie ist gekränkt und unsicher, ob sie etwas falsch macht. Das Praktikum läuft noch drei Monate.',
    goal: 'Sarah will, dass ihre Vorschläge künftig gehört werden.',
    options: [
      { text: 'Ich spreche den Kollegen unter vier Augen an und schildere an einem konkreten Beispiel, was mir aufgefallen ist.', correct: true, why: 'Ein sachliches Gespräch am Einzelfall ist der direkteste Weg, das Verhalten zu ändern – und lässt Raum für ein Missverständnis.' },
      { text: 'Ich sage in der nächsten Besprechung gar nichts mehr, dann kann auch nichts übergangen werden.', correct: false, why: 'Rückzug beendet die Kränkung, gibt aber das Ziel vollständig auf.' },
      { text: 'Ich unterbreche ihn beim nächsten Mal so lange, bis er mich ausreden lässt.', correct: false, why: 'Eskalation verschiebt den Konflikt, statt das Gehörtwerden zu sichern.' },
      { text: 'Ich nehme mir vor, mich nicht mehr zu ärgern.', correct: false, why: 'Ein Vorsatz gegen das eigene Gefühl verändert die Lage in der Besprechung nicht.' },
    ],
  },
  {
    id: 'er-4',
    situation: 'Tobias soll in zwei Tagen ein Referat halten. Beim Üben merkt er, dass er ins Stocken gerät, sobald er sich vorstellt, wie alle ihn ansehen. Die Nervosität wird jedes Mal stärker.',
    goal: 'Tobias will das Referat am Donnerstag flüssig halten.',
    options: [
      { text: 'Ich übe zweimal laut vor jemandem, den ich kenne, und lasse mir sagen, wo es hakt.', correct: true, why: 'Die gefürchtete Situation wird in kleiner Dosis geübt – so verliert sie an Schrecken und die Stellen zum Nachbessern werden sichtbar.' },
      { text: 'Ich lerne den Text Wort für Wort auswendig, damit nichts schiefgehen kann.', correct: false, why: 'Auswendiggelerntes bricht beim ersten Aussetzer ganz zusammen – das erhöht das Risiko, statt es zu senken.' },
      { text: 'Ich übe nicht weiter, weil es mich nur nervöser macht.', correct: false, why: 'Vermeiden senkt die Anspannung kurzfristig und die Sicherheit am Donnerstag dauerhaft.' },
      { text: 'Ich sage mir, dass Aufregung Unsinn ist und ich mich zusammenreißen soll.', correct: false, why: 'Sich die Aufregung zu verbieten macht sie erfahrungsgemäß größer.' },
    ],
  },
  {
    id: 'er-5',
    situation: 'Lena hat ihrer Freundin zugesagt, am Wochenende beim Umzug zu helfen. Kurz darauf merkt sie, dass sie genau dieses Wochenende für die Abgabe einer Hausarbeit braucht. Sie hat ein schlechtes Gewissen.',
    goal: 'Lena will die Hausarbeit rechtzeitig abgeben, ohne die Freundschaft zu belasten.',
    options: [
      { text: 'Ich rufe meine Freundin heute an, erkläre die Lage und biete an, stattdessen am Freitagabend beim Packen zu helfen.', correct: true, why: 'Früh und offen abzusagen und einen machbaren Ersatz anzubieten, bedient beide Teile des Ziels.' },
      { text: 'Ich helfe beim Umzug und schreibe die Hausarbeit in der Nacht davor.', correct: false, why: 'Das rettet die Zusage und gefährdet die Abgabe – ein Teil des Ziels fällt weg.' },
      { text: 'Ich melde mich erst am Samstagmorgen ab, dann ist es weniger unangenehm.', correct: false, why: 'Je später die Absage, desto größer der Schaden für die Freundin – und für die Freundschaft.' },
      { text: 'Ich sage nichts und hoffe, dass sie den Termin von selbst verschiebt.', correct: false, why: 'Vermeiden überlässt das Problem dem Zufall.' },
    ],
  },
  {
    id: 'er-6',
    situation: 'Ein Patient beschwert sich lautstark bei Felix, einem Pflegepraktikanten, über eine Wartezeit, für die Felix nichts kann. Felix fühlt sich ungerecht behandelt und spürt, wie er wütend wird. Vor ihm warten noch acht weitere Patienten.',
    goal: 'Felix will die Situation beruhigen und danach seine Arbeit ohne Ausfall weiterführen.',
    options: [
      { text: 'Ich lasse ihn ausreden, bestätige, dass die Wartezeit ärgerlich ist, und sage, was ich konkret tun kann.', correct: true, why: 'Zuhören und Anerkennen nimmt dem Ärger die Spitze; die konkrete Auskunft bringt das Gespräch zum Ende.' },
      { text: 'Ich erkläre ihm sofort, dass ich für die Wartezeit nicht zuständig bin.', correct: false, why: 'Die Zuständigkeitsfrage stimmt sachlich, beruhigt aber niemanden – sie wirkt wie Abweisung.' },
      { text: 'Ich sage nichts und warte, bis er von selbst aufhört.', correct: false, why: 'Schweigen verlängert die Szene und bindet die Zeit, die die anderen acht brauchen.' },
      { text: 'Ich bitte eine Kollegin, das zu übernehmen, weil ich mich zu sehr ärgere.', correct: false, why: 'Das verlagert die Belastung, ohne dass Felix die Situation selbst bewältigt – und kostet eine zweite Arbeitskraft.' },
    ],
  },
  {
    id: 'er-7',
    situation: 'Nina hat sich vorgenommen, dreimal pro Woche laufen zu gehen. Nach zwei guten Wochen fällt sie durch eine Erkältung eine Woche aus. Als sie wieder gesund ist, ärgert sie sich über den Rückschritt und findet den Einstieg nicht mehr.',
    goal: 'Nina will wieder zu ihrem Rhythmus von drei Läufen pro Woche zurückfinden.',
    options: [
      { text: 'Ich gehe morgen eine kurze, langsame Runde – Hauptsache, der erste Lauf ist wieder da.', correct: true, why: 'Die Hürde wird bewusst klein gemacht; der Wiedereinstieg zählt hier mehr als die Leistung.' },
      { text: 'Ich hole die ausgefallenen Läufe in dieser Woche zusätzlich nach.', correct: false, why: 'Direkt nach einer Erkältung erhöht das die Abbruchgefahr, statt den Rhythmus zu sichern.' },
      { text: 'Ich warte, bis ich mich wieder richtig motiviert fühle.', correct: false, why: 'Auf Motivation zu warten verschiebt den Start auf unbestimmt – die Motivation kommt meist erst mit dem Anfangen.' },
      { text: 'Ich ärgere mich darüber, dass ich mich überhaupt angesteckt habe.', correct: false, why: 'Grübeln über etwas Unabänderliches bringt keinen Lauf zustande.' },
    ],
  },
  {
    id: 'er-8',
    situation: 'David bekommt von seiner Betreuerin eine Rückmeldung zu seiner Seminararbeit, die überwiegend aus Kritik besteht. Er ist verletzt und hat den Eindruck, dass sie seine Arbeit nicht ernst genommen hat. Er hat zwei Wochen zur Überarbeitung.',
    goal: 'David will eine überarbeitete Fassung abgeben, die die Kritik aufnimmt.',
    options: [
      { text: 'Ich lege die Rückmeldung einen Tag beiseite und gehe sie dann in Ruhe Punkt für Punkt durch, um zu sortieren, was ich umsetzen kann.', correct: true, why: 'Der kurze Abstand nimmt der Kränkung die Wucht; das Sortieren macht die Kritik danach bearbeitbar.' },
      { text: 'Ich schreibe ihr, dass die Kritik ungerecht ist.', correct: false, why: 'Die Auseinandersetzung über die Angemessenheit kostet die zwei Wochen, die für die Überarbeitung da sind.' },
      { text: 'Ich übernehme jeden Punkt eins zu eins, ohne ihn zu prüfen.', correct: false, why: 'Ungeprüftes Übernehmen ersetzt das eigene Urteil und trägt die Arbeit nicht.' },
      { text: 'Ich lese die Rückmeldung nicht noch einmal, das erste Mal hat gereicht.', correct: false, why: 'Vermeiden schützt vor dem unangenehmen Gefühl und verhindert die Überarbeitung.' },
    ],
  },
  {
    id: 'er-9',
    situation: 'Anna teilt sich eine Wohnung mit zwei Mitbewohnern. Seit Wochen bleibt die Küche unaufgeräumt, und sie räumt jedes Mal wortlos auf. Inzwischen ist sie so genervt, dass sie beim Heimkommen schon schlechte Laune hat.',
    goal: 'Anna will, dass die Küche künftig gemeinsam sauber gehalten wird.',
    options: [
      { text: 'Ich schlage beim nächsten gemeinsamen Abend eine einfache Regel vor, etwa dass jeder sein Geschirr am selben Tag wegräumt.', correct: true, why: 'Eine gemeinsam vereinbarte, einfache Regel verändert die Lage dauerhaft – und macht die Erwartung überhaupt erst sichtbar.' },
      { text: 'Ich räume ab jetzt nichts mehr weg, dann merken sie es schon.', correct: false, why: 'Der stille Streik verschlechtert die Küche und macht das Zusammenleben schwerer, statt eine Regel zu schaffen.' },
      { text: 'Ich schreibe einen Zettel, dass es so nicht weitergeht.', correct: false, why: 'Ein anonym wirkender Zettel im Ärger lädt zur Verteidigung ein statt zur Absprache.' },
      { text: 'Ich nehme mir vor, mich einfach weniger aufzuregen.', correct: false, why: 'Sich das Gefühl zu verbieten ändert nichts an der Küche.' },
    ],
  },
  {
    id: 'er-10',
    situation: 'Paul hat sich für ein Auslandssemester beworben und eine Absage bekommen. Er ist enttäuscht, weil er sich lange darauf gefreut hat. Eine zweite Bewerbungsrunde ist in vier Monaten möglich.',
    goal: 'Paul will seine Chancen in der zweiten Runde verbessern.',
    options: [
      { text: 'Ich frage im Auslandsbüro nach, woran die Bewerbung gescheitert ist, und arbeite gezielt daran.', correct: true, why: 'Die Rückfrage liefert genau die Information, die für die zweite Runde gebraucht wird.' },
      { text: 'Ich bewerbe mich in vier Monaten mit denselben Unterlagen noch einmal.', correct: false, why: 'Unverändert eingereicht, führt dieselbe Bewerbung wahrscheinlich zum selben Ergebnis.' },
      { text: 'Ich rede mir ein, dass ich ohnehin nicht wegwollte.', correct: false, why: 'Das Abwerten des Ziels lindert die Enttäuschung und beendet die Bewerbung.' },
      { text: 'Ich gehe die Bewerbung im Kopf immer wieder durch und suche den Fehler.', correct: false, why: 'Grübeln ohne neue Information dreht sich im Kreis; die Auskunft gibt es im Auslandsbüro.' },
    ],
  },
  {
    id: 'er-11',
    situation: 'Mira lernt seit drei Wochen konzentriert für den Aufnahmetest. Freunde laden sie zu einem Wochenende ein, sie sagt ab – und liegt danach abends wach, weil sie das Gefühl hat, alles zu verpassen.',
    goal: 'Mira will ihr Lernpensum halten, ohne den Kontakt zu ihren Freunden zu verlieren.',
    options: [
      { text: 'Ich lege feste freie Abende in meinen Wochenplan und verabrede mich für diese.', correct: true, why: 'Erholung und Kontakt werden eingeplant statt gestrichen – das hält beide Teile des Ziels.' },
      { text: 'Ich sage künftig allen Einladungen zu und lerne dafür nachts.', correct: false, why: 'Schlafmangel senkt den Lernertrag – das Pensum wird nominell gehalten und faktisch entwertet.' },
      { text: 'Ich schalte das Handy für die nächsten Wochen aus.', correct: false, why: 'Das löst die Unruhe am Abend nicht und opfert den zweiten Teil des Ziels vollständig.' },
      { text: 'Ich versuche, abends nicht mehr daran zu denken.', correct: false, why: 'Gedankenunterdrückung macht die Gedanken erfahrungsgemäß hartnäckiger.' },
    ],
  },
  {
    id: 'er-12',
    situation: 'Simon arbeitet neben dem Studium im Labor. Nach einem Fehler beim Ansetzen einer Lösung muss ein Versuch wiederholt werden. Ihm ist die Sache unangenehm, und er fürchtet, für unzuverlässig gehalten zu werden.',
    goal: 'Simon will den Schaden begrenzen und im Labor weiterhin eigenständig arbeiten dürfen.',
    options: [
      { text: 'Ich melde den Fehler sofort der Laborleitung und schlage vor, den Ansatz heute noch neu zu machen.', correct: true, why: 'Früh gemeldet bleibt der Schaden klein; der eigene Lösungsvorschlag zeigt genau die Zuverlässigkeit, um die es Simon geht.' },
      { text: 'Ich warte ab, ob der Fehler überhaupt auffällt.', correct: false, why: 'Fällt er später auf, ist der Schaden größer und das Vertrauen dahin.' },
      { text: 'Ich erwähne beiläufig, dass die Beschriftung der Flaschen unglücklich ist.', correct: false, why: 'Die Verantwortung zu verschieben klärt nichts und wirkt ausweichend.' },
      { text: 'Ich nehme mir vor, in Zukunft besser aufzupassen, und sage vorerst nichts.', correct: false, why: 'Der gute Vorsatz für später ersetzt nicht die Meldung, die jetzt nötig ist.' },
    ],
  },
  {
    id: 'er-13',
    situation: 'Elif hat in einer Lerngruppe die Rolle übernommen, die Zusammenfassungen zu schreiben. Inzwischen macht sie fast die gesamte Arbeit, während die anderen nur noch lesen. Sie ist frustriert, will die Gruppe aber nicht verlieren.',
    goal: 'Elif will, dass die Arbeit gleichmäßiger verteilt wird und die Gruppe bestehen bleibt.',
    options: [
      { text: 'Ich bringe das Thema beim nächsten Treffen zur Sprache und schlage vor, die Kapitel unter uns aufzuteilen.', correct: true, why: 'Der offene Vorschlag verteilt die Arbeit und hält die Gruppe zusammen – beides Teil des Ziels.' },
      { text: 'Ich schreibe die Zusammenfassungen weiter, aber kürzer und schlechter.', correct: false, why: 'Stiller Protest senkt die Qualität für alle, ohne dass jemand die Ursache erfährt.' },
      { text: 'Ich verlasse die Gruppe und lerne allein.', correct: false, why: 'Das beendet den Frust und den zweiten Teil des Ziels gleich mit.' },
      { text: 'Ich sage mir, dass ich beim Schreiben ohnehin am meisten lerne.', correct: false, why: 'Die Umdeutung ist bequem, ändert die Verteilung aber nicht – und Elif hat ausdrücklich ein anderes Ziel.' },
    ],
  },
  {
    id: 'er-14',
    situation: 'Ben hat sich im Sportverein den Knöchel verletzt und fällt sechs Wochen aus. Er vermisst das Training und ist gereizt, weil er den Anschluss an die Mannschaft fürchtet.',
    goal: 'Ben will nach sechs Wochen möglichst nah an seinem alten Stand ins Training zurückkehren.',
    options: [
      { text: 'Ich frage den Physiotherapeuten, was ich in dieser Zeit trainieren darf, und halte mich an den Plan.', correct: true, why: 'Was trotz Verletzung möglich ist, erhält die Form – und der fachliche Rahmen verhindert einen Rückfall.' },
      { text: 'Ich trainiere vorsichtig mit und schone den Knöchel dabei.', correct: false, why: 'Belastung gegen die Heilung verlängert den Ausfall und gefährdet das Ziel.' },
      { text: 'Ich lege sechs Wochen komplett die Füße hoch.', correct: false, why: 'Vollständige Pause kostet mehr Form als nötig – Ben verliert genau den Anschluss, den er halten will.' },
      { text: 'Ich gehe nicht mehr zu den Spielen, das macht es nur schlimmer.', correct: false, why: 'Der Rückzug lindert die Gereiztheit und schwächt die Bindung zur Mannschaft.' },
    ],
  },
  {
    id: 'er-15',
    situation: 'Katharina soll eine Schicht mit einer Kollegin tauschen, die schon dreimal kurzfristig abgesagt hat. Sie ist verärgert und will nicht schon wieder einspringen, fürchtet aber, als unkollegial zu gelten.',
    goal: 'Katharina will diesmal absagen, ohne das Verhältnis zur Kollegin zu beschädigen.',
    options: [
      { text: 'Ich sage klar ab und begründe es sachlich mit meinen eigenen Terminen, ohne die früheren Male aufzurechnen.', correct: true, why: 'Eine klare, sachlich begründete Absage wahrt die eigene Grenze und lässt der Kollegin ihr Gesicht.' },
      { text: 'Ich sage zu und ärgere mich still weiter.', correct: false, why: 'Das erreicht das Gegenteil des Ziels und verstärkt den Ärger.' },
      { text: 'Ich zähle ihr auf, wie oft sie schon abgesagt hat.', correct: false, why: 'Die Aufrechnung macht aus einer Absage einen Vorwurf und belastet das Verhältnis.' },
      { text: 'Ich antworte gar nicht auf die Nachricht.', correct: false, why: 'Schweigen ist die unhöflichste Form der Absage und beschädigt das Verhältnis am stärksten.' },
    ],
  },
  {
    id: 'er-16',
    situation: 'Jan merkt beim Lernen, dass er an Chemie regelmäßig hängen bleibt und dann das Lernen ganz abbricht. Danach ärgert er sich über den verlorenen Nachmittag. Bis zum Test sind es noch sechs Wochen.',
    goal: 'Jan will Chemie aufholen, ohne die Nachmittage zu verlieren.',
    options: [
      { text: 'Ich nehme mir pro Tag ein eng begrenztes Chemie-Thema vor und setze mir eine feste Zeit dafür.', correct: true, why: 'Kleine Einheiten mit klarem Ende verhindern das Steckenbleiben und sichern den Rest des Nachmittags.' },
      { text: 'Ich nehme mir einen ganzen Tag nur für Chemie vor, dann ist es hinter mir.', correct: false, why: 'Genau die lange, offene Einheit führt zum Abbruch, den Jan vermeiden will.' },
      { text: 'Ich lasse Chemie erst mal liegen und komme am Ende darauf zurück.', correct: false, why: 'Aufschieben macht den Rückstand größer und den Endspurt enger.' },
      { text: 'Ich zwinge mich, sitzen zu bleiben, bis ich es verstanden habe.', correct: false, why: 'Durchhalten gegen die Erschöpfung ist genau das Muster, das bisher zum Abbruch geführt hat.' },
    ],
  },
  {
    id: 'er-17',
    situation: 'Sophie hat eine Freundin, die sich seit Wochen fast täglich meldet, um über ihre Trennung zu sprechen. Sophie hört gern zu, fühlt sich inzwischen aber ausgelaugt und schuldig, weil sie manchmal nicht antworten will.',
    goal: 'Sophie will für ihre Freundin da sein, ohne sich selbst zu erschöpfen.',
    options: [
      { text: 'Ich sage ihr, dass ich weiter für sie da bin, aber nicht jeden Abend – und schlage feste Zeiten vor, an denen wir telefonieren.', correct: true, why: 'Die Zusage bleibt, der Rahmen wird begrenzt – genau die Verbindung beider Ziele.' },
      { text: 'Ich antworte weiter auf jede Nachricht, auch wenn es mir zu viel wird.', correct: false, why: 'Das erhält die Unterstützung auf Kosten der eigenen Kräfte und damit auf Dauer auch die Unterstützung.' },
      { text: 'Ich melde mich eine Weile gar nicht mehr.', correct: false, why: 'Der abrupte Rückzug schützt Sophie und lässt die Freundin ohne Erklärung zurück.' },
      { text: 'Ich rate ihr, sich professionelle Hilfe zu suchen, und beende das Thema für mich.', correct: false, why: 'Der Rat kann sinnvoll sein, ersetzt aber nicht die zugesagte Nähe – so wird ein Ziel gegen das andere getauscht.' },
    ],
  },
  {
    id: 'er-18',
    situation: 'Noah hat im Nebenjob einen Kunden falsch beraten. Der Fehler ist ihm erst am Abend aufgefallen. Er schämt sich und würde die Sache am liebsten auf sich beruhen lassen. Der Kunde kommt morgen wieder.',
    goal: 'Noah will den Fehler korrigieren und seinen Ruf im Team wahren.',
    options: [
      { text: 'Ich spreche den Kunden morgen von mir aus an, korrigiere die Auskunft und informiere meine Chefin.', correct: true, why: 'Die selbst angestoßene Korrektur behebt den Fehler und zeigt genau die Verlässlichkeit, um die es beim Ruf geht.' },
      { text: 'Ich warte, ob der Kunde von selbst nachfragt.', correct: false, why: 'Kommt es später heraus, wiegt das Verschweigen schwerer als der Fehler.' },
      { text: 'Ich bitte eine Kollegin, die Sache morgen zu übernehmen.', correct: false, why: 'Das schiebt die unangenehme Aufgabe weiter und schadet dem Ruf mehr, als es ihn schützt.' },
      { text: 'Ich nehme mir vor, solche Fragen künftig nicht mehr zu beantworten.', correct: false, why: 'Vermeidung für die Zukunft lässt den heutigen Fehler unkorrigiert.' },
    ],
  },
  {
    id: 'er-19',
    situation: 'Hanna bereitet sich auf eine mündliche Prüfung vor. Beim Lernen kreisen ihre Gedanken ständig um die Frage, was passiert, wenn sie durchfällt. Sie liest dieselbe Seite mehrfach, ohne etwas aufzunehmen.',
    goal: 'Hanna will die verbleibenden Lernstunden tatsächlich zum Lernen nutzen.',
    options: [
      { text: 'Ich schreibe die Sorge einmal auf, lege den Zettel weg und arbeite danach ein festes Kapitel durch.', correct: true, why: 'Die Sorge bekommt einen Ort außerhalb des Kopfes; danach ist Aufmerksamkeit für den Stoff frei.' },
      { text: 'Ich lese die Seite so lange, bis ich sie kann.', correct: false, why: 'Gegen kreisende Gedanken hilft Wiederholen nicht – die Stunden verstreichen weiter ungenutzt.' },
      { text: 'Ich denke den schlimmsten Fall zu Ende durch, damit ich vorbereitet bin.', correct: false, why: 'Das Ausmalen des Scheiterns verlängert genau das Kreisen, das Hanna beim Lernen hindert.' },
      { text: 'Ich mache Pause, bis die Gedanken von selbst aufhören.', correct: false, why: 'Warten auf ein Nachlassen der Sorge ist ein offenes Ende und kostet die Lernzeit.' },
    ],
  },
  {
    id: 'er-20',
    situation: 'Yusuf hat sich in der Lerngruppe über eine Bemerkung geärgert und ist daraufhin laut geworden. Jetzt ist es ihm unangenehm; die Stimmung ist seither angespannt. Das nächste Treffen ist in drei Tagen.',
    goal: 'Yusuf will, dass die Gruppe wieder gut zusammenarbeitet.',
    options: [
      { text: 'Ich spreche beim nächsten Treffen kurz an, dass meine Reaktion überzogen war, und mache dann mit dem Stoff weiter.', correct: true, why: 'Eine knappe Entschuldigung räumt die Anspannung aus, ohne den Vorfall zum Hauptthema zu machen.' },
      { text: 'Ich erkläre ausführlich, warum die Bemerkung mich verletzt hat.', correct: false, why: 'Die lange Rechtfertigung rollt den Konflikt neu auf, statt die Arbeit wieder in Gang zu bringen.' },
      { text: 'Ich tue so, als wäre nichts gewesen.', correct: false, why: 'Die Anspannung bleibt im Raum und wirkt bei der nächsten Gelegenheit weiter.' },
      { text: 'Ich gehe zum nächsten Treffen nicht, damit sich die Lage beruhigt.', correct: false, why: 'Das Fernbleiben verfestigt den Bruch, statt ihn zu kitten.' },
    ],
  },
];

export default TASKS;
