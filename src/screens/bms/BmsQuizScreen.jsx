/**
 * BMS-Quiz.
 *
 * Drei Einstiege, alle über dieselbe Komponente:
 *   - ganzes Fach (Standardzahl an Fragen)
 *   - ausgewählte Themen (pickTopics)
 *   - eingebettet in die BMS-Simulation (embedded)
 *
 * Im Übungsmodus wird jede Frage sofort aufgelöst: richtig/falsch, die
 * Begründung zur gewählten und zur richtigen Option und ein Weg zum passenden
 * Lexikon-Eintrag. Im Prüfungsmodus (Einstellung im KFF-Teil) gilt derselbe
 * Ablauf wie dort: überspringen, markieren, am Ende abgeben.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Screen from '../../components/layout/Screen.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';
import Tappable from '../../components/ui/Tappable.jsx';
import TimerBar from '../../components/ui/TimerBar.jsx';
import TaskNavigator from '../../components/TaskNavigator.jsx';
import ResultView from '../../components/ResultView.jsx';
import QuestionCard, { correctCount, isAnswerCorrect } from '../../components/bms/QuestionCard.jsx';
import { SUBJECTS, loadSubject } from '../../data/bms/index.js';
import { shuffle } from '../../lib/random.js';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useTaskSession } from '../../hooks/useTaskSession.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { useNavigation } from '../../store/useNavigation.js';
import { useBmsProgress } from '../../store/useBmsProgress.js';
import { useSettings } from '../../store/useSettings.js';

/** Themenauswahl vor dem Start. */
function TopicPicker({ subject, topics, selected, onToggle, onStart, onClose, questionsFor }) {
  return (
    <Screen title={`${subject.name}: Themen`} onClose={onClose}>
      <div className="space-y-3 pb-6">
        <p className="px-1 text-[14px] text-black/60 dark:text-white/60">
          Wähle die Themen, aus denen die Fragen gezogen werden.
        </p>
        <div className="ios-list">
          {topics.map((topic) => {
            const checked = selected.includes(topic.id);
            return (
              <Tappable key={topic.id} onClick={() => onToggle(topic.id)} aria-pressed={checked} className="ios-row text-left">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                    checked ? 'border-ios-blue bg-ios-blue text-white' : 'border-black/20 dark:border-white/25'
                  }`}
                >
                  {checked && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px]">{topic.title}</span>
                  <span className="block text-[12px] text-black/45 dark:text-white/45">
                    {questionsFor(topic.id)} Fragen
                  </span>
                </span>
              </Tappable>
            );
          })}
        </div>
        <Button size="lg" onClick={onStart} disabled={selected.length === 0}>
          <Icon name="play" className="h-5 w-5" />
          {selected.length === 0 ? 'Mindestens ein Thema wählen' : 'Training starten'}
        </Button>
      </div>
    </Screen>
  );
}

export default function BmsQuizScreen({
  subjectId,
  topicIds: presetTopics = null,
  pickTopics = false,
  count,
  embedded = false,
  onFinish,
}) {
  const closeScreen = useNavigation((state) => state.closeScreen);
  const openScreen = useNavigation((state) => state.openScreen);
  const addQuizResult = useBmsProgress((state) => state.addQuizResult);
  const examMode = useSettings((state) => state.mode === 'pruefung');
  const feedback = useFeedback();

  const subject = SUBJECTS[subjectId];
  const questionCount = count ?? subject.questionCount;
  const session = useTaskSession(questionCount);

  const [content, setContent] = useState(null);
  const [phase, setPhase] = useState(pickTopics ? 'topics' : 'running');
  const [selectedTopics, setSelectedTopics] = useState(presetTopics ?? []);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    let active = true;
    loadSubject(subjectId).then((data) => { if (active) setContent(data); });
    return () => { active = false; };
  }, [subjectId]);

  /** Fragen aus den gewählten Themen ziehen. */
  const buildQuestions = useCallback((topics) => {
    if (!content) return [];
    const pool = topics?.length
      ? content.questions.filter((question) => topics.includes(question.topicId))
      : content.questions;
    return shuffle(pool).slice(0, Math.min(questionCount, pool.length));
  }, [content, questionCount]);

  // Sobald die Inhalte da sind, Fragen zusammenstellen
  useEffect(() => {
    if (!content || phase === 'topics' || questions.length > 0) return;
    const built = buildQuestions(presetTopics ?? selectedTopics);
    setQuestions(built);
    startedAt.current = Date.now();
  }, [buildQuestions, content, phase, presetTopics, questions.length, selectedTopics]);

  const topicTitle = useCallback(
    (topicId) => content?.topics.find((topic) => topic.id === topicId)?.title ?? topicId,
    [content],
  );

  const finish = useCallback((items) => {
    const score = items.filter((item) => item.correct).length;
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    if (!embedded) {
      addQuizResult({
        subjectId,
        mode: presetTopics || selectedTopics.length ? 'themen' : 'fach',
        score,
        max: items.length,
        seconds,
        breakdown: items.map((item) => ({
          topicId: item.topicId,
          title: topicTitle(item.topicId),
          correct: item.correct,
        })),
      });
    }
    feedback.done();
    setResults(items);
    setPhase('result');
    onFinish?.({ subjectId, score, max: items.length, seconds, results: items });
  }, [addQuizResult, embedded, feedback, onFinish, presetTopics, selectedTopics.length, subjectId, topicTitle]);

  /** Ergebniseintrag aus einer Frage und einer Auswahl. */
  const toItem = useCallback((question, index, chosen, seconds) => {
    const letters = ['a', 'b', 'c', 'd', 'e'];
    const correctText = question.options
      .map((option, i) => (option.correct ? `${letters[i]}) ${option.text}` : null))
      .filter(Boolean)
      .join(' · ');
    const givenText = chosen.length === 0
      ? 'keine Antwort'
      : chosen.map((i) => `${letters[i]}) ${question.options[i].text}`).join(' · ');
    return {
      id: question.id,
      number: index + 1,
      correct: isAnswerCorrect(question, chosen),
      prompt: question.prompt,
      correctText,
      givenText,
      explanation: question.explanation,
      topicId: question.topicId,
      entryId: question.entryId,
      question,
      seconds,
    };
  }, []);

  /** Auswertung – in beiden Modi derselbe Weg, aus Fragen und Antworten. */
  const submit = useCallback(() => {
    const timings = session.collectTimings();
    const items = questions.map((question, index) =>
      toItem(question, index, session.answers[index] ?? [], timings[index] ?? 0));
    finish(items);
  }, [finish, questions, session, toItem]);

  const countdown = useCountdown(subject.seconds, {
    enabled: phase === 'running' && (embedded || examMode),
    autoStart: embedded,
    onExpire: () => submit(),
  });

  const { index } = session;
  const question = questions[index];
  const chosen = session.answers[index] ?? [];
  const revealed = !examMode && Boolean(session.revealed[index]);

  const toggleOption = (optionIndex) => {
    if (!question || revealed) return;
    feedback.tap();
    const single = question.kind !== 'multi';
    const next = single
      ? [optionIndex]
      : chosen.includes(optionIndex)
        ? chosen.filter((i) => i !== optionIndex)
        : [...chosen, optionIndex];
    session.setAnswer(index, next);
  };

  /** Übungsmodus: auflösen, die Frage bleibt danach unveränderlich. */
  const check = () => {
    session.reveal(index);
    if (isAnswerCorrect(question, chosen)) feedback.correct();
    else feedback.wrong();
  };

  /* ------------------------------------------------------------ Rendering */

  if (!content) {
    return (
      <Screen title={subject.name} onClose={embedded ? undefined : closeScreen}>
        <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">Inhalte werden geladen …</p>
      </Screen>
    );
  }

  if (phase === 'topics') {
    return (
      <TopicPicker
        subject={subject}
        topics={content.topics}
        selected={selectedTopics}
        questionsFor={(topicId) => content.questions.filter((q) => q.topicId === topicId).length}
        onToggle={(topicId) => setSelectedTopics((current) =>
          (current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId]))}
        onStart={() => {
          setQuestions(buildQuestions(selectedTopics));
          startedAt.current = Date.now();
          session.reset();
          setPhase('running');
        }}
        onClose={closeScreen}
      />
    );
  }

  if (phase === 'result') {
    const score = results.filter((item) => item.correct).length;
    return (
      <Screen title={`${subject.name} – Ergebnis`} onClose={closeScreen}>
        <ResultView
          title={subject.name}
          score={score}
          max={results.length}
          seconds={Math.round((Date.now() - startedAt.current) / 1000)}
          items={results}
          limitSeconds={subject.seconds}
          renderReview={(item) => (
            <div className="space-y-2">
              <p className="text-[14px] leading-snug text-black/70 dark:text-white/70">{item.explanation}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openScreen('bmsEntry', { subjectId, entryId: item.entryId })}
              >
                <Icon name="book" className="h-4 w-4" />
                Im Lexikon nachlesen
              </Button>
            </div>
          )}
          onClose={closeScreen}
        />
      </Screen>
    );
  }

  if (questions.length === 0) {
    return (
      <Screen title={subject.name} onClose={embedded ? undefined : closeScreen}>
        <p className="py-8 text-center text-[14px] text-black/45 dark:text-white/45">
          Für dieses Fach sind noch keine Fragen hinterlegt.
        </p>
      </Screen>
    );
  }

  if (!question) return null;

  const needed = correctCount(question);
  const canCheck = chosen.length === needed;

  return (
    <Screen
      title={subject.name}
      onClose={embedded ? undefined : closeScreen}
      headerExtra={
        <TimerBar
          remaining={countdown.remaining}
          total={subject.seconds}
          enabled={embedded || examMode}
          accent={subject.accent}
          progressLabel={`Frage ${index + 1} von ${questions.length} · ${topicTitle(question.topicId)}`}
        />
      }
      footer={
        <>
          {/* Im Übungsmodus wird erst geprüft, dann weitergeblättert. */}
          {!examMode && !revealed && (
            <div className="px-3 pb-1">
              <Button size="lg" onClick={check} disabled={!canCheck}>
                {canCheck ? 'Prüfen' : `Noch ${needed - chosen.length} auswählen`}
              </Button>
            </div>
          )}
          <TaskNavigator
            count={questions.length}
            index={index}
            answers={session.answers}
            flags={session.flags}
            answeredCount={session.answeredCount}
            onGoTo={session.goTo}
            onPrevious={session.previous}
            onSkip={session.skip}
            onNext={session.next}
            onToggleFlag={() => session.toggleFlag(index)}
            onSubmit={submit}
            practice={!examMode}
            revealed={revealed}
            isCorrect={(i) => isAnswerCorrect(questions[i], session.answers[i] ?? [])}
            firstOpenIndex={session.firstOpen()}
            submitLabel={examMode ? 'Abgeben' : 'Auswerten'}
          />
        </>
      }
    >
      <div className="space-y-4">
        <QuestionCard question={question} selection={chosen} onToggle={toggleOption} revealed={revealed} />

        {revealed && (
          <section className="ios-card animate-slide-up space-y-3 px-4 py-4">
            <h3
              className={`text-[15px] font-semibold ${
                isAnswerCorrect(question, chosen) ? 'text-ios-green' : 'text-ios-red'
              }`}
            >
              {isAnswerCorrect(question, chosen) ? 'Richtig' : 'Falsch'}
            </h3>
            <p className="text-[14px] leading-relaxed text-black/70 dark:text-white/70">{question.explanation}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openScreen('bmsEntry', { subjectId, entryId: question.entryId })}
            >
              <Icon name="book" className="h-4 w-4" />
              Im Lexikon nachlesen
            </Button>
          </section>
        )}
      </div>
    </Screen>
  );
}
