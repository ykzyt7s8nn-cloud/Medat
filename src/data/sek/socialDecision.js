/**
 * SEK – Soziales Entscheiden.
 *
 * Format nach den offiziellen Vorgaben: 14 Aufgaben in 21 Minuten. Zu jeder
 * Situation stehen fünf Überlegungen, die von sehr eigennützig bis sehr
 * uneigennützig reichen. Sie sind nach ihrer Bedeutung für eine moralisch
 * richtige Entscheidung auf die Plätze a bis e zu verteilen – a ist die
 * wichtigste, e die unwichtigste. Jeder Platz wird genau einmal vergeben.
 * Gewertet wird mit Teilpunkten: Jede richtig gesetzte Marke zählt.
 *
 * Der Schlüssel folgt durchgängig derselben Leiter, angelehnt an Kohlbergs
 * Stufen der Moralentwicklung. Sie ist wichtiger als jede Einzelaufgabe, denn
 * wer sie kennt, kann jede Aufgabe dieses Typs sortieren:
 *
 *   1. Das Wohl und die Würde der betroffenen Person selbst
 *      – was der Sache nach zählt, unabhängig von Regeln und Publikum
 *   2. Verantwortung, Pflicht und die Folgen für die Allgemeinheit
 *      – was jemand in dieser Rolle schuldet
 *   3. Erwartungen des Umfelds, Beziehungen, das eigene Ansehen
 *      – was andere von mir denken
 *   4. Der eigene Vorteil, Aufwand und Nutzen
 *      – was es mir bringt
 *   5. Die Vermeidung eigener Nachteile oder Unannehmlichkeiten
 *      – was mir erspart bleibt
 *
 * Gefragt ist ausdrücklich nicht die persönliche Meinung, sondern diese
 * Rangfolge. Die eigene erste Eingebung ist oft Stufe 3 – man denkt daran,
 * wie es aussieht. Genau dort liegt der häufigste Fehler.
 *
 * `statements` steht in der richtigen Reihenfolge, Platz a zuerst; gemischt
 * wird erst beim Ziehen (siehe data/sek/index.js).
 *
 * Diese Aufgaben sind selbst geschrieben, keine Originalaufgaben.
 */

export const TASKS = [
  {
    id: 'sd-1',
    situation: 'Du arbeitest als Aushilfe in einer Apotheke. Eine ältere Kundin erzählt dir beiläufig, dass sie ihre Herztabletten seit drei Wochen nicht mehr nimmt, weil sie ihr zu teuer geworden sind. Der Apotheker ist gerade im Hinterzimmer.',
    statements: [
      'Ob die Frau ohne ihr Herzmedikament ernsthaft gefährdet ist.',
      'Ob ich verpflichtet bin, eine solche Beobachtung an den Apotheker weiterzugeben.',
      'Was die Frau von mir denkt, wenn ich mich in ihre Finanzen einmische.',
      'Ob mir das Gespräch meine Pause kostet.',
      'Ob ich Ärger bekomme, wenn ich mich als Aushilfe zu weit aus dem Fenster lehne.',
    ],
    explanation: 'Zuerst zählt die konkrete Gefahr für die Frau. Dann die Pflicht, die sich aus der Rolle in der Apotheke ergibt. Erst danach, wie es auf sie wirkt, was es mich kostet und was mir erspart bleibt.',
  },
  {
    id: 'sd-2',
    situation: 'In deiner Lerngruppe kursiert eine Datei mit Aufgaben, die aus der diesjährigen, noch nicht abgeschlossenen Prüfungsrunde stammen sollen. Mehrere aus der Gruppe lernen bereits damit.',
    statements: [
      'Ob die Verwendung dieser Datei alle benachteiligt, die sie nicht haben.',
      'Ob ich damit gegen die Prüfungsordnung verstoße, zu deren Einhaltung ich mich verpflichtet habe.',
      'Wie die Gruppe reagiert, wenn ich als Einzige nicht mitmache.',
      'Ob mir die Datei überhaupt einen nennenswerten Vorteil bringt.',
      'Ob ich erwischt werden könnte.',
    ],
    explanation: 'Die Fairness gegenüber allen anderen Prüflingen wiegt am schwersten, danach die eingegangene Verpflichtung. Der Gruppendruck, der eigene Nutzen und das Entdeckungsrisiko stehen hinten.',
  },
  {
    id: 'sd-3',
    situation: 'Du siehst abends an einer Haltestelle einen offensichtlich betrunkenen Mann, der auf dem Boden sitzt und nicht mehr aufsteht. Andere Wartende gehen vorbei. Dein Bus kommt in zwei Minuten.',
    statements: [
      'Ob der Mann unterkühlt oder ernsthaft in Gefahr ist.',
      'Ob ich als Anwesende verpflichtet bin, Hilfe zu leisten oder zu holen.',
      'Was die anderen Wartenden denken, wenn ich mich als Einzige kümmere.',
      'Wie lange ich auf den nächsten Bus warten müsste.',
      'Ob ich in eine unangenehme Situation gerate, wenn er aggressiv wird.',
    ],
    explanation: 'Zuerst die Gefahr für den Mann, dann die Hilfspflicht. Das Urteil der Umstehenden, der eigene Zeitverlust und die Sorge vor Unannehmlichkeiten folgen dahinter.',
  },
  {
    id: 'sd-4',
    situation: 'Deine Mitbewohnerin erzählt dir unter Tränen, dass sie seit Monaten kaum noch isst. Sie bittet dich ausdrücklich, mit niemandem darüber zu sprechen – auch nicht mit ihrer Familie.',
    statements: [
      'Ob ihre Gesundheit so bedroht ist, dass Schweigen sie gefährdet.',
      'Ob ich ein gegebenes Versprechen brechen darf, wenn es um Leben und Gesundheit geht.',
      'Wie unser Verhältnis aussieht, wenn sie erfährt, dass ich mit jemandem gesprochen habe.',
      'Ob mich die Sache in eine Rolle drängt, der ich nicht gewachsen bin.',
      'Ob ich mir Ärger mit ihrer Familie einhandle.',
    ],
    explanation: 'Die erste Frage ist, wie gefährdet sie tatsächlich ist – davon hängt alles Weitere ab. Dann die Abwägung zwischen Versprechen und Schutz. Beziehung, eigene Überforderung und Ärger mit Dritten rangieren darunter.',
  },
  {
    id: 'sd-5',
    situation: 'Du bekommst im Supermarkt an der Kasse zwanzig Euro zu viel heraus. Die Kassiererin, eine sichtlich neue Kollegin, hat es nicht bemerkt. Hinter dir steht eine lange Schlange.',
    statements: [
      'Dass das Geld nicht mir gehört.',
      'Ob der Fehlbetrag der Kassiererin am Abend angelastet wird.',
      'Wie es aussieht, wenn ich vor der ganzen Schlange auf den Fehler hinweise.',
      'Ob mir die zwanzig Euro gerade gelegen kämen.',
      'Ob überhaupt jemand den Fehler je bemerken würde.',
    ],
    explanation: 'Dass das Geld einem anderen gehört, ist der Kern. Die Folgen für die neue Kollegin sind die konkrete Verantwortung dahinter. Der Auftritt vor der Schlange, der eigene Nutzen und die Entdeckungswahrscheinlichkeit sind nachgeordnet.',
  },
  {
    id: 'sd-6',
    situation: 'Bei einem Gruppenprojekt hat ein Teammitglied wochenlang nichts beigetragen. Bei der Abgabe steht sein Name mit auf der Arbeit. Die Betreuerin fragt euch beim Abgabegespräch, ob alle gleichmäßig beteiligt waren.',
    statements: [
      'Ob eine falsche Auskunft die Bewertung aller Beteiligten verfälscht.',
      'Ob ich verpflichtet bin, auf eine direkte Frage wahrheitsgemäß zu antworten.',
      'Wie das Verhältnis im Team aussieht, wenn ich ihn vor allen bloßstelle.',
      'Ob ich selbst schlechter wegkomme, wenn ich nichts sage.',
      'Ob mir das unangenehme Gespräch danach erspart bleibt, wenn ich schweige.',
    ],
    explanation: 'Zuerst die Richtigkeit der Bewertung für alle, dann die Wahrheitspflicht bei einer direkten Frage. Teamklima, eigener Nachteil und ersparte Unannehmlichkeiten folgen.',
  },
  {
    id: 'sd-7',
    situation: 'Du siehst, wie ein Bekannter im Parkhaus beim Ausparken ein fremdes Auto streift und ohne anzuhalten weiterfährt. Er hat dich nicht bemerkt.',
    statements: [
      'Dass der Halter des beschädigten Autos auf dem Schaden sitzen bleibt.',
      'Dass Unfallflucht kein Kavaliersdelikt, sondern strafbar ist.',
      'Wie sich unsere Bekanntschaft verändert, wenn ich ihn anzeige.',
      'Ob ich als Zeuge Zeit bei der Polizei verliere.',
      'Ob ich überhaupt irgendetwas riskiere, wenn ich einfach weitergehe.',
    ],
    explanation: 'Der geschädigte Dritte steht an erster Stelle, dann die Rechtslage. Die Bekanntschaft, der eigene Zeitaufwand und das eigene Risiko sind nachrangig.',
  },
  {
    id: 'sd-8',
    situation: 'Im Praktikum bemerkst du, dass eine erfahrene Pflegekraft die Händedesinfektion regelmäßig überspringt. Auf der Station liegen mehrere immungeschwächte Patienten.',
    statements: [
      'Ob dadurch Patienten mit geschwächtem Immunsystem konkret gefährdet werden.',
      'Ob ich als Teil des Teams verpflichtet bin, Hygieneverstöße zu melden.',
      'Wie ich als Praktikant dastehe, wenn ich eine erfahrene Kraft kritisiere.',
      'Ob mir die Auseinandersetzung das Praktikumszeugnis verdirbt.',
      'Ob mich das Ganze überhaupt etwas angeht, solange nichts passiert.',
    ],
    explanation: 'Die Patientengefährdung zuerst, dann die Meldepflicht. Der eigene Stand im Team, das Zeugnis und der Wunsch, außen vor zu bleiben, kommen danach.',
  },
  {
    id: 'sd-9',
    situation: 'Deine Nachbarin bittet dich, ihr Paket anzunehmen, während sie im Urlaub ist. Als du es entgegennimmst, bemerkst du, dass es bereits deutlich beschädigt ist und etwas darin klappert.',
    statements: [
      'Dass die Nachbarin erfahren muss, in welchem Zustand das Paket ankam.',
      'Ob ich als Annehmende verpflichtet bin, den Schaden beim Zusteller zu vermerken.',
      'Wie es aussieht, wenn sie den Schaden später mir zuschreibt.',
      'Ob mir der Aufwand mit der Reklamation zu viel ist.',
      'Ob ich die Sache einfach ungeöffnet abstellen und nichts sagen kann.',
    ],
    explanation: 'Die Information an die Eigentümerin steht obenan, dann der formale Vermerk, der ihr Ansprüche sichert. Sorge um den eigenen Ruf, der Aufwand und das Wegschauen folgen.',
  },
  {
    id: 'sd-10',
    situation: 'Ein Freund bittet dich, in seinem Lebenslauf zu bestätigen, dass er bei dir ein dreimonatiges Praktikum absolviert hat. Tatsächlich hat er zwei Wochen ausgeholfen. Er braucht die Stelle dringend.',
    statements: [
      'Dass eine falsche Bestätigung andere Bewerber um eine faire Chance bringt.',
      'Dass eine solche Bescheinigung eine Urkundenfälschung sein kann.',
      'Was es für unsere Freundschaft bedeutet, wenn ich ablehne.',
      'Ob er mir im Gegenzug einmal etwas schuldet.',
      'Ob die Sache jemals auffliegen würde.',
    ],
    explanation: 'Die Benachteiligung der Mitbewerber wiegt am schwersten, dahinter die rechtliche Dimension. Freundschaft, Gegenleistung und Entdeckungsrisiko rangieren darunter – auch wenn die Not des Freundes echt ist.',
  },
  {
    id: 'sd-11',
    situation: 'In einer Vorlesung macht der Dozent wiederholt abfällige Bemerkungen über Studierende mit ausländischen Namen. Die Betroffenen sagen nichts, einige lachen mit.',
    statements: [
      'Dass die Betroffenen in ihrer Würde verletzt werden.',
      'Dass eine Hochschule solche Äußerungen nicht dulden darf und es Meldewege gibt.',
      'Wie ich vor dem Kurs dastehe, wenn ich als Einzige widerspreche.',
      'Ob mir der Dozent die Note verdirbt.',
      'Ob es einfacher ist, die Vorlesung künftig nicht mehr zu besuchen.',
    ],
    explanation: 'Die Verletzung der Betroffenen steht an erster Stelle, dann die institutionelle Verantwortung samt Meldeweg. Das eigene Ansehen, die Note und das Ausweichen sind nachgeordnet.',
  },
  {
    id: 'sd-12',
    situation: 'Du hast einen Sitzplatz im vollen Zug reserviert. Eine hochschwangere Frau steht im Gang, und es ist offensichtlich, dass sie sich schwertut. Du hast selbst noch vier Stunden Fahrt vor dir.',
    statements: [
      'Wie belastend das lange Stehen für sie in ihrem Zustand ist.',
      'Ob es in einer solchen Lage Rücksicht verlangt, unabhängig von der Reservierung.',
      'Was die anderen Fahrgäste denken, wenn ich sitzen bleibe.',
      'Dass ich für den Platz bezahlt habe.',
      'Wie unbequem vier Stunden Stehen für mich wären.',
    ],
    explanation: 'Ihre Belastung zuerst, dann das Gebot der Rücksicht. Die Blicke der Mitreisenden, der eigene Anspruch aus der Reservierung und die eigene Unbequemlichkeit folgen.',
  },
  {
    id: 'sd-13',
    situation: 'Ein Kommilitone vertraut dir an, dass er in der Klausur getäuscht hat. Wenige Tage später wird in der Vorlesung bekannt gegeben, dass wegen eines Täuschungsverdachts der gesamte Jahrgang die Klausur wiederholen muss.',
    statements: [
      'Dass der gesamte Jahrgang für etwas büßt, das eine einzelne Person getan hat.',
      'Ob ich verpflichtet bin, mein Wissen offenzulegen, um die Wiederholung abzuwenden.',
      'Dass er mir die Sache im Vertrauen erzählt hat.',
      'Ob ich selbst die Wiederholungsklausur bequem bestehen würde.',
      'Ob ich als Verräter gelte, wenn es herauskommt.',
    ],
    explanation: 'Der Schaden für den ganzen Jahrgang steht obenan, dann die Frage nach der eigenen Pflicht. Das Vertrauensverhältnis ist ein echter, aber nachrangiger Einwand; eigene Bequemlichkeit und Ruf kommen zuletzt.',
  },
  {
    id: 'sd-14',
    situation: 'Beim Joggen findest du eine Geldbörse mit Ausweis, Bankkarten und dreihundert Euro. Es ist Sonntagabend, Fundbüro und Polizeidienststelle in deiner Nähe sind geschlossen.',
    statements: [
      'Dass die Person auf Ausweis und Karten dringend angewiesen ist.',
      'Dass Fundsachen abzugeben sind und ich den Fund dokumentieren sollte.',
      'Wie ich dastünde, wenn mich jemand mit der Börse gesehen hätte.',
      'Ob mir ein Finderlohn zusteht.',
      'Ob mich die Suche nach einer geöffneten Stelle den Abend kostet.',
    ],
    explanation: 'Der Bedarf der Eigentümerin oder des Eigentümers zuerst, dann die Pflicht zur Abgabe. Das eigene Bild nach außen, der Finderlohn und der Zeitaufwand stehen hinten.',
  },
  {
    id: 'sd-15',
    situation: 'Deine Schwester bittet dich, ihren Kindern nicht zu erzählen, dass die Großmutter schwer krank ist. Die Kinder sind zwölf und vierzehn und fragen dich beim nächsten Besuch direkt, warum Oma nicht mehr kommt.',
    statements: [
      'Ob die Kinder in ihrem Alter ein Recht darauf haben, es zu erfahren.',
      'Dass die Entscheidung über solche Nachrichten bei den Eltern liegt.',
      'Wie mein Verhältnis zu meiner Schwester aussieht, wenn ich mich darüber hinwegsetze.',
      'Ob mir die Ausflüchte gegenüber den Kindern unangenehm sind.',
      'Ob ich dem Gespräch einfach ausweichen kann.',
    ],
    explanation: 'Das Recht der Kinder auf Wahrheit steht zuerst – in diesem Alter ist es gewichtig. Danach die Zuständigkeit der Eltern, die hier ernst zu nehmen ist. Verhältnis zur Schwester, eigenes Unbehagen und Ausweichen folgen.',
  },
  {
    id: 'sd-16',
    situation: 'Du arbeitest im Servicebereich eines Restaurants. Ein Gast beschwert sich zu Unrecht über eine Speise und verlangt lautstark einen Rabatt. Deine Chefin ist nicht da, und der Gast wird zunehmend ausfallend gegenüber einer Kollegin.',
    statements: [
      'Dass meine Kollegin gerade beleidigt wird und Unterstützung braucht.',
      'Dass ich in Vertretung für einen geordneten Ablauf im Lokal verantwortlich bin.',
      'Was die anderen Gäste von der Szene mitbekommen.',
      'Ob mich der Streit mein Trinkgeld kostet.',
      'Ob ich mich einfach zurückziehen und den Gast der Kollegin überlassen kann.',
    ],
    explanation: 'Der Schutz der angegriffenen Kollegin steht an erster Stelle, danach die Verantwortung für den Ablauf. Der Eindruck auf andere Gäste, das Trinkgeld und der Rückzug sind nachgeordnet.',
  },
  {
    id: 'sd-17',
    situation: 'Ein Kommilitone fragt dich kurz vor der Abgabe, ob er deine Hausarbeit „als Orientierung“ lesen darf. Du weißt, dass er in der Vergangenheit schon einmal Textstellen fast wörtlich übernommen hat.',
    statements: [
      'Dass ein Plagiat seinen Abschluss und den Wert aller Abschlüsse beschädigt.',
      'Dass ich mit der Weitergabe eine Täuschung mit ermögliche.',
      'Wie er reagiert, wenn ich ihm misstraue und ablehne.',
      'Ob ich selbst in Schwierigkeiten gerate, wenn er abschreibt.',
      'Ob es mir zu mühsam ist, das Thema anzusprechen.',
    ],
    explanation: 'Der Schaden am Wert der Abschlüsse zuerst, dann die eigene Beteiligung an einer Täuschung. Seine Reaktion, das eigene Risiko und die Mühe des Gesprächs folgen.',
  },
  {
    id: 'sd-18',
    situation: 'Du erfährst, dass in deinem Sportverein seit Jahren Mitgliedsbeiträge in bar kassiert und nicht vollständig verbucht werden. Der Kassier ist seit zwanzig Jahren dabei und im Verein sehr beliebt.',
    statements: [
      'Dass allen Mitgliedern Geld entzogen wird, das ihnen gemeinsam gehört.',
      'Dass der Verein zu ordnungsgemäßer Buchführung verpflichtet ist.',
      'Wie der Verein reagiert, wenn ich einen beliebten Langgedienten anzeige.',
      'Ob mir die Sache ein Vereinsamt einbringt, das ich nicht will.',
      'Ob ich mir den Ärger ersparen kann, indem ich austrete.',
    ],
    explanation: 'Der Schaden für alle Mitglieder wiegt am schwersten, dahinter die Rechtspflicht des Vereins. Die Stimmung im Verein, eigene Ämter und der Austritt als Ausweg stehen hinten.',
  },
  {
    id: 'sd-19',
    situation: 'Deine beste Freundin will nach einer Feier mit dem Auto nach Hause fahren. Sie hat mehrere Gläser getrunken, fühlt sich aber nach eigener Aussage völlig fahrtüchtig und wird ärgerlich, als du sie darauf ansprichst.',
    statements: [
      'Dass sie sich und andere Verkehrsteilnehmer in Lebensgefahr bringt.',
      'Dass Fahren in diesem Zustand verboten ist und ich nicht dabei helfen darf.',
      'Wie unsere Freundschaft aussieht, wenn ich ihr den Schlüssel abnehme.',
      'Ob ich für ein Taxi mitbezahlen müsste.',
      'Ob ich mir den Streit ersparen kann, indem ich nichts weiter sage.',
    ],
    explanation: 'Lebensgefahr für sie und für Dritte steht unangefochten zuerst, dann das Verbot. Die Freundschaft, die Kosten und der vermiedene Streit sind hier nachrangig, so unangenehm die Szene auch wird.',
  },
  {
    id: 'sd-20',
    situation: 'In deinem Nebenjob sollst du Kundinnen und Kunden am Telefon einen Zusatzvertrag verkaufen. Dir fällt auf, dass die vorgegebene Gesprächsvorlage die jährlichen Kosten nicht nennt, solange niemand danach fragt.',
    statements: [
      'Dass Kunden eine Entscheidung treffen sollen, deren Kosten sie kennen.',
      'Dass die Vorlage gegen Informationspflichten verstoßen könnte.',
      'Wie ich im Team dastehe, wenn ich als Einzige von der Vorlage abweiche.',
      'Ob mir dadurch die Verkaufsprämie entgeht.',
      'Ob ich auffalle, wenn ich einfach anders telefoniere als vorgegeben.',
    ],
    explanation: 'Die informierte Entscheidung der Kunden steht obenan, dann die rechtliche Frage. Stand im Team, entgangene Prämie und die Sorge aufzufallen folgen.',
  },
  {
    id: 'sd-21',
    situation: 'Ein neuer Kollege, der die Sprache noch nicht gut spricht, wird von zwei anderen im Team regelmäßig nachgeäfft, wenn er nicht dabei ist. Beim gemeinsamen Mittagessen fangen sie wieder damit an.',
    statements: [
      'Dass der Kollege herabgewürdigt wird, auch wenn er es nicht hört.',
      'Dass ein Team dafür verantwortlich ist, wie es miteinander umgeht.',
      'Wie ich dastehe, wenn ich den beiden vor allen widerspreche.',
      'Ob ich künftig vom Mittagessen ausgeschlossen werde.',
      'Ob es einfacher ist, mitzulachen und das Thema vorbeigehen zu lassen.',
    ],
    explanation: 'Die Würde des Abwesenden zuerst, dann die gemeinsame Verantwortung fürs Klima. Eigenes Ansehen, drohender Ausschluss und Mitlachen als bequemster Weg folgen.',
  },
  {
    id: 'sd-22',
    situation: 'Du hast dich um ein Stipendium beworben und erfährst, dass ein Freund aus deinem Jahrgang, dessen Familie in erheblichen finanziellen Schwierigkeiten steckt, dasselbe Stipendium beantragt hat. Es wird nur eines vergeben.',
    statements: [
      'Dass beide Bewerbungen nach denselben Maßstäben beurteilt werden sollen.',
      'Dass die Auswahl bei der Kommission liegt und nicht bei mir.',
      'Wie unsere Freundschaft aussieht, wenn ich den Platz bekomme.',
      'Wie sehr ich das Geld selbst brauche.',
      'Ob ich mir die Unannehmlichkeit erspare, indem ich zurückziehe.',
    ],
    explanation: 'Hier ist die faire, gleiche Beurteilung der Kern – ein Rückzug aus Mitleid unterläuft sie. Die Zuständigkeit der Kommission entlastet zu Recht. Freundschaft, eigener Bedarf und Ausweichen sind nachgeordnet.',
  },
  {
    id: 'sd-23',
    situation: 'Beim Nachhauseweg hörst du aus der Nachbarwohnung lautes Schreien, das Poltern von Möbeln und danach das Weinen eines Kindes. Es ist nicht das erste Mal in diesem Monat.',
    statements: [
      'Ob ein Kind in der Wohnung gerade konkret gefährdet ist.',
      'Ob ich verpflichtet bin, bei einem solchen Verdacht Hilfe zu holen.',
      'Wie das nachbarschaftliche Verhältnis aussieht, wenn ich die Polizei rufe.',
      'Ob ich als Zeugin später Aussagen machen muss.',
      'Ob ich mich einfach täusche und mir den Aufwand sparen kann.',
    ],
    explanation: 'Die mögliche Gefahr für das Kind steht zuerst, dann die Pflicht, bei diesem Verdacht zu handeln. Nachbarschaft, spätere Umstände als Zeugin und der Wunsch, sich getäuscht zu haben, folgen.',
  },
  {
    id: 'sd-24',
    situation: 'Eine Kommilitonin bittet dich am Tag vor der Abgabe um deine Mitschriften, weil sie wegen der Pflege ihres kranken Vaters wochenlang gefehlt hat. Du brauchst die Unterlagen selbst noch zum Lernen.',
    statements: [
      'Dass sie ohne eigenes Verschulden in eine schwierige Lage geraten ist.',
      'Dass gegenseitige Hilfe unter Studierenden erwartbar ist und niemandem schadet.',
      'Wie es im Jahrgang ankommt, wenn ich ablehne.',
      'Ob ich ohne die Unterlagen selbst schlechter abschneide.',
      'Ob mir das Kopieren zu viel Aufwand ist.',
    ],
    explanation: 'Ihre unverschuldete Lage zuerst, dann die naheliegende Hilfe, die niemandem schadet – das lässt sich fast immer so lösen, dass beide die Unterlagen haben. Ansehen im Jahrgang, eigener Nachteil und Aufwand folgen.',
  },
];

export default TASKS;
