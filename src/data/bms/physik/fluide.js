/** Physik – Thema "Fluide" (Hydrostatik und Strömung). */

export const TOPIC = {
  id: 'phy-fluide',
  title: 'Fluide und Strömung',
  summary: 'Schweredruck, Druckeinheiten, Kontinuität, Viskosität, Blutkreislauf',
  entries: [
    {
      id: 'phy-fluide-hydrostatik',
      title: 'Schweredruck und Druckeinheiten',
      text: 'In einer ruhenden Flüssigkeit wächst der Druck mit der Tiefe, weil die darüberliegende Flüssigkeitssäule mit ihrem Gewicht auf jede Schicht drückt; dieser Schweredruck ist das Produkt aus Dichte, Ortsfaktor und Tiefe. In Wasser nimmt er je zehn Meter um rund ein Bar zu, also um hunderttausend Pascal. Der Druck wirkt in einer Flüssigkeit nach allen Seiten gleich und pflanzt sich in einem geschlossenen System unverändert fort – darauf beruht die hydraulische Presse, bei der eine kleine Kraft auf einem kleinen Kolben eine große Kraft auf einem großen Kolben erzeugt. In der Medizin wird der Blutdruck traditionell in Millimeter Quecksilbersäule angegeben; ein Millimeter Quecksilbersäule entspricht rund 133 Pascal. Beim stehenden Menschen addiert sich der hydrostatische Druck der Blutsäule: In den Füßen ist der Gefäßdruck deutlich höher, im Kopf niedriger als auf Herzhöhe, weshalb man den Blutdruck auf Herzhöhe misst.',
      facts: [
        'Schweredruck p = ρ · g · h, unabhängig von der Gefäßform',
        'In Wasser: rund 1 bar zusätzlicher Druck je 10 m Tiefe',
        '1 bar = 100 000 Pa = 1000 hPa; 1 mmHg ≈ 133 Pa',
        'Hydraulik: F1 / A1 = F2 / A2',
        'Blutdruck wird auf Herzhöhe gemessen',
      ],
      formulas: ['p = ρ · g · h', 'F1 / A1 = F2 / A2'],
      related: ['phy-mechanik-druck', 'phy-fluide-stroemung', 'bio-koerper-herz'],
    },
    {
      id: 'phy-fluide-stroemung',
      title: 'Strömung und Kontinuitätsgleichung',
      text: 'Der Volumenstrom gibt an, welches Volumen je Zeit durch einen Querschnitt fließt; er ist das Produkt aus Querschnittsfläche und mittlerer Strömungsgeschwindigkeit. Weil eine Flüssigkeit praktisch nicht zusammendrückbar ist, muss durch jeden Querschnitt eines Rohres in derselben Zeit dasselbe Volumen fließen: An einer Engstelle strömt sie deshalb schneller. Halbiert sich der Durchmesser, sinkt die Fläche auf ein Viertel und die Geschwindigkeit vervierfacht sich. Nach Bernoulli ist dort, wo die Strömung schneller ist, der statische Druck kleiner. Im Kreislauf erklärt die Kontinuitätsgleichung, warum das Blut in den Kapillaren sehr langsam fließt: Jede einzelne ist zwar eng, ihr Gesamtquerschnitt ist aber viele hundert Mal größer als der der Aorta – das verschafft Zeit für den Stoffaustausch. Das Herzzeitvolumen ist das Produkt aus Schlagvolumen und Herzfrequenz und liegt in Ruhe bei etwa fünf Litern je Minute.',
      facts: [
        'Volumenstrom I = V / t = A · v',
        'Kontinuität: A1 · v1 = A2 · v2 – Engstelle bedeutet höhere Geschwindigkeit',
        'Halber Durchmesser: viertel Fläche, vierfache Geschwindigkeit',
        'Bernoulli: schnellere Strömung, kleinerer statischer Druck',
        'Herzzeitvolumen = Schlagvolumen · Herzfrequenz, in Ruhe rund 5 L/min',
      ],
      formulas: ['I = V / t = A · v', 'A1 · v1 = A2 · v2', 'HZV = SV · HF'],
      related: ['phy-fluide-hydrostatik', 'phy-fluide-viskositaet', 'bio-koerper-herz'],
    },
    {
      id: 'phy-fluide-viskositaet',
      title: 'Viskosität und Strömungswiderstand',
      text: 'Die Viskosität ist die innere Reibung einer Flüssigkeit; Honig ist zäher als Wasser, und bei den meisten Flüssigkeiten sinkt die Viskosität mit steigender Temperatur. Bei der laminaren Strömung gleiten Schichten geordnet aneinander vorbei, in der Rohrmitte am schnellsten; wird die Strömung zu schnell oder das Hindernis zu groß, geht sie in die turbulente Strömung mit Wirbeln über, die man etwa als Geräusch über einer verengten Arterie hört. Analog zum Ohmschen Gesetz ist der Strömungswiderstand das Verhältnis von Druckdifferenz und Volumenstrom. Nach dem Gesetz von Hagen und Poiseuille wächst der Volumenstrom durch ein Rohr mit der vierten Potenz des Radius, ist proportional zur Druckdifferenz und umgekehrt proportional zu Länge und Viskosität. Schon eine geringe Gefäßverengung senkt die Durchblutung daher drastisch: Bei halbem Radius fließt nur noch ein Sechzehntel. Ein erhöhter Anteil roter Blutkörperchen macht das Blut zäher und erhöht so den Widerstand.',
      facts: [
        'Viskosität = innere Reibung; bei Flüssigkeiten sinkt sie mit der Temperatur',
        'Strömungswiderstand R = Δp / I, analog zu R = U / I',
        'Hagen-Poiseuille: Volumenstrom proportional zu r⁴',
        'Halber Radius: ein Sechzehntel des Volumenstroms',
        'Widerstand steigt mit Gefäßlänge und Viskosität',
      ],
      formulas: ['R = Δp / I', 'I = π · r⁴ · Δp / (8 · η · l)'],
      mnemonic: 'Radius hoch vier: kleine Engstelle, große Wirkung.',
      related: ['phy-fluide-stroemung', 'phy-elektrik-ohm', 'phy-fluide-hydrostatik'],
    },
  ],
};

export const QUESTIONS = [
  {
    id: 'phy-flu-q1', topicId: 'phy-fluide', entryId: 'phy-fluide-hydrostatik', kind: 'single',
    prompt: 'Wie groß ist der Schweredruck des Wassers in 5 m Tiefe (ρ = 1000 kg/m³, g ≈ 10 m/s²)?',
    options: [
      { text: '50 000 Pa', correct: true, why: 'p = ρ · g · h = 1000 · 10 · 5 = 50 000, also 0,5 bar.' },
      { text: '5000 Pa', correct: false, why: 'Hier wurde der Ortsfaktor g vergessen.' },
      { text: '500 000 Pa', correct: false, why: 'Eine Zehnerpotenz zu viel – das wären 5 bar.' },
      { text: '50 Pa', correct: false, why: 'Hier wurde die Dichte in kg/L statt in kg/m³ eingesetzt.' },
      { text: '2000 Pa', correct: false, why: 'Hier wurde durch die Tiefe geteilt statt mit ihr multipliziert.' },
    ],
    explanation: 'Faustregel: 10 m Wasser entsprechen etwa 1 bar – 5 m also einem halben Bar.',
  },
  {
    id: 'phy-flu-q2', topicId: 'phy-fluide', entryId: 'phy-fluide-hydrostatik', kind: 'single',
    prompt: 'Wie viele Pascal sind 1 bar?',
    options: [
      { text: '100 000 Pa', correct: true, why: '1 bar = 10⁵ Pa.' },
      { text: '1000 Pa', correct: false, why: '1 bar sind 1000 Hektopascal, nicht 1000 Pascal.' },
      { text: '10 000 Pa', correct: false, why: 'Eine Zehnerpotenz zu wenig.' },
      { text: '1 000 000 Pa', correct: false, why: 'Eine Zehnerpotenz zu viel.' },
      { text: '133 Pa', correct: false, why: 'Das entspricht etwa 1 mmHg.' },
    ],
    explanation: 'Der Luftdruck auf Meereshöhe liegt bei rund 1013 hPa, also knapp über 1 bar.',
  },
  {
    id: 'phy-flu-q3', topicId: 'phy-fluide', entryId: 'phy-fluide-hydrostatik', kind: 'single',
    prompt: 'Bei einer hydraulischen Hebebühne drückt man mit 50 N auf einen Kolben von 2 cm². Welche Kraft wirkt auf den großen Kolben von 100 cm²?',
    options: [
      { text: '2500 N', correct: true, why: 'Der Druck ist überall gleich: Das Flächenverhältnis 100 / 2 = 50 vervielfacht die Kraft auf 50 · 50.' },
      { text: '1 N', correct: false, why: 'Hier wurde das Flächenverhältnis umgekehrt angewendet.' },
      { text: '5000 N', correct: false, why: 'Hier wurde mit der großen Fläche statt mit dem Flächenverhältnis multipliziert.' },
      { text: '50 N', correct: false, why: 'Der Druck pflanzt sich unverändert fort, die Kraft wächst aber mit der Fläche.' },
      { text: '25 000 N', correct: false, why: 'Eine Zehnerpotenz zu viel.' },
    ],
    explanation: 'Energie wird dabei nicht gewonnen: Der kleine Kolben muss einen 50-mal längeren Weg zurücklegen.',
  },
  {
    id: 'phy-flu-q4', topicId: 'phy-fluide', entryId: 'phy-fluide-hydrostatik', kind: 'single',
    prompt: 'Warum ist der Blutdruck in den Fußarterien eines stehenden Menschen höher als auf Herzhöhe?',
    options: [
      { text: 'Weil sich der hydrostatische Druck der Blutsäule zwischen Herz und Fuß addiert', correct: true, why: 'Der Schweredruck ρ · g · h wächst mit der Höhe der darüberliegenden Blutsäule.' },
      { text: 'Weil die Gefäße in den Füßen enger sind und eine Engstelle den Druck erhöht', correct: false, why: 'Nach Bernoulli sinkt der statische Druck in einer Engstelle sogar.' },
      { text: 'Weil die Wadenmuskeln das Blut zusätzlich nach unten pressen', correct: false, why: 'Die Muskelpumpe fördert das venöse Blut zum Herzen zurück.' },
      { text: 'Weil das Herz nach unten stärker pumpt', correct: false, why: 'Das Herz pumpt in alle Richtungen mit demselben Druck aus.' },
      { text: 'Weil das Blut in den Füßen dichter ist', correct: false, why: 'Die Dichte des Blutes ist überall praktisch gleich.' },
    ],
    explanation: 'Deshalb wird der Blutdruck auf Herzhöhe gemessen – am hochgehaltenen Arm wäre er zu niedrig.',
  },
  {
    id: 'phy-flu-q5', topicId: 'phy-fluide', entryId: 'phy-fluide-stroemung', kind: 'single',
    prompt: 'Ein Rohr verengt sich auf den halben Durchmesser. Wie ändert sich die Strömungsgeschwindigkeit an der Engstelle?',
    options: [
      { text: 'Sie vervierfacht sich', correct: true, why: 'Die Fläche sinkt mit dem Quadrat des Durchmessers auf ein Viertel; A · v bleibt konstant.' },
      { text: 'Sie verdoppelt sich', correct: false, why: 'Hier wurde der Durchmesser statt der Fläche eingesetzt.' },
      { text: 'Sie halbiert sich', correct: false, why: 'Durch weniger Querschnitt muss dasselbe Volumen schneller fließen.' },
      { text: 'Sie bleibt gleich', correct: false, why: 'Das widerspricht der Kontinuitätsgleichung.' },
      { text: 'Sie versechzehnfacht sich', correct: false, why: 'Die vierte Potenz gehört zu Hagen-Poiseuille, nicht zur Kontinuitätsgleichung.' },
    ],
    explanation: 'A1 · v1 = A2 · v2: Was durch einen Querschnitt hineinfließt, muss auch durch den nächsten hinaus.',
  },
  {
    id: 'phy-flu-q6', topicId: 'phy-fluide', entryId: 'phy-fluide-stroemung', kind: 'single',
    prompt: 'Das Herz wirft je Schlag 70 mL Blut aus und schlägt 60-mal je Minute. Wie groß ist das Herzzeitvolumen?',
    options: [
      { text: '4,2 L/min', correct: true, why: '70 mL · 60 = 4200 mL = 4,2 L je Minute.' },
      { text: '42 L/min', correct: false, why: 'Eine Zehnerpotenz zu viel – Milliliter falsch in Liter umgerechnet.' },
      { text: '0,42 L/min', correct: false, why: 'Eine Zehnerpotenz zu wenig.' },
      { text: 'Etwa 1,2 L/min', correct: false, why: 'Hier wurde 70 durch 60 geteilt statt multipliziert.' },
      { text: '130 mL/min', correct: false, why: 'Hier wurden Schlagvolumen und Frequenz addiert.' },
    ],
    explanation: 'Herzzeitvolumen = Schlagvolumen · Herzfrequenz; in Ruhe sind es rund 5 L je Minute.',
  },
  {
    id: 'phy-flu-q7', topicId: 'phy-fluide', entryId: 'phy-fluide-stroemung', kind: 'single',
    prompt: 'Warum fließt das Blut in den Kapillaren viel langsamer als in der Aorta?',
    options: [
      { text: 'Weil der Gesamtquerschnitt aller Kapillaren viel größer ist als der der Aorta', correct: true, why: 'Nach der Kontinuitätsgleichung sinkt die Geschwindigkeit, wenn sich der Gesamtquerschnitt vergrößert.' },
      { text: 'Weil jede einzelne Kapillare so eng ist', correct: false, why: 'Eine Engstelle allein würde das Blut sogar beschleunigen – entscheidend ist der Gesamtquerschnitt.' },
      { text: 'Weil das Herz die Kapillaren nicht erreicht', correct: false, why: 'Der Volumenstrom durch die Kapillaren stammt vollständig aus dem Herzen.' },
      { text: 'Weil in den Kapillaren weniger Blut fließt als in der Aorta', correct: false, why: 'Je Minute fließt durch alle Kapillaren zusammen dasselbe Volumen wie durch die Aorta.' },
      { text: 'Weil das Blut in den Kapillaren dünnflüssiger ist', correct: false, why: 'Eine geringere Viskosität würde die Strömung erleichtern, nicht verlangsamen.' },
    ],
    explanation: 'Die langsame Strömung verschafft dem Stoffaustausch zwischen Blut und Gewebe die nötige Zeit.',
  },
  {
    id: 'phy-flu-q8', topicId: 'phy-fluide', entryId: 'phy-fluide-stroemung', kind: 'single',
    prompt: 'Wie verhält sich nach Bernoulli der statische Druck in einer Engstelle eines durchströmten Rohres?',
    options: [
      { text: 'Er ist kleiner als im weiten Teil', correct: true, why: 'Die höhere Bewegungsenergie der Flüssigkeit geht auf Kosten des statischen Drucks.' },
      { text: 'Er ist größer als im weiten Teil', correct: false, why: 'Das ist die häufigste Fehlvorstellung – die Flüssigkeit wird schneller, der Druck sinkt.' },
      { text: 'Er ist überall gleich', correct: false, why: 'Das gilt nur in ruhender Flüssigkeit auf gleicher Höhe.' },
      { text: 'Er fällt auf null', correct: false, why: 'Er sinkt, verschwindet aber nicht.' },
      { text: 'Er hängt nur von der Dichte ab', correct: false, why: 'Die Strömungsgeschwindigkeit geht entscheidend ein.' },
    ],
    explanation: 'Wasserstrahlpumpe und Zerstäuber nutzen den Unterdruck an einer Engstelle.',
  },
  {
    id: 'phy-flu-q9', topicId: 'phy-fluide', entryId: 'phy-fluide-viskositaet', kind: 'single',
    prompt: 'Der Radius eines Blutgefäßes halbiert sich bei gleicher Druckdifferenz. Wie ändert sich der Volumenstrom bei laminarer Strömung?',
    options: [
      { text: 'Er sinkt auf ein Sechzehntel', correct: true, why: 'Nach Hagen-Poiseuille geht der Radius mit der vierten Potenz ein: (1/2)⁴ = 1/16.' },
      { text: 'Er sinkt auf die Hälfte', correct: false, why: 'Der Radius geht nicht linear ein.' },
      { text: 'Er sinkt auf ein Viertel', correct: false, why: 'Das wäre nur die Änderung der Querschnittsfläche.' },
      { text: 'Er sinkt auf ein Achtel', correct: false, why: 'Der Exponent ist vier, nicht drei.' },
      { text: 'Er verdoppelt sich', correct: false, why: 'Ein engeres Gefäß lässt weniger durch.' },
    ],
    explanation: 'Deshalb lässt sich die Durchblutung über kleine Änderungen der Gefäßweite so wirksam regeln.',
  },
  {
    id: 'phy-flu-q10', topicId: 'phy-fluide', entryId: 'phy-fluide-viskositaet', kind: 'single', holds: [1, 2],
    prompt: 'Welche Änderungen erhöhen den Strömungswiderstand eines Blutgefäßes? (I) Das Blut wird zähflüssiger. (II) Das Gefäß wird länger. (III) Der Gefäßradius wird größer. (IV) Die Druckdifferenz wird größer.',
    options: [
      { text: 'Nur I und II', correct: true, why: 'Der Widerstand wächst mit Viskosität und Länge (I, II); ein größerer Radius senkt ihn (III), die Druckdifferenz ändert ihn nicht (IV).' },
      { text: 'Nur I, II und IV', correct: false, why: 'Eine größere Druckdifferenz erhöht den Volumenstrom, nicht den Widerstand.' },
      { text: 'Nur II und III', correct: false, why: 'Ein größerer Radius senkt den Widerstand sogar stark – mit der vierten Potenz.' },
      { text: 'Nur III', correct: false, why: 'Ein weiteres Gefäß lässt mehr durch, sein Widerstand ist kleiner.' },
      { text: 'Alle vier', correct: false, why: 'III und IV erhöhen den Widerstand nicht.' },
    ],
    explanation: 'Analog zu R = U / I gilt R = Δp / I: Der Widerstand wächst mit Länge und Viskosität und sinkt mit r⁴.',
  },

];
