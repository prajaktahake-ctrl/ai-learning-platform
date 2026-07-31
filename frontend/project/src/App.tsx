import { useState } from 'react';
import { Compass, LogOut, LayoutDashboard, Award, Settings } from 'lucide-react';
import { AuthProvider, useAuth } from './auth';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard, QuizResults } from './components/Dashboard';
import { Modal } from './components/ui';
import { getApiBase, setApiBase } from './api';

type View = 'dashboard' | 'results';

function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [url, setUrl] = useState(getApiBase());
  const [saved, setSaved] = useState(false);
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Settings size={18} className="text-pine-500" />
          <h2 className="font-display text-lg italic font-medium text-ink-900">Settings</h2>
        </div>
        <label className="label" htmlFor="settings-url">FastAPI base URL</label>
        <input
          id="settings-url"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setSaved(false);
          }}
          className="input-field font-mono text-xs"
        />
        <div className="mt-4 flex items-center justify-between">
          {saved && <span className="text-xs text-pine-500">Saved</span>}
          <button
            onClick={() => {
              setApiBase(url);
              setSaved(true);
            }}
            className="btn-primary ml-auto"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Shell() {
  const { session, logout } = useAuth();
  const [view, setView] = useState<View>('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-fog-300/70 bg-fog-200/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pine-500">
              <Compass size={18} className="text-fog-50" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg italic font-medium tracking-tight text-ink-900">Waypoint</span>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                view === 'dashboard' ? 'bg-pine-50 text-pine-600' : 'text-ink-500 hover:text-ink-800'
              }`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setView('results')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                view === 'results' ? 'bg-pine-50 text-pine-600' : 'text-ink-500 hover:text-ink-800'
              }`}
            >
              <Award size={16} />
              <span className="hidden sm:inline">Quiz results</span>
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:text-coral-600"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </nav>
        </div>
      </header>

      {view === 'dashboard' ? <Dashboard /> : <QuizResults />}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
