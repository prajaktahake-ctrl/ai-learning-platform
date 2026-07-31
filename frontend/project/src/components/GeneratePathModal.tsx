import { useState } from 'react';
import { Loader2, Sparkles, Target, Calendar, Clock, TrendingUp } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../auth';
import type { Level } from '../types';
import { ErrorBanner, Modal } from './ui';

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function GeneratePathModal({
  open,
  onClose,
  onGenerated,
}: {
  open: boolean;
  onClose: () => void;
  onGenerated: () => void;
}) {
  const { session } = useAuth();
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState<Level>('Beginner');
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [startDate, setStartDate] = useState(todayISO());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.generateLearningPath(session!.email, goal, level, hoursPerDay, durationWeeks, startDate);
      setDone(true);
      setTimeout(() => {
        onGenerated();
        handleClose();
      }, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setGoal('');
    setLevel('Beginner');
    setHoursPerDay(1);
    setDurationWeeks(4);
    setStartDate(todayISO());
    setError(null);
    setDone(false);
    setLoading(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <div className="p-6 sm:p-8">
        {done ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-scale-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pine-50 text-pine-500">
              <Sparkles size={32} />
            </div>
            <h3 className="font-display text-xl italic font-medium text-ink-900">Roadmap ready</h3>
            <p className="mt-1 text-sm text-ink-500">Your personalized path has been added to the dashboard.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="font-display text-xl italic font-medium text-ink-900">Generate a new path</h2>
              <p className="mt-1 text-sm text-ink-500">
                Tell the AI what you want to learn. It may take a few seconds to chart your route.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label" htmlFor="goal">What do you want to learn?</label>
                <div className="relative">
                  <Target size={16} className="absolute left-3.5 top-3.5 text-ink-400" />
                  <textarea
                    id="goal"
                    required
                    rows={3}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Become fluent in conversational Spanish for travel"
                    className="input-field resize-none pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Current level</label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                        level === l
                          ? 'border-pine-500 bg-pine-50 text-ink-900'
                          : 'border-fog-300 bg-fog-50 text-ink-500 hover:border-pine-300'
                      }`}
                    >
                      <TrendingUp size={14} className={level === l ? 'text-pine-500' : ''} />
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="hours">Hours per day</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      id="hours"
                      type="number"
                      min={0.5}
                      max={12}
                      step={0.5}
                      required
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(Number(e.target.value))}
                      className="input-field pl-10 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="weeks">Duration (weeks)</label>
                  <input
                    id="weeks"
                    type="number"
                    min={1}
                    max={52}
                    required
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="input-field font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="start">Start date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="start"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-field pl-10 font-mono"
                  />
                </div>
              </div>

              {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Charting your route…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate roadmap
                  </>
                )}
              </button>
              {loading && (
                <p className="text-center text-xs text-ink-400 animate-pulse">
                  The AI is crafting your personalized topics and schedule — this can take several seconds.
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
