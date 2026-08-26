/**
 * Namensdatenbank für den Untertest "Gedächtnis & Merkfähigkeit".
 *
 * Auswahlkriterien (analog zu den MedAT-Allergieausweisen):
 *   - realistische, aber eher ungewöhnliche deutschsprachige Namen
 *   - keine prominenten Personen
 *   - Mischung aus geläufig und selten, damit das Einprägen fordernd bleibt
 *
 * Bewusst reine Datenlisten ohne Logik – die Generierung der Ausweise liegt
 * in src/engines/memory.js.
 */

/** Weibliche Vornamen (50). */
export const FEMALE_FIRST_NAMES = [
  'Eleonore', 'Roswitha', 'Gundula', 'Hildegard', 'Adelheid',
  'Waltraud', 'Notburga', 'Sieglinde', 'Marlies', 'Cordula',
  'Reinhild', 'Theresia', 'Ottilie', 'Friederike', 'Kunigunde',
  'Leopoldine', 'Josefa', 'Rosalinde', 'Emmeline', 'Wilhelmine',
  'Bernadette', 'Gerlinde', 'Elfriede', 'Hedwig', 'Irmgard',
  'Klementine', 'Mechthild', 'Philippine', 'Severine', 'Traudl',
  'Valeska', 'Wiltrud', 'Zita', 'Annelie', 'Berta',
  'Christiane', 'Doris', 'Editha', 'Franziska', 'Gudrun',
  'Henriette', 'Isolde', 'Johanna', 'Karoline', 'Ludmilla',
  'Magdalena', 'Nikoline', 'Ortrud', 'Paulina', 'Rosemarie',
];

/** Männliche Vornamen (50). */
export const MALE_FIRST_NAMES = [
  'Valentin', 'Korbinian', 'Alois', 'Ferdinand', 'Gottfried',
  'Hubertus', 'Ignaz', 'Jakobus', 'Kilian', 'Leopold',
  'Meinrad', 'Norbert', 'Oswald', 'Pankraz', 'Quirin',
  'Roland', 'Severin', 'Thaddäus', 'Ulrich', 'Volkmar',
  'Wendelin', 'Xaver', 'Zeno', 'Adalbert', 'Benedikt',
  'Cornelius', 'Dietmar', 'Eberhard', 'Florian', 'Gernot',
  'Hartmut', 'Isidor', 'Joachim', 'Konstantin', 'Lorenz',
  'Markward', 'Nepomuk', 'Otmar', 'Philemon', 'Reinhold',
  'Sigismund', 'Tobias', 'Urban', 'Vinzenz', 'Wolfram',
  'Anselm', 'Bartholomäus', 'Casimir', 'Diethelm', 'Emmerich',
];

/** Nachnamen (100). */
export const LAST_NAMES = [
  'Kirchbichler', 'Stucker', 'Osbone', 'Zwanziger', 'Habersack',
  'Rindlisbacher', 'Nussbaumer', 'Prantl', 'Eibensteiner', 'Gruberbauer',
  'Weichselbraun', 'Trattnig', 'Pichlmayr', 'Ochsenreiter', 'Lindenthaler',
  'Mostbauer', 'Kranzlbinder', 'Hollerweger', 'Fingerlos', 'Draxlmayr',
  'Buchleitner', 'Aigelsreiter', 'Zehetgruber', 'Wimmersberger', 'Vollmann',
  'Unterkofler', 'Tschirner', 'Steinacher', 'Rauhofer', 'Quirchmair',
  'Pointner', 'Oberascher', 'Neuhauser', 'Marckhgott', 'Lasserer',
  'Kohlbacher', 'Jaklitsch', 'Innerhofer', 'Hasenöhrl', 'Grillmayer',
  'Feichtenschlager', 'Ebenberger', 'Danzinger', 'Christandl', 'Baumschlager',
  'Auracher', 'Zöhrer', 'Windhager', 'Vorderegger', 'Ulbing',
  'Tauchner', 'Schwaiberger', 'Roiderer', 'Rechberger', 'Puschnig',
  'Ottendorfer', 'Nachbagauer', 'Mühlbacher', 'Loderbauer', 'Kressnig',
  'Kaltenbrunner', 'Jungwirth', 'Hinterleitner', 'Grabenwöger', 'Fuchsberger',
  'Egghart', 'Dorfinger', 'Cerny', 'Brandstetter', 'Aschenbrenner',
  'Wallnöfer', 'Voglsanger', 'Uiberacker', 'Tiefenbacher', 'Sperlhofer',
  'Ronacher', 'Pilsbacher', 'Oswaldner', 'Nagiller', 'Mitterhuber',
  'Leitgeb', 'Kalcher', 'Jenewein', 'Hörbiger', 'Gastinger',
  'Freudenthaler', 'Enzinger', 'Diendorfer', 'Chalupnik', 'Bergthaler',
  'Amberger', 'Zauner', 'Wieshofer', 'Vasold', 'Umgeher',
  'Trinkl', 'Sandbichler', 'Rammerstorfer', 'Pöllinger', 'Obermoser',
];

/** Avatar-Farben (iOS-Systemfarben, ausreichend Kontrast zu weißer Schrift). */
export const AVATAR_COLORS = [
  '#007AFF', '#34C759', '#FF9500', '#AF52DE',
  '#FF2D55', '#5856D6', '#00A3A3', '#C7761A',
];
