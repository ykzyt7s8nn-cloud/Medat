/**
 * SEK – Emotionen erkennen.
 *
 * Format nach den offiziellen Vorgaben: 14 Aufgaben in 21 Minuten. Jede
 * Aufgabe beschreibt in wenigen Sätzen eine Person und eine soziale Situation.
 * Dazu stehen fünf Emotionen, und für jede ist zu entscheiden, ob die
 * beschriebene Person sie in dieser Lage eher wahrscheinlich oder eher
 * unwahrscheinlich empfindet.
 *
 * Gewertet wird nach dem Alles-oder-nichts-Prinzip: Einen Punkt gibt es nur,
 * wenn alle fünf Einschätzungen einer Aufgabe stimmen.
 *
 * Das Muster, das Vorbereitungsanbieter und Erfahrungsberichte übereinstimmend
 * beschreiben und dem der Schlüssel hier folgt:
 *
 *   - Nur der Text zählt. Gefragt ist nicht, was man selbst fühlen würde,
 *     sondern was aus der Beschreibung folgt. Was nicht dasteht – eine
 *     Vorgeschichte, eine verborgene Absicht –, wird nicht hineingelesen.
 *   - Die Person zählt mit. Heißt es, sie sei gelassen, ehrgeizig oder seit
 *     Jahren routiniert, kann das ein naheliegendes Gefühl unwahrscheinlich
 *     machen (Lampenfieber bei der Kabarettistin) oder ein anderes erst
 *     wahrscheinlich (Neid bei der, die sich ständig vergleicht).
 *   - Gefühle sind über ihren Bezugspunkt bestimmt, und Verwechslungen an
 *     dieser Stelle sind der häufigste Fehler: Scham richtet sich auf das
 *     eigene Ansehen vor anderen, Schuld auf die eigene Tat, Ärger auf ein
 *     Hindernis, Empörung auf die Regelverletzung eines anderen, Neid auf den
 *     Besitz eines anderen, Eifersucht auf eine Zuwendung, die ein Dritter
 *     bekommt, Enttäuschung auf eine gebrochene Erwartung, Genugtuung auf
 *     eine ausgeglichene Zurücksetzung. Passt die Situation nicht zum
 *     Bezugspunkt, ist das Gefühl unwahrscheinlich.
 *   - Mehrere Gefühle können gleichzeitig zutreffen, auch gegenläufige
 *     (Erleichterung und Schuld, Stolz und Wehmut).
 *   - Wie viele zutreffen, ist von Aufgabe zu Aufgabe verschieden. Deshalb
 *     ist der Bestand hier bewusst gemischt: mal eines, mal zwei, drei oder
 *     vier von fünf. Eine feste Zahl wäre ein Muster, das man statt der
 *     Gefühle lernen würde – der Selbsttest wacht darüber.
 *
 * Quellen für das Muster: die offizielle Beschreibung des Untertests
 * (medizinstudieren.at, „Testinhalte Humanmedizin“) und die Hinweise der
 * Vorbereitungsanbieter (u. a. MedGurus, medat-vorbereitung.at, Mission
 * MedAT, studymed). Übernommen ist nur das Muster.
 *
 * Diese Aufgaben sind selbst geschrieben, keine Originalaufgaben.
 */

export const TASKS = [
  {
    id: 'ee-1',
    situation: 'Clara hat ihrem Bruder zugesagt, ihn vom Bahnhof abzuholen, und den Termin verschlafen. Als sie aufwacht, steht er bereits seit vierzig Minuten in der Kälte und hat dreimal angerufen.',
    emotions: [
      { emotion: 'Schuldgefühl', likely: true, why: 'Sie hat durch ihr eigenes Versäumnis jemandem geschadet – der klassische Anlass für Schuld.' },
      { emotion: 'Empörung', likely: false, why: 'Empörung richtet sich gegen die Regelverletzung eines anderen – hier liegt der Fehler bei Clara selbst.' },
      { emotion: 'Verlegenheit', likely: true, why: 'Sie muss ihrem Bruder gleich gegenübertreten und das Versäumnis eingestehen.' },
      { emotion: 'Stolz', likely: false, why: 'Stolz setzt eine eigene Leistung voraus, hier liegt das Gegenteil vor.' },
      { emotion: 'Neid', likely: false, why: 'Neid richtet sich auf den Besitz oder das Glück eines anderen – davon ist keine Rede.' },
    ],
  },
  {
    id: 'ee-2',
    situation: 'Tim erfährt, dass ein Kommilitone, mit dem er sich gemeinsam beworben hat, den begehrten Praktikumsplatz bekommen hat. Tim hat eine Absage erhalten. Am Abend treffen sich beide auf einer Feier.',
    emotions: [
      { emotion: 'Enttäuschung', likely: true, why: 'Eine konkrete Erwartung hat sich nicht erfüllt.' },
      { emotion: 'Neid', likely: true, why: 'Der andere hat genau das bekommen, was Tim wollte – der typische Anlass für Neid.' },
      { emotion: 'Verlegenheit', likely: true, why: 'Beim Zusammentreffen muss Tim sich zu seiner Absage verhalten; das ist unangenehm.' },
      { emotion: 'Dankbarkeit', likely: false, why: 'Niemand hat Tim etwas Gutes getan, worauf Dankbarkeit sich beziehen könnte.' },
      { emotion: 'Langeweile', likely: false, why: 'Die Situation ist für Tim alles andere als ereignislos.' },
    ],
  },
  {
    id: 'ee-3',
    situation: 'Nach einer langen Suche findet Frau Berger ihren entlaufenen Hund am Abend unverletzt bei einer Nachbarin, die ihn aufgenommen und gefüttert hat.',
    emotions: [
      { emotion: 'Erleichterung', likely: true, why: 'Eine befürchtete Gefahr ist abgewendet – der Kern von Erleichterung.' },
      { emotion: 'Dankbarkeit', likely: true, why: 'Die Nachbarin hat aus freien Stücken geholfen.' },
      { emotion: 'Rührung', likely: true, why: 'Unerwartete Hilfsbereitschaft nach einem belastenden Tag berührt.' },
      { emotion: 'Empörung', likely: false, why: 'Es ist keine Norm verletzt worden, über die sich Frau Berger empören könnte.' },
      { emotion: 'Freude', likely: true, why: 'Was sie sich den ganzen Tag gewünscht hat, ist eingetreten.' },
    ],
  },
  {
    id: 'ee-4',
    situation: 'Jakob hält vor dreißig Zuhörern einen Vortrag. Mitten im Satz fällt ihm auf, dass er zwei Folien verwechselt hat und seit einer Minute etwas erklärt, das nicht zum Bild passt. Aus der ersten Reihe wird getuschelt.',
    emotions: [
      { emotion: 'Scham', likely: true, why: 'Der Fehler ist öffentlich geworden; Scham bezieht sich genau auf das Ansehen vor anderen.' },
      { emotion: 'Verunsicherung', likely: true, why: 'Der Faden ist gerissen, und die Reaktion aus dem Publikum verstärkt den Zweifel.' },
      { emotion: 'Ärger über sich selbst', likely: true, why: 'Die Verwechslung war vermeidbar und ist ihm selbst zuzuschreiben.' },
      { emotion: 'Genugtuung', likely: false, why: 'Genugtuung setzt voraus, dass etwas zu Recht ausgeglichen wurde – davon ist nichts zu sehen.' },
      { emotion: 'Gelassenheit', likely: false, why: 'Vor Publikum den Faden zu verlieren und getuschelt zu hören, ist das Gegenteil eines gelassenen Moments.' },
    ],
  },
  {
    id: 'ee-5',
    situation: 'Marlene hat ihre Doktorarbeit nach vier Jahren abgegeben. Am Abend sitzt sie allein in ihrer Wohnung. Der Schreibtisch, an dem sie so lange gearbeitet hat, ist zum ersten Mal leer.',
    emotions: [
      { emotion: 'Stolz', likely: true, why: 'Eine lange, aus eigener Kraft erbrachte Leistung ist abgeschlossen.' },
      { emotion: 'Erleichterung', likely: true, why: 'Eine jahrelange Belastung fällt weg.' },
      { emotion: 'Wehmut', likely: true, why: 'Ein Lebensabschnitt endet; der leere Schreibtisch macht das sichtbar.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Sie hat niemandem geschadet und nichts versäumt.' },
      { emotion: 'Leere', likely: true, why: 'Was vier Jahre lang den Alltag bestimmt hat, fällt mit einem Schlag weg – der leere Schreibtisch steht dafür.' },
    ],
  },
  {
    id: 'ee-6',
    situation: 'In der Straßenbahn beobachtet Herr Falk, wie ein Mann einer älteren Frau den letzten freien Sitzplatz wegnimmt und sich lachend hinsetzt, obwohl sie sichtbar am Stock geht.',
    emotions: [
      { emotion: 'Empörung', likely: true, why: 'Eine allgemein anerkannte Regel des Anstands wird offen verletzt.' },
      { emotion: 'Mitgefühl', likely: true, why: 'Die Lage der älteren Frau ist unmittelbar nachvollziehbar.' },
      { emotion: 'Verachtung', likely: true, why: 'Das lachende Verhalten lädt dazu ein, den Mann selbst geringzuschätzen.' },
      { emotion: 'Erleichterung', likely: false, why: 'Es ist keine Gefahr abgewendet worden.' },
      { emotion: 'Dankbarkeit', likely: false, why: 'Niemand hat Herrn Falk oder der Frau etwas Gutes getan.' },
    ],
  },
  {
    id: 'ee-7',
    situation: 'Lisa hat ihrer besten Freundin im Vertrauen von ihrer Bewerbung erzählt. Auf einer Geburtstagsfeier spricht eine Bekannte sie darauf an – die Freundin hat es weitererzählt.',
    emotions: [
      { emotion: 'Kränkung', likely: true, why: 'Das Vertrauen ist von der Person verletzt worden, der sie es ausdrücklich geschenkt hatte.' },
      { emotion: 'Ärger', likely: true, why: 'Die Freundin hat etwas getan, was Lisa nicht wollte – ein Hindernis von außen.' },
      { emotion: 'Verlegenheit', likely: true, why: 'Lisa wird vor anderen auf etwas angesprochen, das privat bleiben sollte.' },
      { emotion: 'Stolz', likely: false, why: 'Es ist nichts geleistet worden, worauf sie stolz sein könnte.' },
      { emotion: 'Zuversicht', likely: false, why: 'Der Vorfall gibt keinen Anlass, den Ausgang der Bewerbung günstiger zu sehen.' },
    ],
  },
  {
    id: 'ee-8',
    situation: 'Amir hat im Praktikum zum ersten Mal selbstständig eine Blutabnahme durchgeführt. Sie hat auf Anhieb geklappt, und die Patientin hat sich bei ihm bedankt. Die Stationsärztin hat es beobachtet und genickt.',
    emotions: [
      { emotion: 'Stolz', likely: true, why: 'Eine eigene Leistung ist gelungen und wurde gesehen.' },
      { emotion: 'Erleichterung', likely: true, why: 'Die befürchtete Panne ist ausgeblieben.' },
      { emotion: 'Zuversicht', likely: true, why: 'Der erste Erfolg lässt die nächsten Male leichter erscheinen.' },
      { emotion: 'Scham', likely: false, why: 'Es ist nichts Peinliches passiert; das Gegenteil ist der Fall.' },
      { emotion: 'Eifersucht', likely: false, why: 'Eifersucht setzt voraus, dass ihm jemand eine Zuwendung streitig macht – davon ist keine Rede.' },
    ],
  },
  {
    id: 'ee-9',
    situation: 'Frau Kaiser hat ein Jahr lang auf eine Beförderung hingearbeitet. Ihr Vorgesetzter teilt ihr mit, die Stelle sei extern besetzt worden, weil ihr „die Erfahrung noch fehle“ – Argumente, die er vor einem Jahr nicht erwähnt hatte.',
    emotions: [
      { emotion: 'Enttäuschung', likely: true, why: 'Eine über ein Jahr aufgebaute Erwartung wird nicht erfüllt.' },
      { emotion: 'Ärger', likely: true, why: 'Die nachgeschobene Begründung wirkt wie eine Verschiebung der Maßstäbe.' },
      { emotion: 'Kränkung', likely: true, why: 'Die Begründung spricht ihr persönlich die Eignung ab.' },
      { emotion: 'Rührung', likely: false, why: 'Es geschieht nichts Berührendes.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Sie hat niemandem geschadet – die Entscheidung lag bei ihrem Vorgesetzten.' },
    ],
  },
  {
    id: 'ee-10',
    situation: 'Beim Aufräumen findet Nele einen alten Brief ihrer verstorbenen Großmutter, in dem diese ihr zum bestandenen Abitur gratuliert und schreibt, wie sehr sie sich auf das Studium ihrer Enkelin freue.',
    emotions: [
      { emotion: 'Rührung', likely: true, why: 'Eine unerwartete, persönliche Zuwendung aus der Vergangenheit berührt unmittelbar.' },
      { emotion: 'Trauer', likely: true, why: 'Der Brief macht den Verlust gegenwärtig.' },
      { emotion: 'Dankbarkeit', likely: true, why: 'Die Zuneigung der Großmutter wird noch einmal spürbar.' },
      { emotion: 'Empörung', likely: false, why: 'Niemand hat eine Regel verletzt.' },
      { emotion: 'Neid', likely: false, why: 'Es gibt niemanden, dessen Besitz oder Glück Nele begehren könnte.' },
    ],
  },
  {
    id: 'ee-11',
    situation: 'Ein Kollege stellt in der Teamsitzung eine Idee als seine eigene vor, die Paul ihm zwei Tage zuvor im Gespräch erzählt hatte. Die Abteilungsleiterin lobt ihn ausdrücklich dafür.',
    emotions: [
      { emotion: 'Ärger', likely: true, why: 'Ein anderer hat sich etwas angeeignet, das Paul zusteht.' },
      { emotion: 'Empörung', likely: true, why: 'Die Aneignung fremder Ideen verletzt eine klare Fairness-Regel.' },
      { emotion: 'Unsicherheit', likely: true, why: 'Paul steht vor der Frage, ob und wie er das vor dem Team ansprechen kann.' },
      { emotion: 'Dankbarkeit', likely: false, why: 'Es ist ihm nichts Gutes widerfahren.' },
      { emotion: 'Gelassenheit', likely: false, why: 'Vor dem gesamten Team um die Anerkennung gebracht zu werden, lässt kaum jemanden unberührt.' },
    ],
  },
  {
    id: 'ee-12',
    situation: 'Sonja hat sich in der Prüfungsvorbereitung von ihrer Lerngruppe zurückgezogen, weil ihr das Tempo zu langsam war. Beim Ergebnis zeigt sich, dass alle anderen deutlich besser abgeschnitten haben als sie.',
    emotions: [
      { emotion: 'Enttäuschung', likely: true, why: 'Ihre Erwartung an das eigene Ergebnis ist nicht aufgegangen.' },
      { emotion: 'Reue', likely: true, why: 'Die eigene Entscheidung, sich zurückzuziehen, erscheint im Rückblick falsch.' },
      { emotion: 'Ärger auf die Gruppe', likely: false, why: 'Die Gruppe hat ihr nichts getan; die Entscheidung, sich zurückzuziehen, war ihre eigene.' },
      { emotion: 'Stolz', likely: false, why: 'Es gibt keine gelungene Leistung, auf die sich Stolz beziehen könnte.' },
      { emotion: 'Mitgefühl', likely: false, why: 'Mitgefühl richtet sich auf das Leid anderer – den anderen geht es gut.' },
    ],
  },
  {
    id: 'ee-13',
    situation: 'Herr Weiß wartet seit zwei Stunden in der Notaufnahme. Vor ihm werden mehrere Patienten vorgezogen, die nach ihm gekommen sind. Niemand erklärt ihm, warum.',
    emotions: [
      { emotion: 'Ärger', likely: true, why: 'Ein Hindernis von außen hält ihn auf, ohne dass er etwas tun kann.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Er hat niemandem geschadet; die Wartezeit hat er nicht verursacht.' },
      { emotion: 'Ungeduld', likely: true, why: 'Die Wartezeit dehnt sich ohne absehbares Ende.' },
      { emotion: 'Stolz', likely: false, why: 'Es liegt keine eigene Leistung vor.' },
      { emotion: 'Dankbarkeit', likely: false, why: 'Bisher ist ihm nichts Gutes getan worden.' },
    ],
  },
  {
    id: 'ee-14',
    situation: 'Mia hat ihrem Mitbewohner vorgeworfen, ihr Ladekabel genommen zu haben. Am Abend findet sie es in ihrer eigenen Jackentasche. Der Mitbewohner sitzt in der Küche.',
    emotions: [
      { emotion: 'Schuldgefühl', likely: true, why: 'Sie hat jemandem zu Unrecht etwas unterstellt.' },
      { emotion: 'Verlegenheit', likely: true, why: 'Sie muss dem Mitbewohner nun gegenübertreten und den Vorwurf zurücknehmen.' },
      { emotion: 'Erleichterung', likely: true, why: 'Das Kabel ist wieder da – der ursprüngliche Verlust ist behoben.' },
      { emotion: 'Empörung', likely: false, why: 'Es gibt keine Regelverletzung mehr, über die sie sich empören könnte.' },
      { emotion: 'Neid', likely: false, why: 'Der Mitbewohner besitzt nichts, was Mia haben möchte.' },
    ],
  },
  {
    id: 'ee-15',
    situation: 'Elena hat ihrem Team monatelang beim Projekt geholfen, ohne dafür genannt zu werden. Bei der Abschlusspräsentation dankt die Projektleiterin ihr ausdrücklich und vor allen für ihren Einsatz.',
    emotions: [
      { emotion: 'Freude', likely: true, why: 'Etwas Erwünschtes ist eingetreten.' },
      { emotion: 'Stolz', likely: true, why: 'Die eigene Leistung wird öffentlich anerkannt.' },
      { emotion: 'Genugtuung', likely: true, why: 'Die lange fehlende Anerkennung wird nachgeholt – genau der Anlass für Genugtuung.' },
      { emotion: 'Scham', likely: false, why: 'Es gibt nichts, was ihr Ansehen beschädigen würde.' },
      { emotion: 'Angst', likely: false, why: 'Es droht keine Gefahr.' },
    ],
  },
  {
    id: 'ee-16',
    situation: 'Fabian erfährt, dass sein bester Freund seit einem halben Jahr fast jedes Wochenende mit einer neuen Clique verbringt und ihm davon nie erzählt hat. Er hört es zufällig von Dritten.',
    emotions: [
      { emotion: 'Kränkung', likely: true, why: 'Der Freund hat ihn aus einem Teil seines Lebens herausgehalten.' },
      { emotion: 'Eifersucht', likely: true, why: 'Eine andere Gruppe bekommt die Zuwendung, die bisher ihm galt – der Kern von Eifersucht.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Nichts im Text deutet darauf hin, dass Fabian den Rückzug verursacht hat – das hineinzulesen hieße, über den Text hinaus zu deuten.' },
      { emotion: 'Erleichterung', likely: false, why: 'Es ist nichts Befürchtetes abgewendet worden.' },
      { emotion: 'Stolz', likely: false, why: 'Es liegt keine eigene Leistung vor.' },
    ],
  },
  {
    id: 'ee-17',
    situation: 'Frau Sander hat einem Bewerber zugesagt, sich bis Freitag zu melden. Sie vergisst es und ruft erst am Montag an. Der Bewerber sagt am Telefon höflich, er habe inzwischen zugesagt anderswo.',
    emotions: [
      { emotion: 'Schuldgefühl', likely: true, why: 'Ihr Versäumnis hat dem Bewerber geschadet.' },
      { emotion: 'Ärger über sich selbst', likely: true, why: 'Der Fehler war vermeidbar und liegt allein bei ihr.' },
      { emotion: 'Kränkung', likely: false, why: 'Der Bewerber bleibt höflich und hat nur die Folgen ihres Versäumnisses gezogen; persönlich herabgesetzt wird sie nicht.' },
      { emotion: 'Verachtung', likely: false, why: 'Der Bewerber hat sich korrekt verhalten; es gibt niemanden geringzuschätzen.' },
      { emotion: 'Langeweile', likely: false, why: 'Die Situation ist für sie unangenehm, nicht ereignislos.' },
    ],
  },
  {
    id: 'ee-18',
    situation: 'Nach einem schweren Streit mit ihrer Mutter, bei dem beide Dinge gesagt haben, die sie nicht meinten, steht Ida abends vor deren Wohnungstür. Die Mutter öffnet und umarmt sie wortlos.',
    emotions: [
      { emotion: 'Erleichterung', likely: true, why: 'Die befürchtete Zurückweisung bleibt aus.' },
      { emotion: 'Rührung', likely: true, why: 'Die wortlose Geste kommt unerwartet und trifft.' },
      { emotion: 'Reue', likely: true, why: 'Die Umarmung macht bewusst, was im Streit gesagt wurde.' },
      { emotion: 'Empörung', likely: false, why: 'In diesem Moment wird keine Regel verletzt.' },
      { emotion: 'Neid', likely: false, why: 'Es geht um niemandes Besitz oder Glück.' },
    ],
  },
  {
    id: 'ee-19',
    situation: 'Robert hat in der Klausur bemerkt, dass sein Sitznachbar von ihm abgeschrieben hat. Der Nachbar hat eine bessere Note bekommen als er. Robert hat nichts gesagt.',
    emotions: [
      { emotion: 'Ärger', likely: true, why: 'Ein anderer hat sich einen Vorteil verschafft, der ihm nicht zusteht.' },
      { emotion: 'Empörung', likely: true, why: 'Es ist eine klare Regel gebrochen worden.' },
      { emotion: 'Unzufriedenheit mit sich selbst', likely: true, why: 'Er hat geschwiegen, obwohl ihn das Verhalten stört – ein Widerspruch zum eigenen Maßstab.' },
      { emotion: 'Dankbarkeit', likely: false, why: 'Niemand hat ihm etwas Gutes getan.' },
      { emotion: 'Stolz', likely: false, why: 'Es gibt keine eigene Leistung, auf die Stolz sich richten könnte.' },
    ],
  },
  {
    id: 'ee-20',
    situation: 'Herr Lindner hat einem Freund tausend Euro geliehen. Nach acht Monaten ohne Rückzahlung sieht er auf Fotos, dass der Freund gerade aus dem Urlaub zurückgekommen ist.',
    emotions: [
      { emotion: 'Ärger', likely: true, why: 'Das eigene Geld wird offenkundig anders eingesetzt als vereinbart.' },
      { emotion: 'Enttäuschung', likely: true, why: 'Die Erwartung an einen Freund ist nicht erfüllt worden.' },
      { emotion: 'Empörung', likely: true, why: 'Die Reihenfolge – Urlaub vor Rückzahlung – verletzt eine Fairness-Regel.' },
      { emotion: 'Kränkung', likely: true, why: 'Der Freund behandelt die Schuld bei ihm offenbar als nachrangig – das trifft auch persönlich.' },
      { emotion: 'Zuversicht', likely: false, why: 'Der Anblick gibt keinen Grund, mit einer baldigen Rückzahlung zu rechnen.' },
    ],
  },
  {
    id: 'ee-21',
    situation: 'Zoe hat ihre erste Wohnung bezogen. Am ersten Abend sitzt sie zwischen halb ausgepackten Kisten, es ist still, und die Eltern sind zweihundert Kilometer entfernt.',
    emotions: [
      { emotion: 'Vorfreude', likely: true, why: 'Ein neuer Lebensabschnitt beginnt, den sie selbst gewählt hat.' },
      { emotion: 'Stolz', likely: true, why: 'Die erste eigene Wohnung ist ein selbst erreichter Schritt.' },
      { emotion: 'Einsamkeit', likely: true, why: 'Stille und die Entfernung zu den Eltern machen das Alleinsein spürbar.' },
      { emotion: 'Verachtung', likely: false, why: 'Es gibt keine Person, der Geringschätzung gelten könnte.' },
      { emotion: 'Unsicherheit', likely: true, why: 'Vieles ist neu und ungewohnt, und niemand ist da, den sie gleich fragen könnte.' },
    ],
  },
  {
    id: 'ee-22',
    situation: 'Ein Arzt teilt Frau Öztürk mit, dass der auffällige Befund nach der zweiten Untersuchung doch harmlos ist. Sie hatte zwei Wochen auf dieses Ergebnis gewartet.',
    emotions: [
      { emotion: 'Erleichterung', likely: true, why: 'Die befürchtete Gefahr ist eindeutig abgewendet.' },
      { emotion: 'Dankbarkeit', likely: true, why: 'Die Klärung verdankt sie der Arbeit des Arztes.' },
      { emotion: 'Erschöpfung', likely: true, why: 'Zwei Wochen Anspannung fordern ihren Preis, der oft erst beim Nachlassen spürbar wird.' },
      { emotion: 'Neid', likely: false, why: 'Es geht um niemandes Besitz oder Glück.' },
      { emotion: 'Empörung', likely: false, why: 'Es ist keine Regel verletzt worden.' },
    ],
  },
  {
    id: 'ee-23',
    situation: 'Leon hat eine Woche lang für die Überraschungsfeier seiner Schwester geplant. Kurz vor dem Termin erzählt ein Verwandter ihr davon. Sie tut am Abend so, als wüsste sie von nichts.',
    emotions: [
      { emotion: 'Ärger', likely: true, why: 'Der Verwandte hat die Planung von außen zunichtegemacht.' },
      { emotion: 'Enttäuschung', likely: true, why: 'Die erhoffte Überraschung findet nicht statt.' },
      { emotion: 'Rührung', likely: true, why: 'Dass die Schwester die Überraschung spielt, ist eine Geste ihm zuliebe.' },
      { emotion: 'Scham', likely: false, why: 'Er hat sich nichts vorzuwerfen, was sein Ansehen beschädigen würde.' },
      { emotion: 'Dankbarkeit', likely: true, why: 'Die Schwester spielt die Überraschung ihm zuliebe mit – eine freiwillige Geste, die ihm gilt.' },
    ],
  },
  {
    id: 'ee-24',
    situation: 'Frau Novak hat ihre Kollegin in einer Besprechung vor allen korrigiert, in einem schärferen Ton als beabsichtigt. Die Kollegin ist danach sehr still geworden und hat den Raum früh verlassen.',
    emotions: [
      { emotion: 'Schuldgefühl', likely: true, why: 'Sie hat durch ihr eigenes Verhalten jemanden verletzt.' },
      { emotion: 'Reue', likely: true, why: 'Der eigene Ton erscheint ihr im Rückblick falsch gewählt.' },
      { emotion: 'Unsicherheit', likely: true, why: 'Wie die Kollegin reagiert und was jetzt zu tun ist, bleibt offen.' },
      { emotion: 'Genugtuung', likely: false, why: 'Es ist nichts zu Recht ausgeglichen worden; der Ton war ausdrücklich nicht beabsichtigt.' },
      { emotion: 'Vorfreude', likely: false, why: 'Es steht nichts Erfreuliches bevor.' },
    ],
  },
  {
    id: 'ee-25',
    situation: 'Herr Haas arbeitet seit dreißig Jahren als Notfallsanitäter und gilt im Team als derjenige, den nichts aus der Ruhe bringt. Bei einem Einsatz wird er zu einem Mann gerufen, der beim Radfahren gestürzt ist und eine stark blutende Platzwunde am Kopf hat. Der Mann ist ansprechbar.',
    emotions: [
      { emotion: 'Konzentration', likely: true, why: 'Die Aufgabe verlangt jetzt seine volle Aufmerksamkeit – und genau darauf ist er eingestellt.' },
      { emotion: 'Panik', likely: false, why: 'Der Text betont seine langjährige Routine und Ruhe; eine Platzwunde bei einem ansprechbaren Patienten ist für ihn Alltag.' },
      { emotion: 'Ekel', likely: false, why: 'Nach dreißig Jahren im Rettungsdienst ist Blut kein Auslöser mehr – die Personenbeschreibung entscheidet hier.' },
      { emotion: 'Hilflosigkeit', likely: false, why: 'Er weiß genau, was zu tun ist, und hat die Mittel dazu.' },
      { emotion: 'Schadenfreude', likely: false, why: 'Nichts deutet darauf hin, dass ihm das Unglück des Mannes recht wäre.' },
    ],
  },
  {
    id: 'ee-26',
    situation: 'Valentina ist sehr ehrgeizig und vergleicht ihre Noten stets mit denen ihrer Kommilitonen. In der Anatomieprüfung erreicht sie 88 von 100 Punkten. Beim Aushang sieht sie, dass ihre Lernpartnerin, mit der sie gemeinsam gelernt hat, 97 Punkte hat.',
    emotions: [
      { emotion: 'Neid', likely: true, why: 'Die Lernpartnerin hat genau das, was Valentina will – und Valentina vergleicht sich ausdrücklich.' },
      { emotion: 'Unzufriedenheit', likely: true, why: 'Gemessen an ihrem eigenen Anspruch reicht ein gutes Ergebnis nicht, wenn eine andere besser ist.' },
      { emotion: 'Erleichterung', likely: false, why: 'Das Bestehen war nie in Gefahr; der Text gibt keinen Anlass zur Sorge davor.' },
      { emotion: 'Scham', likely: false, why: '88 Punkte sind kein Ergebnis, mit dem sie vor anderen schlecht dasteht.' },
      { emotion: 'Mitgefühl', likely: false, why: 'Mitgefühl gilt dem Leid eines anderen – der Lernpartnerin geht es bestens.' },
    ],
  },
  {
    id: 'ee-27',
    situation: 'Nach drei Jahren Fernbeziehung zieht die Freundin von Linus endlich in seine Stadt. Am Tag des Umzugs holt er sie am Bahnhof ab. Er hat die Wohnung am Vorabend extra geputzt und Blumen gekauft.',
    emotions: [
      { emotion: 'Vorfreude', likely: true, why: 'Etwas lang Ersehntes beginnt gerade.' },
      { emotion: 'Freude', likely: true, why: 'Das Warten der Fernbeziehung ist vorbei.' },
      { emotion: 'Aufregung', likely: true, why: 'Ein großer Schritt steht unmittelbar bevor; die Vorbereitungen zeigen, wie viel ihm daran liegt.' },
      { emotion: 'Zärtlichkeit', likely: true, why: 'Die Blumen und das Abholen sind Ausdruck von Zuneigung.' },
      { emotion: 'Groll', likely: false, why: 'Es gibt niemanden, dem er etwas nachträgt.' },
    ],
  },
  {
    id: 'ee-28',
    situation: 'Frau Moser bekommt von ihrer Bank einen Brief: Ihr Konto sei wegen eines Fehlers im System drei Tage lang gesperrt gewesen. Sie hat in diesen Tagen nichts bezahlt und nichts davon bemerkt. Die Bank entschuldigt sich.',
    emotions: [
      { emotion: 'Verwunderung', likely: true, why: 'Sie erfährt nachträglich von etwas, das sie gar nicht bemerkt hat.' },
      { emotion: 'Ärger', likely: false, why: 'Ihr ist kein Nachteil entstanden, und die Bank hat sich entschuldigt – es gibt kein Hindernis, über das sie sich ärgern müsste.' },
      { emotion: 'Angst', likely: false, why: 'Die Sperre ist vorbei und hatte keine Folgen; es droht nichts.' },
      { emotion: 'Dankbarkeit', likely: false, why: 'Die Bank hat ihr nichts Gutes getan, sondern einen eigenen Fehler gemeldet.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Der Fehler lag bei der Bank.' },
    ],
  },
  {
    id: 'ee-29',
    situation: 'Moritz, der sich in Gruppen eher im Hintergrund hält, wird von seinem Chef bei der Weihnachtsfeier ohne Vorwarnung nach vorne gebeten, um vor allen Mitarbeitenden für sein zehnjähriges Firmenjubiläum geehrt zu werden.',
    emotions: [
      { emotion: 'Verlegenheit', likely: true, why: 'Unvermittelt im Mittelpunkt zu stehen, ist für jemanden, der sich im Hintergrund hält, unangenehm.' },
      { emotion: 'Stolz', likely: true, why: 'Zehn Jahre Arbeit werden öffentlich anerkannt.' },
      { emotion: 'Freude', likely: true, why: 'Die Ehrung ist eine erfreuliche Wertschätzung.' },
      { emotion: 'Empörung', likely: false, why: 'Der Chef verletzt keine Regel; er meint es gut.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Moritz hat niemandem geschadet.' },
    ],
  },
  {
    id: 'ee-30',
    situation: 'Katrin hat ihren Hund nach fünfzehn Jahren einschläfern lassen müssen. Eine Woche später kommt sie abends nach Hause, und zum ersten Mal begrüßt sie niemand an der Tür. Die Leine hängt noch am Haken.',
    emotions: [
      { emotion: 'Trauer', likely: true, why: 'Der Verlust wird durch die vertraute Situation spürbar.' },
      { emotion: 'Einsamkeit', likely: true, why: 'Die leere Wohnung macht das Alleinsein bewusst.' },
      { emotion: 'Wut', likely: false, why: 'Niemand hat ihr etwas angetan; das Einschläfern war ein Abschied, kein Unrecht.' },
      { emotion: 'Erleichterung', likely: false, why: 'Der Text gibt keinen Hinweis auf eine Last, die nun weggefallen wäre.' },
      { emotion: 'Neid', likely: false, why: 'Es geht um niemandes Besitz oder Glück.' },
    ],
  },
  {
    id: 'ee-31',
    situation: 'Simone hat ihrem Kollegen versprochen, seine Präsentation durchzusehen, und es dann vergessen. Der Kollege erzählt ihr in der Kaffeeküche begeistert, die Präsentation sei hervorragend angekommen, und bedankt sich trotzdem bei ihr, weil sie „ja angeboten habe zu helfen“.',
    emotions: [
      { emotion: 'Schuldgefühl', likely: true, why: 'Sie hat eine Zusage nicht eingehalten – dass es gut ausging, ändert an ihrem Versäumnis nichts.' },
      { emotion: 'Verlegenheit', likely: true, why: 'Sie wird für eine Hilfe bedankt, die sie nicht geleistet hat.' },
      { emotion: 'Erleichterung', likely: true, why: 'Ihr Versäumnis hat keinen Schaden angerichtet.' },
      { emotion: 'Stolz', likely: false, why: 'Der Erfolg ist nicht ihre Leistung.' },
      { emotion: 'Kränkung', likely: false, why: 'Der Kollege begegnet ihr ausgesprochen freundlich.' },
    ],
  },
  {
    id: 'ee-32',
    situation: 'Herr Petrovic, ein ausgesprochen geduldiger Mensch, steht im Stau, weil vor ihm ein Unfall passiert ist. Er hat keinen Termin, das Radio läuft, und laut Navigationsgerät verzögert sich seine Ankunft zu Hause um eine halbe Stunde.',
    emotions: [
      { emotion: 'Gelassenheit', likely: true, why: 'Er ist als geduldig beschrieben, und es hängt nichts an der Verspätung.' },
      { emotion: 'Wut', likely: false, why: 'Der Stau ist lästig, aber ohne Termin und bei seinem Naturell spricht der Text dagegen.' },
      { emotion: 'Mitgefühl', likely: true, why: 'Vor ihm ist ein Unfall passiert – die Beteiligten sind naheliegender Gegenstand seiner Anteilnahme.' },
      { emotion: 'Panik', likely: false, why: 'Ihm selbst droht keine Gefahr.' },
      { emotion: 'Schadenfreude', likely: false, why: 'Nichts deutet darauf hin, dass ihm das Unglück anderer gefällt.' },
    ],
  },
  {
    id: 'ee-33',
    situation: 'Theresa wird auf der Hochzeit ihrer besten Freundin gebeten, spontan eine Rede zu halten, weil der vorgesehene Trauzeuge krank ist. Theresa tritt seit Jahren als Kabarettistin auf und spricht gern vor Publikum.',
    emotions: [
      { emotion: 'Freude', likely: true, why: 'Sie darf für ihre beste Freundin sprechen und tut das gern.' },
      { emotion: 'Rührung', likely: true, why: 'Die Hochzeit der besten Freundin und die eigene Rede darauf sind ein bewegender Moment.' },
      { emotion: 'Lampenfieber', likely: false, why: 'Sie steht seit Jahren auf der Bühne und spricht gern vor Publikum – die Personenbeschreibung nimmt das naheliegende Gefühl gerade heraus.' },
      { emotion: 'Ärger', likely: false, why: 'Die Bitte ist für sie weder Hindernis noch Zumutung.' },
      { emotion: 'Neid', likely: false, why: 'Nichts im Text deutet an, dass Theresa der Freundin ihr Glück missgönnt.' },
    ],
  },
  {
    id: 'ee-34',
    situation: 'Ein Unbekannter rempelt Jana in der U-Bahn so heftig an, dass ihr Kaffee über ihre Jacke läuft. Er dreht sich um, sieht es und steigt ohne ein Wort an der nächsten Station aus.',
    emotions: [
      { emotion: 'Ärger', likely: true, why: 'Ein anderer hat ihr geschadet und sich nicht darum gekümmert.' },
      { emotion: 'Empörung', likely: true, why: 'Er verletzt offen die Regel, sich zu entschuldigen.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Sie hat nichts falsch gemacht.' },
      { emotion: 'Dankbarkeit', likely: false, why: 'Ihr ist nichts Gutes getan worden.' },
      { emotion: 'Bewunderung', likely: false, why: 'Am Verhalten des Mannes ist nichts, was Anerkennung verdiente.' },
    ],
  },
  {
    id: 'ee-35',
    situation: 'Ein junger Arzt, Dr. Brandl, hat bei einer Patientin eine seltene Erkrankung erkannt, die zuvor zwei Kollegen übersehen hatten. Die Oberärztin bittet ihn, den Fall bei der nächsten Fortbildung vorzustellen.',
    emotions: [
      { emotion: 'Stolz', likely: true, why: 'Eine eigene Leistung ist gelungen, an der andere gescheitert sind.' },
      { emotion: 'Freude', likely: true, why: 'Die Bitte der Oberärztin ist eine Anerkennung.' },
      { emotion: 'Zuversicht', likely: true, why: 'Der Erfolg bestärkt ihn in seinem fachlichen Urteil.' },
      { emotion: 'Genugtuung', likely: false, why: 'Genugtuung setzt eine vorherige Kränkung oder Zurücksetzung voraus, die ausgeglichen wird – davon steht nichts im Text.' },
      { emotion: 'Verachtung', likely: false, why: 'Dass Kollegen eine seltene Erkrankung übersehen, gibt keinen Anlass, sie geringzuschätzen; der Text legt nichts dergleichen nahe.' },
    ],
  },
  {
    id: 'ee-36',
    situation: 'Eva erfährt, dass ihre jüngere Schwester, die als Kind oft krank war und lange als „Sorgenkind“ galt, ihr Studium mit Auszeichnung abgeschlossen hat. Eva hat ihr in schwierigen Phasen oft beim Lernen geholfen.',
    emotions: [
      { emotion: 'Freude', likely: true, why: 'Etwas Gutes ist einer nahestehenden Person widerfahren.' },
      { emotion: 'Stolz', likely: true, why: 'Stolz kann sich auch auf nahestehende Menschen richten – zumal Eva ihren Anteil daran hat.' },
      { emotion: 'Rührung', likely: true, why: 'Der lange Weg vom Sorgenkind zur Auszeichnung berührt.' },
      { emotion: 'Erleichterung', likely: true, why: 'Die jahrelange Sorge um die Schwester findet einen guten Ausgang.' },
      { emotion: 'Neid', likely: false, why: 'Nichts im Text deutet an, dass Eva der Schwester den Erfolg missgönnt.' },
    ],
  },
  {
    id: 'ee-37',
    situation: 'Martin findet beim Wäschewaschen in der Hosentasche einen Lottoschein, den er vor zwei Monaten gekauft und vergessen hat. Bei der Kontrolle stellt sich heraus, dass er vier Richtige hatte – und die Frist zur Einlösung gestern abgelaufen ist.',
    emotions: [
      { emotion: 'Ärger über sich selbst', likely: true, why: 'Der Verlust geht allein auf seine eigene Vergesslichkeit zurück.' },
      { emotion: 'Enttäuschung', likely: true, why: 'Ein schon sicher geglaubter Gewinn geht verloren.' },
      { emotion: 'Bedauern', likely: true, why: 'Ein gewünschter Ausgang war in Reichweite und ist knapp verpasst.' },
      { emotion: 'Freude', likely: false, why: 'Der Gewinn ist verfallen; es bleibt nichts Erfreuliches.' },
      { emotion: 'Empörung', likely: false, why: 'Die Frist ist eine bekannte Regel, die niemand verletzt hat.' },
    ],
  },
  {
    id: 'ee-38',
    situation: 'Philipp hat sich mit einer neuen Bekannten zum ersten Mal zum Abendessen verabredet. Er wartet seit einer Stunde im Restaurant; sie kommt nicht und antwortet auf keine Nachricht.',
    emotions: [
      { emotion: 'Enttäuschung', likely: true, why: 'Eine Erwartung, auf die er sich gefreut hat, erfüllt sich nicht.' },
      { emotion: 'Kränkung', likely: true, why: 'Ohne Absage versetzt zu werden, wirkt wie eine persönliche Zurückweisung.' },
      { emotion: 'Verlegenheit', likely: true, why: 'Er sitzt allein im Restaurant, und das Personal bekommt es mit.' },
      { emotion: 'Erleichterung', likely: false, why: 'Es ist nichts Befürchtetes abgewendet worden.' },
      { emotion: 'Schuldgefühl', likely: false, why: 'Er hat nichts falsch gemacht.' },
    ],
  },
];

export default TASKS;
