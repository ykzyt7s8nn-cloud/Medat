/** Mathematik – Thema "Vektorrechnung". */

export const TOPIC = {
  id: 'mat-vektor',
  title: 'Vektoren',
  summary: 'Addition, Vielfache, Betrag, Verbindungsvektor, Skalarprodukt',
  entries: [
    {
      id: 'mat-vektor-grundlagen',
      title: 'Vektoren, Addition und Betrag',
      text: 'Ein Vektor beschreibt eine Verschiebung mit Richtung und Länge und wird in der Ebene durch zwei, im Raum durch drei Koordinaten angegeben. Vektoren werden komponentenweise addiert und subtrahiert; geometrisch hängt man bei der Addition den zweiten Pfeil an die Spitze des ersten. Multipliziert man einen Vektor mit einer Zahl, wird jede Komponente mit ihr multipliziert: Der Pfeil wird gestreckt oder gestaucht und kehrt bei einem negativen Faktor seine Richtung um. Der Betrag eines Vektors ist seine Länge und ergibt sich nach Pythagoras als Wurzel aus der Summe der Komponentenquadrate; er ist nie negativ. Den Vektor von einem Punkt A zu einem Punkt B erhält man, indem man die Koordinaten von A von denen von B abzieht – „Spitze minus Schaft“. Sein Betrag ist der Abstand der beiden Punkte. Zwei Vektoren sind parallel, wenn der eine ein Vielfaches des anderen ist. In der Physik sind Kraft, Geschwindigkeit und Impuls Vektoren, Masse, Energie und Temperatur dagegen Skalare.',
      facts: [
        'Addition und Subtraktion komponentenweise',
        'r · (a1 | a2) = (r · a1 | r · a2)',
        'Betrag |a| = √(a1² + a2²), im Raum mit a3²',
        'Verbindungsvektor AB = B − A („Spitze minus Schaft“)',
        'Parallel, wenn ein Vektor ein Vielfaches des anderen ist',
      ],
      formulas: ['a + b = (a1 + b1 | a2 + b2)', '|a| = √(a1² + a2² + a3²)', 'AB = B − A'],
      related: ['mat-vektor-skalarprodukt', 'mat-funktion-trigonometrie', 'phy-mechanik-kraft'],
    },
    {
      id: 'mat-vektor-skalarprodukt',
      title: 'Skalarprodukt und Orthogonalität',
      text: 'Das Skalarprodukt zweier Vektoren ist die Summe der Produkte ihrer entsprechenden Komponenten; das Ergebnis ist eine Zahl und kein Vektor. Geometrisch ist es das Produkt der beiden Beträge mit dem Kosinus des eingeschlossenen Winkels. Daraus folgt die wichtigste Anwendung: Zwei Vektoren, die beide nicht der Nullvektor sind, stehen genau dann senkrecht aufeinander, wenn ihr Skalarprodukt null ist, denn der Kosinus von 90 Grad ist null. Ist das Skalarprodukt positiv, ist der Winkel spitz, ist es negativ, stumpf. Einen Normalvektor zu einem ebenen Vektor erhält man, indem man die Komponenten vertauscht und bei einer das Vorzeichen ändert. Das Skalarprodukt eines Vektors mit sich selbst ist das Quadrat seines Betrags. In der Physik ist die Arbeit das Skalarprodukt von Kraft und Weg – steht die Kraft senkrecht zum Weg, wird keine Arbeit verrichtet.',
      facts: [
        'a · b = a1 · b1 + a2 · b2 (+ a3 · b3) – das Ergebnis ist eine Zahl',
        'a · b = |a| · |b| · cos φ',
        'Skalarprodukt null: Vektoren stehen senkrecht',
        'Normalvektor zu (a1 | a2): (−a2 | a1)',
        'a · a = |a|²',
      ],
      formulas: ['a · b = a1 · b1 + a2 · b2', 'cos φ = (a · b) / (|a| · |b|)'],
      related: ['mat-vektor-grundlagen', 'phy-mechanik-energie', 'mat-funktion-einheitskreis'],
    },
  ],
};

export const QUESTIONS = [
  {
    id: 'mat-vek-q1', topicId: 'mat-vektor', entryId: 'mat-vektor-grundlagen', kind: 'single',
    prompt: 'Wie viel ergibt (2 | 3) + (4 | −1)?',
    options: [
      { text: '(6 | 2)', correct: true, why: 'Komponentenweise: 2 + 4 = 6 und 3 + (−1) = 2.' },
      { text: '(6 | 4)', correct: false, why: 'Hier wurde das Minuszeichen der zweiten Komponente übersehen.' },
      { text: '(8 | −3)', correct: false, why: 'Hier wurde komponentenweise multipliziert.' },
      { text: '(−2 | 4)', correct: false, why: 'Hier wurde subtrahiert statt addiert.' },
      { text: 'Keine der angegebenen Antwortmöglichkeiten ist korrekt', correct: false, why: '(6 | 2) steht zur Auswahl und ist richtig.' },
    ],
    explanation: 'Vektoren werden Koordinate für Koordinate addiert.',
  },
  {
    id: 'mat-vek-q2', topicId: 'mat-vektor', entryId: 'mat-vektor-grundlagen', kind: 'single',
    prompt: 'Wie lang ist der Vektor (3 | 4)?',
    options: [
      { text: '5', correct: true, why: '√(3² + 4²) = √25 = 5.' },
      { text: '7', correct: false, why: 'Hier wurden die Komponenten einfach addiert.' },
      { text: '25', correct: false, why: 'Hier wurde die Wurzel vergessen.' },
      { text: '12', correct: false, why: 'Hier wurden die Komponenten multipliziert.' },
      { text: '1', correct: false, why: 'Hier wurde 4 − 3 gerechnet.' },
    ],
    explanation: 'Der Betrag ist der Satz des Pythagoras in Koordinaten.',
  },
  {
    id: 'mat-vek-q3', topicId: 'mat-vektor', entryId: 'mat-vektor-grundlagen', kind: 'single',
    prompt: 'Wie viel ergibt 3 · (2 | −1)?',
    options: [
      { text: '(6 | −3)', correct: true, why: 'Jede Komponente wird mit 3 multipliziert.' },
      { text: '(6 | −1)', correct: false, why: 'Auch die zweite Komponente muss multipliziert werden.' },
      { text: '(5 | 2)', correct: false, why: 'Hier wurde 3 addiert statt multipliziert.' },
      { text: '(6 | 3)', correct: false, why: 'Das Vorzeichen der zweiten Komponente bleibt erhalten.' },
      { text: '(2 | −3)', correct: false, why: 'Hier wurde nur die zweite Komponente multipliziert.' },
    ],
    explanation: 'Ein positiver Faktor streckt den Pfeil, ohne seine Richtung zu ändern.',
  },
  {
    id: 'mat-vek-q4', topicId: 'mat-vektor', entryId: 'mat-vektor-grundlagen', kind: 'single',
    prompt: 'Welcher Vektor führt vom Punkt A(1 | 2) zum Punkt B(4 | 6)?',
    options: [
      { text: '(3 | 4)', correct: true, why: 'B − A = (4 − 1 | 6 − 2).' },
      { text: '(−3 | −4)', correct: false, why: 'Das ist A − B, der Vektor von B nach A.' },
      { text: '(5 | 8)', correct: false, why: 'Hier wurden die Ortsvektoren addiert.' },
      { text: '(4 | 6)', correct: false, why: 'Das ist nur der Ortsvektor von B.' },
      { text: '(4 | 12)', correct: false, why: 'Hier wurden die Koordinaten multipliziert.' },
    ],
    explanation: 'Merkregel: Spitze minus Schaft.',
  },
  {
    id: 'mat-vek-q5', topicId: 'mat-vektor', entryId: 'mat-vektor-grundlagen', kind: 'single',
    prompt: 'Wie weit sind die Punkte P(−1 | 1) und Q(5 | 9) voneinander entfernt?',
    options: [
      { text: '10', correct: true, why: 'PQ = (6 | 8), und √(36 + 64) = √100 = 10.' },
      { text: '14', correct: false, why: 'Hier wurden die Komponenten 6 und 8 addiert.' },
      { text: '100', correct: false, why: 'Hier wurde die Wurzel vergessen.' },
      { text: 'Etwa 10,8', correct: false, why: 'Hier wurden die Koordinaten addiert statt subtrahiert: √(4² + 10²).' },
      { text: '2', correct: false, why: 'Hier wurde 8 − 6 gerechnet.' },
    ],
    explanation: 'Abstand zweier Punkte = Betrag des Verbindungsvektors.',
  },
  {
    id: 'mat-vek-q6', topicId: 'mat-vektor', entryId: 'mat-vektor-grundlagen', kind: 'single',
    prompt: 'Wie lang ist der Vektor (1 | 2 | 2)?',
    options: [
      { text: '3', correct: true, why: '√(1 + 4 + 4) = √9 = 3.' },
      { text: '5', correct: false, why: 'Hier wurden die Komponenten addiert.' },
      { text: '9', correct: false, why: 'Hier wurde die Wurzel vergessen.' },
      { text: '√5', correct: false, why: 'Hier wurde die dritte Komponente vergessen.' },
      { text: '4', correct: false, why: 'Hier wurde 2 · 2 gerechnet und die erste Komponente vergessen.' },
    ],
    explanation: 'Im Raum kommt einfach das dritte Quadrat unter die Wurzel.',
  },
  {
    id: 'mat-vek-q7', topicId: 'mat-vektor', entryId: 'mat-vektor-skalarprodukt', kind: 'single',
    prompt: 'Wie groß ist das Skalarprodukt von (2 | 3) und (4 | −1)?',
    options: [
      { text: '5', correct: true, why: '2 · 4 + 3 · (−1) = 8 − 3 = 5.' },
      { text: '(8 | −3)', correct: false, why: 'Das Skalarprodukt ist eine Zahl – die Produkte müssen noch addiert werden.' },
      { text: '11', correct: false, why: 'Hier wurde das Minuszeichen übersehen.' },
      { text: '10', correct: false, why: 'Hier wurde über Kreuz multipliziert: 2 · (−1) + 3 · 4.' },
      { text: '2', correct: false, why: 'Hier wurde innerhalb der Vektoren multipliziert: 2 · 3 + 4 · (−1).' },
    ],
    explanation: 'Erste mal erste plus zweite mal zweite Komponente.',
  },
  {
    id: 'mat-vek-q8', topicId: 'mat-vektor', entryId: 'mat-vektor-skalarprodukt', kind: 'single',
    prompt: 'Für welchen Wert von t steht (2 | t) senkrecht auf (3 | 6)?',
    options: [
      { text: 't = −1', correct: true, why: '2 · 3 + t · 6 = 0 ergibt t = −1.' },
      { text: 't = 1', correct: false, why: 'Einsetzen ergibt 12, nicht 0.' },
      { text: 't = 4', correct: false, why: 'Dann ist (2 | 4) parallel zu (3 | 6), nicht senkrecht.' },
      { text: 't = −2', correct: false, why: 'Einsetzen ergibt −6, nicht 0.' },
      { text: 't = 0', correct: false, why: 'Dann bleibt 2 · 3 = 6 übrig.' },
    ],
    explanation: 'Senkrecht heißt: Skalarprodukt gleich null – dann nach t auflösen.',
  },
  {
    id: 'mat-vek-q9', topicId: 'mat-vektor', entryId: 'mat-vektor-skalarprodukt', kind: 'single',
    prompt: 'Welcher Vektor steht senkrecht auf (3 | −2)?',
    options: [
      { text: '(2 | 3)', correct: true, why: '3 · 2 + (−2) · 3 = 0.' },
      { text: '(−3 | 2)', correct: false, why: 'Das ist der Gegenvektor – er ist parallel.' },
      { text: '(3 | 2)', correct: false, why: 'Skalarprodukt 9 − 4 = 5, nicht 0.' },
      { text: '(−2 | 3)', correct: false, why: 'Skalarprodukt −6 − 6 = −12, nicht 0.' },
      { text: '(6 | −4)', correct: false, why: 'Das ist das Doppelte, also parallel.' },
    ],
    explanation: 'Komponenten vertauschen und bei einer das Vorzeichen wechseln liefert einen Normalvektor.',
  },
  {
    id: 'mat-vek-q10', topicId: 'mat-vektor', entryId: 'mat-vektor-skalarprodukt', kind: 'single', holds: [1, 2],
    prompt: 'Welche Aussagen über Vektoren sind korrekt? (I) Der Betrag eines Vektors ist nie negativ. (II) Das Skalarprodukt zweier Vektoren ist eine Zahl. (III) Vektoren werden addiert, indem man ihre Beträge addiert. (IV) Orthogonale Vektoren haben das Skalarprodukt 1.',
    options: [
      { text: 'Nur I und II', correct: true, why: 'III ist falsch: Addiert wird komponentenweise. IV ist falsch: Das Skalarprodukt orthogonaler Vektoren ist 0.' },
      { text: 'Nur I, II und IV', correct: false, why: 'Orthogonal bedeutet Skalarprodukt 0, nicht 1.' },
      { text: 'Nur II und III', correct: false, why: 'Beträge addieren sich nur bei gleich gerichteten Vektoren.' },
      { text: 'Nur I', correct: false, why: 'Auch II ist richtig.' },
      { text: 'Alle vier', correct: false, why: 'III und IV sind falsch.' },
    ],
    explanation: '(3 | 0) + (0 | 4) hat den Betrag 5, nicht 3 + 4 = 7.',
  },
];
