/**
 * Textverständnis – die Sachtexte samt Fragen.
 *
 * Je Text vier Fragen, ein Durchgang zieht drei Texte und damit die
 * vorgeschriebenen zwölf Aufgaben.
 *
 * Beim Schreiben galten drei Regeln, die den Untertest ausmachen:
 *
 *   1. Jede Frage ist allein aus dem Text zu beantworten. Wer das Thema kennt,
 *      darf keinen Vorteil haben – geprüft wird Lesen, nicht Wissen.
 *   2. Die falschen Antworten sind nicht einfach falsch, sondern auf die
 *      typischen Weisen falsch: Sie verallgemeinern, was der Text einschränkt,
 *      kehren eine Richtung um, verwechseln Ursache mit Wirkung, stehen zwar
 *      im Text, beantworten aber die Frage nicht, oder klingen plausibel und
 *      stehen nirgends.
 *   3. Keine Frage hängt an einem einzelnen Wort, das man überlesen kann,
 *      ohne den Satz verstanden zu haben.
 *
 * Schreibkonvention wie überall: Die richtige Antwort steht zuerst, gemischt
 * wird beim Ziehen (siehe data/tv/index.js).
 *
 * Die Texte sind eigens geschrieben und enthalten keine Originaltexte.
 */

export const TEXTS = [
  {
    id: 'tv-schlaf',
    title: 'Warum wir schlafen',
    paragraphs: [
      'Lange galt Schlaf als Zustand der Untätigkeit, als bloße Pause zwischen zwei Wachphasen. Diese Sicht hat sich gründlich gewandelt. Messungen der Hirnaktivität zeigen, dass das Gehirn im Schlaf keineswegs ruht, sondern in geordneten Zyklen zwischen Phasen tiefer und flacher Aktivität wechselt. Ein solcher Zyklus dauert bei Erwachsenen etwa neunzig Minuten und wiederholt sich pro Nacht vier- bis sechsmal.',
      'Besonders aufschlussreich ist der Zusammenhang zwischen Schlaf und Gedächtnis. Wer nach dem Lernen schläft, behält den Stoff messbar besser als jemand, der die gleiche Zeit wach verbringt. Man nimmt an, dass tagsüber gebildete Gedächtnisspuren im Tiefschlaf wiederholt und dabei von kurzlebigen in dauerhafte Speicher überführt werden. Entscheidend ist dabei nicht die Gesamtdauer des Schlafs allein, sondern der Anteil an Tiefschlaf, der vor allem in der ersten Nachthälfte anfällt.',
      'Ein zweiter Befund betrifft die Reinigung des Gehirns. Im Schlaf vergrößern sich die Zwischenräume zwischen den Nervenzellen, wodurch Flüssigkeit leichter hindurchströmen und Abbauprodukte abtransportieren kann. Dieser Vorgang läuft im Wachzustand deutlich langsamer ab. Ob daraus folgt, dass chronischer Schlafmangel neurodegenerative Erkrankungen begünstigt, ist bislang nicht abschließend geklärt; die vorliegenden Studien zeigen Zusammenhänge, aber keine gesicherte Ursache.',
      'Für den Alltag hat das Folgen. Wer die Nacht vor einer Prüfung durchlernt, tauscht Wiederholung gegen Verarbeitung – und verliert dabei meist mehr, als er gewinnt. Empfehlungen, den Schlaf durch kurze Tagschläfchen zu ersetzen, greifen ebenfalls zu kurz: Ein Mittagsschlaf von zwanzig Minuten erhöht nachweislich die Wachheit, erreicht aber die Tiefschlafphasen gar nicht erst, auf die es beim Einprägen ankommt.',
    ],
    questions: [
      {
        id: 'tv-schlaf-q1',
        prompt: 'Welche Aussage über Schlafzyklen lässt sich dem Text entnehmen?',
        options: [
          { text: 'Ein Zyklus dauert bei Erwachsenen rund neunzig Minuten und wiederholt sich mehrmals pro Nacht.', correct: true },
          { text: 'Die Zyklen werden im Lauf der Nacht immer länger.', correct: false },
          { text: 'Pro Nacht durchläuft ein Erwachsener genau vier Zyklen.', correct: false },
          { text: 'Während eines Zyklus bleibt die Hirnaktivität weitgehend konstant.', correct: false },
          { text: 'Die Zyklen treten nur in der ersten Nachthälfte auf.', correct: false },
        ],
        explanation: 'Der Text nennt etwa neunzig Minuten und vier bis sechs Wiederholungen. „Genau vier“ verengt diese Spanne, und von einer Verlängerung oder konstanter Aktivität steht nichts da – im Gegenteil, es ist ausdrücklich von einem Wechsel die Rede.',
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
        prompt: 'Warum hält der Text einen zwanzigminütigen Mittagsschlaf für keinen Ersatz beim Einprägen von Gelerntem?',
        options: [
          { text: 'Weil er die Tiefschlafphasen nicht erreicht, auf die es dabei ankommt.', correct: true },
          { text: 'Weil er die Wachheit nicht erhöht.', correct: false },
          { text: 'Weil er den nächtlichen Rhythmus der Zyklen durcheinanderbringt.', correct: false },
          { text: 'Weil dabei keine Abbauprodukte abtransportiert werden.', correct: false },
          { text: 'Weil zwanzig Minuten für einen vollständigen Zyklus zu kurz sind.', correct: false },
        ],
        explanation: 'Der Text nennt genau einen Grund: Der Tiefschlaf wird nicht erreicht. Dass die Wachheit steigt, räumt er sogar ausdrücklich ein. Die Aussage zum unvollständigen Zyklus klingt plausibel, steht aber nicht als Begründung im Text.',
      },
      {
        id: 'tv-schlaf-q4',
        prompt: 'Welche Aussage gibt den Gedankengang des letzten Absatzes am besten wieder?',
        options: [
          { text: 'Wer die Nacht vor einer Prüfung durchlernt, gewinnt an Wiederholung weniger, als er an Verarbeitung verliert.', correct: true },
          { text: 'Vor Prüfungen sollte man auf jede Form von Schlaf verzichten.', correct: false },
          { text: 'Tagschläfchen sind für die Wachheit wirkungslos.', correct: false },
          { text: 'Die Nacht vor der Prüfung ist für das Lernen die wertvollste Zeit.', correct: false },
          { text: 'Entscheidend ist allein, wie viele Stunden insgesamt geschlafen wird.', correct: false },
        ],
        explanation: 'Der Absatz wägt Wiederholung gegen Verarbeitung ab und kommt zu dem Schluss, dass der Tausch sich meist nicht lohnt. Die letzte Antwort widerspricht sogar dem zweiten Absatz, der ausdrücklich nicht die Gesamtdauer allein für entscheidend hält.',
      },
    ],
  },

  {
    id: 'tv-impf',
    title: 'Herdenschutz und seine Grenzen',
    paragraphs: [
      'Wenn in einer Bevölkerung genügend Menschen gegen eine übertragbare Krankheit immun sind, findet der Erreger nicht mehr genügend empfängliche Personen, um sich weiter auszubreiten. Von diesem Effekt profitieren auch jene, die selbst nicht immun sind – Säuglinge etwa, die für eine Impfung noch zu jung sind, oder Menschen, deren Immunsystem durch eine Behandlung geschwächt ist. Der Fachbegriff dafür lautet Herdenschutz.',
      'Wie hoch der Anteil der Immunen sein muss, hängt davon ab, wie ansteckend der Erreger ist. Bei Masern, einer der ansteckendsten bekannten Krankheiten, liegt die erforderliche Schwelle bei etwa fünfundneunzig Prozent; bei weniger übertragbaren Erregern genügen deutlich niedrigere Werte. Dass die Schwelle für jeden Erreger eigens bestimmt werden muss, wird in öffentlichen Debatten regelmäßig übersehen.',
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
        explanation: 'Der dritte Absatz erklärt es mit der ungleichen Verteilung. Die übrigen Antworten führen Gründe an, die der Text nicht nennt – die letzte verkehrt sogar die Rolle derer, die der Herdenschutz gerade schützen soll.',
      },
      {
        id: 'tv-impf-q3',
        prompt: 'Welche Bedingung ist dem Text zufolge für eine vollständige Ausrottung eines Erregers erforderlich?',
        options: [
          { text: 'Dass er ausschließlich von Mensch zu Mensch übertragen wird.', correct: true },
          { text: 'Dass er sich nicht verändert.', correct: false },
          { text: 'Dass die Immunität lebenslang anhält.', correct: false },
          { text: 'Dass die Impfquote weltweit bei hundert Prozent liegt.', correct: false },
          { text: 'Dass die Krankheit schwer verläuft und deshalb konsequent bekämpft wird.', correct: false },
        ],
        explanation: 'Der letzte Absatz nennt genau diese Bedingung und begründet sie mit dem fehlenden tierischen Reservoir. Veränderlichkeit und Dauer der Immunität behandelt der Text als eigene Probleme, nicht als Bedingung der Ausrottung.',
      },
      {
        id: 'tv-impf-q4',
        prompt: 'Welche Kritik übt der Text an öffentlichen Debatten?',
        options: [
          { text: 'Dass übersehen wird, dass die Schwelle für jeden Erreger eigens zu bestimmen ist.', correct: true },
          { text: 'Dass der Begriff Herdenschutz dort falsch verwendet wird.', correct: false },
          { text: 'Dass die Gefahr für Immungeschwächte kleingeredet wird.', correct: false },
          { text: 'Dass Pocken und Masern gleichgesetzt werden.', correct: false },
          { text: 'Dass dort mit veralteten Zahlen gearbeitet wird.', correct: false },
        ],
        explanation: 'Die Kritik steht wörtlich am Ende des zweiten Absatzes. Die übrigen Vorwürfe wären denkbar, erhebt der Text aber nicht.',
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
      'Als Gegenmaßnahmen werden vor allem Bäume, entsiegelte Flächen und helle Dächer genannt. Bäume wirken doppelt: Sie spenden Schatten und kühlen zusätzlich durch Verdunstung. Helle Dächer werfen Sonnenstrahlung zurück, statt sie aufzunehmen, und sind vergleichsweise günstig umzusetzen. Am wirksamsten ist der Text zufolge allerdings keine einzelne Maßnahme, sondern deren Verbindung im Quartier – eine Baumreihe in einer ansonsten versiegelten Straße bleibt ein Tropfen auf den heißen Stein.',
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
        prompt: 'Wie bewertet der Text den Beitrag von Verkehr, Klimaanlagen und Industrie?',
        options: [
          { text: 'Als vorhanden, aber im Vergleich zu den übrigen Faktoren gering.', correct: true },
          { text: 'Als den wichtigsten einzelnen Faktor.', correct: false },
          { text: 'Als bedeutsam ausschließlich während Hitzeperioden.', correct: false },
          { text: 'Als vernachlässigbar und nicht messbar.', correct: false },
          { text: 'Als Hauptgrund dafür, dass Städte nachts langsamer abkühlen.', correct: false },
        ],
        explanation: 'Der Text nennt den Beitrag gering und merkt an, dass er außerhalb von Hitzeperioden kaum ins Gewicht fällt – das ist etwas anderes als „nur während Hitzeperioden bedeutsam“. Genau solche Verschiebungen sind der häufigste Fehler in diesem Untertest.',
      },
      {
        id: 'tv-stadt-q3',
        prompt: 'Worin besteht laut Text die doppelte Wirkung von Bäumen?',
        options: [
          { text: 'Sie spenden Schatten und kühlen durch Verdunstung.', correct: true },
          { text: 'Sie spenden Schatten und binden Kohlendioxid.', correct: false },
          { text: 'Sie verdunsten Wasser und werfen Strahlung zurück.', correct: false },
          { text: 'Sie kühlen tagsüber und speichern nachts Wärme.', correct: false },
          { text: 'Sie entsiegeln den Boden und verengen die Straßenschlucht.', correct: false },
        ],
        explanation: 'Der Text nennt Schatten und Verdunstung. Das Zurückwerfen von Strahlung schreibt er den hellen Dächern zu; Kohlendioxid kommt gar nicht vor, obwohl es beim Thema naheliegt – ein Wissensvorsprung hilft hier nicht.',
      },
      {
        id: 'tv-stadt-q4',
        prompt: 'Welche Schlussfolgerung zieht der Text zu den Gegenmaßnahmen?',
        options: [
          { text: 'Entscheidend ist die Verbindung mehrerer Maßnahmen im Quartier.', correct: true },
          { text: 'Helle Dächer sind die wirksamste Einzelmaßnahme.', correct: false },
          { text: 'Ohne vollständige Entsiegelung bleibt jede Maßnahme wirkungslos.', correct: false },
          { text: 'Bäume sind allen anderen Maßnahmen überlegen.', correct: false },
          { text: 'Die Maßnahmen helfen vor allem den ohnehin bessergestellten Vierteln.', correct: false },
        ],
        explanation: 'Der letzte Satz stellt ausdrücklich die Verbindung über die Einzelmaßnahme. Dass helle Dächer günstig sind, macht sie nicht zur wirksamsten – auch das eine typische Verschiebung.',
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
        prompt: 'Wie erklärt der Text, dass Resistenzen zwischen entfernt verwandten Arten auftreten?',
        options: [
          { text: 'Durch die Weitergabe ringförmiger DNA-Stücke zwischen Bakterien.', correct: true },
          { text: 'Dadurch, dass dieselbe zufällige Veränderung in mehreren Arten unabhängig auftritt.', correct: false },
          { text: 'Durch die Vermehrung besonders schnell teilender Arten.', correct: false },
          { text: 'Dadurch, dass Antibiotika in mehreren Arten dieselbe Struktur angreifen.', correct: false },
          { text: 'Durch die Übertragung über den Darm des Patienten.', correct: false },
        ],
        explanation: 'Der dritte Absatz nennt ausschließlich den Weg über ringförmige DNA-Stücke. Die übrigen Erklärungen sind biologisch nicht abwegig, stehen aber nicht im Text.',
      },
      {
        id: 'tv-antibio-q3',
        prompt: 'Was hält der Text der Regel entgegen, eine Antibiotikapackung stets vollständig aufzubrauchen?',
        options: [
          { text: 'Maßgeblich sei die ärztlich festgelegte Dauer, die auch kürzer sein könne.', correct: true },
          { text: 'Die Regel sei richtig, werde aber zu selten befolgt.', correct: false },
          { text: 'Eine längere Einnahme erhöhe die Resistenzbildung immer.', correct: false },
          { text: 'Die Packungsgröße richte sich nach der üblichen Behandlungsdauer.', correct: false },
          { text: 'Entscheidend sei nicht die Dauer, sondern die Höhe der Dosis.', correct: false },
        ],
        explanation: 'Der letzte Satz stellt die ärztlich festgelegte Dauer über die Packungsgröße. Der Text sagt gerade nicht, dass längere Einnahme immer schade – er warnt vor zu kurzer und unregelmäßiger Einnahme.',
      },
      {
        id: 'tv-antibio-q4',
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
      'Beide Zahlen sagen für sich genommen wenig darüber aus, was ein positives Ergebnis im Einzelfall bedeutet. Dafür braucht es eine dritte Größe: wie verbreitet die Krankheit in der untersuchten Gruppe überhaupt ist. Man nennt sie Prävalenz. Erst aus dem Zusammenspiel dieser drei Angaben ergibt sich, wie wahrscheinlich es ist, dass eine Person mit positivem Ergebnis tatsächlich krank ist.',
      'Ein Beispiel macht das anschaulich. Man untersuche zehntausend Personen auf eine Krankheit, die einen von tausend betrifft. Unter ihnen sind also zehn Kranke, von denen der Test etwa alle findet. Unter den neuntausendneunhundertneunzig Gesunden schlägt er bei einem Prozent fälschlich an, also bei rund hundert Personen. Von den etwa hundertzehn positiven Ergebnissen entfallen damit hundert auf Gesunde: Wer ein positives Ergebnis erhält, ist trotz eines sehr guten Tests mit deutlich unter zehn Prozent Wahrscheinlichkeit tatsächlich krank.',
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
        prompt: 'Welche Größe braucht es laut Text zusätzlich, um ein positives Ergebnis im Einzelfall zu deuten?',
        options: [
          { text: 'Die Prävalenz in der untersuchten Gruppe.', correct: true },
          { text: 'Die Zahl der insgesamt durchgeführten Tests.', correct: false },
          { text: 'Die Schwere der Erkrankung.', correct: false },
          { text: 'Die Zuverlässigkeit des Labors.', correct: false },
          { text: 'Das Verhältnis von Sensitivität zu Spezifität.', correct: false },
        ],
        explanation: 'Der zweite Absatz benennt die Prävalenz ausdrücklich als dritte Größe. Die letzte Antwort klingt fachlich, kommt im Text aber nicht vor.',
      },
      {
        id: 'tv-statistik-q3',
        prompt: 'Wie viele der positiven Ergebnisse entfallen im Beispiel auf Gesunde?',
        options: [
          { text: 'Rund hundert von etwa hundertzehn.', correct: true },
          { text: 'Rund zehn von etwa hundertzehn.', correct: false },
          { text: 'Etwa die Hälfte.', correct: false },
          { text: 'Rund hundert von zehntausend.', correct: false },
          { text: 'Etwa ein Prozent.', correct: false },
        ],
        explanation: 'Der dritte Absatz rechnet es vor: zehn richtig positive, rund hundert falsch positive. Die vierte und fünfte Antwort geben Zahlen wieder, die im Text stehen, beantworten aber eine andere Frage.',
      },
      {
        id: 'tv-statistik-q4',
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
        explanation: 'Der zweite Absatz beschreibt sie als Gegenrichtung zum aufsteigenden Signal. Die dritte Antwort greift einen Vorgang aus dem nächsten Absatz auf, der damit nichts zu tun hat.',
      },
      {
        id: 'tv-schmerz-q3',
        prompt: 'Was kennzeichnet dem Text zufolge das Stadium des anhaltenden Schmerzes?',
        options: [
          { text: 'Der Schmerz ist selbst zum Problem geworden und nicht mehr nur Anzeiger einer Schädigung.', correct: true },
          { text: 'Das Gewebe ist irreversibel geschädigt.', correct: false },
          { text: 'Die Schmerzverarbeitung findet ausschließlich im Gehirn statt.', correct: false },
          { text: 'Die Angabe der betroffenen Person wird unzuverlässig.', correct: false },
          { text: 'Bildgebende Verfahren zeigen typische Veränderungen.', correct: false },
        ],
        explanation: 'Der dritte Absatz formuliert es genau so und nennt die Folgen für die Behandlung. Die vierte Antwort kehrt sogar um, was der letzte Absatz betont.',
      },
      {
        id: 'tv-schmerz-q4',
        prompt: 'Welches Argument führt der Text gegen eine Überbewertung bildgebender Befunde an?',
        options: [
          { text: 'Auch bei beschwerdefreien Menschen finden sich regelmäßig Veränderungen.', correct: true },
          { text: 'Die Verfahren sind zu ungenau, um kleine Schäden zu zeigen.', correct: false },
          { text: 'Sie werden zu selten eingesetzt, um verlässlich zu sein.', correct: false },
          { text: 'Sie zeigen Empfindungen, aber keine Strukturen.', correct: false },
          { text: 'Sie sind bei chronischem Schmerz technisch nicht durchführbar.', correct: false },
        ],
        explanation: 'Der letzte Absatz nennt genau diesen Befund. Die vierte Antwort dreht die Aussage des Textes um – dort steht Strukturen, nicht Empfindungen.',
      },
    ],
  },

  {
    id: 'tv-sprache',
    title: 'Wie Sprachen verschwinden',
    paragraphs: [
      'Von den rund siebentausend heute gesprochenen Sprachen gilt etwa die Hälfte als bedroht. Bedroht heißt in der Sprachwissenschaft nicht, dass eine Sprache wenige Sprecher hat, sondern dass sie nicht mehr an Kinder weitergegeben wird. Eine Sprache mit zehntausend Sprechern, die alle über sechzig sind, steht schlechter da als eine mit fünfhundert Sprechern, unter denen Kinder sind.',
      'Der Übergang verläuft selten abrupt. Zunächst wird die kleinere Sprache aus öffentlichen Bereichen verdrängt – aus Verwaltung, Schule und Handel –, bleibt aber in der Familie erhalten. In der nächsten Phase sprechen Eltern mit ihren Kindern in der größeren Sprache, weil sie sich davon bessere Aussichten versprechen, verstehen die kleinere aber noch. Die dritte Generation versteht sie schließlich nur noch bruchstückhaft.',
      'Dass mit einer Sprache Wissen verloren geht, wird oft mit Beispielen aus der Botanik belegt: Bezeichnungen für Pflanzen und ihre Verwendung sind in kleinen Sprachen häufig feiner ausdifferenziert als in den großen. Sprachwissenschaftler weisen jedoch darauf hin, dass solches Wissen grundsätzlich übersetzbar ist und der eigentliche Verlust anderswo liegt: in den grammatischen Bauweisen, die sich unabhängig voneinander entwickelt haben und zeigen, welche Möglichkeiten menschliche Sprache überhaupt hat.',
      'Bemühungen um Wiederbelebung sind entsprechend aufwendig. Wörterbücher und Aufnahmen bewahren eine Sprache als Gegenstand, nicht als Verständigungsmittel. Erfolgreich waren Programme dort, wo es gelang, Räume zu schaffen, in denen die Sprache tatsächlich gebraucht wurde – Kindergärten etwa, in denen ausschließlich sie gesprochen wird. Entscheidend war dabei weniger der Umfang der Mittel als die Frage, ob die Sprechergemeinschaft das Vorhaben selbst trug.',
    ],
    questions: [
      {
        id: 'tv-sprache-q1',
        prompt: 'Wann gilt eine Sprache in der Sprachwissenschaft als bedroht?',
        options: [
          { text: 'Wenn sie nicht mehr an Kinder weitergegeben wird.', correct: true },
          { text: 'Wenn sie weniger als tausend Sprecher hat.', correct: false },
          { text: 'Wenn sie aus Verwaltung und Schule verdrängt wurde.', correct: false },
          { text: 'Wenn ihre Sprecher im Durchschnitt über sechzig sind.', correct: false },
          { text: 'Wenn für sie kein Wörterbuch existiert.', correct: false },
        ],
        explanation: 'Der erste Absatz grenzt den Begriff ausdrücklich gegen die reine Sprecherzahl ab. Die dritte und vierte Antwort beschreiben Begleiterscheinungen, die der Text an anderer Stelle nennt.',
      },
      {
        id: 'tv-sprache-q2',
        prompt: 'Was kennzeichnet die zweite Phase des beschriebenen Übergangs?',
        options: [
          { text: 'Eltern sprechen mit ihren Kindern die größere Sprache, verstehen die kleinere aber noch.', correct: true },
          { text: 'Die kleinere Sprache verschwindet aus der Verwaltung.', correct: false },
          { text: 'Die Kinder verstehen die kleinere Sprache nur noch bruchstückhaft.', correct: false },
          { text: 'Beide Sprachen werden gleichermaßen in der Familie gebraucht.', correct: false },
          { text: 'Die kleinere Sprache wird nur noch in der Schule unterrichtet.', correct: false },
        ],
        explanation: 'Der zweite Absatz ordnet die Phasen klar: Verdrängung aus dem Öffentlichen zuerst, dann der Wechsel in der Familie, zuletzt das bruchstückhafte Verstehen. Hier ist die Reihenfolge die eigentliche Aufgabe.',
      },
      {
        id: 'tv-sprache-q3',
        prompt: 'Worin liegt laut den zitierten Sprachwissenschaftlern der eigentliche Verlust?',
        options: [
          { text: 'In den grammatischen Bauweisen, die zeigen, was menschliche Sprache überhaupt kann.', correct: true },
          { text: 'In den differenzierten Pflanzenbezeichnungen.', correct: false },
          { text: 'In den mündlich überlieferten Erzählungen.', correct: false },
          { text: 'In der kulturellen Identität der Sprechergemeinschaft.', correct: false },
          { text: 'In der Vielfalt der Schriftsysteme.', correct: false },
        ],
        explanation: 'Der dritte Absatz stellt die Botanik-Beispiele ausdrücklich zurück und setzt die Grammatik dagegen. Die übrigen Antworten sind gängige Argumente in dieser Debatte, stehen hier aber nicht.',
      },
      {
        id: 'tv-sprache-q4',
        prompt: 'Was war dem Text zufolge bei erfolgreichen Wiederbelebungsprogrammen entscheidend?',
        options: [
          { text: 'Dass die Sprechergemeinschaft das Vorhaben selbst trug.', correct: true },
          { text: 'Der Umfang der bereitgestellten Mittel.', correct: false },
          { text: 'Die Vollständigkeit der Wörterbücher und Aufnahmen.', correct: false },
          { text: 'Die staatliche Anerkennung als Amtssprache.', correct: false },
          { text: 'Die Zahl der noch lebenden Sprecher.', correct: false },
        ],
        explanation: 'Der letzte Satz stellt die Trägerschaft ausdrücklich über die Mittel. Wörterbücher bewahren dem Text zufolge nur den Gegenstand, nicht den Gebrauch.',
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
      'Praktisch folgt daraus weder, Placebos einzusetzen, noch, sie für bedeutungslos zu halten. Bedeutsam ist vielmehr, dass jede Behandlung einen solchen Anteil enthält: Zuwendung, Erklärung und eine glaubwürdige Aussicht auf Besserung wirken auch dann, wenn daneben ein Wirkstoff gegeben wird. Wer diesen Anteil vernachlässigt, verschenkt Wirkung, die nichts kostet.',
    ],
    questions: [
      {
        id: 'tv-placebo-q1',
        prompt: 'Welche Deutung des Placeboeffekts weist der Text zurück?',
        options: [
          { text: 'Dass er beweise, Erwartung entscheide über Krankheit.', correct: true },
          { text: 'Dass er auf statistischen Artefakten beruhe.', correct: false },
          { text: 'Dass er bei selbst berichteten Beschwerden am stärksten sei.', correct: false },
          { text: 'Dass er in jeder Behandlung enthalten sei.', correct: false },
          { text: 'Dass er in Studien überhaupt messbar sei.', correct: false },
        ],
        explanation: 'Der erste Absatz nennt genau diese Deutung und erklärt sie für überzogen. Die dritte und vierte Antwort vertritt der Text selbst – wer nur überfliegt, verwechselt hier leicht These und Gegenthese.',
      },
      {
        id: 'tv-placebo-q2',
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
      {
        id: 'tv-placebo-q3',
        prompt: 'Bei welchen Größen wirkt der Effekt dem Text zufolge kaum?',
        options: [
          { text: 'Bei messbaren Größen wie Blutdruck oder Laborwerten.', correct: true },
          { text: 'Bei Schmerz und Übelkeit.', correct: false },
          { text: 'Bei Beschwerden, die sich von selbst bessern.', correct: false },
          { text: 'Bei Müdigkeit.', correct: false },
          { text: 'Bei Beschwerden, die die Person selbst berichtet.', correct: false },
        ],
        explanation: 'Der dritte Absatz stellt selbst berichtete Beschwerden den messbaren Größen gegenüber. Drei der falschen Antworten nennen genau die Beispiele der anderen Seite.',
      },
      {
        id: 'tv-placebo-q4',
        prompt: 'Welchen praktischen Schluss zieht der Text?',
        options: [
          { text: 'Zuwendung und Erklärung wirken auch neben einem Wirkstoff und sollten nicht vernachlässigt werden.', correct: true },
          { text: 'Placebos sollten breiter eingesetzt werden.', correct: false },
          { text: 'Der Placeboeffekt ist für die Praxis ohne Bedeutung.', correct: false },
          { text: 'Wirkstoffe sollten erst nach einem Placeboversuch gegeben werden.', correct: false },
          { text: 'Studien ohne dritte Gruppe sind wertlos.', correct: false },
        ],
        explanation: 'Der letzte Absatz schließt beide Extreme ausdrücklich aus und betont den Anteil, den jede Behandlung enthält. Die zweite und dritte Antwort sind genau die beiden Extreme.',
      },
    ],
  },
];

export default TEXTS;
