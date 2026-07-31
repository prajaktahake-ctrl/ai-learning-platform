import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Circle, CheckCircle2, Loader2, Plus, Map, Compass, Award } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../auth';
import type { LearningPath, QuizResultEntry, Subtopic } from '../types';
import { EmptyState, ErrorBanner, ProgressRing } from './ui';
import { GeneratePathModal } from './GeneratePathModal';
import { QuizModal } from './QuizModal';
import { RoutePath } from './RoutePath';

// function SubtopicRow({
//   subtopic,
//   onMark,
//   markingId,
// }: {
//   subtopic: Subtopic;
//   onMark: (s: Subtopic) => void;
//   markingId: string | null;
// }) {
//   const done = subtopic.status === 'completed';
//   const isMarking = markingId === subtopic.subtopic_id;
//   return (
//     <div className="flex items-center gap-3 py-2.5 pl-9 pr-2">
//       <div className="shrink-0">
//         {done ? (
//           // <CheckCircle2 size={18} className="text-mustard-500" />
//           <CheckCircle2 size={18} className="text-pine-500" />
//         ) : (
//           <Circle size={18} className="text-fog-400" />
//         )}
//       </div>
//       <span className={`flex-1 text-sm ${done ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
//         {subtopic.title}
//       </span>
//       {!done && (
//         <button
//           onClick={() => onMark(subtopic)}
//           disabled={isMarking}
//           className="flex items-center gap-1.5 rounded-lg border border-pine-300 px-2.5 py-1 text-xs font-medium text-pine-600 transition-all hover:bg-pine-50 active:scale-[0.97] disabled:opacity-60"
//         >
//           {isMarking ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
//           Mark complete
//         </button>
//       )}
//     </div>
//   );
// }
function SubtopicRow({
  subtopic,
  onMark,
  markingId,
  onTakeQuiz,
}: {
  subtopic: Subtopic;
  onMark: (s: Subtopic) => void;
  markingId: string | null;
  onTakeQuiz: (quizId: string) => void;
}) {
  const done = subtopic.status === 'completed';
  const isMarking = markingId === subtopic.subtopic_id;
  const hasPendingQuiz = done && !!subtopic.quiz_id && !subtopic.quiz_taken;
  return (
    <div className="flex items-center gap-3 py-2.5 pl-9 pr-2">
      <div className="shrink-0">
        {done ? (
          <CheckCircle2 size={18} className="text-pine-500" />
        ) : (
          <Circle size={18} className="text-fog-400" />
        )}
      </div>
      <span className={`flex-1 text-sm ${done ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
        {subtopic.title}
      </span>
      {!done && (
        <button
          onClick={() => onMark(subtopic)}
          disabled={isMarking}
          className="flex items-center gap-1.5 rounded-lg border border-pine-300 px-2.5 py-1 text-xs font-medium text-pine-600 transition-all hover:bg-pine-50 active:scale-[0.97] disabled:opacity-60"
        >
          {isMarking ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
          Mark complete
        </button>
      )}
      {hasPendingQuiz && (
        <button
          onClick={() => onTakeQuiz(subtopic.quiz_id!)}
          className="flex items-center gap-1.5 rounded-lg border border-coral-400 px-2.5 py-1 text-xs font-medium text-coral-600 transition-all hover:bg-coral-500/10 active:scale-[0.97]"
        >
          <Award size={12} />
          Take quiz
        </button>
      )}
    </div>
  );
}

// function TopicCard({
//   topic,
//   onMark,
//   markingId,
// }: {
//   topic: LearningPath['topics'][number];
//   onMark: (s: Subtopic) => void;
//   markingId: string | null;
// }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="overflow-hidden rounded-xl border border-fog-300 bg-fog-100/50">
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-fog-100"
//       >
//         {open ? <ChevronDown size={16} className="text-ink-400" /> : <ChevronRight size={16} className="text-ink-400" />}
//         <span className="flex-1 text-sm font-medium text-ink-900">{topic.title}</span>
//         <span className="stat text-xs text-ink-500">{topic.progress}%</span>
//       </button>
//       {open && (
//         <div className="border-t border-fog-300/70 animate-fade-in">
//           {topic.subtopics.length === 0 ? (
//             <p className="px-4 py-3 text-xs text-ink-400">No subtopics</p>
//           ) : (
//             topic.subtopics.map((s) => (
//               <SubtopicRow key={s.subtopic_id} subtopic={s} onMark={onMark} markingId={markingId} />
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
function TopicCard({
  topic,
  onMark,
  markingId,
  onTakeQuiz,
}: {
  topic: LearningPath['topics'][number];
  onMark: (s: Subtopic) => void;
  markingId: string | null;
  onTakeQuiz: (quizId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasPendingTopicQuiz = !!topic.quiz_id && !topic.quiz_taken;
  return (
    <div className="overflow-hidden rounded-xl border border-fog-300 bg-fog-100/50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-fog-100"
      >
        {open ? <ChevronDown size={16} className="text-ink-400" /> : <ChevronRight size={16} className="text-ink-400" />}
        <span className="flex-1 text-sm font-medium text-ink-900">{topic.title}</span>
        {hasPendingTopicQuiz && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onTakeQuiz(topic.quiz_id!);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-coral-400 px-2.5 py-1 text-xs font-medium text-coral-600 transition-all hover:bg-coral-500/10 active:scale-[0.97]"
          >
            <Award size={12} />
            Take topic quiz
          </span>
        )}
        <span className="stat text-xs text-ink-500">{topic.progress}%</span>
      </button>
      {open && (
        <div className="border-t border-fog-300/70 animate-fade-in">
          {topic.subtopics.length === 0 ? (
            <p className="px-4 py-3 text-xs text-ink-400">No subtopics</p>
          ) : (
            topic.subtopics.map((s) => (
              <SubtopicRow key={s.subtopic_id} subtopic={s} onMark={onMark} markingId={markingId} onTakeQuiz={onTakeQuiz} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// function PathCard({
//   path,
//   onMark,
//   markingId,
//   index,
// }: {
//   path: LearningPath;
//   onMark: (s: Subtopic) => void;
//   markingId: string | null;
//   index: number;
// }) {
function PathCard({
  path,
  onMark,
  markingId,
  index,
  onTakeQuiz,
}: {
  path: LearningPath;
  onMark: (s: Subtopic) => void;
  markingId: string | null;
  index: number;
  onTakeQuiz: (quizId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="card glass-hover overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-5 p-5 sm:p-6">
        <ProgressRing value={path.progress} size={64} stroke={5} />
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-display text-lg italic font-medium text-ink-900">{path.title}</h3>
          <p className="mt-0.5 text-xs text-ink-500">
            {path.topics.length} topic{path.topics.length !== 1 && 's'} ·{' '}
            <span className="stat">{path.progress}%</span> complete
          </p>
        </div>
        <button onClick={() => setExpanded((e) => !e)} className="btn-ghost shrink-0">
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-fog-300/70 px-5 py-5 sm:px-6 animate-fade-in">
          {/* signature route visualization */}
          <div className="mb-6 rounded-xl bg-fog-100/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-ink-500">
              <Map size={13} />
              Your route
            </div>
            <RoutePath path={path} />
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-ink-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-mustard-500" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-coral-500/40 animate-pulse-ring" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral-500" />
                </span>
                You are here
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-fog-400 bg-fog-50" /> Upcoming
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {path.topics.map((t) => (
              <TopicCard key={t.topic_id} topic={t} onMark={onMark} markingId={markingId} onTakeQuiz={onTakeQuiz} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card p-6">
          <div className="flex items-center gap-5">
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-3 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const { session } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGen, setShowGen] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboard(session!.email);
      setPaths(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // async function handleMark(subtopic: Subtopic) {
  //   setMarkingId(subtopic.subtopic_id);
  //   try {
  //     const res = await api.completeSubtopic(subtopic.subtopic_id);
  //     if (res.subtopic_quiz_id) {
  //       setQuizId(res.subtopic_quiz_id);
  //       setQuizOpen(true);
  //     } else if (res.topic_quiz_id) {
  //       setQuizId(res.topic_quiz_id);
  //       setQuizOpen(true);
  //     }
  //     await load();
  //   } catch (e) {
  //     setError(e instanceof Error ? e.message : 'Failed to mark complete');
  //   } finally {
  //     setMarkingId(null);
  //   }
  // }
  async function handleMark(subtopic: Subtopic) {
    setMarkingId(subtopic.subtopic_id);
    try {
      const res = await api.completeSubtopic(subtopic.subtopic_id);
      if (res.subtopic_quiz_id) {
        setQuizId(res.subtopic_quiz_id);
        setQuizOpen(true);
      } else if (res.topic_quiz_id) {
        setQuizId(res.topic_quiz_id);
        setQuizOpen(true);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to mark complete');
    } finally {
      setMarkingId(null);
    }
  }

  function handleTakeQuiz(quizIdToOpen: string) {
    setQuizId(quizIdToOpen);
    setQuizOpen(true);
  }

  return (
    <div className="relative min-h-screen topo-bg">
      <div className="absolute inset-0 topo-lines opacity-30" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-pine-500">
              <Compass size={14} />
              Your journeys
            </div>
            <h1 className="font-display text-3xl italic font-medium tracking-tight text-ink-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-500">Signed in as {session?.email}</p>
          </div>
          <button onClick={() => setShowGen(true)} className="btn-primary shrink-0">
            <Plus size={16} />
            Generate a new path
          </button>
        </div>

        {error && <div className="mb-6"><ErrorBanner message={error} onDismiss={() => setError(null)} /></div>}

        {loading ? (
          <DashboardSkeleton />
        ) : paths.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Map size={28} />}
              title="No learning paths yet"
              subtitle="Generate your first AI-crafted roadmap and start your journey."
            />
            <div className="pb-10 text-center">
              <button onClick={() => setShowGen(true)} className="btn-primary">
                <Plus size={16} />
                Generate a new path
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {paths.map((p, i) => (
              <PathCard key={p.learning_path_id} path={p} onMark={handleMark} markingId={markingId} index={i} onTakeQuiz={handleTakeQuiz} />
            ))}
          </div>
        )}
      </div>

      <GeneratePathModal open={showGen} onClose={() => setShowGen(false)} onGenerated={load} />
      {quizId && (
        <QuizModal
          quizId={quizId}
          open={quizOpen}
          onClose={() => {
            setQuizOpen(false);
            setQuizId(null);
          }}
          onSubmitted={load}
        />
      )}
    </div>
  );
}

function QuizResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-1/2" />
              <div className="skeleton h-2 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuizResults() {
  const { session } = useAuth();
  const [results, setResults] = useState<QuizResultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getQuizHistory(session!.email);
        setResults(res.results);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load quiz history');
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  return (
    <div className="relative min-h-screen topo-bg">
      <div className="absolute inset-0 topo-lines opacity-30" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-coral-500">
            <Award size={14} />
            Assessment history
          </div>
          <h1 className="font-display text-3xl italic font-medium tracking-tight text-ink-900 sm:text-4xl">
            Quiz results
          </h1>
        </div>

        {error && <div className="mb-6"><ErrorBanner message={error} onDismiss={() => setError(null)} /></div>}

        {loading ? (
          <QuizResultsSkeleton />
        ) : results.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={<Award size={28} />}
              title="No quizzes taken yet"
              subtitle="Complete subtopics on your paths to unlock knowledge checks."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div
                key={`${r.quiz_id}-${i}`}
                className="card glass-hover flex items-center gap-4 p-4 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProgressRing value={r.percentage} size={52} stroke={4} label={`${r.percentage}%`} />
                <div className="flex-1">
                  <span className="rounded-md bg-fog-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-label text-ink-600">
                    {r.type}
                  </span>
                  <p className="mt-1 text-sm font-medium text-ink-900">
                    <span className="stat">{r.score}</span> / <span className="stat">{r.total}</span> correct
                  </p>
                  <p className="stat mt-0.5 text-[11px] text-ink-400">{r.quiz_id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
