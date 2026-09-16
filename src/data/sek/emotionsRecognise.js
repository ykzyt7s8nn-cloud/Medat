/**
 * SEK – Emotionen erkennen.
 *
 * Format nach den offiziellen Vorgaben: 14 Aufgaben in 21 Minuten. Jede
 * Aufgabe beschreibt in wenigen Sätzen eine soziale Situation. Dazu stehen
 * fünf Emotionen, und für jede ist zu entscheiden, ob die beschriebene Person
 * sie in dieser Lage eher wahrscheinlich oder eher unwahrscheinlich empfindet.
 *
 * Gewertet wird nach dem Alles-oder-nichts-Prinzip: Einen Punkt gibt es nur,
 * wenn alle fünf Einschätzungen einer Aufgabe stimmen.
 *
 * Zum Lösen hilft weniger die eigene Erfahrung als die Frage, worauf sich eine
 * Emotion richtet: Scham auf das eigene Ansehen vor anderen, Schuld auf die
 * eigene Tat, Ärger auf ein Hindernis von außen, Neid auf den Besitz eines
 * anderen, Enttäuschung auf eine gebrochene Erwartung. Passt die Situation
 * nicht zu diesem Bezugspunkt, ist die Emotion unwahrscheinlich – auch wenn
 * sie gefühlsmäßig „irgendwie“ dazugehören könnte.
 *
 * Wahrscheinlich heißt nicht ausschließlich: Mehrere Emotionen können
 * gleichzeitig zutreffen, auch gegenläufige.
 *
 * Diese Aufgaben sind selbst geschrieben, keine Originalaufgaben.
 */

export const TASKS = [
  {
    id: 'ee-1',
    situation: 'Clara hat ihrem Bruder zugesagt, ihn vom Bahnhof abzuholen, und den Termin verschlafen. Als sie aufwacht, steht er bereits seit vierzig Minuten in der Kälte und hat dreimal angerufen.',
    emotions: [
      { emotion: 'Schuldgefühl', likely: true, why: 'Sie hat durch ihr eigenes Versäumnis jemandem geschadet – der klassische Anlass für Schuld.' },
      { emotion: 'Ärger über sich selbst', likely: true, why: 'Der eigene Fehler ist vermeidbar gewesen; Ärger richtet sich hier nach innen.' },
      { emotion: 'Erleichterung', likely: false, why: 'Es ist nichts abgewendet worden, was Erleichterung auslösen könnte.' },
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
      { emotion: 'Scham', likely: false, why: 'Ihr Ansehen steht nicht in Frage; niemand wirft ihr etwas vor.' },
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
      { emotion: 'Verachtung', likely: false, why: 'Verachtung richtet sich auf eine andere Person – hier ist niemand beteiligt.' },
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
      { emotion: 'Scham', likely: true, why: 'Sie hat den Rückzug begründet, und nun steht sie vor der Gruppe schlechter da.' },
      { emotion: 'Stolz', likely: false, why: 'Es gibt keine gelungene Leistung, auf die sich Stolz beziehen könnte.' },
      { emotion: 'Mitgefühl', likely: false, why: 'Mitgefühl richtet sich auf das Leid anderer – den anderen geht es gut.' },
    ],
  },
  {
    id: 'ee-13',
    situation: 'Herr Weiß wartet seit zwei Stunden in der Notaufnahme. Vor ihm werden mehrere Patienten vorgezogen, die nach ihm gekommen sind. Niemand erklärt ihm, warum.',
    emotions: [
      { emotion: 'Ärger', likely: true, why: 'Ein Hindernis von außen hält ihn auf, ohne dass er etwas tun kann.' },
      { emotion: 'Unsicherheit', likely: true, why: 'Ohne Erklärung bleibt offen, wie ernst sein eigener Fall genommen wird.' },
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
      { emotion: 'Unsicherheit', likely: true, why: 'Der Wert der Freundschaft steht plötzlich in Frage.' },
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
      { emotion: 'Bedauern', likely: true, why: 'Ein gewünschter Ausgang ist durch eigenes Zutun verloren.' },
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
      { emotion: 'Scham', likely: false, why: 'Sein eigenes Ansehen steht nicht zur Debatte.' },
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
      { emotion: 'Schuldgefühl', likely: false, why: 'Sie hat niemandem geschadet.' },
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
      { emotion: 'Eifersucht', likely: false, why: 'Niemand macht ihm eine Zuwendung streitig.' },
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
];

export default TASKS;
