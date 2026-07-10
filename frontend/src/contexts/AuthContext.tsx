import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import * as api from '../lib/api';

interface AuthContextValue {
  userId: string | null;
  loading: boolean;
  login: (id: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signup: (id: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCurrentUserId()
      .then((id) => setUserId(id))
      .catch(() => setUserId(null))
      .finally(() => setLoading(false));
  }, []);

  const login: AuthContextValue['login'] = async (id, password) => {
    const result = await api.login(id, password);
    if (result.ok) setUserId(id);
    return result;
  };

  const signup: AuthContextValue['signup'] = async (id, password) => {
    const result = await api.signup(id, password);
    if (result.ok) setUserId(id);
    return result;
  };

  const logout = async () => {
    await api.logout();
    setUserId(null);
  };

  return <AuthContext.Provider value={{ userId, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
