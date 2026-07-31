import { useState } from 'react';
import { Compass, Mail, Lock, User, Sparkles, Loader2 } from 'lucide-react';
import { api, getApiBase, setApiBase } from '../api';
import { useAuth } from '../auth';
import type { PersonalityMode } from '../types';
import { ErrorBanner } from './ui';

const LEARNING_STYLES: { value: PersonalityMode; label: string; desc: string }[] = [
  { value: 'fast-track', label: 'Fast-track', desc: 'Move quickly, cover essentials' },
  { value: 'deep-mastery', label: 'Deep mastery', desc: 'Thorough, foundational depth' },
  { value: 'practical-only', label: 'Practical only', desc: 'Hands-on, project-driven' },
];

export function AuthScreen() {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState(getApiBase());

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [style, setStyle] = useState<PersonalityMode>('fast-track');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      setApiBase(apiUrl);
      if (tab === 'login') {
        const res = await api.login(email, password);
        login(res.access_token, email);
      } else {
        const res = await api.register(name, email, password, style);
        login(res.access_token, email, name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden topo-bg">
      <div className="absolute inset-0 topo-lines opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-pine-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-coral-500/8 blur-[100px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center text-center animate-slide-up">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-500 shadow-lg shadow-pine-500/20">
            <Compass className="text-fog-50" size={28} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl italic font-medium tracking-tight text-ink-900 sm:text-4xl">
            Waypoint
          </h1>
          <p className="mt-2 max-w-sm text-sm text-ink-500">
            Chart your learning journey. AI-crafted roadmaps, one waypoint at a time.
          </p>
        </div>

        <div className="w-full max-w-md animate-slide-up [animation-delay:100ms]">
          <div className="card p-6 shadow-xl shadow-ink-900/5 sm:p-8">
            <div className="mb-6 flex rounded-xl bg-fog-100 p-1">
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setError(null);
                  }}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    tab === t ? 'bg-pine-500 text-fog-50 shadow' : 'text-ink-500 hover:text-ink-800'
                  }`}
                >
                  {t === 'login' ? 'Log in' : 'Create account'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div className="animate-fade-in">
                  <label className="label" htmlFor="name">Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="label" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={4}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {tab === 'register' && (
                <div className="animate-fade-in">
                  <label className="label">Learning style</label>
                  <div className="grid gap-2">
                    {LEARNING_STYLES.map((s) => (
                      <button
                        type="button"
                        key={s.value}
                        onClick={() => setStyle(s.value)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all active:scale-[0.98] ${
                          style === s.value
                            ? 'border-pine-500 bg-pine-50'
                            : 'border-fog-300 bg-fog-50 hover:border-pine-300'
                        }`}
                      >
                        <Sparkles size={16} className={style === s.value ? 'text-pine-500' : 'text-ink-400'} />
                        <div>
                          <div className="text-sm font-medium text-ink-900">{s.label}</div>
                          <div className="text-xs text-ink-500">{s.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : (
                  <>{tab === 'login' ? 'Log in' : 'Create account'}</>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-ink-600">
                <span className="group-open:hidden">Backend configuration</span>
                <span className="hidden group-open:inline">Hide</span>
              </summary>
              <div className="mt-3">
                <label className="label" htmlFor="api-url">FastAPI base URL</label>
                <input
                  id="api-url"
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  onBlur={() => setApiBase(apiUrl)}
                  placeholder="http://localhost:8000"
                  className="input-field font-mono text-xs"
                />
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
