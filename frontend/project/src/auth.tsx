import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { clearSession, getEmail, getUserName, getToken, setSession } from './api';

interface Session {
  token: string;
  email: string;
  name: string | null;
}

interface AuthContextValue {
  session: Session | null;
  login: (token: string, email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);

  useEffect(() => {
    const token = getToken();
    const email = getEmail();
    if (token && email) {
      setSessionState({ token, email, name: getUserName() });
    }
  }, []);

  const login = useCallback((token: string, email: string, name?: string) => {
    setSession(token, email, name);
    setSessionState({ token, email, name: name || null });
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
