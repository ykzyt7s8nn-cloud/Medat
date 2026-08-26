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

/** Flache, alphabetisch gepflegte Wortliste (anagramm-eindeutig). */
export const NOUNS = [
  // A
  'Abend', 'Abendessen', 'Abenteuer', 'Abteilung', 'Achterbahn', 'Acker', 'Adler', 'Akrobat', 'Aktenordner', 'Aktentasche',
  'Aktion', 'Alarm', 'Album', 'Almanach', 'Alpaka', 'Ambulanz', 'Ameise', 'Amsel', 'Anatomie', 'Anker',
  'Antenne', 'Antrag', 'Apfel', 'Apfelbaum', 'Apfelsine', 'Apotheke', 'Aprikose', 'Aquarell', 'Aquarium', 'Arbeit',
  'Arbeitsplatz', 'Archipel', 'Architekt', 'Archiv', 'Armaturenbrett', 'Armband', 'Armee', 'Aroma', 'Arsenal', 'Artikel',
  'Aschenbecher', 'Aspekt', 'Astronaut', 'Astronomie', 'Atelier', 'Athlet', 'Atomkraft', 'Attest', 'Aufenthalt',
  'Aufsatz', 'Auftrag', 'Augenbraue', 'Ausbildung', 'Ausflug', 'Auslieferung', 'Ausweis', 'Autobahn', 'Automechaniker',
  // B
  'Badezimmer', 'Bagger', 'Bahnhof', 'Balken', 'Balkon', 'Ballon', 'Banane', 'Bandage', 'Bankett', 'Bankkonto',
  'Barometer', 'Bauer', 'Bauernhof', 'Baumstamm', 'Becher', 'Beere', 'Beobachter', 'Bergsteiger', 'Bergwerk', 'Besen',
  'Besenstiel', 'Besuch', 'Beton', 'Bettdecke', 'Beute', 'Bibel', 'Bibliothek', 'Biene', 'Bierdeckel', 'Bilanz',
  'Bildschirm', 'Binde', 'Biologie', 'Birke', 'Birne', 'Bison', 'Blasmusik', 'Blatt', 'Blech', 'Bleistift',
  'Blitz', 'Block', 'Blume', 'Blumentopf', 'Bluse', 'Blutdruck', 'Blutgruppe', 'Boden', 'Bodensatz', 'Bogen',
  'Bohne', 'Bohrmaschine', 'Bombe', 'Bonus', 'Borke', 'Botanik', 'Brandstifter', 'Braten', 'Brett', 'Brief',
  'Briefkasten', 'Brieftasche', 'Brille', 'Bronze', 'Brotkorb', 'Bruder', 'Brunnen', 'Buchhaltung', 'Buchhandlung', 'Buchstabe',
  'Bucht', 'Bundesland', 'Bunker', 'Burgruine', 'Busch',
  // C
  'Chance', 'Chaos', 'Chemikalie', 'Chirurg', 'Chirurgie', 'Chronik', 'Clown', 'Comic', 'Container',
  // D
  'Dachboden', 'Dachrinne', 'Dachs', 'Dampf', 'Dampflok', 'Datenbank', 'Datum', 'Daumen', 'Decke', 'Degen',
  'Delfin', 'Denkmal', 'Denkmalschutz', 'Diagramm', 'Diamant', 'Diener', 'Diesel', 'Diktat', 'Dinkel', 'Diplom',
  'Distel', 'Docht', 'Dokument', 'Dolch', 'Domino', 'Dorfplatz', 'Draht', 'Drama', 'Drehbuch', 'Dreieck',
  'Dreiklang', 'Droge', 'Druck', 'Druckerei', 'Duell', 'Dunst', 'Durst', 'Dusche',
  // E
  'Ebene', 'Ehrenwort', 'Eiche', 'Eichhorn', 'Eierschale', 'Eimer', 'Eingang', 'Einkaufszettel', 'Eisen', 'Eisenbahn',
  'Eisscholle', 'Eiter', 'Elefant', 'Elektriker', 'Elend', 'Elfenbein', 'Elite', 'Entdeckung', 'Entfernung', 'Epoche',
  'Erbse', 'Erdbeben', 'Erdbeere', 'Erdkugel', 'Erdkunde', 'Erdrutsch', 'Erfindung', 'Ergebnis', 'Erinnerung', 'Erker',
  'Erlebnis', 'Ersatz', 'Erzieher', 'Essig', 'Etage', 'Etikett', 'Experiment', 'Explosion',
  // F
  'Fabel', 'Fabrik', 'Faden', 'Fahrer', 'Fahrkarte', 'Fahrplan', 'Fahrrad', 'Fahrstuhl', 'Falke', 'Falle',
  'Fallschirm', 'Familie', 'Farbe', 'Fasan', 'Faser', 'Feder', 'Feier', 'Feiertag', 'Feige', 'Feile',
  'Feldstecher', 'Felge', 'Fenster', 'Fensterbank', 'Fernrohr', 'Ferse', 'Feuer', 'Feuerwehr', 'Figur', 'Filmkamera',
  'Filter', 'Finsternis', 'Firma', 'Fisch', 'Fischotter', 'Flamme', 'Flanke', 'Flasche', 'Flaschenhals', 'Fledermaus',
  'Flieder', 'Fliegenpilz', 'Fliese', 'Flinte', 'Flosse', 'Flucht', 'Flugbegleiter', 'Flughafen', 'Flugzeug', 'Fluss',
  'Flusspferd', 'Folie', 'Forelle', 'Formel', 'Forscher', 'Forschung', 'Fossil', 'Fotoapparat', 'Fotograf', 'Frachtschiff',
  'Frage', 'Freiheit', 'Fremdsprache', 'Frist', 'Frucht', 'Fruchtsaft', 'Fuchs', 'Funke', 'Furche',
  // G
  'Gabel', 'Galerie', 'Galgen', 'Garten', 'Gartenzaun', 'Gasse', 'Gasthaus', 'Gaumen', 'Gebet', 'Gebiet',
  'Gebirge', 'Geburt', 'Geduld', 'Gefahr', 'Gehalt', 'Geheimnis', 'Gehirn', 'Geist', 'Geldbeutel', 'Gelenk',
  'Gemeinde', 'Generator', 'Genie', 'Geografie', 'Geologe', 'Gerste', 'Geruch', 'Geschenk', 'Gesellschaft',
  'Gesetz', 'Gesicht', 'Getreide', 'Gewehr', 'Gewicht', 'Gewissen', 'Gewitter', 'Gipfel', 'Gitarre', 'Gitter',
  'Glanz', 'Glasscherbe', 'Glaube', 'Gleis', 'Globus', 'Glocke', 'Glockenturm', 'Gnade', 'Goldmedaille', 'Gondel',
  'Grabstein', 'Grafik', 'Grammatik', 'Granit', 'Grenzstein', 'Grippe', 'Grotte', 'Grundriss', 'Gruppe', 'Gulasch',
  'Gurke',
  // H
  'Haken', 'Halle', 'Halskette', 'Hammer', 'Hamster', 'Handel', 'Handgelenk', 'Handschrift', 'Handschuh', 'Handtasche',
  'Handtuch', 'Handwerk', 'Hantel', 'Harke', 'Haufen', 'Hauptstadt', 'Hausarzt', 'Hebel', 'Hecke', 'Heide',
  'Heimat', 'Henkel', 'Herbst', 'Herbstlaub', 'Herde', 'Herzog', 'Hindernis', 'Hirsch', 'Hirse', 'Hobel',
  'Hochhaus', 'Hochzeit', 'Hocker', 'Hoffnung', 'Honig', 'Hopfen', 'Horde', 'Horizont', 'Hornisse', 'Horst',
  'Hosentasche', 'Hotel', 'Hubschrauber', 'Humor', 'Hunger', 'Hymne',
  // I
  'Illusion', 'Imkerei', 'Impfstoff', 'Impuls', 'Index', 'Indiz', 'Industrie', 'Infekt', 'Inhalt', 'Innenhof',
  'Inschrift', 'Insekt', 'Instrument', 'Interview', 'Intrige', 'Ironie', 'Irrtum',
  // J
  'Jargon', 'Jasmin', 'Journal', 'Jubel', 'Jugend', 'Junge', 'Jurist', 'Juwel',
  // K
  'Kabel', 'Kabine', 'Kabinett', 'Kaffee', 'Kajak', 'Kakao', 'Kaktus', 'Kalender', 'Kamel', 'Kamera',
  'Kamin', 'Kaminfeger', 'Kammer', 'Kampf', 'Kanal', 'Kanne', 'Kante', 'Kapsel', 'Karotte', 'Kartoffel',
  'Karton', 'Kasten', 'Katze', 'Kaufmann', 'Kegel', 'Kehle', 'Keller', 'Kellner', 'Kenner', 'Kerbe',
  'Kerze', 'Kerzenlicht', 'Kessel', 'Kette', 'Keule', 'Kiesel', 'Kimono', 'Kinderwagen', 'Kirche', 'Kirchturm',
  'Kissen', 'Kiste', 'Klage', 'Klammer', 'Klang', 'Klarinette', 'Klasse', 'Klaue', 'Klavier', 'Kleid',
  'Klemme', 'Klima', 'Klinge', 'Klingelknopf', 'Klinik', 'Klippe', 'Kloster', 'Knabe', 'Knebel', 'Knoblauch',
  'Knochen', 'Knopf', 'Knoten', 'Kobalt', 'Kochtopf', 'Koffer', 'Kohle', 'Kolben', 'Kolonie', 'Komet',
  'Kommode', 'Kompass', 'Kompliment', 'Konferenz', 'Konfetti', 'Konsul', 'Kontinent', 'Kontor', 'Konzentration', 'Konzert',
  'Kopfkissen', 'Kopie', 'Kordel', 'Korken', 'Korkenzieher', 'Korsett', 'Krabbe', 'Kraft', 'Kraftwerk', 'Kragen',
  'Krampf', 'Kranich', 'Krankenhaus', 'Krankenwagen', 'Kranz', 'Krater', 'Kredit', 'Kreide', 'Kreis', 'Kresse',
  'Kreuz', 'Krieg', 'Kristall', 'Kritik', 'Krokus', 'Krone', 'Kronleuchter', 'Kruste', 'Kubus', 'Kuchen',
  'Kugel', 'Kunde', 'Kunst', 'Kunstwerk', 'Kupfer', 'Kurbel', 'Kurier', 'Kurve', 'Kutsche',
  // L
  'Laboratorium', 'Labyrinth', 'Landkarte', 'Landschaft', 'Lanze', 'Laser', 'Lastwagen', 'Latte', 'Laube', 'Lauch',
  'Laune', 'Lautsprecher', 'Lawine', 'Lawinengefahr', 'Lebensmittel', 'Leder', 'Legende', 'Lehne', 'Lehrbuch', 'Lehrer',
  'Leine', 'Leinwand', 'Leiter', 'Lektor', 'Lenker', 'Leopard', 'Lerche', 'Leuchtturm', 'Libelle', 'Licht',
  'Lichtschalter', 'Liebe', 'Liebesbrief', 'Lieferant', 'Limonade', 'Linde', 'Lineal', 'Linie', 'Lippe', 'Literatur',
  'Lobby', 'Locke', 'Logik', 'Lokal', 'Lokomotive', 'Lorbeer', 'Lotse', 'Lotto', 'Luftballon', 'Lunge',
  'Luxus',
  // M
  'Magen', 'Magier', 'Magnesium', 'Magnet', 'Makler', 'Maler', 'Mandel', 'Mangel', 'Mannschaft', 'Mantel',
  'Marke', 'Markt', 'Marktplatz', 'Marmelade', 'Marmor', 'Marsch', 'Maschine', 'Maske', 'Masse', 'Mathematik',
  'Matte', 'Mauer', 'Mauerwerk', 'Maurer', 'Mechanismus', 'Medaille', 'Medizin', 'Meile', 'Meise', 'Melodie',
  'Melone', 'Menge', 'Mensch', 'Menschheit', 'Messer', 'Metall', 'Meteor', 'Meter', 'Miene', 'Mikroskop',
  'Milbe', 'Milch', 'Milchglas', 'Mineral', 'Minze', 'Mispel', 'Mitte', 'Mitternacht', 'Mixer', 'Moment',
  'Monat', 'Mondschein', 'Monitor', 'Moped', 'Mosaik', 'Motiv', 'Motor', 'Motorboot', 'Motorhaube', 'Motte',
  'Mulde', 'Mumie', 'Museum', 'Muskel', 'Muster', 'Mutter',
  // N
  'Nabel', 'Nachbarin', 'Nachricht', 'Nachtisch', 'Nadelbaum', 'Nagel', 'Nahrung', 'Narbe', 'Nationalpark', 'Natur',
  'Naturschutz', 'Nebelbank', 'Neffe', 'Nessel', 'Nichte', 'Nickel', 'Niere', 'Nomade', 'Notausgang', 'Notiz',
  'Notizblock', 'Nougat', 'Novelle', 'Nudel', 'Nummer', 'Nutzen',
  // O
  'Oberarzt', 'Objekt', 'Ochse', 'Oktave', 'Olive', 'Onkel', 'Operation', 'Opfer', 'Orange', 'Orangensaft',
  'Orbit', 'Orchester', 'Orden', 'Ordnung', 'Organ', 'Organismus', 'Orgel', 'Orkan', 'Ornament', 'Ozean',
  // P
  'Palast', 'Palette', 'Panda', 'Panik', 'Panzer', 'Papier', 'Papierkorb', 'Pappel', 'Parade', 'Parfum',
  'Parkplatz', 'Partie', 'Passagier', 'Paste', 'Pastor', 'Patent', 'Patient', 'Pauke', 'Pause', 'Pension',
  'Pergament', 'Perle', 'Person', 'Pfanne', 'Pfannkuchen', 'Pfefferminze', 'Pfeife', 'Pfeil', 'Pfeiler', 'Pferd',
  'Pfirsich', 'Pflanze', 'Pflaster', 'Pflasterstein', 'Pflug', 'Pforte', 'Pfosten', 'Pfote', 'Pfund', 'Phase',
  'Philosophie', 'Physik', 'Physiker', 'Piano', 'Pilger', 'Pilot', 'Pilzsammler', 'Pinguin', 'Pinsel', 'Pirat',
  'Piste', 'Pizza', 'Plakat', 'Planet', 'Planetarium', 'Plastik', 'Platte', 'Platz', 'Plombe', 'Pokal',
  'Politik', 'Politiker', 'Pollen', 'Portal', 'Porzellan', 'Poster', 'Postkarte', 'Praktikum', 'Prinz', 'Prisma',
  'Probe', 'Professor', 'Profil', 'Projekt', 'Prospekt', 'Protest', 'Provinz', 'Prozent', 'Prozessor', 'Psychopath',
  'Pudel', 'Puder', 'Pullover', 'Pulver', 'Punkt', 'Puppe', 'Pyramide',
  // Q
  'Quader', 'Quadrant', 'Qualle', 'Quarz', 'Quelle', 'Quirl', 'Quote',
  // R
  'Rabatt', 'Rachen', 'Radiergummi', 'Radio', 'Rahmen', 'Rakete', 'Rampe', 'Rasen', 'Raster', 'Rathaus',
  'Ratte', 'Raubtier', 'Raupe', 'Rebell', 'Rechen', 'Rechnung', 'Reflex', 'Regen', 'Regenbogen', 'Regenmantel',
  'Regenschirm', 'Regenwolke', 'Reifen', 'Reihe', 'Reisekoffer', 'Rekord', 'Relief', 'Reptil', 'Rettich', 'Rettungsboot',
  'Revier', 'Rezeption', 'Richter', 'Richtung', 'Riegel', 'Riemen', 'Riesenrad', 'Rinde', 'Ringelnatter', 'Rippe',
  'Ritter', 'Ritual', 'Robbe', 'Roboter', 'Rodeo', 'Roggen', 'Rohstoff', 'Rolle', 'Roman', 'Rosine',
  'Rotor', 'Rotwein', 'Rubin', 'Rucksack', 'Ruder', 'Ruine', 'Rumpf', 'Runde', 'Rutsche',
  // S
  'Safari', 'Saite', 'Salon', 'Salto', 'Salut', 'Samen', 'Sammler', 'Sandstrand', 'Sattel', 'Sauerstoff',
  'Sauna', 'Schachbrett', 'Schacht', 'Schaden', 'Schallplatte', 'Schalter', 'Schatten', 'Schatz', 'Schatzkiste', 'Schaufel',
  'Schaufenster', 'Schaukel', 'Scheibe', 'Scheinwerfer', 'Schenkel', 'Schere', 'Scherz', 'Scheune', 'Schicht', 'Schiedsrichter',
  'Schiene', 'Schiff', 'Schild', 'Schilf', 'Schimmel', 'Schirm', 'Schlaf', 'Schlafsack', 'Schlagzeug', 'Schlange',
  'Schlauch', 'Schleife', 'Schlitten', 'Schlittschuh', 'Schloss', 'Schlucht', 'Schmerz', 'Schmetterling', 'Schmied', 'Schnabel',
  'Schnecke', 'Schnee', 'Schneeflocke', 'Schnellzug', 'Schnitt', 'Schnur', 'Schokolade', 'Scholle', 'Schornstein', 'Schotter',
  'Schrank', 'Schraube', 'Schreck', 'Schreibtisch', 'Schrift', 'Schritt', 'Schrott', 'Schulhof', 'Schuppe', 'Schuster',
  'Schutz', 'Schwamm', 'Schwarm', 'Schwelle', 'Schwert', 'Schwester', 'Schwimmbad', 'Segel', 'Segelboot', 'Segler',
  'Seide', 'Seife', 'Seite', 'Sekte', 'Sektglas', 'Semmel', 'Senator', 'Sender', 'Sense', 'Sessel',
  'Seufzer', 'Sichel', 'Sieger', 'Signal', 'Silbe', 'Silber', 'Sirene', 'Sirup', 'Sitte', 'Skala',
  'Skalpell', 'Skelett', 'Skilift', 'Skizze', 'Sklave', 'Skulptur', 'Slalom', 'Socke', 'Sockel', 'Sohle',
  'Soldat', 'Sommer', 'Sonne', 'Sonnenblume', 'Sonnenlicht', 'Sorge', 'Sorte', 'Spagat', 'Spange', 'Spanne',
  'Spargel', 'Spaten', 'Spatz', 'Specht', 'Speck', 'Spende', 'Sperre', 'Spiegel', 'Spiel', 'Spielplatz',
  'Spinne', 'Spinnennetz', 'Spirale', 'Spitze', 'Splitter', 'Sporn', 'Sportplatz', 'Sprache', 'Sprachkurs', 'Sprung',
  'Spule', 'Staat', 'Stachelbeere', 'Stadion', 'Stadt', 'Stadtplan', 'Stall', 'Stamm', 'Stand', 'Standbild',
  'Stange', 'Start', 'Statue', 'Staub', 'Stein', 'Steinbruch', 'Stelle', 'Stempel', 'Steppe', 'Stern',
  'Sternbild', 'Steuer', 'Stichprobe', 'Stiefel', 'Stier', 'Stift', 'Stimme', 'Stimmgabel', 'Stirn', 'Stoff',
  'Stollen', 'Stolz', 'Storch', 'Strand', 'Strandkorb', 'Strauch', 'Streifen', 'Streit', 'Strich', 'Strom',
  'Stromkabel', 'Strudel', 'Strumpf', 'Stube', 'Studentin', 'Stufe', 'Stuhl', 'Stunde', 'Sturm', 'Sturz',
  'Suppe', 'Suppentopf', 'Symbol', 'System', 'Szene',
  // T
  'Tablett', 'Tafel', 'Talent', 'Tango', 'Tanne', 'Tannenbaum', 'Tante', 'Tapete', 'Tasche', 'Taschenlampe',
  'Taschentuch', 'Tasse', 'Tastatur', 'Taste', 'Taube', 'Taucher', 'Teekanne', 'Teich', 'Telefonbuch', 'Teleskop',
  'Teller', 'Tempel', 'Tempo', 'Tennis', 'Teppich', 'Teppichboden', 'Termin', 'Terrasse', 'Testament', 'Theater',
  'Thema', 'Theorie', 'Thermometer', 'Thron', 'Tiefgarage', 'Tierarzt', 'Tiger', 'Tinte', 'Tintenfisch', 'Tischdecke',
  'Titel', 'Toast', 'Toilette', 'Tomate', 'Tomatensaft', 'Tonne', 'Topas', 'Torte', 'Tourist', 'Trabant',
  'Tracht', 'Trainer', 'Traktor', 'Trauer', 'Trauerweide', 'Traum', 'Treffer', 'Treibhaus', 'Trend', 'Treppe',
  'Tresor', 'Tribut', 'Trichter', 'Trikot', 'Trinkwasser', 'Trommel', 'Trompete', 'Tropfen', 'Truhe', 'Trupp',
  'Tulpe', 'Tumor', 'Tunnel', 'Turban', 'Turbine', 'Turnhalle', 'Turnier', 'Tusche', 'Tutor', 'Typus',
  // U
  'Uhrmacher', 'Umleitung', 'Umzug', 'Unfall', 'Uniform', 'Union', 'Universum', 'Unruhe', 'Unterricht', 'Unterschrift',
  'Urkunde', 'Urlaub', 'Ursache', 'Urteil',
  // V
  'Vanille', 'Vater', 'Ventil', 'Ventilator', 'Verband', 'Verbrecher', 'Verein', 'Vergangenheit', 'Verkehr', 'Versammlung',
  'Verstand', 'Vertrag', 'Vertrauen', 'Viertel', 'Villa', 'Violine', 'Virus', 'Vision', 'Vitrine', 'Vogel',
  'Vollmond', 'Vorhang', 'Vorlesung', 'Vorrat', 'Vorschlag', 'Vorteil', 'Vulkan', 'Vulkanasche',
  // W
  'Waage', 'Wache', 'Waffe', 'Waffel', 'Waffeleisen', 'Wagen', 'Wagenheber', 'Wahlkampf', 'Waldbrand', 'Walnuss',
  'Walze', 'Wanderschuh', 'Wandtafel', 'Wanne', 'Wappen', 'Warteschlange', 'Warze', 'Wasser', 'Wasserfall', 'Wasserhahn',
  'Watte', 'Weber', 'Wechsel', 'Wecker', 'Wegweiser', 'Weiher', 'Weinberg', 'Weizen', 'Welle', 'Weltkarte',
  'Weltmeister', 'Werkstatt', 'Werkzeug', 'Weste', 'Wettbewerb', 'Wette', 'Wiege', 'Wiese', 'Wimper', 'Windel',
  'Windrichtung', 'Winkel', 'Winter', 'Winterjacke', 'Wippe', 'Wirbel', 'Wissen', 'Wissenschaft', 'Witwe', 'Woche',
  'Wohnzimmer', 'Wolke', 'Wolkenkratzer', 'Wolle', 'Wonne', 'Wortschatz', 'Wrack', 'Wunde', 'Wunder', 'Wunderkerze',
  'Wurzel',
  // Y
  'Yacht',
  // Z
  'Zahnarzt', 'Zahnpasta', 'Zange', 'Zapfen', 'Zauber', 'Zebra', 'Zeder', 'Zeiger', 'Zeile', 'Zeitschrift',
  'Zeitung', 'Zelle', 'Zement', 'Zentimeter', 'Zentrum', 'Zettel', 'Zeuge', 'Zeugnis', 'Ziege', 'Ziegel',
  'Ziegelstein', 'Zielscheibe', 'Ziffer', 'Zigarre', 'Zimmer', 'Zimmermann', 'Zinke', 'Zinne', 'Zirkel', 'Zirkus',
  'Zirkuszelt', 'Zitat', 'Zitrone', 'Zucker', 'Zuckerdose', 'Zugbegleiter', 'Zunge', 'Zuschauer', 'Zwerg', 'Zwiebel',
  'Zwischenfall', 'Zylinder',
];
