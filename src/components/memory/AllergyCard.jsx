/**
 * Allergieausweis im Kartendesign.
 *
 * Zeigt exakt die acht MedAT-Felder. Das "Foto" ist ein generierter Avatar
 * (farbiger Kreis mit Initialen) – so bleibt die App ohne externe Assets
 * offline lauffähig.
 */

function Field({ label, children, wide = false }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <dt className="text-[11px] uppercase tracking-wide text-black/45 dark:text-white/45">{label}</dt>
      <dd className="text-[15px] font-medium leading-snug">{children}</dd>
    </div>
  );
}

export function Avatar({ card, size = 56 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: card.color, fontSize: size * 0.34 }}
      role="img"
      aria-label={`Foto von ${card.fullName}`}
    >
      {card.initials}
    </div>
  );
}

export function AllergyCard({ card, compact = false, className = '' }) {
  return (
    <article className={`ios-card overflow-hidden ${className}`}>
      <div className="flex items-center justify-between bg-ios-blue px-4 py-2 text-white">
        <span className="text-[12px] font-semibold uppercase tracking-wider">Allergieausweis</span>
        <span className="text-[12px] opacity-80">Nr. {card.index + 1}</span>
      </div>

      <div className="flex items-center gap-3 px-4 pt-4">
        <Avatar card={card} size={compact ? 44 : 56} />
        <div className="min-w-0">
          <p className="truncate text-[17px] font-bold leading-tight">{card.fullName}</p>
          <p className="text-[13px] text-black/50 dark:text-white/50">
            geb. {card.birthday.label} · {card.gender === 'w' ? 'weiblich' : 'männlich'}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4">
        <Field label="Blutgruppe">{card.bloodType}</Field>
        <Field label="Blutdruck">{card.bloodPressure.label}</Field>
        <Field label="Medikamente">{card.medication}</Field>
        <Field label="Brillenträger/in">{card.glasses}</Field>
        <Field label={`Allergien (${card.allergies.length})`} wide>
          <span className="flex flex-wrap gap-1.5 pt-0.5">
            {card.allergies.map((allergen) => (
              <span
                key={allergen}
                className="rounded-full bg-ios-red/10 px-2.5 py-1 text-[13px] text-ios-red dark:bg-ios-red/20"
              >
                {allergen}
              </span>
            ))}
          </span>
        </Field>
      </dl>
    </article>
  );
}

export default AllergyCard;
