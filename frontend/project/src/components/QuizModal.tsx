import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Award, Loader2, RotateCw } from 'lucide-react';
import { api } from '../api';
import type { Quiz } from '../types';
import { ErrorBanner, Modal, ProgressBar } from './ui';

type OptionKey = 'a' | 'b' | 'c' | 'd';

export function QuizModal({
  quizId,
  open,
  onClose,
  onSubmitted,
}: {
  quizId: string;
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [result, setResult] = useState<{ score: number; total: number; correct_answers: Record<string, OptionKey> } | null>(null);

  useEffect(() => {
    if (!open || !quizId) return;
    setLoading(true);
    setError(null);
    setQuiz(null);
    setAnswers({});
    setResult(null);
    api
      .getQuiz(quizId)
      .then((q) => setQuiz(q))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [open, quizId]);

  function selectOption(qid: string, opt: OptionKey) {
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  }

  async function handleSubmit() {
    if (!quiz) return;
    setSubmitting(true);
    setError(null);
    api
      .submitQuiz(quizId, answers)
      .then((res) => {
        setResult(res);
        onSubmitted?.();
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to submit quiz'))
      .finally(() => setSubmitting(false));
  }

  const allAnswered = quiz?.questions.every((q) => answers[q.question_id]) ?? false;
  const pct = result ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="p-6 sm:p-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-ink-500">
            <Loader2 size={28} className="animate-spin text-pine-500" />
            <p className="mt-3 text-sm">Loading quiz…</p>
          </div>
        )}

        {error && !loading && (
          <div className="py-8">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {!loading && !error && quiz && !result && (
          <>
            <div className="mb-6">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-pine-500">
                <Award size={14} />
                Knowledge check
              </div>
              <h2 className="font-display text-xl italic font-medium text-ink-900">
                {quiz.questions.length} question{quiz.questions.length !== 1 && 's'}
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Pick the best answer for each. You can submit once all are answered.
              </p>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((q, idx) => (
                <div key={q.question_id} className="animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="mb-3 flex items-start gap-3">
                    <span className="stat mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-pine-50 text-xs font-semibold text-pine-500">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-ink-900">{q.question}</p>
                  </div>
                  <div className="ml-9 grid gap-2 sm:grid-cols-2">
                    {(['a', 'b', 'c', 'd'] as OptionKey[]).map((opt) => {
                      const selected = answers[q.question_id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => selectOption(q.question_id, opt)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all active:scale-[0.98] ${
                            selected
                              ? 'border-pine-500 bg-pine-50 text-ink-900'
                              : 'border-fog-300 bg-fog-50 text-ink-600 hover:border-pine-300'
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold uppercase transition-all ${
                              selected
                                ? 'bg-pine-500 text-fog-50 animate-check-pop'
                                : 'bg-fog-200 text-ink-500'
                            }`}
                          >
                            {opt}
                          </span>
                          <span>{q.options[opt]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <span className="stat text-xs text-ink-500">
                {Object.keys(answers).length} / {quiz.questions.length} answered
              </span>
              <button onClick={handleSubmit} disabled={!allAnswered || submitting} className="btn-primary">
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>Submit answers</>
                )}
              </button>
            </div>
          </>
        )}

        {!loading && !error && result && (
          <div className="flex flex-col items-center py-6 text-center animate-scale-in">
            <div
              className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
                pct >= 70 ? 'bg-mustard-500/15 text-mustard-500' : pct >= 40 ? 'bg-coral-500/15 text-coral-500' : 'bg-red-500/15 text-red-500'
              }`}
            >
              {pct >= 70 ? <Award size={36} /> : <RotateCw size={36} />}
            </div>
            <h2 className="font-display text-3xl italic font-medium text-ink-900">
              <span className="stat not-italic">{result.score}</span>
              <span className="text-ink-400"> / </span>
              <span className="stat not-italic">{result.total}</span>
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {pct >= 70 ? 'Well done — you have a solid grasp of this waypoint.' : pct >= 40 ? 'Decent start — review the misses and keep going.' : 'Keep at it — revisit the material and try again.'}
            </p>

            <div className="mt-6 w-full max-w-sm">
              <ProgressBar value={pct} />
            </div>

            {quiz && (
              <div className="mt-8 w-full space-y-3 text-left">
                <h3 className="text-[11px] font-semibold uppercase tracking-label text-ink-500">Review</h3>
                {quiz.questions.map((q, idx) => {
                  const userAns = answers[q.question_id];
                  const correctAns = result.correct_answers?.[q.question_id];
                  const isRight = userAns === correctAns;
                  return (
                    <div
                      key={q.question_id}
                      className={`rounded-xl border p-3 ${
                        isRight ? 'border-mustard-500/40 bg-mustard-500/5' : 'border-coral-300/50 bg-coral-500/5'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isRight ? (
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-mustard-500" />
                        ) : (
                          <XCircle size={16} className="mt-0.5 shrink-0 text-coral-500" />
                        )}
                        <div className="text-xs">
                          <p className="font-medium text-ink-900">
                            <span className="stat">{idx + 1}.</span> {q.question}
                          </p>
                          {!isRight && (
                            <p className="mt-1 text-ink-600">
                              Your answer: <span className="text-coral-600">{userAns ? `${userAns}) ${q.options[userAns]}` : '—'}</span>
                              <span className="mx-1.5 text-ink-300">·</span>
                              Correct: <span className="text-mustard-600">{correctAns}) {q.options[correctAns]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={onClose} className="btn-ghost mt-6">
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
