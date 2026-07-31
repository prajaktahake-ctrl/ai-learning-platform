import type {
  AuthResponse,
  CompleteResponse,
  LearningPath,
  Level,
  PersonalityMode,
  Quiz,
  QuizHistoryResponse,
  QuizSubmitResponse,
} from './types';

const STORAGE_KEY = 'waypoint.api.base';
const DEFAULT_BASE = 'http://localhost:8000';

export function getApiBase(): string {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_BASE;
}

export function setApiBase(url: string): void {
  const cleaned = url.trim().replace(/\/+$/, '');
  localStorage.setItem(STORAGE_KEY, cleaned);
}

export function getToken(): string | null {
  return localStorage.getItem('waypoint.token');
}

export function getEmail(): string | null {
  return localStorage.getItem('waypoint.email');
}

export function getUserName(): string | null {
  return localStorage.getItem('waypoint.name');
}

export function setSession(token: string, email: string, name?: string): void {
  localStorage.setItem('waypoint.token', token);
  localStorage.setItem('waypoint.email', email);
  if (name) localStorage.setItem('waypoint.name', name);
}

export function clearSession(): void {
  localStorage.removeItem('waypoint.token');
  localStorage.removeItem('waypoint.email');
  localStorage.removeItem('waypoint.name');
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data === 'string') return data;
    if (data.detail) {
      if (typeof data.detail === 'string') return data.detail;
      if (Array.isArray(data.detail)) {
        return data.detail.map((d: { msg?: string; message?: string }) => d.msg || d.message || 'Invalid field').join('; ');
      }
    }
    if (data.message) return data.message;
    return JSON.stringify(data);
  } catch {
    return `Request failed (${res.status} ${res.statusText})`;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

function qs(params: Record<string, string | number>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)));
  return sp.toString();
}

export const api = {
  async register(name: string, email: string, password: string, personality_mode: PersonalityMode): Promise<AuthResponse> {
    return request<AuthResponse>(`${getApiBase()}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password, personality_mode }),
    });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>(`${getApiBase()}/auth/login?${qs({ email, password })}`, {
      method: 'POST',
    });
  },

  async generateLearningPath(
    email: string,
    goal: string,
    level: Level,
    hours_per_day: number,
    duration_weeks: number,
    start_date: string,
  ): Promise<{ message: string }> {
    return request(`${getApiBase()}/generate-learning-path?${qs({ email, goal, level, hours_per_day, duration_weeks, start_date })}`, {
      method: 'POST',
      headers: authHeaders(),
    });
  },

  async getDashboard(email: string): Promise<LearningPath[]> {
    return request<LearningPath[]>(`${getApiBase()}/dashboard/${encodeURIComponent(email)}`, {
      headers: authHeaders(),
    });
  },

  async completeSubtopic(subtopic_id: string): Promise<CompleteResponse> {
    return request<CompleteResponse>(`${getApiBase()}/subtopic/${subtopic_id}/complete`, {
      method: 'PUT',
      headers: authHeaders(),
    });
  },

  async getQuiz(quiz_id: string): Promise<Quiz> {
    return request<Quiz>(`${getApiBase()}/quiz/${quiz_id}`);
  },

  async submitQuiz(quiz_id: string, answers: Record<string, string>): Promise<QuizSubmitResponse> {
    return request<QuizSubmitResponse>(`${getApiBase()}/quiz/${quiz_id}/submit`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ answers }),
    });
  },

  async getQuizHistory(email: string): Promise<QuizHistoryResponse> {
    return request<QuizHistoryResponse>(`${getApiBase()}/quiz/dashboard/${encodeURIComponent(email)}`, {
      headers: authHeaders(),
    });
  },
};

export { ApiError };
