/**
 * SEK – Emotionen regulieren.
 *
 * Format nach den offiziellen Vorgaben: 12 Aufgaben in 18 Minuten. Jede
 * Aufgabe beschreibt eine Situation, in der eine Person eine belastende
 * Emotion erlebt, nennt die Rahmenbedingungen und das Ziel, das die Person
 * erreichen will. Darunter stehen vier Vorsätze in der Ich-Form. Gesucht ist
 * der eine, mit dem sich das genannte Ziel am ehesten erreichen lässt; es gibt
 * einen Punkt je Aufgabe.
 *
 * Wichtig für die Lösung: Gefragt ist nicht, was sich am besten anfühlt oder
 * was man selbst täte, sondern was dem *genannten Ziel* dient. Ein Vorsatz,
 * der die Anspannung senkt, aber das Ziel aufgibt, ist hier falsch.
 *
 * Der Schlüssel folgt dem Prozessmodell der Emotionsregulation nach Gross,
 * auf das sich die Beschreibungen des Untertests stützen. Welcher Weg trägt,
 * hängt zuerst an einer Frage: Lässt sich die Lage noch ändern?
 *
 *   - Ja: Dann führt meist ein konkreter, zeitnaher Schritt zum Ziel –
 *     ansprechen, nachfragen, planen, Hilfe holen.
 *   - Nein: Dann führt Neubewertung (die Lage anders einordnen), Annehmen oder
 *     eine gezielte Ablenkung zum Ziel. Wer hier noch handeln will – den
 *     gestrichenen Flug zurückfordern, nachts weiterlernen –, verfehlt es.
 *
 * Die typischen falschen Wege sind immer dieselben Muster, und wer sie kennt,
 * erkennt sie wieder:
 *   - Vermeiden und Aufschieben ("ich mache das später")
 *   - Unterdrücken ("ich lasse mir nichts anmerken")
 *   - Grübeln und Schuld suchen ("ich frage mich, warum immer ich")
 *   - Impulsiv ausagieren ("ich sage ihm jetzt deutlich die Meinung")
 *   - Das Ziel fallen lassen ("dann eben nicht")
 * Dazu kommt bei unveränderlichen Lagen der Kontrollversuch an der falschen
 * Stelle: Handeln, wo es nichts mehr zu handeln gibt.
 *
 * Quellen für das Muster: die offizielle Beschreibung des Untertests
 * (medizinstudieren.at: Wissen über die Effektivität verschiedener Umgangs-
 * weisen mit Emotionen, wenn bestimmte Ziele zu erreichen sind) und die
 * Hinweise der Vorbereitungsanbieter (u. a. studymed, Mission MedAT,
 * medat-vorbereitung.at). Übernommen ist nur das Muster.
 *
 * Schreibkonvention wie im BMS: Die richtige Antwort steht an erster Stelle;
 * gemischt wird erst beim Ziehen (siehe data/sek/index.js).
 *
 * Diese Aufgaben sind selbst geschrieben, keine Originalaufgaben.
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
  {
    id: 'er-21',
    situation: 'Laura hat am nächsten Morgen um acht Uhr eine wichtige mündliche Prüfung. Es ist halb zwölf in der Nacht, sie hat alles gelernt, was sie lernen konnte, liegt aber wach und spielt im Kopf immer wieder mögliche Fragen durch.',
    goal: 'Laura will ausgeschlafen in die Prüfung gehen.',
    options: [
      { text: 'Ich sage mir, dass ich vorbereitet bin und jetzt nichts mehr ändern kann, und lenke mich mit einem ruhigen Hörbuch ab, bis ich müde werde.', correct: true, why: 'An der Vorbereitung ist heute Nacht nichts mehr zu ändern – also hilft die Neubewertung der Lage und eine ruhige Ablenkung, nicht weiteres Handeln.' },
      { text: 'Ich stehe noch einmal auf und wiederhole die schwierigsten Kapitel, damit ich ruhiger werde.', correct: false, why: 'Ein Problemlöseversuch an der falschen Stelle: Der Stoff sitzt, und nächtliches Lernen kostet genau den Schlaf, um den es geht.' },
      { text: 'Ich gehe die möglichen Fragen so lange durch, bis ich auf jede eine Antwort weiß.', correct: false, why: 'Das ist Grübeln mit gutem Gewissen – es hält wach, statt zu beruhigen.' },
      { text: 'Ich nehme mir fest vor, an gar nichts mehr zu denken.', correct: false, why: 'Gedanken zu unterdrücken, macht sie erfahrungsgemäß hartnäckiger.' },
    ],
  },
  {
    id: 'er-22',
    situation: 'Der Flug von Herrn Wagner in den Urlaub ist wegen eines Unwetters gestrichen worden. Die Fluggesellschaft hat ihn bereits auf den nächsten Morgen umgebucht und ein Hotel gestellt. Er ist verärgert, weil ein Urlaubstag verloren geht.',
    goal: 'Herr Wagner will den Abend nicht verderben und erholt in den Urlaub starten.',
    options: [
      { text: 'Ich nehme den Abend als ersten, wenn auch ungeplanten Urlaubsabend und gehe in der Stadt essen.', correct: true, why: 'Am Wetter und an der Umbuchung ist nichts mehr zu ändern; die Neubewertung macht aus dem Verlust einen nutzbaren Abend.' },
      { text: 'Ich verlange am Schalter so lange einen früheren Flug, bis mir jemand einen gibt.', correct: false, why: 'Bei einem Unwetter gibt es keinen früheren Flug – der Versuch verlängert nur den Ärger.' },
      { text: 'Ich schreibe noch heute Abend eine ausführliche Beschwerde an die Fluggesellschaft.', correct: false, why: 'Die Beschwerde hält den Ärger warm und füllt genau den Abend, der nicht verdorben werden soll.' },
      { text: 'Ich rechne mir aus, wie viel Geld mich der verlorene Tag gekostet hat.', correct: false, why: 'Das Nachrechnen ist Grübeln über einen Verlust, der feststeht.' },
    ],
  },
  {
    id: 'er-23',
    situation: 'Clemens erfährt, dass seine Bewerbung für ein begehrtes Forschungspraktikum abgelehnt wurde. Es gab nur einen Platz und über hundert Bewerbungen. Die Absage enthält keine Begründung, und das Praktikum wird nicht wieder ausgeschrieben.',
    goal: 'Clemens will sich von der Absage nicht die Motivation für sein Studium nehmen lassen.',
    options: [
      { text: 'Ich führe mir vor Augen, dass bei einem Platz auf hundert Bewerbungen eine Absage wenig über mich aussagt, und schaue mich nach anderen Praktika um.', correct: true, why: 'Die realistische Neubewertung nimmt der Absage das persönliche Gewicht; der Blick nach vorn hält die Motivation.' },
      { text: 'Ich rufe so lange im Institut an, bis mir jemand den Grund für die Absage nennt.', correct: false, why: 'Bei einem nicht wiederholten Platz bringt die Begründung keinen Nutzen – und die Hartnäckigkeit hält die Kränkung wach.' },
      { text: 'Ich frage mich, was die anderen Bewerber haben, das ich nicht habe.', correct: false, why: 'Vergleichendes Grübeln ohne Information nagt an genau der Motivation, die erhalten bleiben soll.' },
      { text: 'Ich bewerbe mich in Zukunft nur noch dort, wo ich sicher genommen werde.', correct: false, why: 'Das vermeidet weitere Enttäuschungen um den Preis künftiger Chancen.' },
    ],
  },
  {
    id: 'er-24',
    situation: 'Rebecca pflegt seit Monaten ihre demenzkranke Großmutter mit. Bei jedem Besuch fragt die Großmutter, wer Rebecca sei. Rebecca ist jedes Mal traurig und kommt bedrückt nach Hause. Die Erkrankung schreitet fort.',
    goal: 'Rebecca will die Besuche weiter machen und sie für beide so angenehm wie möglich gestalten.',
    options: [
      { text: 'Ich akzeptiere, dass sie mich nicht mehr erkennt, und richte die Besuche auf das, was ihr jetzt noch Freude macht – alte Lieder, Spaziergänge, Fotos.', correct: true, why: 'Die Krankheit lässt sich nicht aufhalten; Annehmen und ein neuer Blick auf den Besuch machen ihn für beide wertvoll.' },
      { text: 'Ich erkläre ihr bei jedem Besuch geduldig, wer ich bin, bis sie es sich wieder merkt.', correct: false, why: 'Hier wird gegen etwas gekämpft, das sich nicht ändern lässt – die Enttäuschung wiederholt sich jedes Mal.' },
      { text: 'Ich lasse mir bei den Besuchen nichts anmerken und weine erst zu Hause.', correct: false, why: 'Unterdrücken verschiebt die Traurigkeit nur und kostet auf Dauer die Kraft für die Besuche.' },
      { text: 'Ich besuche sie seltener, weil es mir sonst zu nahe geht.', correct: false, why: 'Das vermeidet den Schmerz, gibt aber das Ziel auf, die Besuche fortzusetzen.' },
    ],
  },
  {
    id: 'er-25',
    situation: 'Dominik steht an der Supermarktkasse, als ein Mann sich vordrängt und ihn dabei anrempelt. Dominik spürt, wie die Wut hochsteigt. Er hat noch zwanzig Minuten bis zu einem Vorstellungsgespräch, für das er sich konzentrieren will.',
    goal: 'Dominik will ruhig und konzentriert beim Vorstellungsgespräch ankommen.',
    options: [
      { text: 'Ich atme ein paar Mal tief durch, sage mir, dass der Mann für heute keine Rolle spielt, und denke an meine Antworten für das Gespräch.', correct: true, why: 'Die Wut wird gedämpft und die Aufmerksamkeit auf das gelenkt, worauf es heute ankommt.' },
      { text: 'Ich stelle ihn zur Rede und sage ihm deutlich, was ich von seinem Verhalten halte.', correct: false, why: 'Impulsives Ausagieren heizt die Wut an und gefährdet die Ruhe, die das Gespräch braucht.' },
      { text: 'Ich schimpfe auf dem Weg zum Gespräch im Kopf weiter über den Mann.', correct: false, why: 'Grübeln hält die Wut genau bis zu dem Moment am Leben, in dem er ruhig sein will.' },
      { text: 'Ich sage das Gespräch ab, weil ich ohnehin nicht mehr in der Stimmung bin.', correct: false, why: 'Ein kleiner Vorfall kostet so das ganze Ziel.' },
    ],
  },
  {
    id: 'er-26',
    situation: 'Ida hat zwei Wochen an einem Referat gearbeitet. In der Sitzung erfährt sie, dass es wegen eines Terminfehlers der Lehrveranstaltung ersatzlos entfällt. Die Note wird nun allein aus der Klausur gebildet, die in drei Wochen stattfindet.',
    goal: 'Ida will in der Klausur eine gute Note erreichen.',
    options: [
      { text: 'Ich ärgere mich heute Abend, nehme mir dann vor, was ich für das Referat gelernt habe, als Teil des Klausurstoffs zu sehen, und mache morgen einen Lernplan.', correct: true, why: 'Der Ärger darf sein; die Neubewertung rettet die Arbeit als Lernstoff, und der Plan richtet sich auf das, was noch zu beeinflussen ist.' },
      { text: 'Ich bitte die Lehrveranstaltungsleitung, das Referat doch noch halten zu dürfen.', correct: false, why: 'Der Termin ist ersatzlos gestrichen – der Versuch bindet Kraft, die der Klausur fehlt.' },
      { text: 'Ich frage mich, warum ausgerechnet mir so etwas immer passiert.', correct: false, why: 'Grübeln über Pech verändert nichts und kostet Zeit.' },
      { text: 'Ich lasse die Klausur auf mich zukommen, weil sich Planung ja offenbar nicht lohnt.', correct: false, why: 'Aus Ärger das Ziel aufzugeben, verschlechtert genau die Note, um die es geht.' },
    ],
  },
  {
    id: 'er-27',
    situation: 'Eine Patientin beschwert sich bei Lea, einer Medizinstudentin im Praktikum, sehr heftig über das Krankenhausessen. Lea merkt, wie sie selbst gereizt wird, denn für das Essen ist sie nicht zuständig.',
    goal: 'Lea will das Gespräch freundlich zu Ende bringen und die Anamnese aufnehmen, für die sie gekommen ist.',
    options: [
      { text: 'Ich sage mir, dass die Patientin ihren Ärger über die Lage im Krankenhaus loswerden will und nicht mich meint, höre kurz zu und leite dann zu meinen Fragen über.', correct: true, why: 'Die Umdeutung nimmt der Beschwerde die persönliche Spitze; danach ist Raum für die eigentliche Aufgabe.' },
      { text: 'Ich erkläre ihr, dass ich für das Essen nicht zuständig bin und sie sich an die Küche wenden soll.', correct: false, why: 'Sachlich richtig, aber abweisend – das Gespräch kippt, und die Anamnese wird schwieriger.' },
      { text: 'Ich lächle und lasse mir nicht anmerken, wie sehr mich das nervt.', correct: false, why: 'Unterdrückte Gereiztheit schimmert durch und kostet Konzentration für die Anamnese.' },
      { text: 'Ich verlasse das Zimmer und komme später wieder, wenn sie sich beruhigt hat.', correct: false, why: 'Vermeiden verschiebt die Anamnese und das Problem.' },
    ],
  },
  {
    id: 'er-28',
    situation: 'Markus hat nach einem Streit mit seinem Mitbewohner eine Nachricht geschrieben, die er sofort bereut. Der Mitbewohner hat sie gelesen und noch nicht geantwortet. Markus ist unruhig und schaut alle paar Minuten aufs Handy.',
    goal: 'Markus will das Verhältnis zu seinem Mitbewohner wieder in Ordnung bringen.',
    options: [
      { text: 'Ich schreibe kurz, dass mir die Nachricht leidtut, und schlage vor, heute Abend in Ruhe zu reden.', correct: true, why: 'Die kurze Entschuldigung und das Gesprächsangebot sind der direkte Weg zum Ziel.' },
      { text: 'Ich warte, bis er sich meldet; schließlich hat er den Streit angefangen.', correct: false, why: 'Abwarten und die Schuld beim anderen suchen lässt die Lage, wie sie ist.' },
      { text: 'Ich schreibe eine lange Nachricht, in der ich erkläre, warum ich so reagiert habe.', correct: false, why: 'Eine lange Rechtfertigung rollt den Streit neu auf, statt ihn beizulegen.' },
      { text: 'Ich gehe heute Abend aus, damit wir uns nicht begegnen.', correct: false, why: 'Das vermeidet das Gespräch, das das Verhältnis braucht.' },
    ],
  },
  {
    id: 'er-29',
    situation: 'Sabine sitzt seit vier Stunden im Wartebereich des Krankenhauses, während ihr Vater operiert wird. Die Ärzte haben gesagt, es könne noch zwei Stunden dauern. Sie kann nichts tun als warten und wird immer unruhiger.',
    goal: 'Sabine will die Wartezeit durchstehen, ohne sich völlig zu erschöpfen.',
    options: [
      { text: 'Ich gehe kurz an die frische Luft, trinke etwas und rufe meine Schwester an, um mit ihr zu reden.', correct: true, why: 'An der Operation kann sie nichts ändern; Bewegung, Versorgung und Zuspruch helfen, die Unruhe auszuhalten.' },
      { text: 'Ich frage alle halbe Stunde am Empfang nach, ob es Neuigkeiten gibt.', correct: false, why: 'Das Nachfragen ist ein Kontrollversuch an der falschen Stelle; jede Antwort „noch nichts“ steigert die Unruhe.' },
      { text: 'Ich lese im Internet alles über mögliche Komplikationen dieser Operation.', correct: false, why: 'Gezieltes Suchen nach Risiken nährt die Sorge, statt sie zu dämpfen.' },
      { text: 'Ich sage mir, dass ich mich zusammenreißen muss, und bleibe still sitzen.', correct: false, why: 'Sich die Unruhe zu verbieten, kostet zusätzlich Kraft.' },
    ],
  },
  {
    id: 'er-30',
    situation: 'Tim hat sich für den Halbmarathon angemeldet und monatelang trainiert. Eine Woche vor dem Lauf zieht er sich eine Zerrung zu; der Arzt rät dringend von einer Teilnahme ab. Tim ist niedergeschlagen.',
    goal: 'Tim will gesund werden und im nächsten Jahr den Halbmarathon laufen.',
    options: [
      { text: 'Ich sage diesen Lauf ab, sehe das Training als Grundlage für das nächste Jahr und suche mir schon jetzt einen neuen Lauf aus.', correct: true, why: 'Die Absage schützt die Gesundheit; die Neubewertung macht aus der verlorenen Saison eine Vorbereitung.' },
      { text: 'Ich laufe trotzdem und gehe es einfach langsamer an.', correct: false, why: 'Das rettet den Termin und gefährdet beide Teile des Ziels.' },
      { text: 'Ich höre mit dem Laufen auf, weil sich das Training ja doch nicht gelohnt hat.', correct: false, why: 'Aus Enttäuschung das Ziel aufzugeben, ist genau der falsche Schluss.' },
      { text: 'Ich überlege, was ich im Training falsch gemacht habe, dass ausgerechnet jetzt so etwas passiert.', correct: false, why: 'Grübeln über die Ursache ändert nichts an der Zerrung und hilft nicht beim Neubeginn.' },
    ],
  },
];

export default TASKS;
