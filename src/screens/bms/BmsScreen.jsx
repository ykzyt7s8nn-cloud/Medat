/**
 * BMS-Tab: Lexikon und Quiz.
 *
 * Die Inhalte werden erst beim Öffnen eines Fachs geladen (dynamischer Import).
 * Für die fachübergreifende Suche werden alle vier Fächer nachgeladen – aber
 * erst, wenn wirklich gesucht wird.
 */
import { useEffect, useMemo, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Icon from '../../components/ui/Icon.jsx';
import ProgressRing from '../../components/ui/ProgressRing.jsx';
import Segmented from '../../components/ui/Segmented.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import Button from '../../components/ui/Button.jsx';
import { BMS_TOTAL, SUBJECTS, SUBJECT_ORDER, loadAllSubjects, loadSubject } from '../../data/bms/index.js';
import { formatTime } from '../../hooks/useCountdown.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useBmsProgress } from '../../store/useBmsProgress.js';

/** Lädt ein Fach und meldet Ladezustand zurück. */
function useSubjectContent(subjectId) {
  const [content, setContent] = useState(null);
  useEffect(() => {
    let active = true;
    setContent(null);
    loadSubject(subjectId).then((data) => { if (active) setContent(data); });
    return () => { active = false; };
  }, [subjectId]);
  return content;
}

function SubjectChips({ value, onChange }) {
  return (
    <div className="scroll-area flex gap-2 overflow-x-auto pb-1">
      {SUBJECT_ORDER.map((id) => {
        const subject = SUBJECTS[id];
        const active = value === id;
        return (
          <Tappable
            key={id}
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-medium ${
              active ? 'text-white' : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
            }`}
            style={active ? { backgroundColor: subject.accent } : undefined}
          >
            <Icon name={subject.icon} className="h-4 w-4" />
            {subject.name}
          </Tappable>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- Lexikon */

function LexikonView() {
  const openScreen = useNavigation((state) => state.openScreen);
  const readEntries = useBmsProgress((state) => state.readEntries);
  const [subjectId, setSubjectId] = useState('biologie');
  const [query, setQuery] = useState('');
  const [allContent, setAllContent] = useState(null);
  const content = useSubjectContent(subjectId);

  // Für die Suche werden alle Fächer gebraucht – erst dann nachladen.
  useEffect(() => {
    if (query.trim().length < 2 || allContent) return undefined;
    let active = true;
    loadAllSubjects().then((data) => { if (active) setAllContent(data); });
    return () => { active = false; };
  }, [allContent, query]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2 || !allContent) return null;
    const hits = [];
    for (const id of SUBJECT_ORDER) {
      for (const topic of allContent[id].topics) {
        for (const entry of topic.entries) {
          const haystack = `${entry.title} ${entry.text} ${entry.facts.join(' ')}`.toLowerCase();
          if (haystack.includes(term)) hits.push({ subjectId: id, topic, entry });
        }
      }
    }
    return hits.slice(0, 40);
  }, [allContent, query]);

  const entryIds = content ? content.topics.flatMap((topic) => topic.entries.map((entry) => entry.id)) : [];
  const readCount = entryIds.filter((id) => readEntries[id]).length;

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 rounded-xl bg-black/[0.06] px-3 py-2.5 dark:bg-white/10">
        <Icon name="search" className="h-[18px] w-[18px] shrink-0 text-black/40 dark:text-white/40" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Alle Fächer durchsuchen …"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-black/40 dark:placeholder:text-white/40"
          aria-label="Lexikon durchsuchen"
        />
      </label>

      {results ? (
        <section className="space-y-2">
          <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
            {results.length === 0 ? 'Keine Treffer' : `${results.length} Treffer`}
          </h2>
          {results.map(({ subjectId: hitSubject, topic, entry }) => (
            <Tappable
              key={entry.id}
              onClick={() => openScreen('bmsEntry', { subjectId: hitSubject, entryId: entry.id })}
              className="ios-card flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium">{entry.title}</span>
                <span className="block truncate text-[12px] text-black/45 dark:text-white/45">
                  {SUBJECTS[hitSubject].name} · {topic.title}
                </span>
              </span>
              {readEntries[entry.id] && <Icon name="check" className="h-4 w-4 shrink-0 text-ios-green" />}
              <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-black/25 dark:text-white/25" />
            </Tappable>
          ))}
        </section>
      ) : (
        <>
          <SubjectChips value={subjectId} onChange={setSubjectId} />

          {!content ? (
            <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">Lädt …</p>
          ) : content.topics.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">
              Für dieses Fach sind noch keine Einträge hinterlegt.
            </p>
          ) : (
            <>
              <div className="ios-card flex items-center gap-3 px-4 py-3">
                <ProgressRing
                  value={entryIds.length ? readCount / entryIds.length : 0}
                  size={44}
                  strokeWidth={4.5}
                  color={SUBJECTS[subjectId].accent}
                >
                  <span className="tabular text-[11px] font-bold">{readCount}</span>
                </ProgressRing>
                <span className="text-[14px] text-black/60 dark:text-white/60">
                  {readCount} von {entryIds.length} Einträgen gelesen
                </span>
              </div>

              {content.topics.map((topic) => (
                <section key={topic.id} className="space-y-1.5">
                  <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
                    {topic.title}
                  </h2>
                  <div className="ios-list">
                    {topic.entries.map((entry) => (
                      <Tappable
                        key={entry.id}
                        onClick={() => openScreen('bmsEntry', { subjectId, entryId: entry.id })}
                        className="ios-row text-left"
                      >
                        <span className="min-w-0 flex-1 truncate">{entry.title}</span>
                        {readEntries[entry.id] && <Icon name="check" className="h-4 w-4 shrink-0 text-ios-green" />}
                        <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-black/25 dark:text-white/25" />
                      </Tappable>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- Quiz */

function QuizView() {
  const openScreen = useNavigation((state) => state.openScreen);
  const subjectAccuracy = useBmsProgress((state) => state.subjectAccuracy);

  return (
    <div className="space-y-4">
      <Tappable
        onClick={() => openScreen('bmsSimulation')}
        className="flex w-full items-center gap-4 rounded-card bg-gradient-to-br from-ios-green to-ios-teal px-4 py-4 text-left text-white shadow-card"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <Icon name="trophy" className="h-6 w-6" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-semibold">BMS-Simulation</span>
          <span className="mt-0.5 block text-[13px] opacity-90">
            {BMS_TOTAL.questionCount} Fragen in {formatTime(BMS_TOTAL.seconds)} – alle vier Fächer nacheinander
          </span>
        </span>
        <Icon name="chevronRight" className="h-5 w-5 opacity-80" />
      </Tappable>

      <section className="space-y-3">
        <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
          Einzelfach-Training
        </h2>
        {SUBJECT_ORDER.map((id) => {
          const subject = SUBJECTS[id];
          const accuracy = subjectAccuracy(id);
          return (
            <Tappable
              key={id}
              onClick={() => openScreen('bmsQuiz', { subjectId: id })}
              className="ios-card flex w-full items-center gap-4 px-4 py-4 text-left"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${subject.accent}1A`, color: subject.accent }}
              >
                <Icon name={subject.icon} className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold">{subject.name}</span>
                <span className="mt-0.5 block text-[13px] text-black/50 dark:text-white/50">
                  {subject.questionCount} Fragen in {formatTime(subject.seconds)}
                </span>
                <span className="mt-1 block text-[12px] text-black/40 dark:text-white/40">
                  {accuracy === null ? 'Noch nicht geübt' : `${Math.round(accuracy * 100)} % richtig bisher`}
                </span>
              </span>
              <ProgressRing
                value={accuracy ?? 0}
                size={44}
                strokeWidth={4.5}
                color={subject.accent}
                label={`${Math.round((accuracy ?? 0) * 100)} Prozent richtig`}
              >
                <span className="tabular text-[11px] font-bold" style={{ color: subject.accent }}>
                  {accuracy === null ? '–' : Math.round(accuracy * 100)}
                </span>
              </ProgressRing>
            </Tappable>
          );
        })}
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45">
          Nach Thema
        </h2>
        <div className="ios-list">
          {SUBJECT_ORDER.map((id) => (
            <Tappable
              key={id}
              onClick={() => openScreen('bmsQuiz', { subjectId: id, pickTopics: true })}
              className="ios-row text-left"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2.5">
                <Icon name={SUBJECTS[id].icon} className="h-4 w-4 shrink-0" style={{ color: SUBJECTS[id].accent }} />
                <span className="truncate">Themen in {SUBJECTS[id].name} wählen</span>
              </span>
              <Icon name="chevronRight" className="h-4 w-4 shrink-0 text-black/25 dark:text-white/25" />
            </Tappable>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function BmsScreen() {
  const [view, setView] = useState('lexikon');

  return (
    <Screen
      title="BMS"
      subtitle="Basiskenntnistest für Medizinische Studien"
      headerExtra={
        <Segmented
          ariaLabel="BMS-Bereich"
          options={[
            { value: 'lexikon', label: 'Lexikon' },
            { value: 'quiz', label: 'Quiz' },
          ]}
          value={view}
          onChange={setView}
        />
      }
    >
      {view === 'lexikon' ? <LexikonView /> : <QuizView />}
    </Screen>
  );
}
