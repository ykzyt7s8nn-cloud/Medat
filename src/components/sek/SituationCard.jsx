/**
 * Die Situationsbeschreibung über jeder SEK-Aufgabe.
 *
 * Sie ist in allen drei Untertests der gemeinsame Kopf und bekommt deshalb
 * bewusst viel Ruhe: etwas größerer Zeilenabstand als sonst, weil sie gelesen
 * und nicht überflogen werden soll. Das Ziel bei „Emotionen regulieren“ steht
 * abgesetzt darunter – es entscheidet über die richtige Antwort und darf im
 * Fließtext nicht untergehen.
 */
export default function SituationCard({ situation, goal, accent }) {
  return (
    <section className="ios-card px-4 py-4">
      <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: accent }}>
        Situation
      </h2>
      <p className="text-[15px] leading-relaxed text-black/80 dark:text-white/85">{situation}</p>
      {goal && (
        <p className="mt-3 rounded-xl bg-black/[0.04] px-3 py-2.5 text-[14px] leading-snug dark:bg-white/[0.08]">
          <span className="font-semibold">Ziel: </span>
          {goal}
        </p>
      )}
    </section>
  );
}
