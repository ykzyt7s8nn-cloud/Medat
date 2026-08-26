/**
 * Substantiv-Datenbank für den Untertest "Wortflüssigkeit".
 *
 * Regeln für jeden Eintrag (geprüft von scripts/selftest.mjs):
 *   - deutsches Substantiv im Nominativ Singular
 *   - kein Plural, kein Verb, kein Adjektiv, kein Diminutiv
 *   - keine Umlaute und kein ß (MedAT-Vorgabe) – auch keine ae/oe/ue-Ersatzschreibung
 *   - Länge 5–14 Buchstaben
 *   - anagramm-eindeutig innerhalb der Datenbank, damit es genau eine Lösung gibt
 *
 * Die Schwierigkeitsstufen werden nicht doppelt gepflegt, sondern über die
 * Wortlänge abgeleitet (siehe DIFFICULTY_RANGES).
 */

/** Längenbereiche je Schwierigkeitsstufe (MedAT-typisch). */
export const DIFFICULTY_RANGES = {
  leicht: [5, 6],
  mittel: [7, 9],
  schwer: [10, 14],
};

/**
 * Fremd- und Fachwörter.
 *
 * Diese Wörter bleiben gültige Substantive und werden in den Stufen
 * Leicht/Mittel/Schwer/Gemischt weiter verwendet – auf "MedAT-Niveau" sind sie
 * aber ausgeschlossen: Dort sollen ausschließlich gewachsene deutsche Wörter
 * vorkommen, keine Lehnwörter und keine Fachsprache.
 *
 * Bewusst als gepflegte Liste statt als Heuristik: Endungen wie -ion oder -ik
 * würden ebenso "Meinung" und "Musik" treffen, und ein falsch aussortiertes
 * Wort wäre schwerer zu bemerken als ein Eintrag in dieser Liste.
 */
export const FOREIGN_OR_TECHNICAL = new Set([
  'Almanach', 'Ambulanz', 'Aquarell', 'Aquarium', 'Architekt', 'Astronaut', 'Astronomie', 'Atelier',
  'Barometer', 'Bibliothek', 'Biologie', 'Botanik', 'Chirurg', 'Chirurgie', 'Container', 'Datenbank',
  'Diagramm', 'Diplom', 'Explosion', 'Generator', 'Grammatik', 'Horizont', 'Industrie', 'Interview',
  'Kabinett', 'Konferenz', 'Kontinent', 'Konzentration', 'Kristall', 'Labyrinth', 'Laboratorium',
  'Literatur', 'Lokomotive', 'Magnesium', 'Mathematik', 'Mechanismus', 'Mikroskop', 'Orchester',
  'Organismus', 'Pergament', 'Philosophie', 'Physik', 'Physiker', 'Planetarium', 'Politik', 'Politiker',
  'Porzellan', 'Praktikum', 'Professor', 'Prospekt', 'Prozessor', 'Psychopath', 'Pullover', 'Pyramide',
  'Quadrant', 'Rezeption', 'Skalpell', 'Skelett', 'Skulptur', 'Testament', 'Thermometer', 'Universum',
  'Ventilator', 'Zylinder',
]);

/** Flache, alphabetisch gepflegte Wortliste (anagramm-eindeutig). */
export const NOUNS = [
  // A
  'Abend', 'Abendessen', 'Abendrot', 'Abenteuer', 'Aberwitz', 'Abteilung', 'Achterbahn', 'Acker', 'Adler', 'Akrobat',
  'Aktenordner', 'Aktentasche', 'Aktion', 'Alarm', 'Album', 'Allerlei', 'Almanach', 'Alpaka', 'Ambulanz', 'Ameise',
  'Amsel', 'Anatomie', 'Anker', 'Antenne', 'Antrag', 'Apfel', 'Apfelbaum', 'Apfelsine', 'Apotheke', 'Aprikose',
  'Aquarell', 'Aquarium', 'Arbeit', 'Arbeitsplatz', 'Archipel', 'Architekt', 'Archiv', 'Armaturenbrett', 'Armband', 'Armee',
  'Aroma', 'Arsenal', 'Artikel', 'Aschenbecher', 'Aspekt', 'Astronaut', 'Astronomie', 'Atelier', 'Athlet', 'Atomkraft',
  'Attest', 'Auerhahn', 'Aufenthalt', 'Aufsatz', 'Auftrag', 'Augenbraue', 'Ausbildung', 'Ausflug', 'Auslieferung', 'Ausweis',
  'Autobahn', 'Automechaniker',
  // B
  'Backstein', 'Badezimmer', 'Bagger', 'Bahnhof', 'Balgerei', 'Balken', 'Balkon', 'Ballon', 'Banane', 'Bandage',
  'Bandwurm', 'Bankett', 'Bankkonto', 'Barometer', 'Bauchweh', 'Bauer', 'Bauernhof', 'Becher', 'Beere', 'Beinhaus',
  'Beobachter', 'Bergkamm', 'Bergsteiger', 'Bergwerk', 'Besen', 'Besenstiel', 'Besuch', 'Beton', 'Bettdecke', 'Bettzeug',
  'Beute', 'Bibel', 'Bibliothek', 'Biene', 'Bierdeckel', 'Bilanz', 'Bildhauer', 'Bildschirm', 'Binde', 'Biologie',
  'Birke', 'Birne', 'Bison', 'Blasmusik', 'Blatt', 'Blattgold', 'Blech', 'Blechdose', 'Bleistift', 'Blitz',
  'Block', 'Blume', 'Blumentopf', 'Bluse', 'Blutdruck', 'Blutegel', 'Blutgruppe', 'Boden', 'Bodensatz', 'Bogen',
  'Bohne', 'Bohrmaschine', 'Bombe', 'Bonus', 'Borke', 'Botanik', 'Brachland', 'Brandmal', 'Brandstifter', 'Braten',
  'Brett', 'Brief', 'Briefkasten', 'Brieftasche', 'Brille', 'Bronze', 'Brotkorb', 'Brotlaib', 'Bruder', 'Brunnen',
  'Buchhaltung', 'Buchhandlung', 'Buchstabe', 'Bucht', 'Bundesland', 'Bunker', 'Burgruine', 'Busch',
  // C
  'Chance', 'Chaos', 'Chemikalie', 'Chirurg', 'Chirurgie', 'Chronik', 'Clown', 'Comic', 'Container',
  // D
  'Dachboden', 'Dachrinne', 'Dachs', 'Dachstuhl', 'Dampf', 'Dampflok', 'Datenbank', 'Datum', 'Daumen', 'Decke',
  'Degen', 'Delfin', 'Denkmal', 'Denkmalschutz', 'Diagramm', 'Diamant', 'Dickicht', 'Diener', 'Diesel', 'Diktat',
  'Dinkel', 'Diplom', 'Distel', 'Docht', 'Dokument', 'Dolch', 'Domino', 'Dorfplatz', 'Dornbusch', 'Draht',
  'Drahtseil', 'Drama', 'Drehbuch', 'Dreieck', 'Dreiklang', 'Droge', 'Druck', 'Druckerei', 'Duell', 'Dunst',
  'Durst', 'Dusche',
  // E
  'Ebene', 'Edelstein', 'Efeuranke', 'Ehrenwort', 'Eiche', 'Eichhorn', 'Eierschale', 'Eimer', 'Eingang', 'Einkaufszettel',
  'Eisen', 'Eisenbahn', 'Eisscholle', 'Eisvogel', 'Eiter', 'Elefant', 'Elektriker', 'Elend', 'Elfenbein', 'Elite',
  'Entdeckung', 'Entfernung', 'Epoche', 'Erbse', 'Erdbeben', 'Erdbeere', 'Erdkugel', 'Erdkunde', 'Erdrutsch', 'Erfindung',
  'Ergebnis', 'Erinnerung', 'Erker', 'Erlebnis', 'Erlenholz', 'Ersatz', 'Erzieher', 'Essig', 'Etage', 'Etikett',
  'Experiment', 'Explosion',
  // F
  'Fabel', 'Fabrik', 'Fackelzug', 'Faden', 'Fahrer', 'Fahrkarte', 'Fahrplan', 'Fahrrad', 'Fahrrinne', 'Fahrstuhl',
  'Falke', 'Falle', 'Fallschirm', 'Familie', 'Farbe', 'Fasan', 'Faser', 'Feder', 'Federkiel', 'Feier',
  'Feiertag', 'Feige', 'Feile', 'Feldstecher', 'Feldstein', 'Felge', 'Fenster', 'Fensterbank', 'Fernrohr', 'Ferse',
  'Feuer', 'Feuermal', 'Feuerwehr', 'Figur', 'Filmkamera', 'Filter', 'Filzstift', 'Fingerhut', 'Finsternis', 'Firma',
  'Fisch', 'Fischotter', 'Flachland', 'Flamme', 'Flanke', 'Flasche', 'Flaschenhals', 'Fledermaus', 'Flieder', 'Fliegenpilz',
  'Fliese', 'Flinte', 'Flohmarkt', 'Flosse', 'Flucht', 'Flugbegleiter', 'Flughafen', 'Flugsand', 'Flugzeug', 'Fluss',
  'Flusspferd', 'Folie', 'Forelle', 'Formel', 'Forscher', 'Forschung', 'Forstamt', 'Fossil', 'Fotoapparat', 'Fotograf',
  'Frachtgut', 'Frachtschiff', 'Frage', 'Freiheit', 'Fremdsprache', 'Frist', 'Frucht', 'Fruchtsaft', 'Fuchs', 'Fuchsbau',
  'Funke', 'Furche',
  // G
  'Gabel', 'Galerie', 'Galgen', 'Garten', 'Gartenzaun', 'Gasse', 'Gasthaus', 'Gaumen', 'Gaunerei', 'Gebet',
  'Gebiet', 'Gebirge', 'Geburt', 'Geduld', 'Gefahr', 'Geflecht', 'Gehalt', 'Geheimnis', 'Gehirn', 'Geist',
  'Geizhals', 'Geldbeutel', 'Gelenk', 'Gemeinde', 'Gemetzel', 'Generator', 'Genie', 'Geografie', 'Geologe', 'Geplauder',
  'Geraschel', 'Gerste', 'Geruch', 'Geschenk', 'Gesellschaft', 'Gesetz', 'Gesicht', 'Gesindel', 'Getrampel', 'Getreide',
  'Gewehr', 'Gewicht', 'Gewimmel', 'Gewissen', 'Gewitter', 'Gipfel', 'Gitarre', 'Gitter', 'Glanz', 'Glasperle',
  'Glasscherbe', 'Glaube', 'Gleis', 'Gleisbett', 'Globus', 'Glocke', 'Glockenturm', 'Glutnest', 'Gnade', 'Goldmedaille',
  'Gondel', 'Grabstein', 'Grafik', 'Grammatik', 'Granit', 'Grasnarbe', 'Grauzone', 'Grenzstein', 'Grenzwall', 'Grippe',
  'Grotte', 'Grundriss', 'Gruppe', 'Gulasch', 'Gurke',
  // H
  'Hafenkran', 'Hagebutte', 'Haken', 'Halbmond', 'Halle', 'Halskette', 'Hammer', 'Hamster', 'Handel', 'Handgelenk',
  'Handschrift', 'Handschuh', 'Handtasche', 'Handtuch', 'Handwerk', 'Hantel', 'Harke', 'Hartholz', 'Haselmaus', 'Haufen',
  'Hauptstadt', 'Hausarzt', 'Hausflur', 'Hebel', 'Hecke', 'Heide', 'Heimat', 'Henkel', 'Herbst', 'Herbstlaub',
  'Herde', 'Herdfeuer', 'Herzog', 'Heuboden', 'Hindernis', 'Hirsch', 'Hirse', 'Hobel', 'Hobelbank', 'Hochhaus',
  'Hochmoor', 'Hochzeit', 'Hocker', 'Hoffnung', 'Holzklotz', 'Holzwurm', 'Honig', 'Hopfen', 'Horde', 'Horizont',
  'Hornisse', 'Horst', 'Hosentasche', 'Hotel', 'Hubschrauber', 'Hufeisen', 'Humor', 'Hunger', 'Hutschnur', 'Hymne',
  // I
  'Illusion', 'Imkerei', 'Impfstoff', 'Impuls', 'Index', 'Indiz', 'Industrie', 'Infekt', 'Inhalt', 'Innenhof',
  'Inschrift', 'Insekt', 'Instrument', 'Interview', 'Intrige', 'Ironie', 'Irrgarten', 'Irrglaube', 'Irrtum',
  // J
  'Jagdhorn', 'Jahrmarkt', 'Jargon', 'Jasmin', 'Journal', 'Jubel', 'Jugend', 'Junge', 'Jurist', 'Juwel',
  // K
  'Kabel', 'Kabine', 'Kabinett', 'Kaffee', 'Kajak', 'Kakao', 'Kaktus', 'Kalender', 'Kalkstein', 'Kamel',
  'Kamera', 'Kamin', 'Kaminfeger', 'Kammer', 'Kampf', 'Kanal', 'Kanne', 'Kante', 'Kapsel', 'Karotte',
  'Kartoffel', 'Karton', 'Kastanie', 'Kasten', 'Katze', 'Kaufmann', 'Kegel', 'Kehle', 'Keller', 'Kellner',
  'Kenner', 'Kerbe', 'Kerbholz', 'Kerze', 'Kerzenlicht', 'Kessel', 'Kette', 'Keule', 'Kienspan', 'Kiesel',
  'Kiesgrube', 'Kimono', 'Kinderwagen', 'Kirche', 'Kirchhof', 'Kirchturm', 'Kissen', 'Kiste', 'Klage', 'Klammer',
  'Klang', 'Klarinette', 'Klasse', 'Klaue', 'Klavier', 'Kleeblatt', 'Kleid', 'Klemme', 'Klima', 'Klinge',
  'Klingelknopf', 'Klinik', 'Klippe', 'Kloster', 'Knabe', 'Knebel', 'Knoblauch', 'Knochen', 'Knopf', 'Knopfloch',
  'Knoten', 'Kobalt', 'Kochtopf', 'Koffer', 'Kohle', 'Kolben', 'Kolonie', 'Komet', 'Kommode', 'Kompass',
  'Kompliment', 'Konferenz', 'Konfetti', 'Konsul', 'Kontinent', 'Kontor', 'Konzentration', 'Konzert', 'Kopfkissen', 'Kopie',
  'Kordel', 'Korken', 'Korkenzieher', 'Kornfeld', 'Korsett', 'Krabbe', 'Kraft', 'Kraftwerk', 'Kragen', 'Krampf',
  'Kranich', 'Krankenhaus', 'Krankenwagen', 'Kranz', 'Krater', 'Kredit', 'Kreide', 'Kreis', 'Kresse', 'Kreuz',
  'Krieg', 'Kristall', 'Kritik', 'Krokus', 'Krone', 'Kronleuchter', 'Kruste', 'Kubus', 'Kuchen', 'Kugel',
  'Kunde', 'Kunst', 'Kunstwerk', 'Kupfer', 'Kurbel', 'Kurier', 'Kurve', 'Kutsche',
  // L
  'Laboratorium', 'Labyrinth', 'Landkarte', 'Landschaft', 'Lanze', 'Laser', 'Lastwagen', 'Latte', 'Laube', 'Lauch',
  'Laune', 'Lautsprecher', 'Lawine', 'Lawinengefahr', 'Lebensmittel', 'Leder', 'Legende', 'Lehmboden', 'Lehne', 'Lehrbuch',
  'Lehrer', 'Leine', 'Leinsamen', 'Leinwand', 'Leiter', 'Lektor', 'Lenker', 'Leopard', 'Lerche', 'Leuchtturm',
  'Libelle', 'Licht', 'Lichtschalter', 'Liebe', 'Liebesbrief', 'Lieferant', 'Limonade', 'Linde', 'Lineal', 'Linie',
  'Lippe', 'Literatur', 'Lobby', 'Locke', 'Logik', 'Lokal', 'Lokomotive', 'Lorbeer', 'Lotse', 'Lotto',
  'Luftballon', 'Lunge', 'Luxus',
  // M
  'Machtwort', 'Magen', 'Magier', 'Magnesium', 'Magnet', 'Maisfeld', 'Makler', 'Maler', 'Mandel', 'Mangel',
  'Mannschaft', 'Mantel', 'Marke', 'Markt', 'Marktplatz', 'Marmelade', 'Marmor', 'Marsch', 'Maschine', 'Maske',
  'Masse', 'Mathematik', 'Matte', 'Mauer', 'Mauerwerk', 'Maurer', 'Mechanismus', 'Medaille', 'Medizin', 'Meile',
  'Meise', 'Melodie', 'Melone', 'Menge', 'Mensch', 'Menschheit', 'Messer', 'Metall', 'Meteor', 'Meter',
  'Miene', 'Mikroskop', 'Milbe', 'Milch', 'Milchglas', 'Mineral', 'Minze', 'Mispel', 'Mistgabel', 'Mitte',
  'Mitternacht', 'Mixer', 'Moment', 'Monat', 'Mondschein', 'Monitor', 'Moorhuhn', 'Moped', 'Morgentau', 'Mosaik',
  'Motiv', 'Motor', 'Motorboot', 'Motorhaube', 'Motte', 'Mulde', 'Mumie', 'Museum', 'Muskel', 'Muster',
  'Mutter',
  // N
  'Nabel', 'Nachbarin', 'Nachricht', 'Nachthemd', 'Nachtisch', 'Nadelbaum', 'Nadelwald', 'Nagel', 'Nagelbett', 'Nahrung',
  'Narbe', 'Nationalpark', 'Natur', 'Naturschutz', 'Nebelbank', 'Neffe', 'Nessel', 'Nichte', 'Nickel', 'Niere',
  'Nomade', 'Notausgang', 'Notiz', 'Notizblock', 'Nougat', 'Novelle', 'Nudel', 'Nummer', 'Nutzen',
  // O
  'Oberarzt', 'Objekt', 'Ochse', 'Ofenrohr', 'Oktave', 'Olive', 'Onkel', 'Operation', 'Opfer', 'Orange',
  'Orangensaft', 'Orbit', 'Orchester', 'Orden', 'Ordnung', 'Organ', 'Organismus', 'Orgel', 'Orkan', 'Ornament',
  'Ozean',
  // P
  'Palast', 'Palette', 'Panda', 'Panik', 'Panzer', 'Papier', 'Papierkorb', 'Pappel', 'Parade', 'Parfum',
  'Parkplatz', 'Partie', 'Passagier', 'Paste', 'Pastor', 'Patent', 'Patient', 'Pauke', 'Pause', 'Pechvogel',
  'Pension', 'Pergament', 'Perle', 'Person', 'Pfahlbau', 'Pfanne', 'Pfannkuchen', 'Pfefferminze', 'Pfeife', 'Pfeil',
  'Pfeiler', 'Pferd', 'Pfirsich', 'Pflanze', 'Pflaster', 'Pflasterstein', 'Pflug', 'Pforte', 'Pfosten', 'Pfote',
  'Pfund', 'Phase', 'Philosophie', 'Physik', 'Physiker', 'Piano', 'Pilger', 'Pilot', 'Pilzsammler', 'Pinguin',
  'Pinsel', 'Pirat', 'Piste', 'Pizza', 'Plakat', 'Planet', 'Planetarium', 'Plastik', 'Platte', 'Platz',
  'Plombe', 'Pokal', 'Politik', 'Politiker', 'Pollen', 'Portal', 'Porzellan', 'Poster', 'Postkarte', 'Praktikum',
  'Prinz', 'Prisma', 'Probe', 'Professor', 'Profil', 'Projekt', 'Prospekt', 'Protest', 'Provinz', 'Prozent',
  'Prozessor', 'Psychopath', 'Pudel', 'Puder', 'Pullover', 'Pulver', 'Punkt', 'Puppe', 'Pyramide',
  // Q
  'Quader', 'Quadrant', 'Qualle', 'Quarz', 'Quelle', 'Quirl', 'Quote',
  // R
  'Rabatt', 'Rachen', 'Radiergummi', 'Radio', 'Radkranz', 'Rahmen', 'Rakete', 'Rampe', 'Rasen', 'Raster',
  'Rathaus', 'Ratte', 'Raubtier', 'Rauchfang', 'Raufbold', 'Raupe', 'Rebell', 'Rebstock', 'Rechen', 'Rechnung',
  'Reflex', 'Regen', 'Regenbogen', 'Regenmantel', 'Regenschirm', 'Regenwolke', 'Reifen', 'Reihe', 'Reisekoffer', 'Rekord',
  'Relief', 'Reptil', 'Rettich', 'Rettungsboot', 'Revier', 'Rezeption', 'Richter', 'Richtung', 'Riedgras', 'Riegel',
  'Riemen', 'Riesenrad', 'Rinde', 'Ringelnatter', 'Rippe', 'Ritter', 'Ritual', 'Robbe', 'Roboter', 'Rodeo',
  'Roggen', 'Rohstoff', 'Rolle', 'Roman', 'Rosine', 'Rostfleck', 'Rotor', 'Rotwein', 'Rubin', 'Rucksack',
  'Ruder', 'Ruderboot', 'Ruine', 'Rumpf', 'Runde', 'Rutsche',
  // S
  'Sackgasse', 'Safari', 'Saite', 'Salon', 'Salto', 'Salut', 'Salzkorn', 'Samen', 'Sammler', 'Sandkorn',
  'Sandstrand', 'Sattel', 'Sauerstoff', 'Sauerteig', 'Sauna', 'Schachbrett', 'Schacht', 'Schaden', 'Schallplatte', 'Schalter',
  'Scharnier', 'Schatten', 'Schatz', 'Schatzkiste', 'Schaufel', 'Schaufenster', 'Schaukel', 'Scheibe', 'Scheinwerfer', 'Schenkel',
  'Schere', 'Scherz', 'Scheune', 'Schicht', 'Schiedsrichter', 'Schiene', 'Schiff', 'Schild', 'Schilf', 'Schimmel',
  'Schirm', 'Schlaf', 'Schlafsack', 'Schlagzeug', 'Schlange', 'Schlauch', 'Schleife', 'Schleuse', 'Schlitten', 'Schlittschuh',
  'Schloss', 'Schlucht', 'Schmerz', 'Schmetterling', 'Schmied', 'Schnabel', 'Schnecke', 'Schnee', 'Schneeflocke', 'Schnellzug',
  'Schnepfe', 'Schnitt', 'Schnitzel', 'Schnur', 'Schokolade', 'Scholle', 'Schornstein', 'Schotter', 'Schrank', 'Schraube',
  'Schreck', 'Schreibtisch', 'Schrift', 'Schritt', 'Schrott', 'Schuhwerk', 'Schulhof', 'Schuppe', 'Schuppen', 'Schuster',
  'Schutz', 'Schwalbe', 'Schwamm', 'Schwarm', 'Schwelle', 'Schwert', 'Schwester', 'Schwimmbad', 'Segel', 'Segelboot',
  'Segler', 'Seide', 'Seife', 'Seite', 'Sekte', 'Sektglas', 'Semmel', 'Senator', 'Sender', 'Sense',
  'Sessel', 'Seufzer', 'Sichel', 'Sieger', 'Signal', 'Silbe', 'Silber', 'Sinnbild', 'Sirene', 'Sirup',
  'Sitte', 'Sitzbank', 'Skala', 'Skalpell', 'Skelett', 'Skilift', 'Skizze', 'Sklave', 'Skulptur', 'Slalom',
  'Socke', 'Sockel', 'Sohle', 'Soldat', 'Sommer', 'Sonne', 'Sonnenblume', 'Sonnenlicht', 'Sonnenuhr', 'Sorge',
  'Sorte', 'Spagat', 'Spange', 'Spanne', 'Spargel', 'Spaten', 'Spatz', 'Specht', 'Speck', 'Spende',
  'Sperre', 'Sperrholz', 'Spiegel', 'Spiel', 'Spielmann', 'Spielplatz', 'Spinne', 'Spinnennetz', 'Spirale', 'Spitze',
  'Splitter', 'Sporn', 'Sportplatz', 'Sprache', 'Sprachkurs', 'Sprung', 'Spule', 'Staat', 'Stachelbeere', 'Stadion',
  'Stadt', 'Stadtplan', 'Stall', 'Stamm', 'Stand', 'Standbild', 'Standuhr', 'Stange', 'Start', 'Statue',
  'Staub', 'Steilhang', 'Stein', 'Steinbock', 'Steinbruch', 'Stelle', 'Stempel', 'Steppe', 'Stern', 'Sternbild',
  'Steuer', 'Stichprobe', 'Stiefel', 'Stiefkind', 'Stier', 'Stift', 'Stimme', 'Stimmgabel', 'Stirn', 'Stockwerk',
  'Stoff', 'Stollen', 'Stolz', 'Storch', 'Strand', 'Strandkorb', 'Strauch', 'Streifen', 'Streit', 'Strich',
  'Strohhalm', 'Strom', 'Stromkabel', 'Strudel', 'Strumpf', 'Stube', 'Studentin', 'Stufe', 'Stuhl', 'Stunde',
  'Sturm', 'Sturmflut', 'Sturz', 'Suppe', 'Suppentopf', 'Symbol', 'System', 'Szene',
  // T
  'Tablett', 'Tafel', 'Tagedieb', 'Talent', 'Talsperre', 'Tango', 'Tanne', 'Tannenbaum', 'Tante', 'Tapete',
  'Tasche', 'Taschenlampe', 'Taschentuch', 'Tasse', 'Tastatur', 'Taste', 'Taube', 'Taucher', 'Tauwetter', 'Teekanne',
  'Teekessel', 'Teich', 'Teichrose', 'Telefonbuch', 'Teleskop', 'Teller', 'Tempel', 'Tempo', 'Tennis', 'Teppich',
  'Teppichboden', 'Termin', 'Terrasse', 'Testament', 'Theater', 'Thema', 'Theorie', 'Thermometer', 'Thron', 'Tiefgarage',
  'Tiefsinn', 'Tierarzt', 'Tiger', 'Tinte', 'Tintenfisch', 'Tischdecke', 'Titel', 'Toast', 'Toilette', 'Tomate',
  'Tomatensaft', 'Tonne', 'Topas', 'Torfmoor', 'Torte', 'Tourist', 'Trabant', 'Tracht', 'Trainer', 'Traktor',
  'Trauer', 'Trauerweide', 'Traum', 'Treffer', 'Treibhaus', 'Treibholz', 'Trend', 'Treppe', 'Tresor', 'Tribut',
  'Trichter', 'Trikot', 'Trinkwasser', 'Trommel', 'Trompete', 'Tropfen', 'Trugbild', 'Truhe', 'Trupp', 'Tulpe',
  'Tumor', 'Tunnel', 'Turban', 'Turbine', 'Turmfalke', 'Turnhalle', 'Turnier', 'Tusche', 'Tutor', 'Typus',
  // U
  'Uhrmacher', 'Ulmenholz', 'Umleitung', 'Umzug', 'Unfall', 'Uniform', 'Union', 'Universum', 'Unruhe', 'Unterholz',
  'Unterricht', 'Unterschrift', 'Urgestein', 'Urkunde', 'Urlaub', 'Ursache', 'Urteil',
  // V
  'Vanille', 'Vater', 'Ventil', 'Ventilator', 'Verband', 'Verbrecher', 'Verein', 'Vergangenheit', 'Verkehr', 'Versammlung',
  'Verschlag', 'Verstand', 'Vertrag', 'Vertrauen', 'Viehweide', 'Viertel', 'Villa', 'Violine', 'Virus', 'Vision',
  'Vitrine', 'Vogel', 'Vogelnest', 'Vollmond', 'Vorhang', 'Vorlesung', 'Vorrat', 'Vorschlag', 'Vorteil', 'Vulkan',
  'Vulkanasche',
  // W
  'Waage', 'Wache', 'Wachturm', 'Waffe', 'Waffel', 'Waffeleisen', 'Wagen', 'Wagenheber', 'Wahlkampf', 'Waldbrand',
  'Waldhorn', 'Walnuss', 'Walze', 'Wanderschuh', 'Wandtafel', 'Wanne', 'Wappen', 'Warteschlange', 'Warze', 'Wasser',
  'Wasserfall', 'Wasserhahn', 'Watte', 'Weber', 'Wechsel', 'Wecker', 'Wegweiser', 'Wehrgang', 'Weiher', 'Weinberg',
  'Weinranke', 'Weinstock', 'Weizen', 'Wellblech', 'Welle', 'Weltkarte', 'Weltmeister', 'Werkbank', 'Werkstatt', 'Weste',
  'Wettbewerb', 'Wette', 'Wiege', 'Wiese', 'Wiesental', 'Wildbach', 'Wildfang', 'Wimper', 'Windel', 'Windhauch',
  'Windrichtung', 'Windspiel', 'Winkel', 'Winter', 'Winterjacke', 'Wippe', 'Wirbel', 'Wissen', 'Wissenschaft', 'Witwe',
  'Woche', 'Wohnzimmer', 'Wolke', 'Wolkenkratzer', 'Wolle', 'Wonne', 'Wortschatz', 'Wrack', 'Wunde', 'Wunder',
  'Wunderkerze', 'Wurzel',
  // Y
  'Yacht',
  // Z
  'Zahnarzt', 'Zahnkranz', 'Zahnpasta', 'Zange', 'Zapfen', 'Zauber', 'Zaunpfahl', 'Zebra', 'Zeder', 'Zeiger',
  'Zeile', 'Zeitgeist', 'Zeitschrift', 'Zeitung', 'Zelle', 'Zement', 'Zentimeter', 'Zentrum', 'Zettel', 'Zeuge',
  'Zeugnis', 'Ziege', 'Ziegel', 'Ziegelstein', 'Zielscheibe', 'Ziffer', 'Zigarre', 'Zimmer', 'Zimmermann', 'Zinke',
  'Zinne', 'Zirkel', 'Zirkus', 'Zirkuszelt', 'Zitat', 'Zitrone', 'Zucker', 'Zuckerdose', 'Zugbegleiter', 'Zunge',
  'Zuschauer', 'Zwerg', 'Zwiebel', 'Zwischenfall', 'Zylinder',
];
