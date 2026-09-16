/**
 * Aktivität über alle Testteile hinweg.
 *
 * KFF und BMS führen getrennte Verläufe – aus gutem Grund, denn sie messen
 * Verschiedenes. Für Strähne und Gesamtzeit wäre diese Trennung aber
 * irreführend: Wer eine Woche lang nur BMS geübt hat, hat geübt. Deshalb
 * werden die beiden Verläufe hier zusammengeführt, und zwar erst beim Lesen –
 * gespeichert bleibt jeder Teil für sich.
 */
import { useMemo } from 'react';
import { streakFrom } from '../lib/spacedRepetition.js';
import { useProgress } from '../store/useProgress.js';
import { useBmsProgress } from '../store/useBmsProgress.js';

export function useActivity() {
  const kffHistory = useProgress((state) => state.history);
  const bmsHistory = useBmsProgress((state) => state.history);

  return useMemo(() => {
    const all = [...kffHistory, ...bmsHistory];
    const seconds = all.reduce((sum, item) => sum + (item.seconds || 0), 0);
    return {
      streak: streakFrom(all.map((item) => item.at)),
      sessions: all.length,
      kffSessions: kffHistory.length,
      bmsSessions: bmsHistory.length,
      seconds,
      lastAt: all.length > 0 ? Math.max(...all.map((item) => item.at)) : null,
    };
  }, [bmsHistory, kffHistory]);
}

export default useActivity;
