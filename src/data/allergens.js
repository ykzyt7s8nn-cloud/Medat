/**
 * Allergen-Pool und medizinische Ausweisfelder für den Untertest
 * "Gedächtnis & Merkfähigkeit".
 *
 * Die Allergene sind nach Kategorie gruppiert. Die Kategorie wird genutzt, um
 * plausible Distraktoren zu bilden (ähnliche Allergene statt reiner Zufall).
 */

export const ALLERGEN_GROUPS = {
  pollen: ['Birkenpollen', 'Gräserpollen', 'Beifuß', 'Ambrosia', 'Haselpollen', 'Erlenpollen', 'Roggenpollen'],
  tiere: ['Katzenhaare', 'Hundehaare', 'Pferdehaare', 'Meerschweinchen', 'Vogelfedern', 'Tierhaare'],
  hausstaub: ['Hausstaubmilben', 'Schimmelpilze', 'Vorratsmilben'],
  nahrung: [
    'Erdnüsse', 'Haselnüsse', 'Walnüsse', 'Soja', 'Kiwi', 'Sellerie', 'Senf', 'Sesam',
    'Milcheiweiß', 'Laktose', 'Hühnerei', 'Weizen', 'Roggen', 'Meeresfrüchte', 'Fisch', 'Glutamate',
  ],
  medikamente: ['Penicillin', 'Antibiotika', 'Aspirin', 'Ibuprofen', 'Jod', 'Lokalanästhetika', 'Kontrastmittel'],
  insekten: ['Wespengift', 'Bienengift', 'Hornissengift', 'Insektengift'],
  kontakt: [
    'Latex', 'Nickel', 'Kobalt', 'Chrom', 'Duftstoffe', 'Konservierungsstoffe',
    'Farbstoffe', 'Formaldehyd', 'Wollwachs',
  ],
};

/** Flache Liste aller Allergene (52). */
export const ALLERGENS = Object.values(ALLERGEN_GROUPS).flat();

/** Umkehrindex Allergen → Kategorie, für die Distraktor-Auswahl. */
export const ALLERGEN_CATEGORY = Object.fromEntries(
  Object.entries(ALLERGEN_GROUPS).flatMap(([category, list]) => list.map((a) => [a, category])),
);

/** Blutgruppen exakt nach MedAT-Ausweis. */
export const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', '0+', '0−'];

/** Ja/Nein-Felder (Medikamenteneinnahme, Brillenträger/in). */
export const YES_NO = ['Ja', 'Nein'];
