/**
 * Lexikon-Eintrag im Detail.
 *
 * Aufbau: Erklärung, Schlüsselfakten, optional Formeln und Merksatz, dazu
 * Querverweise auf verwandte Einträge. Ein Eintrag gilt als gelesen, sobald er
 * geöffnet wurde – manuell lässt sich das wieder zurücknehmen.
 */
import { useEffect, useMemo, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import { SUBJECTS, loadAllSubjects, loadSubject } from '../../data/bms/index.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useBmsProgress } from '../../store/useBmsProgress.js';

export default function BmsEntryScreen({ subjectId, entryId }) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const openScreen = useNavigation((state) => state.openScreen);
  const markRead = useBmsProgress((state) => state.markRead);
  const toggleRead = useBmsProgress((state) => state.toggleRead);
  const readEntries = useBmsProgress((state) => state.readEntries);
  const [all, setAll] = useState(null);
  const [primary, setPrimary] = useState(null);
  const [currentId, setCurrentId] = useState(entryId);

  // Zuerst nur das Fach des Eintrags laden – das genügt für die Anzeige und
  // spart beim Öffnen die übrigen drei Fächer.
  useEffect(() => {
    let active = true;
    loadSubject(subjectId).then((data) => { if (active) setPrimary({ [subjectId]: data }); });
    return () => { active = false; };
  }, [subjectId]);

  const loaded = all ?? primary;

  const index = useMemo(() => {
    const map = new Map();
    if (!loaded) return map;
    for (const [id, content] of Object.entries(loaded)) {
      for (const topic of content.topics) {
        for (const entry of topic.entries) map.set(entry.id, { subjectId: id, topic, entry });
      }
    }
    return map;
  }, [loaded]);

  const found = index.get(currentId) ?? null;

  // Die restlichen Fächer erst nachladen, wenn sie wirklich gebraucht werden:
  // für einen Eintrag aus einem anderen Fach oder einen fachübergreifenden
  // Querverweis. Die meisten Einträge kommen ohne aus.
  useEffect(() => {
    if (!primary || all) return undefined;
    const missing = !found || (found.entry.related ?? []).some((id) => !index.has(id));
    if (!missing) return undefined;
    let active = true;
    loadAllSubjects().then((data) => { if (active) setAll(data); });
    return () => { active = false; };
  }, [all, found, index, primary]);

  // Ein geöffneter Eintrag zählt als gelesen.
  useEffect(() => { markRead(currentId); }, [currentId, markRead]);

  const relatedEntries = useMemo(
    () => (found?.entry.related ?? []).map((id) => index.get(id)?.entry).filter(Boolean),
    [found, index],
  );

  if (!loaded) {
    return (
      <Screen title="Lexikon" onClose={closeScreen}>
        <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">Lädt …</p>
      </Screen>
    );
  }

  if (!found) {
    // Solange nur das Startfach geladen ist, kann der Eintrag noch in einem
    // anderen Fach liegen – dann warten statt eine Fehlmeldung zu zeigen.
    return (
      <Screen title="Lexikon" onClose={closeScreen}>
        <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">
          {all ? 'Dieser Eintrag ist noch nicht hinterlegt.' : 'Lädt …'}
        </p>
      </Screen>
    );
  }

  const { entry, topic } = found;
  const subject = SUBJECTS[found.subjectId];
  const isRead = Boolean(readEntries[entry.id]);

  return (
    <Screen title={entry.title} subtitle={`${subject.name} · ${topic.title}`} onClose={closeScreen}>
      <div className="space-y-4 pb-6">
        <section className="ios-card px-4 py-4">
          <p className="text-[15px] leading-relaxed text-black/80 dark:text-white/80">{entry.text}</p>
        </section>

        <section className="ios-card px-4 py-4">
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
            Schlüsselfakten
          </h2>
          <ul className="space-y-2">
            {entry.facts.map((fact) => (
              <li key={fact} className="flex gap-2 text-[14px] leading-snug">
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: subject.accent }}
                />
                <span className="text-black/75 dark:text-white/75">{fact}</span>
              </li>
            ))}
          </ul>
        </section>

        {entry.formulas?.length > 0 && (
          <section className="ios-card px-4 py-4">
            <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
              Formeln
            </h2>
            <ul className="space-y-2.5">
              {entry.formulas.map((formula) => (
                <li key={formula.text}>
                  <p className="tabular rounded-lg bg-black/[0.05] px-3 py-2 text-[15px] font-medium dark:bg-white/10">
                    {formula.text}
                  </p>
                  {formula.note && (
                    <p className="mt-1 px-1 text-[13px] text-black/55 dark:text-white/55">{formula.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {entry.mnemonic && (
          <section className="rounded-card bg-ios-yellow/15 px-4 py-3.5">
            <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-ios-orange">Merkhilfe</h2>
            <p className="text-[14px] leading-snug text-black/75 dark:text-white/80">{entry.mnemonic}</p>
          </section>
        )}

        {relatedEntries.length > 0 && (
          <section className="space-y-1.5">
            <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
              Verwandte Stichwörter
            </h2>
            <div className="ios-list">
              {relatedEntries.map((related) => (
                <Tappable key={related.id} onClick={() => setCurrentId(related.id)} className="ios-row text-left">
                  <span className="min-w-0 flex-1 truncate">{related.title}</span>
                  <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-black/25 dark:text-white/25" />
                </Tappable>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            variant={isRead ? 'neutral' : 'primary'}
            size="md"
            className="flex-1"
            onClick={() => toggleRead(entry.id)}
          >
            <Icon name={isRead ? 'refresh' : 'check'} className="h-5 w-5" />
            {isRead ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => openScreen('bmsQuiz', { subjectId: found.subjectId, topicIds: [topic.id] })}
          >
            Dazu üben
          </Button>
        </div>
      </div>
    </Screen>
  );
}
