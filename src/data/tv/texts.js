/**
 * Textverständnis – die Sachtexte samt Fragen.
 *
 * Woran sich der Bestand ausrichtet (Stand der Recherche: MedAT 2023–2025,
 * Angaben der Vorbereitungsanbieter und Erfahrungsberichte):
 *
 *   * 12 Aufgaben in 35 Minuten, Single Choice a bis e, genau eine richtig.
 *   * Die Aufgaben verteilen sich auf mehrere Texte, zuletzt meist vier bis
 *     fünf, mit je zwei bis drei, selten mehr Fragen. Ein Durchgang zieht
 *     deshalb Texte mit zwei, drei oder vier Fragen, bis genau zwölf beisammen
 *     sind (siehe data/tv/index.js).
 *   * Die Texte sind populärwissenschaftliche Sachtexte, überwiegend aus
 *     Medizin und Naturwissenschaft, eher Zeitung als Fachzeitschrift. Ihre
 *     Länge schwankt; früher waren es 75 bis 300 Wörter, seither werden sie
 *     länger. Hier liegen sie zwischen rund 200 und 350 Wörtern.
 *   * Drei Fragetypen, wie sie im Test vorkommen:
 *       – „Welche Aussage lässt sich ableiten?“ mit fünf einzelnen Aussagen,
 *       – dasselbe verneint: „… lässt sich NICHT ableiten?“ – hier ist die
 *         eine nicht ableitbare Aussage die richtige Antwort,
 *       – Aussagenkombinationen: drei oder vier Aussagen I bis IV, die
 *         Antworten nennen, welche davon zutreffen („Nur I und III“). Die
 *         Aussagen stehen in `statements`, `holds` markiert jene, die im Sinne
 *         der Frage zutreffen. Die Antworttexte müssen genau diese Menge
 *         treffen – der Selbsttest liest die Ziffern aus und prüft das.
 *
 * Beim Schreiben galten drei Regeln, die den Untertest ausmachen:
 *
 *   1. Jede Frage ist allein aus dem Text zu beantworten. Wer das Thema kennt,
 *      darf keinen Vorteil haben – geprüft wird Lesen, nicht Wissen. Was der
 *      Text nicht sagt, gilt als nicht ableitbar, auch wenn es zutrifft.
 *   2. Die falschen Antworten sind nicht einfach falsch, sondern auf die
 *      typischen Weisen falsch: Sie verallgemeinern, was der Text einschränkt
 *      („in manchen Fällen“ → „immer“), kehren eine Richtung um, verwechseln
 *      Ursache mit Wirkung, stehen zwar im Text, beantworten aber die Frage
 *      nicht, oder klingen plausibel und stehen nirgends.
 *   3. Keine Frage hängt an einem einzelnen Wort, das man überlesen kann,
 *      ohne den Satz verstanden zu haben.
 *
 * Fachlich sind die Texte so geschrieben, dass sie stimmen; prüfungsrelevant
 * ist trotzdem allein, was dasteht.
 *
 * Schreibkonvention wie überall: Die richtige Antwort steht zuerst, gemischt
 * wird beim Ziehen (siehe data/tv/index.js).
 *
 * Die Texte sind eigens geschrieben und enthalten keine Originaltexte.
 */

/** Fragestellung der Aussagenkombinationen – wie im Test mit „lässt/lassen“. */
const DERIVABLE = 'Welche der folgenden Aussagen lässt/lassen sich aus dem Text ableiten?';
/** Einzelaussagen, eine davon ableitbar. */
const ONE_DERIVABLE = 'Welche der folgenden Aussagen lässt sich aus dem Text ableiten?';
/** Einzelaussagen, eine davon nicht ableitbar. */
const ONE_NOT_DERIVABLE = 'Welche der folgenden Aussagen lässt sich NICHT aus dem Text ableiten?';

export const TEXTS = [
  {
    id: 'tv-schlaf',
    title: 'Warum wir schlafen',
    paragraphs: [
      'Lange galt Schlaf als Zustand der Untätigkeit, als bloße Pause zwischen zwei Wachphasen. Diese Sicht hat sich gründlich gewandelt. Messungen der Hirnaktivität zeigen, dass das Gehirn im Schlaf keineswegs ruht, sondern in geordneten Zyklen zwischen Phasen tiefer und flacher Aktivität wechselt. Ein solcher Zyklus dauert bei Erwachsenen etwa neunzig Minuten und wiederholt sich pro Nacht vier- bis sechsmal.',
      'Die Phasen eines Zyklus unterscheiden sich deutlich. Im Tiefschlaf sind die Hirnwellen langsam und gleichmäßig, Puls und Atmung verlangsamen sich, und Schlafende sind schwer zu wecken. Im sogenannten REM-Schlaf, benannt nach den raschen Augenbewegungen, gleicht die Hirnaktivität dagegen eher dem Wachzustand; in dieser Phase treten die meisten lebhaften Träume auf, während die Skelettmuskulatur weitgehend erschlafft. Gegen Morgen werden die REM-Phasen länger, der Tiefschlaf wird seltener.',
      'Besonders aufschlussreich ist der Zusammenhang zwischen Schlaf und Gedächtnis. Wer nach dem Lernen schläft, behält den Stoff messbar besser als jemand, der die gleiche Zeit wach verbringt. Man nimmt an, dass tagsüber gebildete Gedächtnisspuren im Tiefschlaf wiederholt und dabei von kurzlebigen in dauerhafte Speicher überführt werden. Entscheidend ist dabei nicht die Gesamtdauer des Schlafs allein, sondern der Anteil an Tiefschlaf, der vor allem in der ersten Nachthälfte anfällt.',
      'Ein zweiter Befund betrifft die Reinigung des Gehirns. Im Schlaf vergrößern sich die Zwischenräume zwischen den Nervenzellen, wodurch Flüssigkeit leichter hindurchströmen und Abbauprodukte abtransportieren kann. Dieser Vorgang läuft im Wachzustand deutlich langsamer ab. Ob daraus folgt, dass chronischer Schlafmangel neurodegenerative Erkrankungen begünstigt, ist bislang nicht abschließend geklärt; die vorliegenden Studien zeigen Zusammenhänge, aber keine gesicherte Ursache.',
      'Für den Alltag hat das Folgen. Wer die Nacht vor einer Prüfung durchlernt, tauscht Wiederholung gegen Verarbeitung – und verliert dabei meist mehr, als er gewinnt. Empfehlungen, den Schlaf durch kurze Tagschläfchen zu ersetzen, greifen ebenfalls zu kurz: Ein Mittagsschlaf von zwanzig Minuten erhöht nachweislich die Wachheit, erreicht aber die Tiefschlafphasen gar nicht erst, auf die es beim Einprägen ankommt.',
    ],
    questions: [
      {
        id: 'tv-schlaf-q1',
        prompt: DERIVABLE,
        statements: [
          { text: 'Ein Erwachsener durchläuft pro Nacht mehrere Schlafzyklen von rund neunzig Minuten.', holds: true },
          { text: 'Tiefschlaf fällt vor allem in der zweiten Nachthälfte an.', holds: false },
          { text: 'Im Wachzustand werden keine Abbauprodukte aus dem Gehirn abtransportiert.', holds: false },
          { text: 'Für das Behalten von Gelerntem zählt nicht allein die Gesamtdauer des Schlafs.', holds: true },
        ],
        options: [
          { text: 'Nur I und IV', correct: true },
          { text: 'Nur I, III und IV', correct: false },
          { text: 'Nur II und IV', correct: false },
          { text: 'Nur I', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'I steht im ersten Absatz (etwa neunzig Minuten, vier- bis sechsmal), IV im dritten („nicht die Gesamtdauer allein“). II kehrt die Angabe um – der Tiefschlaf liegt vor allem in der ersten Nachthälfte. III übertreibt: Im Wachzustand läuft der Abtransport „deutlich langsamer“, nicht gar nicht.',
      },
      {
        id: 'tv-schlaf-q2',
        prompt: 'Was sagt der Text über den Zusammenhang von Schlafmangel und neurodegenerativen Erkrankungen?',
        options: [
          { text: 'Es sind Zusammenhänge belegt, eine ursächliche Beziehung aber nicht gesichert.', correct: true },
          { text: 'Schlafmangel ist als Ursache solcher Erkrankungen nachgewiesen.', correct: false },
          { text: 'Ein Zusammenhang konnte in Studien nicht gefunden werden.', correct: false },
          { text: 'Die Frage wurde bisher nicht untersucht.', correct: false },
          { text: 'Neurodegenerative Erkrankungen führen ihrerseits zu Schlafmangel.', correct: false },
        ],
        explanation: 'Der Text formuliert an dieser Stelle bewusst vorsichtig: Zusammenhänge ja, gesicherte Ursache nein. Die übrigen Antworten machen daraus entweder mehr oder weniger, als dort steht; die letzte kehrt die Richtung um.',
      },
      {
        id: 'tv-schlaf-q3',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Ein zwanzigminütiger Mittagsschlaf ersetzt beim Einprägen den nächtlichen Tiefschlaf.', correct: true },
          { text: 'Ein kurzer Mittagsschlaf erhöht die Wachheit.', correct: false },
          { text: 'Im Schlaf vergrößern sich die Zwischenräume zwischen den Nervenzellen.', correct: false },
          { text: 'Wer nach dem Lernen schläft, behält den Stoff besser als jemand, der dieselbe Zeit wach bleibt.', correct: false },
          { text: 'Das Gehirn ist auch im Schlaf aktiv.', correct: false },
        ],
        explanation: 'Der letzte Absatz sagt das Gegenteil: Der kurze Mittagsschlaf erreicht die Tiefschlafphasen nicht, auf die es beim Einprägen ankommt. Alle übrigen Aussagen stehen so im Text – die Wachheit steigert der Mittagsschlaf ausdrücklich.',
      },
    ],
  },

  {
    id: 'tv-impf',
    title: 'Herdenschutz und seine Grenzen',
    paragraphs: [
      'Wenn in einer Bevölkerung genügend Menschen gegen eine übertragbare Krankheit immun sind, findet der Erreger nicht mehr genügend empfängliche Personen, um sich weiter auszubreiten. Von diesem Effekt profitieren auch jene, die selbst nicht immun sind – Säuglinge etwa, die für eine Impfung noch zu jung sind, oder Menschen, deren Immunsystem durch eine Behandlung geschwächt ist. Der Fachbegriff dafür lautet Herdenschutz.',
      'Wie hoch der Anteil der Immunen sein muss, hängt davon ab, wie ansteckend der Erreger ist. Bei Masern, einer der ansteckendsten bekannten Krankheiten, liegt die erforderliche Schwelle bei etwa fünfundneunzig Prozent; bei weniger übertragbaren Erregern genügen deutlich niedrigere Werte. Dass die Schwelle für jeden Erreger eigens bestimmt werden muss, wird in öffentlichen Debatten regelmäßig übersehen.',
      'Berechnen lässt sich die Schwelle aus der Zahl der Menschen, die eine erkrankte Person in einer vollständig empfänglichen Bevölkerung im Mittel ansteckt. Steckt jeder Kranke im Schnitt fünf andere an, müssen vier von fünf dieser Ansteckungen ausbleiben, damit die Zahl der Fälle nicht mehr wächst – die Schwelle liegt dann bei achtzig Prozent. Je mehr Menschen ein Kranker ansteckt, desto näher rückt sie an hundert Prozent heran.',
      'Der Herdenschutz hat allerdings Voraussetzungen, die leicht aus dem Blick geraten. Er wirkt nur, wenn sich die Immunen gleichmäßig verteilen. Bilden sich örtliche Gruppen mit geringer Impfquote, kann es dort auch dann zu Ausbrüchen kommen, wenn die landesweite Quote über der Schwelle liegt. Der Durchschnitt verbirgt in solchen Fällen genau das Problem, das er zu widerlegen scheint.',
      'Hinzu kommt, dass der Schutz nicht bei jedem Erreger gleich lange trägt. Wo die Immunität mit den Jahren nachlässt oder der Erreger sich verändert, muss sie aufgefrischt werden. Bei Krankheiten, die ausschließlich von Mensch zu Mensch übertragen werden, ist eine vollständige Ausrottung denkbar und im Fall der Pocken auch gelungen. Wo dagegen Tiere als Reservoir dienen, bleibt der Erreger auch dann bestehen, wenn die menschliche Bevölkerung weitgehend immun ist.',
    ],
    questions: [
      {
        id: 'tv-impf-q1',
        prompt: 'Wovon hängt laut Text die Höhe der nötigen Immunitätsschwelle ab?',
        options: [
          { text: 'Davon, wie ansteckend der jeweilige Erreger ist.', correct: true },
          { text: 'Von der Größe der betrachteten Bevölkerung.', correct: false },
          { text: 'Davon, wie schwer die Krankheit verläuft.', correct: false },
          { text: 'Davon, ob ein tierisches Reservoir existiert.', correct: false },
          { text: 'Von der Dauer, die die Immunität anhält.', correct: false },
        ],
        explanation: 'Der Text nennt allein die Übertragbarkeit als Maßstab für die Schwelle. Reservoir und Dauer der Immunität kommen im Text vor, betreffen dort aber andere Fragen – ein typischer Fall von „steht im Text, beantwortet aber die Frage nicht“.',
      },
      {
        id: 'tv-impf-q2',
        prompt: 'Warum kann es trotz ausreichender landesweiter Impfquote zu Ausbrüchen kommen?',
        options: [
          { text: 'Weil sich örtlich Gruppen mit geringer Quote bilden können und der Durchschnitt das verdeckt.', correct: true },
          { text: 'Weil die Schwelle für Masern nie erreicht wird.', correct: false },
          { text: 'Weil Geimpfte den Erreger ebenso weitergeben wie Ungeimpfte.', correct: false },
          { text: 'Weil die landesweite Quote nur geschätzt werden kann.', correct: false },
          { text: 'Weil Säuglinge und Immungeschwächte den Erreger in Umlauf halten.', correct: false },
        ],
        explanation: 'Der vierte Absatz erklärt es mit der ungleichen Verteilung. Die übrigen Antworten führen Gründe an, die der Text nicht nennt – die letzte verkehrt sogar die Rolle derer, die der Herdenschutz gerade schützen soll.',
      },
      {
        id: 'tv-impf-q3',
        prompt: DERIVABLE,
        statements: [
          { text: 'Vom Herdenschutz profitieren auch Menschen, die selbst nicht immun sind.', holds: true },
          { text: 'Bei Masern muss etwa fünfundneunzig Prozent der Bevölkerung immun sein, damit der Herdenschutz trägt.', holds: true },
          { text: 'Erreger mit tierischem Reservoir lassen sich durch hohe Impfquoten beim Menschen vollständig ausrotten.', holds: false },
          { text: 'Die Pocken konnten ausgerottet werden, weil die Immunität gegen sie lebenslang anhält.', holds: false },
        ],
        options: [
          { text: 'Nur I und II', correct: true },
          { text: 'Nur I, II und III', correct: false },
          { text: 'Nur I, II und IV', correct: false },
          { text: 'Nur II und III', correct: false },
          { text: 'Nur I', correct: false },
        ],
        explanation: 'I und II stehen in den ersten beiden Absätzen. III widerspricht dem letzten Satz: Mit tierischem Reservoir bleibt der Erreger bestehen. IV nennt einen Grund, den der Text nicht gibt – er verbindet die Ausrottung der Pocken mit der reinen Übertragung von Mensch zu Mensch, nicht mit der Dauer der Immunität.',
      },
    ],
  },

  {
    id: 'tv-stadt',
    title: 'Die Stadt als Wärmeinsel',
    paragraphs: [
      'In Städten ist es wärmer als im Umland, und der Unterschied ist erheblich: An windstillen Sommerabenden liegt er in Mitteleuropa regelmäßig bei mehreren Grad. Verantwortlich dafür sind mehrere Faktoren, die sich gegenseitig verstärken. Asphalt und Beton nehmen tagsüber Wärme auf und geben sie nachts langsam wieder ab. Gleichzeitig fehlt es an Grünflächen, über denen Wasser verdunsten und dabei Wärme binden könnte.',
      'Hinzu kommt die Bauweise selbst. Enge Straßenschluchten zwischen hohen Häusern schränken den Blick zum Himmel ein, über den Wärme nachts abgestrahlt wird. Was tagsüber gespeichert wurde, entweicht deshalb nur langsam. Verkehr, Klimaanlagen und Industrie geben zusätzliche Wärme ab – ein Beitrag, der im Vergleich zu den übrigen Faktoren allerdings gering ausfällt und außerhalb von Hitzeperioden kaum ins Gewicht fällt.',
      'Die gesundheitlichen Folgen treffen nicht alle gleich. Ältere Menschen, Kleinkinder und chronisch Kranke reagieren empfindlicher auf anhaltende Hitze, und gerade in dicht bebauten Vierteln mit wenig Grün leben häufig Haushalte mit geringem Einkommen. Die Wärmeinsel verschärft damit Unterschiede, die schon vorher bestanden.',
      'Messungen zeigen, wie groß die Unterschiede innerhalb einer Stadt sein können. In einer Hitzewelle kann sich die Oberfläche eines dunklen Parkplatzes am Nachmittag auf über fünfzig Grad erhitzen, während der Rasen eines nahen Parks deutlich kühler bleibt. Für die Gesundheit ist allerdings weniger die Hitze des Tages entscheidend als die der Nacht: Kühlt es nachts nicht mehr ab, kann sich der Körper nicht erholen, und gerade dann steigt die Zahl hitzebedingter Krankenhausaufnahmen und Todesfälle.',
      'Als Gegenmaßnahmen werden vor allem Bäume, entsiegelte Flächen und helle Dächer genannt. Bäume wirken doppelt: Sie spenden Schatten und kühlen zusätzlich durch Verdunstung. Helle Dächer werfen Sonnenstrahlung zurück, statt sie aufzunehmen, und sind vergleichsweise günstig umzusetzen. Am wirksamsten ist allerdings keine einzelne Maßnahme, sondern deren Verbindung im Quartier – eine Baumreihe in einer ansonsten versiegelten Straße bleibt ein Tropfen auf den heißen Stein.',
    ],
    questions: [
      {
        id: 'tv-stadt-q1',
        prompt: 'Welche Rolle spielen Straßenschluchten für die städtische Wärmeinsel?',
        options: [
          { text: 'Sie behindern die nächtliche Abstrahlung von Wärme zum Himmel.', correct: true },
          { text: 'Sie verhindern, dass Wind die Luft am Tag aufheizt.', correct: false },
          { text: 'Sie sammeln die Abwärme von Verkehr und Klimaanlagen.', correct: false },
          { text: 'Sie verstärken die Verdunstung und damit die Wärmebindung.', correct: false },
          { text: 'Sie sind für den Effekt ohne Bedeutung.', correct: false },
        ],
        explanation: 'Der zweite Absatz nennt genau diesen Mechanismus. Die Antwort zur Verdunstung kehrt die Wirkung um: Verdunstung bindet Wärme, sie ist Teil der Lösung und nicht des Problems.',
      },
      {
        id: 'tv-stadt-q2',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Abwärme aus Verkehr und Industrie ist die Hauptursache der städtischen Wärmeinsel.', correct: true },
          { text: 'Asphalt und Beton geben tagsüber aufgenommene Wärme nachts langsam wieder ab.', correct: false },
          { text: 'Helle Dächer werfen Sonnenstrahlung zurück.', correct: false },
          { text: 'In dicht bebauten Vierteln mit wenig Grün leben häufig Haushalte mit geringem Einkommen.', correct: false },
          { text: 'Ältere Menschen reagieren empfindlicher auf anhaltende Hitze.', correct: false },
        ],
        explanation: 'Der Text nennt den Beitrag von Verkehr, Klimaanlagen und Industrie ausdrücklich „gering“ im Vergleich zu den übrigen Faktoren. Alles andere steht fast wörtlich im Text.',
      },
      {
        id: 'tv-stadt-q3',
        prompt: DERIVABLE,
        statements: [
          { text: 'Bäume kühlen sowohl durch Schatten als auch durch Verdunstung.', holds: true },
          { text: 'Helle Dächer sind die wirksamste Einzelmaßnahme.', holds: false },
          { text: 'Eine einzelne Baumreihe in einer sonst versiegelten Straße bewirkt wenig.', holds: true },
          { text: 'Die Wärmeinsel trifft alle Bevölkerungsgruppen gleich stark.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I, II und III', correct: false },
          { text: 'Nur I', correct: false },
          { text: 'Nur III und IV', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'I und III stehen im letzten Absatz („Tropfen auf den heißen Stein“). II verschiebt die Aussage: Helle Dächer sind günstig, als wirksamste Einzelmaßnahme nennt der Text sie nicht – er stellt die Verbindung der Maßnahmen über jede einzelne. IV widerspricht dem dritten Absatz.',
      },
    ],
  },

  {
    id: 'tv-antibio',
    title: 'Wie Resistenzen entstehen',
    paragraphs: [
      'Bakterien vermehren sich schnell, und bei jeder Teilung können Fehler in ihrem Erbgut auftreten. Die meisten dieser Veränderungen sind für das Bakterium nachteilig oder ohne Folgen. Gelegentlich entsteht jedoch eine Veränderung, die es unempfindlich gegen ein Antibiotikum macht – etwa weil sich die Struktur verändert, an der das Mittel ansetzt, oder weil das Bakterium den Wirkstoff aus der Zelle hinausbefördert.',
      'Solche Veränderungen entstehen zufällig, nicht als Antwort auf das Antibiotikum. Das Mittel erzeugt die Resistenz also nicht, es wählt sie aus: Wo ein Antibiotikum wirkt, sterben die empfindlichen Bakterien, während die wenigen unempfindlichen überleben und sich ungestört vermehren. Nach wenigen Generationen besteht die Population überwiegend aus resistenten Nachkommen. Dieses Missverständnis – das Antibiotikum als Ursache statt als Auslese – hält sich hartnäckig.',
      'Bakterien können Resistenzgene zudem untereinander weitergeben, und zwar nicht nur an ihre eigenen Nachkommen. Über ringförmige DNA-Stücke gelangen solche Gene auch zwischen entfernt verwandten Arten. Deshalb kann eine Resistenz, die in einer harmlosen Darmbakterienart entstanden ist, später in einem Krankheitserreger auftauchen.',
      'Resistenzen entstehen nicht nur in Krankenhäusern. Auch in der Tierhaltung werden große Mengen Antibiotika eingesetzt, und über das Abwasser gelangen Rückstände und resistente Bakterien in Flüsse und Böden. Wo Menschen, Tiere und Umwelt so eng verbunden sind, lässt sich das Problem in keinem dieser Bereiche allein lösen. Zugleich sind in den vergangenen Jahrzehnten nur wenige grundlegend neue Wirkstoffklassen hinzugekommen – ihre Entwicklung ist teuer, und neue Mittel sollen, damit sie wirksam bleiben, möglichst selten eingesetzt werden.',
      'Für die Praxis folgt daraus zweierlei. Erstens beschleunigt jeder unnötige Einsatz eines Antibiotikums die Auslese, auch dort, wo er dem einzelnen Patienten nicht schadet. Zweitens ist eine zu kurze oder unregelmäßige Einnahme problematisch, weil sie Wirkstoffkonzentrationen erzeugt, bei denen empfindliche Bakterien überleben und teilweise unempfindliche im Vorteil sind. Die häufig gehörte Regel, eine Packung stets vollständig aufzubrauchen, ist damit allerdings nicht gemeint: Maßgeblich ist die ärztlich festgelegte Dauer, die je nach Erkrankung kürzer ausfallen kann.',
    ],
    questions: [
      {
        id: 'tv-antibio-q1',
        prompt: 'Welche Aussage über die Entstehung von Resistenzen entspricht dem Text?',
        options: [
          { text: 'Die Veränderungen entstehen zufällig; das Antibiotikum wählt die unempfindlichen Bakterien aus.', correct: true },
          { text: 'Das Antibiotikum löst im Bakterium die passende Veränderung aus.', correct: false },
          { text: 'Bakterien entwickeln gezielt Abwehrmechanismen gegen das Mittel, dem sie ausgesetzt sind.', correct: false },
          { text: 'Resistenzen entstehen erst, wenn ein Antibiotikum zu niedrig dosiert wird.', correct: false },
          { text: 'Nur Krankheitserreger können resistent werden, harmlose Arten nicht.', correct: false },
        ],
        explanation: 'Der zweite Absatz unterscheidet ausdrücklich zwischen Erzeugen und Auswählen. Die letzte Antwort widerspricht dem dritten Absatz, in dem eine Resistenz aus einer harmlosen Art in einen Erreger gelangt.',
      },
      {
        id: 'tv-antibio-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Resistenzgene können zwischen entfernt verwandten Bakterienarten weitergegeben werden.', holds: true },
          { text: 'Eine Resistenz kann darauf beruhen, dass das Bakterium den Wirkstoff aus der Zelle befördert.', holds: true },
          { text: 'Die meisten Veränderungen im Erbgut von Bakterien machen diese resistent.', holds: false },
          { text: 'Eine Antibiotikapackung sollte stets vollständig aufgebraucht werden.', holds: false },
        ],
        options: [
          { text: 'Nur I und II', correct: true },
          { text: 'Nur I, II und IV', correct: false },
          { text: 'Nur II und III', correct: false },
          { text: 'Nur I', correct: false },
          { text: 'Nur I, II und III', correct: false },
        ],
        explanation: 'I steht im dritten Absatz (ringförmige DNA-Stücke), II im ersten. III widerspricht dem ersten Absatz: Die meisten Veränderungen sind nachteilig oder folgenlos. IV ist die Regel, von der sich der letzte Absatz ausdrücklich absetzt – maßgeblich ist die ärztlich festgelegte Dauer.',
      },
      {
        id: 'tv-antibio-q3',
        prompt: 'Warum ist dem Text zufolge auch ein Antibiotikum problematisch, das dem behandelten Patienten nicht schadet?',
        options: [
          { text: 'Weil jeder unnötige Einsatz die Auslese resistenter Bakterien beschleunigt.', correct: true },
          { text: 'Weil er die Darmflora dauerhaft verändert.', correct: false },
          { text: 'Weil er die Wirksamkeit bei diesem Patienten für später aufbraucht.', correct: false },
          { text: 'Weil er zu unregelmäßiger Einnahme verleitet.', correct: false },
          { text: 'Weil er neue Resistenzgene im Patienten entstehen lässt.', correct: false },
        ],
        explanation: 'Der Text argumentiert hier über die Allgemeinheit, nicht über den Einzelnen. Die letzte Antwort fällt zudem in das im zweiten Absatz beschriebene Missverständnis zurück.',
      },
    ],
  },

  {
    id: 'tv-statistik',
    title: 'Was ein Test wirklich aussagt',
    paragraphs: [
      'Ein medizinischer Test gilt als gut, wenn er Kranke zuverlässig erkennt und Gesunde zuverlässig ausschließt. Die erste Eigenschaft heißt Sensitivität, die zweite Spezifität. Ein Test mit neunundneunzig Prozent Sensitivität übersieht unter hundert Kranken im Mittel einen. Ein Test mit neunundneunzig Prozent Spezifität schlägt unter hundert Gesunden im Mittel einmal fälschlich an.',
      'Beide Eigenschaften lassen sich bei vielen Tests nicht zugleich beliebig steigern. Wird die Grenze, ab der ein Messwert als auffällig gilt, niedriger angesetzt, entgehen dem Test weniger Kranke, dafür schlägt er häufiger bei Gesunden an; eine höhere Grenze bewirkt das Umgekehrte. Wo die Grenze liegen soll, hängt davon ab, was im jeweiligen Fall schwerer wiegt: ein übersehener Kranker oder ein unnötig beunruhigter Gesunder.',
      'Beide Zahlen sagen für sich genommen wenig darüber aus, was ein positives Ergebnis im Einzelfall bedeutet. Dafür braucht es eine dritte Größe: wie verbreitet die Krankheit in der untersuchten Gruppe überhaupt ist. Man nennt sie Prävalenz. Erst aus dem Zusammenspiel dieser drei Angaben ergibt sich, wie wahrscheinlich es ist, dass eine Person mit positivem Ergebnis tatsächlich krank ist.',
      'Ein Beispiel macht das anschaulich. Man untersuche zehntausend Personen mit einem Test, der in beiden Eigenschaften neunundneunzig Prozent erreicht, auf eine Krankheit, die einen von tausend betrifft. Unter ihnen sind also zehn Kranke, von denen der Test etwa alle findet. Unter den neuntausendneunhundertneunzig Gesunden schlägt er bei einem Prozent fälschlich an, also bei rund hundert Personen. Von den etwa hundertzehn positiven Ergebnissen entfallen damit hundert auf Gesunde: Wer ein positives Ergebnis erhält, ist trotz eines sehr guten Tests mit weniger als zehn Prozent Wahrscheinlichkeit tatsächlich krank.',
      'Daraus folgt kein Misstrauen gegen Tests, wohl aber gegen das Testen ohne Anlass. In einer Gruppe mit Beschwerden oder bekanntem Risiko ist die Prävalenz höher, und dasselbe Ergebnis wiegt dort ungleich schwerer. Reihenuntersuchungen an Gesunden liefern dagegen zwangsläufig viele falsch positive Befunde – mit Folgeuntersuchungen, Wartezeiten und Ängsten, die selbst nicht folgenlos bleiben.',
    ],
    questions: [
      {
        id: 'tv-statistik-q1',
        prompt: 'Was beschreibt die Spezifität eines Tests?',
        options: [
          { text: 'Wie zuverlässig er Gesunde als gesund erkennt.', correct: true },
          { text: 'Wie zuverlässig er Kranke als krank erkennt.', correct: false },
          { text: 'Wie verbreitet die Krankheit in der Gruppe ist.', correct: false },
          { text: 'Wie wahrscheinlich ein positiv Getesteter krank ist.', correct: false },
          { text: 'Wie genau der Messwert des Tests reproduzierbar ist.', correct: false },
        ],
        explanation: 'Der erste Absatz ordnet die Begriffe eindeutig zu. Die zweite Antwort beschreibt die Sensitivität, die dritte die Prävalenz – Verwechslungen, die der Text gerade auseinanderhalten will.',
      },
      {
        id: 'tv-statistik-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Ein Test mit neunundneunzig Prozent Sensitivität übersieht unter hundert Kranken im Mittel einen.', holds: true },
          { text: 'Ob ein positives Ergebnis zutrifft, lässt sich allein aus Sensitivität und Spezifität bestimmen.', holds: false },
          { text: 'Im Beispiel ist eine positiv getestete Person mit weniger als zehn Prozent Wahrscheinlichkeit krank.', holds: true },
          { text: 'In einer Gruppe mit Beschwerden wiegt ein positives Ergebnis weniger schwer als bei einer Reihenuntersuchung an Gesunden.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I, II und III', correct: false },
          { text: 'Nur III', correct: false },
          { text: 'Nur I, III und IV', correct: false },
          { text: 'Nur II und IV', correct: false },
        ],
        explanation: 'I steht im ersten Absatz, III ist das Ergebnis des Rechenbeispiels (zehn von etwa hundertzehn). II widerspricht dem dritten Absatz, der ausdrücklich die Prävalenz als dritte Größe verlangt. IV kehrt den letzten Absatz um: Bei höherer Prävalenz wiegt dasselbe Ergebnis schwerer.',
      },
      {
        id: 'tv-statistik-q3',
        prompt: 'Welche Folgerung zieht der Text aus dem Beispiel?',
        options: [
          { text: 'Nicht Tests sind das Problem, sondern das Testen ohne Anlass.', correct: true },
          { text: 'Tests mit hoher Spezifität sind unbrauchbar.', correct: false },
          { text: 'Reihenuntersuchungen sollten grundsätzlich unterbleiben.', correct: false },
          { text: 'Ein positives Ergebnis ist praktisch immer ein Fehlalarm.', correct: false },
          { text: 'Die Sensitivität sollte zulasten der Spezifität erhöht werden.', correct: false },
        ],
        explanation: 'Der letzte Absatz beginnt genau mit dieser Unterscheidung. Die übrigen Antworten überziehen das Argument – ein häufiger Fehlertyp, weil sie in dieselbe Richtung weisen wie der Text, nur zu weit.',
      },
    ],
  },

  {
    id: 'tv-schmerz',
    title: 'Schmerz ist kein Messwert',
    paragraphs: [
      'Dass Schmerz und Gewebeschaden zusammenhängen, ist die Alltagsvorstellung. Sie stimmt oft, aber keineswegs immer. Soldaten mit schweren Verletzungen berichten bisweilen erst Stunden später von Schmerzen; umgekehrt leiden Menschen mit unauffälligen Befunden über Jahre unter erheblichen Beschwerden. Die Stärke des Schmerzes lässt sich aus dem Ausmaß der Schädigung also nicht ablesen.',
      'Erklären lässt sich das damit, dass Schmerz im Nervensystem nicht bloß weitergeleitet, sondern verarbeitet wird. Auf dem Weg vom Gewebe zum Gehirn wird das Signal an mehreren Stellen verstärkt oder gedämpft, und absteigende Bahnen aus dem Gehirn greifen ihrerseits in diese Verarbeitung ein. Aufmerksamkeit, frühere Erfahrungen und die Erwartung, was der Schmerz bedeutet, verändern deshalb messbar, wie stark er empfunden wird.',
      'Wie stark solche Einflüsse sein können, zeigen Versuche, in denen derselbe Hitzereiz einmal mit dem Hinweis angekündigt wird, er sei harmlos, und einmal mit dem Hinweis, er könne die Haut schädigen. Im zweiten Fall bewerten die Versuchspersonen den Reiz als deutlich schmerzhafter, obwohl er physikalisch genau derselbe ist. Verschieden ist allein, was die Person über ihn zu wissen glaubt.',
      'Bei anhaltendem Schmerz kommt ein weiterer Vorgang hinzu. Werden die beteiligten Nervenbahnen über längere Zeit gereizt, reagieren sie zunehmend empfindlich. Reize, die zuvor harmlos waren, können dann schmerzen. In diesem Stadium ist der Schmerz selbst zum Problem geworden und nicht mehr nur Anzeiger einer Schädigung – eine Unterscheidung, die für die Behandlung erhebliche Folgen hat.',
      'Für den klinischen Alltag heißt das vor allem eines: Die Angabe der betroffenen Person bleibt die maßgebliche Quelle. Bildgebende Verfahren zeigen Strukturen, nicht Empfindungen, und ein unauffälliges Bild widerlegt keine Beschwerden. Umgekehrt finden sich in Aufnahmen von beschwerdefreien Menschen regelmäßig Veränderungen, die man bei Schmerzpatienten schnell zur Ursache erklären würde.',
    ],
    questions: [
      {
        id: 'tv-schmerz-q1',
        prompt: 'Welche Aussage über das Verhältnis von Schmerz und Gewebeschaden entspricht dem Text?',
        options: [
          { text: 'Aus dem Ausmaß der Schädigung lässt sich die Schmerzstärke nicht ablesen.', correct: true },
          { text: 'Zwischen beiden besteht kein Zusammenhang.', correct: false },
          { text: 'Je schwerer die Schädigung, desto stärker der Schmerz.', correct: false },
          { text: 'Schmerz ohne Befund beruht in der Regel auf Einbildung.', correct: false },
          { text: 'Der Zusammenhang gilt bei akuten, nicht bei chronischen Schmerzen.', correct: false },
        ],
        explanation: 'Der Text sagt „oft, aber nicht immer“ – das ist weder ein strenger Zusammenhang noch gar keiner. Die zweite und dritte Antwort übertreiben in je eine Richtung.',
      },
      {
        id: 'tv-schmerz-q2',
        prompt: 'Was ist mit den absteigenden Bahnen aus dem Gehirn gemeint?',
        options: [
          { text: 'Bahnen, über die das Gehirn in die Verarbeitung des Schmerzsignals eingreift.', correct: true },
          { text: 'Bahnen, die den Schmerz vom Gewebe zum Gehirn leiten.', correct: false },
          { text: 'Nervenbahnen, die bei anhaltendem Schmerz empfindlicher werden.', correct: false },
          { text: 'Bahnen, die Bewegungsbefehle an die Muskeln übermitteln.', correct: false },
          { text: 'Verbindungen zwischen Aufmerksamkeit und Erinnerung.', correct: false },
        ],
        explanation: 'Der zweite Absatz beschreibt sie als Gegenrichtung zum aufsteigenden Signal. Die dritte Antwort greift einen Vorgang aus dem vierten Absatz auf, der damit nichts zu tun hat.',
      },
      {
        id: 'tv-schmerz-q3',
        prompt: DERIVABLE,
        statements: [
          { text: 'Bei anhaltender Reizung können zuvor harmlose Reize Schmerzen auslösen.', holds: true },
          { text: 'Ein unauffälliges Bild widerlegt keine Beschwerden.', holds: true },
          { text: 'Bildgebende Verfahren zeigen, wie stark ein Schmerz empfunden wird.', holds: false },
          { text: 'Frühere Erfahrungen beeinflussen, wie stark Schmerz empfunden wird.', holds: true },
        ],
        options: [
          { text: 'Nur I, II und IV', correct: true },
          { text: 'Alle vier Aussagen', correct: false },
          { text: 'Nur I und II', correct: false },
          { text: 'Nur II, III und IV', correct: false },
          { text: 'Nur I und IV', correct: false },
        ],
        explanation: 'I steht im vierten, II im letzten, IV im zweiten Absatz. III kehrt den letzten Absatz um: Bildgebende Verfahren zeigen Strukturen, nicht Empfindungen. Wer nur zwei der drei richtigen findet, landet bei den Teilmengen-Antworten – auch das eine typische Falle.',
      },
    ],
  },

  {
    id: 'tv-placebo',
    title: 'Der Placeboeffekt und was er nicht ist',
    paragraphs: [
      'Dass Menschen sich nach der Einnahme eines wirkstofffreien Präparats besser fühlen, ist gut belegt. Weniger klar ist, was daraus folgt. Der Effekt wird häufig als Beweis dafür angeführt, dass Erwartung über Krankheit entscheidet. Diese Deutung geht zu weit und übersieht, wie solche Studien zustande kommen.',
      'Beobachtet wird in der Regel der Unterschied zwischen einer Placebogruppe und dem Zustand vor der Behandlung. In diese Differenz geht vieles ein, was mit Erwartung nichts zu tun hat: Viele Beschwerden bessern sich von selbst; wer an einer Studie teilnimmt, wird aufmerksamer betreut; und Personen melden sich meist dann, wenn es ihnen besonders schlecht geht, sodass eine Besserung schon rein statistisch wahrscheinlich ist. Um den Effekt selbst zu bestimmen, braucht es deshalb eine dritte Gruppe, die gar nicht behandelt wird – und in Studien mit einer solchen Gruppe fällt der Placeboeffekt deutlich kleiner aus.',
      'Was bleibt, ist gleichwohl bemerkenswert. Am stärksten und am zuverlässigsten zeigt sich der Effekt bei Beschwerden, die die betroffene Person selbst berichtet: Schmerz, Übelkeit, Müdigkeit. Auf messbare Größen wie Blutdruck, Tumorgröße oder Laborwerte wirkt er dagegen kaum. Diese Verteilung ist kein Zufall – sie deckt sich mit der Annahme, dass der Effekt vor allem die Verarbeitung und Bewertung von Empfindungen verändert.',
      'Auch das Gegenstück ist belegt. Wer erwartet, dass ein Präparat Nebenwirkungen hat, berichtet häufiger darüber – selbst wenn er nur ein Scheinpräparat erhalten hat. In Studien klagen Teilnehmende der Placebogruppe regelmäßig über Kopfschmerz, Müdigkeit oder Übelkeit, also über genau jene Beschwerden, die in der Aufklärung aufgezählt wurden. Man spricht vom Noceboeffekt.',
      'Praktisch folgt daraus weder, Placebos einzusetzen, noch, sie für bedeutungslos zu halten. Bedeutsam ist vielmehr, dass jede Behandlung einen solchen Anteil enthält: Zuwendung, Erklärung und eine glaubwürdige Aussicht auf Besserung wirken auch dann, wenn daneben ein Wirkstoff gegeben wird. Wer diesen Anteil vernachlässigt, verschenkt Wirkung, die nichts kostet.',
    ],
    questions: [
      {
        id: 'tv-placebo-q1',
        prompt: 'Welche Deutung des Placeboeffekts weist der Text zurück?',
        options: [
          { text: 'Dass er beweise, Erwartung entscheide über Krankheit.', correct: true },
          { text: 'Dass er bei selbst berichteten Beschwerden am stärksten sei.', correct: false },
          { text: 'Dass er in jeder Behandlung enthalten sei.', correct: false },
          { text: 'Dass Zuwendung auch neben einem Wirkstoff wirke.', correct: false },
          { text: 'Dass er in Studien überhaupt messbar sei.', correct: false },
        ],
        explanation: 'Der erste Absatz nennt genau diese Deutung und erklärt sie für überzogen. Die zweite bis vierte Antwort vertritt der Text selbst – wer nur überfliegt, verwechselt hier leicht These und Gegenthese.',
      },
      {
        id: 'tv-placebo-q2',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Auf Laborwerte und Tumorgröße wirkt der Placeboeffekt besonders zuverlässig.', correct: true },
          { text: 'Viele Beschwerden bessern sich von selbst.', correct: false },
          { text: 'Wer an einer Studie teilnimmt, wird aufmerksamer betreut.', correct: false },
          { text: 'In Studien mit einer unbehandelten Gruppe fällt der Placeboeffekt kleiner aus.', correct: false },
          { text: 'Zuwendung und Erklärung wirken auch neben einem Wirkstoff.', correct: false },
        ],
        explanation: 'Der dritte Absatz sagt das Gegenteil: Auf messbare Größen wie Laborwerte oder Tumorgröße wirkt der Effekt kaum, am zuverlässigsten ist er bei selbst berichteten Beschwerden. Die übrigen Aussagen stehen im zweiten und im letzten Absatz.',
      },
      {
        id: 'tv-placebo-q3',
        prompt: 'Wozu braucht es laut Text eine unbehandelte dritte Gruppe?',
        options: [
          { text: 'Um den Effekt von spontaner Besserung und ähnlichen Einflüssen zu trennen.', correct: true },
          { text: 'Um die Placebogruppe zu vergrößern.', correct: false },
          { text: 'Um die Wirksamkeit des eigentlichen Wirkstoffs zu belegen.', correct: false },
          { text: 'Um die Betreuung in beiden Gruppen vergleichbar zu machen.', correct: false },
          { text: 'Um ethische Bedenken gegen Placebogaben auszuräumen.', correct: false },
        ],
        explanation: 'Der zweite Absatz führt die dritte Gruppe genau zu diesem Zweck ein. Die übrigen Zwecke sind in Studien üblich, hier aber nicht gemeint.',
      },
    ],
  },

  {
    id: 'tv-licht',
    title: 'Licht am Abend und die innere Uhr',
    paragraphs: [
      'Fast alle Körperfunktionen schwanken im Tagesverlauf: die Körpertemperatur, der Blutdruck, die Spiegel zahlreicher Hormone. Den Takt gibt eine kleine Gruppe von Nervenzellen im Zwischenhirn vor, die als Hauptuhr des Körpers gilt. Ihr eigener Rhythmus dauert bei den meisten Menschen etwas länger als vierundzwanzig Stunden und muss deshalb täglich nachgestellt werden. Wichtigster Zeitgeber ist Licht. Erfasst wird es von besonderen Zellen der Netzhaut, die nicht dem Sehen dienen und am stärksten auf kurzwelliges, bläuliches Licht ansprechen.',
      'Am Abend schüttet die Zirbeldrüse das Hormon Melatonin aus, das dem Körper Nacht signalisiert. Helles Licht in den Abendstunden hemmt diese Ausschüttung und verschiebt die innere Uhr nach hinten: Man wird später müde und wacht später auf. Licht am Morgen bewirkt das Gegenteil und verschiebt die Uhr nach vorn. Entscheidend ist also nicht nur die Helligkeit, sondern auch der Zeitpunkt – dieselbe Lichtmenge wirkt je nach Tageszeit in entgegengesetzte Richtung.',
      'Wie eng Licht und innere Uhr verknüpft sind, zeigt sich bei manchen vollständig blinden Menschen. Fehlen ihnen auch die lichtempfindlichen Zellen, die nicht dem Sehen dienen, läuft ihre Uhr frei: Weil ihr Rhythmus etwas länger als ein Tag ist, verschiebt sich ihre Schlafbereitschaft von Tag zu Tag ein wenig, bis sie nach einigen Wochen mitten in den Tag fällt.',
      'Bildschirme stehen deshalb häufig in der Kritik. Die Lichtmenge, die ein Telefon abgibt, ist allerdings gering im Vergleich zu einer hell erleuchteten Wohnung, und Studien finden für den Bildschirm allein meist nur Verschiebungen von wenigen Minuten. Wer abends schlecht einschläft, sollte daher eher auf die gesamte Beleuchtung achten – und darauf, ob das, was auf dem Bildschirm geschieht, wach hält.',
      'Folgen hat ein verschobener Rhythmus vor allem dort, wo er mit äußeren Zeiten kollidiert. Jugendliche haben biologisch bedingt eine spätere innere Uhr als Erwachsene; ein früher Schulbeginn zwingt sie, gegen ihren Rhythmus aufzustehen, und der fehlende Schlaf lässt sich am Wochenende nur teilweise nachholen. Ähnliches gilt für Schichtarbeit, bei der der Schlaf in eine Phase fällt, in der der Körper auf Wachheit eingestellt ist.',
    ],
    questions: [
      {
        id: 'tv-licht-q1',
        prompt: 'Warum muss die innere Uhr laut Text täglich nachgestellt werden?',
        options: [
          { text: 'Weil ihr eigener Rhythmus bei den meisten Menschen etwas länger als vierundzwanzig Stunden dauert.', correct: true },
          { text: 'Weil Melatonin im Lauf des Tages vollständig abgebaut wird.', correct: false },
          { text: 'Weil die lichtempfindlichen Zellen der Netzhaut im Lauf des Tages ermüden.', correct: false },
          { text: 'Weil Bildschirme den Rhythmus jeden Abend verschieben.', correct: false },
          { text: 'Weil ihr Rhythmus bei Jugendlichen kürzer ist als bei Erwachsenen.', correct: false },
        ],
        explanation: 'Der erste Absatz verbindet beides mit „deshalb“: Der Eigenrhythmus ist etwas länger als ein Tag. Die übrigen Gründe stehen nicht im Text; die letzte Antwort verdreht sogar die Aussage über Jugendliche, deren Uhr später, nicht kürzer ist.',
      },
      {
        id: 'tv-licht-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Licht am Abend verschiebt die innere Uhr nach hinten.', holds: true },
          { text: 'Die für die innere Uhr wichtigen Zellen der Netzhaut dienen vor allem dem Sehen.', holds: false },
          { text: 'Dieselbe Lichtmenge kann je nach Tageszeit in entgegengesetzte Richtung wirken.', holds: true },
          { text: 'Melatonin wird am Morgen ausgeschüttet und macht wach.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I, II und III', correct: false },
          { text: 'Nur III und IV', correct: false },
          { text: 'Nur I', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'I und III stehen im zweiten Absatz. II widerspricht dem ersten Absatz: Die Zellen dienen gerade nicht dem Sehen. IV verdreht den zweiten Absatz – Melatonin wird am Abend ausgeschüttet und signalisiert Nacht.',
      },
      {
        id: 'tv-licht-q3',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Bildschirme sind die Hauptursache dafür, dass Menschen abends spät einschlafen.', correct: true },
          { text: 'Jugendliche haben biologisch bedingt eine spätere innere Uhr als Erwachsene.', correct: false },
          { text: 'Ein Telefon gibt weniger Licht ab als eine hell erleuchtete Wohnung.', correct: false },
          { text: 'Bei Schichtarbeit fällt der Schlaf in eine Phase, in der der Körper auf Wachheit eingestellt ist.', correct: false },
          { text: 'Auch die Körpertemperatur schwankt im Tagesverlauf.', correct: false },
        ],
        explanation: 'Der vierte Absatz relativiert gerade die Rolle der Bildschirme: Für sie allein finden Studien meist nur Verschiebungen von wenigen Minuten. Die übrigen Aussagen stehen so im Text.',
      },
    ],
  },

  {
    id: 'tv-insulin',
    title: 'Wenn Insulin nicht mehr wirkt',
    paragraphs: [
      'Nach einer Mahlzeit steigt der Zuckerspiegel im Blut. Die Bauchspeicheldrüse antwortet darauf mit der Ausschüttung von Insulin, einem Hormon, das Muskel-, Fett- und Leberzellen veranlasst, Glukose aufzunehmen oder zu speichern. So sinkt der Blutzucker innerhalb weniger Stunden wieder auf seinen Ausgangswert.',
      'Zwischen den Mahlzeiten sorgt ein Gegenspieler dafür, dass der Blutzucker nicht zu tief fällt. Sinkt er, schüttet die Bauchspeicheldrüse Glukagon aus, das die Leber veranlasst, gespeicherten Zucker freizusetzen. Das Gehirn ist auf diese Versorgung besonders angewiesen, weil es unter gewöhnlichen Bedingungen fast ausschließlich Glukose als Energiequelle nutzt.',
      'Bei einer Insulinresistenz sprechen die Zellen schwächer auf das Hormon an. Anfangs gleicht die Bauchspeicheldrüse das aus, indem sie mehr Insulin bildet; der Blutzucker bleibt dann trotz der Störung im Normbereich, und die Betroffenen bemerken nichts. Erst wenn die insulinbildenden Zellen mit der Mehrproduktion nicht mehr Schritt halten, steigt der Blutzucker dauerhaft an – es entsteht ein Typ-2-Diabetes. Zwischen dem Beginn der Resistenz und der Diagnose können deshalb Jahre liegen.',
      'Als wichtigster Risikofaktor gilt Fett, das sich im Bauchraum und in der Leber ansammelt. Es ist stoffwechselaktiver als das Fett unter der Haut und gibt Stoffe ab, welche die Insulinwirkung stören. Das erklärt, warum Menschen mit gleichem Körpergewicht ein sehr unterschiedliches Risiko haben können. Daneben spielen Bewegungsmangel und erbliche Veranlagung eine Rolle.',
      'Umgekehrt lässt sich die Insulinempfindlichkeit beeinflussen. Arbeitende Muskeln nehmen Glukose zum Teil auch ohne Insulin auf, weshalb regelmäßige Bewegung den Blutzucker senkt, schon bevor sich das Gewicht verändert. Eine Gewichtsabnahme, die vor allem das Fett in Leber und Bauchraum verringert, kann eine beginnende Erkrankung in manchen Fällen sogar zurückbilden. Gelingt das nicht, stehen Medikamente zur Verfügung, die an verschiedenen Stellen dieses Regelkreises ansetzen.',
    ],
    questions: [
      {
        id: 'tv-insulin-q1',
        prompt: 'Warum bemerken Betroffene eine beginnende Insulinresistenz zunächst nicht?',
        options: [
          { text: 'Weil die Bauchspeicheldrüse mehr Insulin bildet und der Blutzucker dadurch im Normbereich bleibt.', correct: true },
          { text: 'Weil die Zellen anfangs noch vollständig auf Insulin ansprechen.', correct: false },
          { text: 'Weil der Blutzucker nach Mahlzeiten nicht ansteigt.', correct: false },
          { text: 'Weil das Fett unter der Haut die Störung ausgleicht.', correct: false },
          { text: 'Weil arbeitende Muskeln den gesamten Zucker ohne Insulin aufnehmen.', correct: false },
        ],
        explanation: 'Der dritte Absatz beschreibt den Ausgleich durch Mehrproduktion. Die zweite Antwort widerspricht der Definition der Resistenz, die letzte Antwort übertreibt den Schlussabsatz („zum Teil“ wird zu „gesamten“).',
      },
      {
        id: 'tv-insulin-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Fett im Bauchraum ist stoffwechselaktiver als Fett unter der Haut.', holds: true },
          { text: 'Menschen mit gleichem Körpergewicht haben das gleiche Diabetesrisiko.', holds: false },
          { text: 'Bewegung kann den Blutzucker senken, noch bevor sich das Gewicht verändert.', holds: true },
          { text: 'Ein Typ-2-Diabetes lässt sich durch Gewichtsabnahme in jedem Fall zurückbilden.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I, III und IV', correct: false },
          { text: 'Nur III', correct: false },
          { text: 'Nur I und II', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'I steht im vierten, III im letzten Absatz. II widerspricht dem vierten Absatz, nach dem das Risiko bei gleichem Gewicht sehr unterschiedlich sein kann. IV verallgemeinert: Der Text sagt „in manchen Fällen“ und spricht von einer beginnenden Erkrankung.',
      },
      {
        id: 'tv-insulin-q3',
        prompt: 'Was kennzeichnet laut Text den Übergang von der Insulinresistenz zum Typ-2-Diabetes?',
        options: [
          { text: 'Die insulinbildenden Zellen halten mit der nötigen Mehrproduktion nicht mehr Schritt.', correct: true },
          { text: 'Die Bauchspeicheldrüse stellt die Insulinbildung schlagartig ein.', correct: false },
          { text: 'Die Zellen nehmen überhaupt keine Glukose mehr auf.', correct: false },
          { text: 'Das Fett unter der Haut nimmt stark zu.', correct: false },
          { text: 'Die Leber hört auf, Glukose zu speichern.', correct: false },
        ],
        explanation: 'Der dritte Absatz nennt genau diesen Wendepunkt: Erst wenn die Mehrproduktion nicht mehr reicht, steigt der Blutzucker dauerhaft. Die zweite und dritte Antwort übertreiben den Vorgang ins Absolute.',
      },
    ],
  },

  {
    id: 'tv-mrna',
    title: 'Ein Bauplan auf Zeit',
    paragraphs: [
      'Jede Zelle stellt ihre Proteine nach Bauplänen her, die in der DNA im Zellkern liegen. Abgelesen werden sie nicht direkt: Zunächst entsteht eine Abschrift, die Boten-RNA oder mRNA. Sie verlässt den Kern und wird an den Ribosomen im Zellplasma in ein Protein übersetzt. Danach wird sie innerhalb von Stunden bis wenigen Tagen abgebaut. Diese Kurzlebigkeit ist kein Mangel, sondern erlaubt der Zelle, die Herstellung eines Proteins rasch zu beenden, wenn es nicht mehr gebraucht wird.',
      'mRNA-Impfstoffe nutzen diesen Weg. Sie enthalten den Bauplan für ein einzelnes Protein des Erregers, verpackt in winzige Fetttröpfchen, die von Körperzellen aufgenommen werden und die mRNA ins Zellplasma freisetzen. Die Zelle stellt das Protein her und präsentiert es dem Immunsystem, das daraufhin Antikörper und Gedächtniszellen bildet – ohne dass je ein vollständiger Erreger im Körper war. Der Zellkern, in dem das Erbgut liegt, ist dabei nicht das Ziel: Die mRNA wirkt im Zellplasma und wird dort auch abgebaut.',
      'Die größte technische Schwierigkeit lag lange in der Empfindlichkeit des Moleküls. Freie mRNA wird von Enzymen, die im Körper allgegenwärtig sind, rasch zerlegt und löst zudem starke Entzündungsreaktionen aus. Erst chemisch leicht veränderte Bausteine, die vom Immunsystem weniger stark als fremd erkannt werden, und die schützende Fetthülle machten den Ansatz praktikabel. Die Empfindlichkeit erklärt auch, warum manche dieser Impfstoffe tiefgekühlt gelagert werden müssen.',
      'Ein Vorteil des Verfahrens liegt in der Geschwindigkeit. Ist die Erbinformation eines neuen Erregers bekannt, lässt sich der passende Bauplan in wenigen Wochen herstellen, während herkömmliche Verfahren oft monatelang darauf angewiesen sind, den Erreger in Zellkulturen oder Hühnereiern zu vermehren. Die anschließenden Prüfungen auf Sicherheit und Wirksamkeit verkürzt das allerdings nicht.',
      'Das Prinzip ist nicht auf Impfstoffe beschränkt. Erprobt werden auch Ansätze, bei denen mRNA den Körper ein Protein herstellen lässt, das ihm wegen einer Erbkrankheit fehlt, oder bei denen sie das Immunsystem auf Merkmale eines Tumors richtet, die nur bei der jeweiligen Person vorkommen. Weil die mRNA rasch abgebaut wird, muss sie dafür allerdings wiederholt gegeben werden – dieselbe Kurzlebigkeit, die beim Impfen erwünscht ist, wird hier zur Hürde.',
    ],
    questions: [
      {
        id: 'tv-mrna-q1',
        prompt: DERIVABLE,
        statements: [
          { text: 'Die mRNA wird an den Ribosomen im Zellplasma in ein Protein übersetzt.', holds: true },
          { text: 'mRNA-Impfstoffe enthalten den Bauplan für den vollständigen Erreger.', holds: false },
          { text: 'Die Kurzlebigkeit der mRNA erlaubt es der Zelle, die Herstellung eines Proteins rasch zu beenden.', holds: true },
          { text: 'Freie mRNA kann starke Entzündungsreaktionen auslösen.', holds: true },
        ],
        options: [
          { text: 'Nur I, III und IV', correct: true },
          { text: 'Alle vier Aussagen', correct: false },
          { text: 'Nur I und III', correct: false },
          { text: 'Nur III und IV', correct: false },
          { text: 'Nur I, II und III', correct: false },
        ],
        explanation: 'I und III stehen im ersten, IV im dritten Absatz. II widerspricht dem zweiten Absatz: Der Impfstoff enthält den Bauplan für ein einzelnes Protein, gerade ohne dass je ein vollständiger Erreger im Körper ist.',
      },
      {
        id: 'tv-mrna-q2',
        prompt: 'Was machte den Ansatz laut Text erst praktikabel?',
        options: [
          { text: 'Chemisch leicht veränderte Bausteine und eine schützende Fetthülle.', correct: true },
          { text: 'Die Lagerung bei Raumtemperatur.', correct: false },
          { text: 'Die Vermehrung des Erregers in Hühnereiern.', correct: false },
          { text: 'Die Übersetzung der mRNA im Zellkern.', correct: false },
          { text: 'Eine verkürzte Prüfung auf Sicherheit und Wirksamkeit.', correct: false },
        ],
        explanation: 'Der dritte Absatz nennt beide Neuerungen mit „erst … machten praktikabel“. Hühnereier gehören zu den herkömmlichen Verfahren, und die Prüfungen verkürzen sich laut viertem Absatz gerade nicht.',
      },
      {
        id: 'tv-mrna-q3',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Mit dem mRNA-Verfahren verkürzen sich auch die Prüfungen auf Sicherheit und Wirksamkeit.', correct: true },
          { text: 'Herkömmliche Verfahren sind oft darauf angewiesen, den Erreger zu vermehren.', correct: false },
          { text: 'Manche mRNA-Impfstoffe müssen tiefgekühlt gelagert werden.', correct: false },
          { text: 'Nach der Impfung bildet das Immunsystem Antikörper und Gedächtniszellen.', correct: false },
          { text: 'Im Körper gibt es Enzyme, die freie mRNA rasch zerlegen.', correct: false },
        ],
        explanation: 'Der vierte Absatz sagt ausdrücklich, dass die schnellere Herstellung die Prüfungen nicht verkürzt. Alle übrigen Aussagen stehen im Text.',
      },
    ],
  },

  {
    id: 'tv-ozean',
    title: 'Das saure Meer',
    paragraphs: [
      'Etwa ein Viertel des Kohlendioxids, das der Mensch freisetzt, nimmt das Meer auf. Für das Klima ist das ein Puffer, für das Meer selbst ist es nicht folgenlos. Gelöstes Kohlendioxid reagiert mit Wasser zu Kohlensäure, die einen Teil ihrer Wasserstoffionen abgibt. Der pH-Wert des Oberflächenwassers ist seit Beginn der Industrialisierung von etwa 8,2 auf 8,1 gesunken. Das klingt nach wenig, doch weil die pH-Skala logarithmisch ist, entspricht es einer Zunahme der Wasserstoffionen um rund ein Viertel. Basisch bleibt das Meer dabei weiterhin – „Versauerung“ beschreibt die Richtung, nicht den Zustand.',
      'Die zusätzlichen Wasserstoffionen binden Carbonat-Ionen. Genau diese brauchen Muscheln, Schnecken, Korallen und manche Planktonarten, um Schalen und Skelette aus Kalk aufzubauen. Sinkt die Carbonatkonzentration, kostet der Aufbau mehr Energie; unterhalb einer bestimmten Schwelle beginnen ungeschützte Kalkstrukturen sich sogar aufzulösen. Kaltes Wasser löst mehr Kohlendioxid als warmes, weshalb polare Meere diese Schwelle früher erreichen.',
      'Besonders gut untersucht sind Austernzuchten an der Westküste Nordamerikas. Dort starben Mitte der 2000er-Jahre wiederholt große Teile der Larven, und zwar immer dann, wenn kaltes, kohlendioxidreiches Tiefenwasser an die Küste strömte. Seit die Betriebe das Meerwasser laufend messen und ihre Becken nur noch bei günstigen Werten befüllen, sind die Ausfälle zurückgegangen.',
      'Nicht alle Arten reagieren gleich. In Experimenten zeigen manche Kalkbildner deutliche Einbußen, andere kaum Veränderungen, und einige Algen wachsen bei mehr gelöstem Kohlendioxid sogar besser. Für Vorhersagen ist das unbequem, denn die Folgen hängen weniger an einzelnen Arten als an den Beziehungen zwischen ihnen: Schwindet eine kalkbildende Planktonart, fehlt sie als Nahrung für Tiere, die selbst keinen Kalk bilden.',
      'Anders als die Erwärmung lässt sich die Versauerung vergleichsweise genau messen und vorausberechnen, weil sie unmittelbar aus der Chemie des Kohlendioxids folgt. Umkehrbar ist sie auf menschlichen Zeitskalen dennoch kaum: Bis die Verwitterung von Gestein an Land genug ausgleichende Stoffe ins Meer gespült hat, vergehen Jahrtausende.',
    ],
    questions: [
      {
        id: 'tv-ozean-q1',
        prompt: 'Warum ist die Senkung des pH-Werts von 8,2 auf 8,1 laut Text erheblicher, als sie klingt?',
        options: [
          { text: 'Weil die pH-Skala logarithmisch ist und die Wasserstoffionen dadurch um rund ein Viertel zunehmen.', correct: true },
          { text: 'Weil das Meer dadurch sauer geworden ist.', correct: false },
          { text: 'Weil ein pH-Wert von 8,1 die Schwelle markiert, unterhalb derer sich Kalk auflöst.', correct: false },
          { text: 'Weil das Meer seither kein weiteres Kohlendioxid aufnehmen kann.', correct: false },
          { text: 'Weil sich der pH-Wert in polaren Meeren zehnmal stärker verändert hat.', correct: false },
        ],
        explanation: 'Der erste Absatz begründet es mit der logarithmischen Skala. Die zweite Antwort widerspricht dem Text ausdrücklich – das Meer bleibt basisch. Die Schwelle für die Kalkauflösung beziffert der Text nicht.',
      },
      {
        id: 'tv-ozean-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Kaltes Wasser löst mehr Kohlendioxid als warmes.', holds: true },
          { text: 'Alle Kalkbildner zeigen in Experimenten deutliche Einbußen.', holds: false },
          { text: 'Auch Tiere, die keinen Kalk bilden, können von der Versauerung betroffen sein.', holds: true },
          { text: 'Die Versauerung lässt sich schwerer vorausberechnen als die Erwärmung.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I, II und III', correct: false },
          { text: 'Nur III und IV', correct: false },
          { text: 'Nur I', correct: false },
          { text: 'Keine der Aussagen', correct: false },
        ],
        explanation: 'I steht im zweiten Absatz. III folgt aus dem vierten: Schwindet eine kalkbildende Planktonart, fehlt sie als Nahrung für Tiere ohne Kalk. II verallgemeinert („manche“ wird zu „alle“), IV kehrt den letzten Absatz um.',
      },
      {
        id: 'tv-ozean-q3',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Würde kein Kohlendioxid mehr freigesetzt, kehrte der pH-Wert innerhalb weniger Jahrzehnte auf 8,2 zurück.', correct: true },
          { text: 'Das Meer ist trotz der Versauerung weiterhin basisch.', correct: false },
          { text: 'Manche Algen wachsen bei mehr gelöstem Kohlendioxid besser.', correct: false },
          { text: 'Die zusätzlichen Wasserstoffionen binden Carbonat-Ionen.', correct: false },
          { text: 'Das Meer nimmt einen Teil des vom Menschen freigesetzten Kohlendioxids auf.', correct: false },
        ],
        explanation: 'Der letzte Absatz nennt die Versauerung auf menschlichen Zeitskalen kaum umkehrbar; der Ausgleich dauert Jahrtausende. Die übrigen Aussagen stehen im Text.',
      },
    ],
  },

  {
    id: 'tv-hoehe',
    title: 'Dünne Luft',
    paragraphs: [
      'In viertausend Metern Höhe ist der Luftdruck um etwa vierzig Prozent niedriger als auf Meereshöhe. Der Anteil des Sauerstoffs an der Luft ändert sich dabei nicht – er liegt überall bei rund einundzwanzig Prozent –, wohl aber sein Partialdruck, und dieser bestimmt, wie viel Sauerstoff in der Lunge ins Blut übertritt.',
      'Der Körper reagiert in Stufen. Innerhalb von Minuten steigen Atemfrequenz und Puls. Schon nach wenigen Stunden schütten die Nieren vermehrt das Hormon Erythropoetin aus, das die Bildung roter Blutkörperchen anregt; bis deren Zahl deutlich zunimmt, vergehen jedoch Wochen. In den ersten Tagen steigt der Anteil roter Blutkörperchen im Blut trotzdem bereits an – allerdings vor allem, weil die Menge an Blutplasma abnimmt, nicht weil neue Zellen hinzukommen.',
      'Wer zu schnell aufsteigt, riskiert die Höhenkrankheit mit Kopfschmerz, Übelkeit und Schlafstörungen, in schweren Fällen mit Wasseransammlungen in Lunge oder Gehirn. Die wichtigste Vorbeugung ist ein langsamer Aufstieg. Körperliche Fitness schützt dagegen nicht: Trainierte erkranken ebenso häufig, steigen aber oft schneller.',
      'Wie gut sich jemand anpasst, lässt sich vorab kaum vorhersagen; wer schon einmal erkrankt ist, erkrankt bei gleichem Aufstieg allerdings eher wieder. Als Faustregel gilt, oberhalb von etwa dreitausend Metern die Schlafhöhe pro Tag nur um wenige hundert Meter zu steigern. Treten dennoch Beschwerden auf, ist es am sichersten, nicht weiter aufzusteigen und bei schweren Anzeichen sofort abzusteigen.',
      'Bevölkerungen, die seit Jahrtausenden im Hochland leben, haben unterschiedliche Lösungen entwickelt. Bewohner der Anden haben im Mittel deutlich mehr rote Blutkörperchen als Menschen im Tiefland. Bei vielen Tibetern ist das nicht der Fall; unter ihnen sind Erbanlagen verbreitet, die einen übermäßigen Anstieg verhindern, und sie atmen mehr. Das ist von Vorteil, denn zu viele rote Blutkörperchen machen das Blut zähflüssig und belasten das Herz. Höhenanpassung bedeutet also nicht einfach: je mehr Blutkörperchen, desto besser.',
    ],
    questions: [
      {
        id: 'tv-hoehe-q1',
        prompt: 'Was ändert sich laut Text mit zunehmender Höhe an der Atemluft?',
        options: [
          { text: 'Der Partialdruck des Sauerstoffs sinkt, sein Anteil an der Luft bleibt gleich.', correct: true },
          { text: 'Der Anteil des Sauerstoffs an der Luft sinkt deutlich.', correct: false },
          { text: 'Luftdruck und Sauerstoffanteil bleiben gleich, nur die Temperatur sinkt.', correct: false },
          { text: 'Der Partialdruck bleibt gleich, aber der Sauerstoffanteil sinkt.', correct: false },
          { text: 'Der Luftdruck steigt, weil die Luft kälter ist.', correct: false },
        ],
        explanation: 'Der erste Absatz trennt beides ausdrücklich: Anteil gleich, Partialdruck niedriger. Die vierte Antwort vertauscht genau diese beiden Größen – die häufigste Verwechslung bei diesem Thema.',
      },
      {
        id: 'tv-hoehe-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Der frühe Anstieg des Anteils roter Blutkörperchen geht vor allem auf eine Abnahme des Blutplasmas zurück.', holds: true },
          { text: 'Körperlich Trainierte erkranken seltener an der Höhenkrankheit.', holds: false },
          { text: 'Erythropoetin wird von den Nieren ausgeschüttet.', holds: true },
          { text: 'Tibeter haben im Mittel mehr rote Blutkörperchen als Bewohner der Anden.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I', correct: false },
          { text: 'Nur I, II und III', correct: false },
          { text: 'Nur III und IV', correct: false },
          { text: 'Nur II und IV', correct: false },
        ],
        explanation: 'I und III stehen im zweiten Absatz. II widerspricht dem dritten Absatz: Trainierte erkranken ebenso häufig. IV kehrt den Vergleich im letzten Absatz um – deutlich mehr rote Blutkörperchen haben die Andenbewohner.',
      },
      {
        id: 'tv-hoehe-q3',
        prompt: 'Welche Schlussfolgerung zieht der Text aus dem Vergleich von Anden- und Tibetbewohnern?',
        options: [
          { text: 'Eine möglichst hohe Zahl roter Blutkörperchen ist nicht automatisch die beste Anpassung.', correct: true },
          { text: 'Die Anpassung der Andenbewohner ist der der Tibeter überlegen.', correct: false },
          { text: 'Tibeter atmen weniger, um das Herz zu entlasten.', correct: false },
          { text: 'Beide Bevölkerungen haben dieselbe Lösung entwickelt.', correct: false },
          { text: 'Zähflüssiges Blut schützt vor der Höhenkrankheit.', correct: false },
        ],
        explanation: 'Der letzte Satz zieht genau diesen Schluss. Die dritte Antwort kehrt eine Angabe um (Tibeter atmen mehr), die vierte widerspricht dem Einleitungssatz des Absatzes („unterschiedliche Lösungen“).',
      },
    ],
  },

  {
    id: 'tv-epigenetik',
    title: 'Was Gene an- und abschaltet',
    paragraphs: [
      'Fast alle Zellen eines Menschen tragen dasselbe Erbgut, und doch unterscheiden sich eine Leberzelle und eine Nervenzelle grundlegend. Der Unterschied liegt nicht in den Genen selbst, sondern darin, welche von ihnen abgelesen werden. Gesteuert wird das unter anderem durch chemische Markierungen an der DNA und an den Proteinen, um die sie gewickelt ist. Eine Methylgruppe an bestimmten Stellen der DNA etwa führt meist dazu, dass ein Gen stillgelegt wird. Die Abfolge der DNA-Bausteine verändern solche Markierungen nicht.',
      'Bei der Zellteilung werden viele Markierungen an die Tochterzellen weitergegeben; deshalb bleibt eine Leberzelle auch nach der Teilung eine Leberzelle. Zugleich sind die Markierungen veränderbar: Ernährung, Stress oder Schadstoffe können sie beeinflussen, und mit dem Alter verändern sie sich in einem so regelmäßigen Muster, dass sich daraus das Lebensalter eines Menschen auf wenige Jahre genau schätzen lässt.',
      'Ein anschauliches Beispiel liefern eineiige Zwillinge. Ihr Erbgut ist nahezu identisch, und in der Kindheit gleichen sich auch ihre Markierungen stark. Mit den Jahren werden die Unterschiede größer, und zwar umso mehr, je verschiedener die Zwillinge leben. Das ist eine mögliche Erklärung dafür, dass von zwei eineiigen Zwillingen mitunter nur einer an einer Krankheit erkrankt, bei der das Erbgut eine Rolle spielt.',
      'Großes Aufsehen erregen Berichte, nach denen solche Prägungen an Kinder und Enkel weitergegeben werden. Bei Pflanzen und einigen Tierarten ist das gut belegt. Beim Menschen ist die Lage unklarer: Bei der Bildung von Ei- und Samenzellen und kurz nach der Befruchtung wird der größte Teil der Markierungen gelöscht und neu gesetzt. Studien, die bei den Nachkommen von Hungersnöten Veränderungen fanden, können zudem nicht sicher unterscheiden, ob diese vererbt wurden oder ob die Kinder den Umständen schon im Mutterleib selbst ausgesetzt waren.',
      'Für die Medizin ist vor allem bedeutsam, dass sich die Markierungen anders als Veränderungen der DNA-Abfolge grundsätzlich rückgängig machen lassen. Bei einigen Blutkrebserkrankungen werden bereits Medikamente eingesetzt, die Methylgruppen entfernen und so stillgelegte Gene wieder aktivieren können.',
    ],
    questions: [
      {
        id: 'tv-epigenetik-q1',
        prompt: DERIVABLE,
        statements: [
          { text: 'Leber- und Nervenzellen eines Menschen tragen im Wesentlichen dasselbe Erbgut.', holds: true },
          { text: 'Methylgruppen verändern die Abfolge der DNA-Bausteine.', holds: false },
          { text: 'Aus den Markierungen lässt sich das Lebensalter eines Menschen schätzen.', holds: true },
          { text: 'Die Weitergabe epigenetischer Prägungen an Enkel ist beim Menschen gut belegt.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I, III und IV', correct: false },
          { text: 'Nur III', correct: false },
          { text: 'Nur II und IV', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'I steht im ersten, III im zweiten Absatz. II widerspricht dem letzten Satz des ersten Absatzes. IV überträgt, was für Pflanzen und einige Tierarten gilt, auf den Menschen – für den nennt der Text die Lage ausdrücklich unklar.',
      },
      {
        id: 'tv-epigenetik-q2',
        prompt: 'Warum bleibt eine Leberzelle laut Text auch nach der Teilung eine Leberzelle?',
        options: [
          { text: 'Weil viele Markierungen an die Tochterzellen weitergegeben werden.', correct: true },
          { text: 'Weil bei der Teilung alle Markierungen gelöscht und neu gesetzt werden.', correct: false },
          { text: 'Weil sich ihre DNA-Abfolge von der einer Nervenzelle unterscheidet.', correct: false },
          { text: 'Weil Methylgruppen die übrigen Gene dauerhaft entfernen.', correct: false },
          { text: 'Weil Ernährung und Stress die Markierungen festigen.', correct: false },
        ],
        explanation: 'Der zweite Absatz verbindet beides mit „deshalb“. Das Löschen und Neusetzen beschreibt der Text für Ei- und Samenzellen, nicht für gewöhnliche Zellteilungen; die dritte Antwort widerspricht dem ersten Absatz.',
      },
      {
        id: 'tv-epigenetik-q3',
        prompt: 'Welchen Einwand erhebt der Text gegen Studien an den Nachkommen von Hungersnöten?',
        options: [
          { text: 'Sie können eine Vererbung nicht sicher davon unterscheiden, dass die Kinder den Umständen schon im Mutterleib ausgesetzt waren.', correct: true },
          { text: 'Sie fanden bei den Nachkommen keinerlei Veränderungen.', correct: false },
          { text: 'Sie wurden nur an Pflanzen und Tieren durchgeführt.', correct: false },
          { text: 'Sie übersehen, dass Hunger die Abfolge der DNA-Bausteine verändert.', correct: false },
          { text: 'Sie beruhen auf zu wenigen Teilnehmenden.', correct: false },
        ],
        explanation: 'Der vierte Absatz nennt genau diesen Einwand. Die zweite Antwort widerspricht ihm – die Studien fanden Veränderungen –, die letzte ist ein üblicher Einwand gegen Studien, steht hier aber nicht.',
      },
    ],
  },

  {
    id: 'tv-allergie',
    title: 'Zu sauber für das Immunsystem?',
    paragraphs: [
      'Heuschnupfen, Asthma und Neurodermitis sind in vielen Industrieländern im Lauf des zwanzigsten Jahrhunderts deutlich häufiger geworden. Da sich das Erbgut einer Bevölkerung in wenigen Generationen kaum verändert, müssen Umweltfaktoren eine wesentliche Rolle spielen. Eine einflussreiche Erklärung dafür ist die Hygienehypothese.',
      'Bei einer Allergie hält das Immunsystem einen harmlosen Stoff, etwa Blütenpollen oder ein Nahrungseiweiß, für gefährlich und bildet Antikörper gegen ihn. Beim nächsten Kontakt lösen diese Antikörper die Freisetzung von Botenstoffen wie Histamin aus, die Schwellungen, Juckreiz oder Atemnot verursachen. Der erste Kontakt bleibt also folgenlos; Beschwerden entstehen erst bei einem späteren.',
      'In ihrer ursprünglichen Form besagte sie, dass Kinder in kleinen Familien seltener Infektionen durchmachen und ihr Immunsystem deshalb zu Überreaktionen gegen harmlose Stoffe neige. Ein Befund passte dazu: Kinder mit mehreren älteren Geschwistern leiden seltener an Heuschnupfen. Spätere Untersuchungen haben die Hypothese jedoch verschoben. Die klassischen Kinderkrankheiten scheinen kaum zu schützen; entscheidend ist offenbar der frühe Kontakt mit einer vielfältigen Gemeinschaft harmloser Mikroben, wie sie etwa auf Bauernhöfen mit Viehhaltung vorkommt. Kinder, die dort aufwachsen, erkranken deutlich seltener an Asthma und Allergien.',
      'Missverständlich ist der Name, weil er nahelegt, mangelnde Sauberkeit im Haushalt sei gesund. Dafür gibt es keine Belege; Händewaschen und Küchenhygiene verhindern Infektionen, ohne nachweislich Allergien zu fördern. Fachleute sprechen inzwischen lieber von einer gestörten Beziehung zu „alten Freunden“ – Mikroben, mit denen der Mensch über lange Zeit zusammengelebt hat.',
      'Auch bei Nahrungsmittelallergien hat sich die Sicht gewandelt. Lange wurde Eltern geraten, Erdnüsse und andere häufige Auslöser in den ersten Lebensjahren zu meiden. Eine große Studie zeigte jedoch, dass Kleinkinder mit hohem Allergierisiko, die früh regelmäßig kleine Mengen Erdnuss erhielten, später erheblich seltener eine Erdnussallergie entwickelten als jene, die Erdnuss mieden. Die Empfehlungen wurden daraufhin geändert.',
    ],
    questions: [
      {
        id: 'tv-allergie-q1',
        prompt: 'Warum schließt der Text, dass Umweltfaktoren für die Zunahme der Allergien wesentlich sind?',
        options: [
          { text: 'Weil sich das Erbgut einer Bevölkerung in wenigen Generationen kaum verändert.', correct: true },
          { text: 'Weil Allergien nicht erblich sind.', correct: false },
          { text: 'Weil Kinder auf Bauernhöfen häufiger erkranken.', correct: false },
          { text: 'Weil die klassischen Kinderkrankheiten seltener geworden sind.', correct: false },
          { text: 'Weil Händewaschen Allergien fördert.', correct: false },
        ],
        explanation: 'Der erste Absatz begründet den Schluss mit dem kaum veränderlichen Erbgut. Die zweite Antwort sagt mehr, als dasteht; die dritte und fünfte widersprechen dem Text.',
      },
      {
        id: 'tv-allergie-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Kinder mit mehreren älteren Geschwistern leiden seltener an Heuschnupfen.', holds: true },
          { text: 'Die klassischen Kinderkrankheiten schützen nach heutigem Stand wirksam vor Allergien.', holds: false },
          { text: 'Mangelnde Sauberkeit im Haushalt beugt Allergien nachweislich vor.', holds: false },
          { text: 'Früher Kontakt mit vielfältigen harmlosen Mikroben scheint vor Allergien zu schützen.', holds: true },
        ],
        options: [
          { text: 'Nur I und IV', correct: true },
          { text: 'Nur I, II und IV', correct: false },
          { text: 'Nur IV', correct: false },
          { text: 'Nur I, III und IV', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'I und IV stehen im dritten Absatz. II widerspricht ihm („scheinen kaum zu schützen“), III dem vierten Absatz, nach dem es dafür keine Belege gibt. Gerade III klingt nach dem Namen der Hypothese richtig – deshalb steht der Einwand im Text.',
      },
      {
        id: 'tv-allergie-q3',
        prompt: 'Was zeigte laut Text die große Studie zur Erdnussallergie?',
        options: [
          { text: 'Kleinkinder mit hohem Risiko, die früh regelmäßig Erdnuss erhielten, entwickelten später seltener eine Erdnussallergie.', correct: true },
          { text: 'Erdnüsse sollten in den ersten Lebensjahren gemieden werden.', correct: false },
          { text: 'Früher Erdnusskontakt schützt auch vor Asthma.', correct: false },
          { text: 'Kinder ohne Allergierisiko profitieren am meisten von früher Erdnussgabe.', correct: false },
          { text: 'Eine Erdnussallergie lässt sich durch Händewaschen verhindern.', correct: false },
        ],
        explanation: 'Der letzte Absatz beschreibt genau dieses Ergebnis. Die zweite Antwort ist die alte Empfehlung, die die Studie widerlegt hat; über Asthma und über Kinder ohne Risiko sagt die Studie im Text nichts.',
      },
    ],
  },

  {
    id: 'tv-herzinfarkt',
    title: 'Nicht jeder Infarkt beginnt mit Brustschmerz',
    paragraphs: [
      'Das Bild vom Herzinfarkt ist geprägt von einem plötzlichen, heftigen Schmerz in der Brust, der in den linken Arm ausstrahlt. Dieses Bild ist nicht falsch: Brustschmerz oder Druckgefühl ist bei Männern wie bei Frauen das häufigste Anzeichen. Bei Frauen, älteren Menschen und Menschen mit Diabetes treten jedoch häufiger zusätzlich oder stattdessen andere Beschwerden auf – Atemnot, Übelkeit, Schmerzen im Oberbauch oder im Rücken, ungewöhnliche Erschöpfung.',
      'Solche Beschwerden werden leichter falsch gedeutet, von den Betroffenen ebenso wie von Behandelnden. Unter anderem deshalb kommen Frauen mit Herzinfarkt im Mittel später in die Klinik als Männer. Das wiegt schwer, denn beim Infarkt ist ein Herzkranzgefäß verschlossen, und mit jeder Stunde ohne Behandlung stirbt mehr Herzmuskelgewebe ab, das nicht mehr ersetzt wird. Bei der Behandlung kommt es deshalb vor allem darauf an, das verschlossene Gefäß so rasch wie möglich wieder zu öffnen, meist mit einem Katheter, der über eine Arterie am Handgelenk oder in der Leiste bis zum Herzen vorgeschoben wird.',
      'Bei Diabetes kommt eine Besonderheit hinzu: Langjährig erhöhter Blutzucker kann Nerven schädigen, auch jene, die Schmerz vom Herzen melden. Ein Infarkt kann dann nahezu schmerzlos verlaufen. Für alle Gruppen gilt deshalb dieselbe Regel: Bei neuen, unerklärlichen Beschwerden dieser Art lieber einmal zu oft den Notruf wählen als einmal zu selten.',
    ],
    questions: [
      {
        id: 'tv-herzinfarkt-q1',
        prompt: DERIVABLE,
        statements: [
          { text: 'Auch bei Frauen ist Brustschmerz oder Druckgefühl das häufigste Anzeichen eines Herzinfarkts.', holds: true },
          { text: 'Abgestorbenes Herzmuskelgewebe wird nach einem Infarkt wieder ersetzt.', holds: false },
          { text: 'Bei Menschen mit Diabetes kann ein Infarkt nahezu schmerzlos verlaufen.', holds: true },
          { text: 'Frauen erleiden häufiger einen Herzinfarkt als Männer.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur III', correct: false },
          { text: 'Nur I, III und IV', correct: false },
          { text: 'Nur II und III', correct: false },
          { text: 'Nur I und IV', correct: false },
        ],
        explanation: 'I steht im ersten, III im letzten Absatz. II widerspricht dem zweiten Absatz („nicht mehr ersetzt“). IV steht nirgends – der Text vergleicht Anzeichen und Zeit bis zur Klinik, nicht die Häufigkeit von Infarkten.',
      },
      {
        id: 'tv-herzinfarkt-q2',
        prompt: 'Worauf führt der Text unter anderem zurück, dass Frauen mit Herzinfarkt im Mittel später in die Klinik kommen?',
        options: [
          { text: 'Darauf, dass ihre Beschwerden leichter falsch gedeutet werden.', correct: true },
          { text: 'Darauf, dass ihr Infarkt meist schmerzlos verläuft.', correct: false },
          { text: 'Darauf, dass bei ihnen seltener ein Herzkranzgefäß verschlossen ist.', correct: false },
          { text: 'Darauf, dass sie häufiger an Diabetes leiden.', correct: false },
          { text: 'Darauf, dass bei ihnen weniger Herzmuskelgewebe abstirbt.', correct: false },
        ],
        explanation: 'Der zweite Absatz verbindet beides mit „unter anderem deshalb“. Der nahezu schmerzlose Verlauf gehört im Text zum Diabetes, nicht zu Frauen allgemein; über die Häufigkeit von Diabetes bei Frauen sagt der Text nichts.',
      },
    ],
  },

  {
    id: 'tv-rhesus',
    title: 'Wenn das Blut der Mutter das Kind angreift',
    paragraphs: [
      'Auf der Oberfläche roter Blutkörperchen sitzen Merkmale, nach denen die Blutgruppen eingeteilt werden. Eines davon ist der Rhesusfaktor D: Wer ihn trägt, gilt als Rhesus-positiv, wer nicht, als Rhesus-negativ. Anders als bei den Merkmalen des AB0-Systems bildet ein Rhesus-negativer Mensch Antikörper gegen D erst, nachdem er mit dem Merkmal in Kontakt gekommen ist. In Mitteleuropa ist etwa jeder siebte Mensch Rhesus-negativ.',
      'Bedeutsam wird das in der Schwangerschaft, wenn eine Rhesus-negative Frau ein Rhesus-positives Kind erwartet. Vor allem bei der Geburt gelangt kindliches Blut in den mütterlichen Kreislauf, und die Mutter beginnt, Antikörper zu bilden. Dem ersten Kind schadet das meist nicht mehr. In einer folgenden Schwangerschaft mit einem wiederum Rhesus-positiven Kind können die Antikörper jedoch über den Mutterkuchen zum Kind gelangen und dessen rote Blutkörperchen zerstören – mit Blutarmut bis hin zu lebensbedrohlichen Verläufen.',
      'Verhindert wird das heute durch eine einfache Maßnahme: Die Mutter erhält während der Schwangerschaft und nach der Geburt fertige Antikörper gegen D. Diese beseitigen die kindlichen Blutkörperchen in ihrem Kreislauf, bevor ihr eigenes Immunsystem darauf reagieren und ein Gedächtnis bilden kann. Man verhindert also eine Antikörperbildung, indem man Antikörper gibt. Seit diese Vorbeugung in den 1960er- und 1970er-Jahren allgemein eingeführt wurde, ist die Erkrankung in Ländern mit guter Schwangerenvorsorge selten geworden.',
    ],
    questions: [
      {
        id: 'tv-rhesus-q1',
        prompt: 'Warum ist das erste Rhesus-positive Kind einer Rhesus-negativen Frau meist nicht gefährdet?',
        options: [
          { text: 'Weil die Mutter vor allem erst durch den Blutkontakt bei der Geburt beginnt, Antikörper zu bilden.', correct: true },
          { text: 'Weil Antikörper nicht über den Mutterkuchen gelangen können.', correct: false },
          { text: 'Weil die Mutter von Geburt an Antikörper gegen D besitzt.', correct: false },
          { text: 'Weil das erste Kind immer Rhesus-negativ ist.', correct: false },
          { text: 'Weil die Mutter während der ersten Schwangerschaft keine roten Blutkörperchen bildet.', correct: false },
        ],
        explanation: 'Der zweite Absatz verlegt die Antikörperbildung vor allem auf die Geburt – für das erste Kind also zu spät. Die zweite Antwort widerspricht demselben Absatz, die dritte dem ersten: Gegen D entstehen Antikörper erst nach Kontakt.',
      },
      {
        id: 'tv-rhesus-q2',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Die Gabe fertiger Antikörper regt das Immunsystem der Mutter an, ein Gedächtnis gegen D zu bilden.', correct: true },
          { text: 'Ein Rhesus-negativer Mensch bildet Antikörper gegen D erst nach Kontakt mit dem Merkmal.', correct: false },
          { text: 'Antikörper der Mutter können in einer Folgeschwangerschaft die roten Blutkörperchen des Kindes zerstören.', correct: false },
          { text: 'Die vorbeugenden Antikörper werden auch nach der Geburt gegeben.', correct: false },
          { text: 'Gegen Merkmale des AB0-Systems verläuft die Antikörperbildung anders als gegen D.', correct: false },
        ],
        explanation: 'Der letzte Absatz sagt das Gegenteil: Die gegebenen Antikörper beseitigen die kindlichen Zellen, bevor das mütterliche Immunsystem reagieren und ein Gedächtnis bilden kann. Alle übrigen Aussagen stehen im Text.',
      },
    ],
  },

  {
    id: 'tv-fieber',
    title: 'Fieber als Werkzeug',
    paragraphs: [
      'Fieber ist keine Störung der Temperaturregelung, sondern deren Verstellung. Bei einer Infektion setzen Abwehrzellen Botenstoffe frei, die im Gehirn den Sollwert der Körpertemperatur anheben. Der Körper behandelt die bisherige Temperatur dann als zu niedrig: Man fröstelt, die Gefäße der Haut verengen sich, und Muskelzittern erzeugt Wärme, bis der neue Sollwert erreicht ist. Bei einer Überhitzung durch Hitze oder Anstrengung ist das anders – dort bleibt der Sollwert unverändert, und der Körper kann die Wärme nur nicht schnell genug abgeben.',
      'Dass der Körper diesen Aufwand treibt – pro Grad steigt der Energieverbrauch um rund zehn Prozent –, spricht für einen Nutzen. Tatsächlich arbeiten manche Abwehrzellen bei erhöhter Temperatur wirksamer, und viele Erreger vermehren sich schlechter. Selbst wechselwarme Tiere wie Eidechsen suchen bei einer Infektion wärmere Plätze auf und überleben dann häufiger.',
      'Daraus folgt nicht, dass Fieber nie gesenkt werden sollte. Bei Erwachsenen, die sich elend fühlen, ist das Senken in aller Regel unbedenklich; ein messbarer Nachteil für den Heilungsverlauf ist bei gewöhnlichen Infekten nicht belegt. Ob man es senkt, richtet sich daher vor allem nach dem Befinden, nicht nach der gemessenen Zahl. Fieberkrämpfe bei Kleinkindern, eine häufige Sorge von Eltern, lassen sich durch fiebersenkende Mittel übrigens nicht zuverlässig verhindern. Bei Säuglingen in den ersten Lebensmonaten ist Fieber dagegen stets ärztlich abzuklären – weniger wegen der Temperatur selbst als wegen der Frage, welche Infektion dahintersteckt.',
    ],
    questions: [
      {
        id: 'tv-fieber-q1',
        prompt: 'Worin unterscheidet sich Fieber laut Text von einer Überhitzung durch Anstrengung?',
        options: [
          { text: 'Beim Fieber ist der Sollwert der Körpertemperatur angehoben, bei der Überhitzung nicht.', correct: true },
          { text: 'Bei der Überhitzung steigt der Sollwert stärker als beim Fieber.', correct: false },
          { text: 'Fieber entsteht ohne Beteiligung des Gehirns.', correct: false },
          { text: 'Bei der Überhitzung fröstelt man, beim Fieber nicht.', correct: false },
          { text: 'Fieber kommt nur bei wechselwarmen Tieren vor.', correct: false },
        ],
        explanation: 'Der erste Absatz stellt beides genau so gegenüber. Die vierte Antwort vertauscht die Zuordnung: Das Frösteln gehört zum ansteigenden Fieber.',
      },
      {
        id: 'tv-fieber-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Mit jedem Grad Fieber steigt der Energieverbrauch um rund zehn Prozent.', holds: true },
          { text: 'Viele Erreger vermehren sich bei erhöhter Temperatur schlechter.', holds: true },
          { text: 'Fiebersenkung verlängert bei gewöhnlichen Infekten nachweislich die Krankheit.', holds: false },
        ],
        options: [
          { text: 'Nur I und II', correct: true },
          { text: 'Alle drei Aussagen', correct: false },
          { text: 'Nur I', correct: false },
          { text: 'Nur II und III', correct: false },
          { text: 'Keine der Aussagen', correct: false },
        ],
        explanation: 'I und II stehen im zweiten Absatz. III widerspricht dem letzten Absatz: Ein messbarer Nachteil für den Heilungsverlauf ist bei gewöhnlichen Infekten gerade nicht belegt.',
      },
    ],
  },

  {
    id: 'tv-crispr',
    title: 'Die Genschere',
    paragraphs: [
      'Bakterien führen einen ständigen Abwehrkampf gegen Viren, und viele von ihnen verfügen dabei über eine Art Gedächtnis. Nach einer überstandenen Infektion bauen sie kurze Stücke der viralen Erbinformation in einen bestimmten Abschnitt ihres eigenen Erbguts ein. Dringt dasselbe Virus erneut ein, stellt das Bakterium von diesen Stücken RNA-Abschriften her, die sich mit einem schneidenden Enzym verbinden. Passt eine Abschrift zu einem Abschnitt im Erbgut des Virus, lagert sie sich dort an, und das Enzym zerschneidet die virale DNA. Den Abschnitt im Bakteriengenom nennt man CRISPR, das bekannteste Schneideenzym Cas9.',
      'Die Entdeckung, dass sich dieses System umprogrammieren lässt, hat die Molekularbiologie verändert. Ersetzt man die RNA durch eine im Labor hergestellte Leitsequenz, schneidet Cas9 an nahezu jeder gewünschten Stelle eines Erbguts – auch in Zellen von Pflanzen, Tieren und Menschen. Den eigentlichen Eingriff nimmt dabei allerdings nicht die Schere vor, sondern die Zelle selbst, indem sie den Bruch im DNA-Doppelstrang repariert. Meist geschieht das durch ein rasches, aber ungenaues Zusammenfügen der Enden, bei dem kleine Fehler entstehen, die das betroffene Gen häufig unbrauchbar machen. Soll stattdessen eine bestimmte Sequenz eingefügt werden, muss man der Zelle eine Vorlage anbieten – ein Weg, den sie deutlich seltener wählt.',
      'Die Methode ist schneller, billiger und genauer als frühere Verfahren, aber nicht fehlerfrei. Die Leitsequenz kann sich auch an Stellen anlagern, die der Zielsequenz nur ähneln, und dort ungewollte Schnitte auslösen. Zudem entstehen an der Zielstelle mitunter größere Umbauten, die mit den üblichen Prüfverfahren leicht übersehen werden. Neuere Varianten, die nur einen der beiden DNA-Stränge schneiden oder einzelne Bausteine chemisch umwandeln, sollen diese Risiken verringern.',
      'In der Medizin ist ein erster Einsatz bereits zugelassen: Bei bestimmten erblichen Erkrankungen des roten Blutfarbstoffs werden Blutstammzellen der Patienten außerhalb des Körpers verändert und anschließend zurückgegeben. Die Veränderung betrifft dabei nur Körperzellen und wird nicht an Kinder vererbt. Eingriffe in Embryonen, Ei- oder Samenzellen, deren Folgen alle späteren Generationen tragen würden, sind dagegen in den meisten Ländern verboten – nicht nur aus technischer Vorsicht, sondern auch, weil die Betroffenen, die künftigen Nachkommen, sich zu dem Eingriff nicht äußern können.',
    ],
    questions: [
      {
        id: 'tv-crispr-q1',
        prompt: 'Welche Aufgabe hat das CRISPR-System ursprünglich in Bakterien?',
        options: [
          { text: 'Es erkennt und zerschneidet die Erbinformation von Viren, die das Bakterium schon einmal befallen haben.', correct: true },
          { text: 'Es repariert Brüche im DNA-Doppelstrang des Bakteriums.', correct: false },
          { text: 'Es fügt dem Bakterium gezielt neue Gene ein.', correct: false },
          { text: 'Es schützt das Bakterium vor Antibiotika.', correct: false },
          { text: 'Es verhindert, dass virale DNA in das Bakteriengenom eingebaut wird.', correct: false },
        ],
        explanation: 'Der erste Absatz beschreibt CRISPR als Gedächtnis gegen bereits bekannte Viren. Die Reparatur von Doppelstrangbrüchen schreibt der Text der Zelle zu, nicht dem System; die letzte Antwort widerspricht dem Text, denn Stücke viraler DNA werden ja gerade eingebaut.',
      },
      {
        id: 'tv-crispr-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Cas9 fügt die gewünschte neue Sequenz selbst in das Erbgut ein.', holds: false },
          { text: 'Meist repariert die Zelle den Schnitt so, dass kleine Fehler entstehen.', holds: true },
          { text: 'Um eine bestimmte Sequenz einzufügen, braucht die Zelle eine Vorlage.', holds: true },
          { text: 'Die Leitsequenz kann sich auch an Stellen anlagern, die der Zielsequenz nur ähneln.', holds: true },
        ],
        options: [
          { text: 'Nur II, III und IV', correct: true },
          { text: 'Alle vier Aussagen', correct: false },
          { text: 'Nur II und III', correct: false },
          { text: 'Nur III und IV', correct: false },
          { text: 'Nur I, II und IV', correct: false },
        ],
        explanation: 'II und III stehen im zweiten, IV im dritten Absatz. I widerspricht dem zweiten Absatz ausdrücklich: Den Eingriff nimmt nicht die Schere vor, sondern die Zelle bei der Reparatur.',
      },
      {
        id: 'tv-crispr-q3',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Größere Umbauten an der Zielstelle werden von den üblichen Prüfverfahren zuverlässig erkannt.', correct: true },
          { text: 'Die Methode ist schneller und billiger als frühere Verfahren.', correct: false },
          { text: 'Manche neueren Varianten schneiden nur einen der beiden DNA-Stränge.', correct: false },
          { text: 'Die Genschere lässt sich auch in menschlichen Zellen einsetzen.', correct: false },
          { text: 'Bei der zugelassenen Behandlung werden Blutstammzellen außerhalb des Körpers verändert.', correct: false },
        ],
        explanation: 'Der dritte Absatz sagt das Gegenteil: Solche Umbauten werden mit den üblichen Prüfverfahren leicht übersehen. Die übrigen Aussagen stehen im Text.',
      },
      {
        id: 'tv-crispr-q4',
        prompt: 'Welchen Grund für das Verbot von Eingriffen in Embryonen nennt der Text über die technische Vorsicht hinaus?',
        options: [
          { text: 'Die künftigen Nachkommen, die die Folgen tragen, können sich zu dem Eingriff nicht äußern.', correct: true },
          { text: 'Veränderte Embryonen entwickeln sich nicht weiter.', correct: false },
          { text: 'Die Veränderung würde nur Körperzellen betreffen.', correct: false },
          { text: 'Erbliche Bluterkrankungen ließen sich dann nicht mehr behandeln.', correct: false },
          { text: 'Eingriffe in Embryonen sind teurer als Eingriffe in Blutstammzellen.', correct: false },
        ],
        explanation: 'Der letzte Satz nennt diesen Grund mit „nicht nur …, sondern auch“. Die dritte Antwort beschreibt die zugelassene Behandlung an Blutstammzellen und kehrt damit den Gegensatz des Absatzes um.',
      },
    ],
  },

  {
    id: 'tv-alzheimer',
    title: 'Die Amyloid-Frage',
    paragraphs: [
      'Im Gehirn von Menschen mit Alzheimer-Krankheit finden sich zwei typische Ablagerungen: Plaques aus dem Eiweißbruchstück Beta-Amyloid zwischen den Nervenzellen und Bündel aus verändertem Tau-Protein in ihrem Inneren. Seit den 1990er-Jahren bestimmt die Amyloid-Hypothese die Forschung. Sie besagt, dass die Anhäufung von Beta-Amyloid am Anfang einer Kette steht, an deren Ende Tau-Veränderungen, der Untergang von Nervenzellen und schließlich die Demenz stehen.',
      'Für die Hypothese spricht vor allem die Genetik. Die seltenen erblichen Formen der Krankheit, die oft schon vor dem sechzigsten Lebensjahr beginnen, gehen fast immer auf Veränderungen in Genen zurück, welche die Bildung von Beta-Amyloid beeinflussen. Auch Menschen mit Down-Syndrom, die eine zusätzliche Kopie des Gens für das Vorläuferprotein besitzen, erkranken auffallend häufig und früh.',
      'Gegen eine einfache Lesart spricht dagegen, dass viele ältere Menschen reichlich Plaques im Gehirn tragen, ohne geistig beeinträchtigt zu sein. Außerdem hängt das Ausmaß der Beschwerden enger mit der Ausbreitung der Tau-Bündel zusammen als mit der Menge an Amyloid. Über Jahrzehnte scheiterten zudem zahlreiche Medikamente, die Amyloid verringern sollten – einige von ihnen, obwohl sie die Plaques nachweislich abbauten.',
      'Neuere Antikörper haben die Debatte wiederbelebt. In großen Studien beseitigten sie Amyloid weitgehend und verlangsamten den Verlust geistiger Fähigkeiten im Frühstadium messbar, um etwa ein Viertel bis ein Drittel über rund eineinhalb Jahre. Ob dieser Effekt für die Betroffenen im Alltag spürbar ist, wird unterschiedlich beurteilt. Hinzu kommen Nebenwirkungen in Form von Schwellungen und kleinen Blutungen im Gehirn, die eine engmaschige Überwachung erfordern. Gegeben werden die Mittel als Infusion in regelmäßigen Abständen, und nur ein Teil der Erkrankten kommt für sie infrage, weil zuvor nachgewiesen werden muss, dass sich tatsächlich Amyloid im Gehirn abgelagert hat.',
      'Viele Forschende sehen in diesen Ergebnissen eine Bestätigung dafür, dass Amyloid eine ursächliche Rolle spielt, zugleich aber einen Hinweis darauf, dass die Behandlung zu spät ansetzt, wenn die Kette einmal in Gang gekommen ist. Studien an Menschen, die Ablagerungen, aber noch keine Beschwerden haben, sollen das klären.',
    ],
    questions: [
      {
        id: 'tv-alzheimer-q1',
        prompt: 'Was besagt die Amyloid-Hypothese laut Text?',
        options: [
          { text: 'Die Anhäufung von Beta-Amyloid steht am Anfang einer Kette, die zur Demenz führt.', correct: true },
          { text: 'Tau-Bündel lösen die Bildung von Amyloid-Plaques aus.', correct: false },
          { text: 'Amyloid-Plaques sind eine harmlose Begleiterscheinung des Alterns.', correct: false },
          { text: 'Die Demenz entsteht allein durch den Untergang von Nervenzellen, unabhängig von Ablagerungen.', correct: false },
          { text: 'Beta-Amyloid lagert sich im Inneren der Nervenzellen ab.', correct: false },
        ],
        explanation: 'Der erste Absatz gibt die Hypothese genau so wieder. Die zweite Antwort kehrt die Reihenfolge der Kette um, die letzte vertauscht die Orte: Amyloid liegt zwischen, Tau in den Nervenzellen.',
      },
      {
        id: 'tv-alzheimer-q2',
        prompt: 'Welche der folgenden Befunde führt der Text als Argument FÜR die Amyloid-Hypothese an?',
        statements: [
          { text: 'Erbliche Formen gehen fast immer auf Veränderungen in Genen zurück, welche die Bildung von Beta-Amyloid beeinflussen.', holds: true },
          { text: 'Viele ältere Menschen tragen Plaques, ohne geistig beeinträchtigt zu sein.', holds: false },
          { text: 'Menschen mit Down-Syndrom erkranken auffallend häufig und früh.', holds: true },
          { text: 'Das Ausmaß der Beschwerden hängt enger mit den Tau-Bündeln zusammen als mit der Menge an Amyloid.', holds: false },
        ],
        options: [
          { text: 'Nur I und III', correct: true },
          { text: 'Nur I', correct: false },
          { text: 'Nur I, III und IV', correct: false },
          { text: 'Nur II und IV', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'Alle vier Befunde stehen im Text – gefragt ist aber, wofür sie sprechen. I und III führt der zweite Absatz als Argumente dafür an, II und IV der dritte als Argumente gegen eine einfache Lesart. Wer nur prüft, ob etwas im Text vorkommt, wählt hier „Alle vier“.',
      },
      {
        id: 'tv-alzheimer-q3',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Die neueren Antikörper bringen den Verlust geistiger Fähigkeiten im Frühstadium zum Stillstand.', correct: true },
          { text: 'Die neueren Antikörper können Schwellungen und kleine Blutungen im Gehirn verursachen.', correct: false },
          { text: 'Frühere Medikamente scheiterten teils, obwohl sie Plaques nachweislich abbauten.', correct: false },
          { text: 'Erbliche Formen der Krankheit beginnen oft vor dem sechzigsten Lebensjahr.', correct: false },
          { text: 'Ob der Effekt der neueren Antikörper im Alltag spürbar ist, wird unterschiedlich beurteilt.', correct: false },
        ],
        explanation: 'Der vierte Absatz spricht von einer Verlangsamung um etwa ein Viertel bis ein Drittel, nicht von einem Stillstand. Die übrigen Aussagen stehen so im Text.',
      },
      {
        id: 'tv-alzheimer-q4',
        prompt: 'Wie deuten laut Text viele Forschende die Ergebnisse mit den neueren Antikörpern?',
        options: [
          { text: 'Amyloid spielt eine ursächliche Rolle, die Behandlung setzt aber möglicherweise zu spät an.', correct: true },
          { text: 'Die Amyloid-Hypothese ist damit endgültig widerlegt.', correct: false },
          { text: 'Die Antikörper wirken in Wahrheit auf die Tau-Bündel.', correct: false },
          { text: 'Bei Menschen ohne Beschwerden ist eine Behandlung nachweislich wirkungslos.', correct: false },
          { text: 'Die Nebenwirkungen machen die Antikörper unbrauchbar.', correct: false },
        ],
        explanation: 'Der letzte Absatz verbindet Bestätigung und Einschränkung genau so. Ob eine frühere Behandlung wirkt, sollen Studien erst klären – die vierte Antwort nimmt ein Ergebnis vorweg, das es noch nicht gibt.',
      },
    ],
  },

  {
    id: 'tv-laktose',
    title: 'Milch für Erwachsene',
    paragraphs: [
      'Gesunde Säuglinge können Milchzucker verdauen. Dafür bilden sie im Dünndarm das Enzym Laktase, das den Milchzucker Laktose in die Einfachzucker Glukose und Galaktose spaltet, die anschließend ins Blut aufgenommen werden. Bei den meisten Säugetieren und auch bei den meisten Menschen geht die Bildung des Enzyms nach dem Abstillen deutlich zurück. Weltweit verdaut nur etwa ein Drittel der Erwachsenen Milchzucker weiterhin problemlos; in Nordwesteuropa sind es um die neunzig Prozent, in Teilen Ostasiens nur wenige Prozent.',
      'Fehlt die Laktase, gelangt der Milchzucker unverdaut in den Dickdarm. Dort wird er von Bakterien vergoren, wobei Gase und Säuren entstehen, die Blähungen, Bauchschmerzen und Durchfall verursachen können. Wie stark die Beschwerden ausfallen, ist sehr unterschiedlich; viele Menschen mit wenig Laktase vertragen kleine Mengen, etwa ein Glas Milch über den Tag verteilt. Gereifter Käse enthält kaum noch Laktose, weil sie bei der Herstellung größtenteils mit der Molke entfernt oder abgebaut wird.',
      'Dass die Laktasebildung bei manchen Menschen lebenslang anhält, geht auf wenige Erbveränderungen zurück. Sie liegen nicht im Laktase-Gen selbst, sondern in einem benachbarten Abschnitt, der dessen Ablesung steuert. Bemerkenswert ist, dass in Europa, Ostafrika und auf der Arabischen Halbinsel jeweils andere Veränderungen dieselbe Wirkung haben. Die Eigenschaft ist also mehrfach unabhängig voneinander entstanden.',
      'Untersuchungen an altem Erbgut zeigen, dass sie sich erst nach der Einführung der Milchwirtschaft ausgebreitet hat, in Europa sogar erst Jahrtausende danach. Die Viehhaltung kam also zuerst, die Anpassung folgte. Die Ausbreitung verlief für Verhältnisse der Evolution ungewöhnlich schnell, was auf einen erheblichen Überlebensvorteil hindeutet. Worin er bestand, ist umstritten. Diskutiert werden eine verlässliche Nahrungsquelle, Flüssigkeit in Gegenden mit verunreinigtem Wasser und die bessere Versorgung mit Kalzium. Eine neuere Auswertung legt nahe, dass der Vorteil vor allem in Zeiten von Hungersnöten und Seuchen zum Tragen kam, wenn Durchfall für geschwächte Menschen lebensgefährlich werden konnte.',
    ],
    questions: [
      {
        id: 'tv-laktose-q1',
        prompt: 'Was geschieht laut Text mit Milchzucker, wenn Laktase fehlt?',
        options: [
          { text: 'Er gelangt unverdaut in den Dickdarm und wird dort von Bakterien vergoren.', correct: true },
          { text: 'Er wird im Dünndarm in Glukose und Galaktose gespalten.', correct: false },
          { text: 'Er wird unverändert ins Blut aufgenommen.', correct: false },
          { text: 'Er wird mit der Molke ausgeschieden.', correct: false },
          { text: 'Er wird im Dickdarm von körpereigener Laktase abgebaut.', correct: false },
        ],
        explanation: 'Der zweite Absatz beschreibt genau diesen Weg. Die zweite Antwort beschreibt die Verdauung mit Laktase, die vierte greift die Käseherstellung auf – beides steht im Text, beantwortet aber nicht die Frage.',
      },
      {
        id: 'tv-laktose-q2',
        prompt: DERIVABLE,
        statements: [
          { text: 'Die meisten Erwachsenen weltweit verdauen Milchzucker problemlos.', holds: false },
          { text: 'Die Erbveränderungen für die lebenslange Laktasebildung liegen im Laktase-Gen selbst.', holds: false },
          { text: 'Die lebenslange Laktasebildung ist mehrfach unabhängig voneinander entstanden.', holds: true },
          { text: 'Viele Menschen mit wenig Laktase vertragen kleine Mengen Milch.', holds: true },
        ],
        options: [
          { text: 'Nur III und IV', correct: true },
          { text: 'Nur II, III und IV', correct: false },
          { text: 'Nur IV', correct: false },
          { text: 'Nur I und III', correct: false },
          { text: 'Alle vier Aussagen', correct: false },
        ],
        explanation: 'III steht im dritten, IV im zweiten Absatz. I widerspricht dem ersten Absatz (nur etwa ein Drittel), II dem dritten: Die Veränderungen liegen in einem benachbarten, steuernden Abschnitt.',
      },
      {
        id: 'tv-laktose-q3',
        prompt: 'In welcher Reihenfolge verlief die Entwicklung in Europa laut Text?',
        options: [
          { text: 'Zuerst kam die Milchwirtschaft, Jahrtausende später breitete sich die lebenslange Laktasebildung aus.', correct: true },
          { text: 'Die lebenslange Laktasebildung breitete sich aus, und erst daraufhin entstand die Milchwirtschaft.', correct: false },
          { text: 'Beides entwickelte sich gleichzeitig.', correct: false },
          { text: 'Die lebenslange Laktasebildung war schon vor der Viehhaltung weit verbreitet.', correct: false },
          { text: 'Die Milchwirtschaft entstand erst, als sich Hungersnöte häuften.', correct: false },
        ],
        explanation: 'Der letzte Absatz sagt es ausdrücklich: „Die Viehhaltung kam also zuerst, die Anpassung folgte.“ Die zweite und vierte Antwort kehren die Reihenfolge um.',
      },
      {
        id: 'tv-laktose-q4',
        prompt: ONE_NOT_DERIVABLE,
        options: [
          { text: 'Der Vorteil der lebenslangen Laktasebildung ist geklärt: Sie verbesserte die Versorgung mit Kalzium.', correct: true },
          { text: 'Gereifter Käse enthält kaum noch Laktose.', correct: false },
          { text: 'Die Ausbreitung verlief für Verhältnisse der Evolution ungewöhnlich schnell.', correct: false },
          { text: 'Bei der Vergärung im Dickdarm entstehen Gase und Säuren.', correct: false },
          { text: 'In Teilen Ostasiens verdauen nur wenige Prozent der Erwachsenen Milchzucker problemlos.', correct: false },
        ],
        explanation: 'Der Text nennt die Frage nach dem Vorteil ausdrücklich umstritten; Kalzium ist nur eine von mehreren diskutierten Erklärungen. Die übrigen Aussagen stehen im Text.',
      },
    ],
  },
];

export default TEXTS;
