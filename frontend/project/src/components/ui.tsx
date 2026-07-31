import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-coral-300/50 bg-coral-500/5 px-4 py-3 text-sm text-coral-700 animate-fade-in">
      <span className="mt-0.5 font-semibold text-coral-500">!</span>
      <span className="flex-1 text-ink-800">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-ink-400 transition-colors hover:text-ink-700">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!open) return null;
  const maxW = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative z-10 w-full ${maxW} max-h-[90vh] overflow-y-auto rounded-2xl glass shadow-2xl shadow-ink-900/10 animate-scale-in`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-fog-200 hover:text-ink-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 56,
  stroke = 4,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(47,93,80,0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F5D50" />
            <stop offset="100%" stopColor="#D9756A" />
          </linearGradient>
        </defs>
      </svg>
      <span className="stat absolute text-[11px] font-medium text-ink-800">
        {label ?? `${Math.round(value)}%`}
      </span>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-fog-300/70">
      <div
        className="h-full rounded-full bg-pine-500 transition-[width] duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pine-50 text-pine-500">
        {icon}
      </div>
      <h3 className="font-display text-lg italic font-medium text-ink-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-500">{subtitle}</p>
    </div>
  );
}
