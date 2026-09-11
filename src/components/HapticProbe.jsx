/**
 * Probierschalter für die Haptik – zugleich der Test, was das Gerät hergibt.
 *
 * Auf iOS gibt es zwei Wege, und sie sind nicht gleichwertig:
 *
 *   1. Der Nutzer tippt selbst auf einen <input type="checkbox" switch>.
 *      Das löst die systemeigene Haptik zuverlässig aus.
 *   2. Die App aktiviert einen solchen Schalter programmatisch. Ob iOS das
 *      ebenfalls mit Haptik quittiert, ist nicht zugesichert.
 *
 * Weg 2 entscheidet darüber, ob die App im laufenden Untertest überhaupt etwas
 * auslösen kann – etwa bei der Auflösung oder der Zeitwarnung. Prüfen lässt er
 * sich nur am Gerät, nicht im Code.
 *
 * Deshalb tut dieser Schalter beides nacheinander: einen Impuls sofort über den
 * Tipp (Weg 1), einen zweiten nach einer deutlichen Pause programmatisch
 * (Weg 2). Wer nur einen spürt, weiß: Die App kann Haptik nur dann auslösen,
 * wenn der Finger direkt auf einem Schalter landet.
 *
 * Die Pause ist bewusst lang. Bei 80 Millisekunden verschmelzen zwei Impulse zu
 * einem Gefühl, und genau daran scheiterte die vorige Fassung dieses Tests.
 */
import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';
import { pulse } from '../hooks/useFeedback.js';

/** Abstand zwischen dem Tipp und dem programmatischen Impuls. */
const GAP_MS = 700;

export default function HapticProbe({ onTrigger, disabled = false }) {
  const inputRef = useRef(null);
  const [stage, setStage] = useState('idle'); // idle | erster | zweiter
  const timers = useRef([]);

  // Das switch-Attribut kennt React nicht als Eigenschaft – von Hand setzen.
  useEffect(() => {
    inputRef.current?.setAttribute('switch', '');
  }, []);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const trigger = () => {
    if (disabled) return;
    timers.current.forEach(window.clearTimeout);
    // Impuls 1 kommt vom Tipp auf den Schalter selbst – dafür ist nichts zu tun.
    onTrigger?.();
    setStage('erster');
    timers.current = [
      window.setTimeout(() => { pulse(); setStage('zweiter'); }, GAP_MS),
      window.setTimeout(() => setStage('idle'), GAP_MS + 4000),
    ];
  };

  const label = {
    idle: 'Haptik testen',
    erster: 'Erster Impuls …',
    zweiter: 'Zweiter Impuls – beide gespürt?',
  }[stage];

  return (
    <>
      <label
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2 text-[15px] font-semibold transition ${
          disabled
            ? 'bg-black/5 text-black/30 dark:bg-white/10 dark:text-white/30'
            : 'bg-ios-blue/10 text-ios-blue active:scale-[0.97] dark:bg-ios-blue/20'
        }`}
      >
        {/* Der Schalter bleibt gezeichnet, aber unscheinbar: Ein ausgeblendetes
            Element löst auf iOS keine Haptik aus. */}
        <input
          ref={inputRef}
          type="checkbox"
          tabIndex={0}
          disabled={disabled}
          onChange={trigger}
          aria-label="Haptik testen"
          className="h-px w-px shrink-0 opacity-[0.01]"
        />
        {stage !== 'idle' && <Icon name="check" className="h-4 w-4" />}
        {label}
      </label>
      {!disabled && (
        <p className="mt-2 text-[12px] leading-snug text-black/45 dark:text-white/45">
          Zwei Impulse im Abstand von einer knappen Sekunde: der erste durch
          deinen Tipp, der zweite von der App ausgelöst. Spürst du nur den
          ersten, kann die App im laufenden Untertest nichts auslösen – dann
          gibt es Haptik nur dort, wo dein Finger direkt auf der Antwort landet.
        </p>
      )}
    </>
  );
}
