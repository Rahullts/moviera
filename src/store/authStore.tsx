import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) { setAuthError('Auth not configured'); throw new Error('Auth not configured'); }
    setAuthError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setAuthError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) { setAuthError('Auth not configured'); throw new Error('Auth not configured'); }
    setAuthError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password });
    if (err) {
      setAuthError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) { setAuthError('Auth not configured'); throw new Error('Auth not configured'); }
    setAuthError(null);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/' },
    });
    if (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error: err } = await supabase.auth.signOut();
    if (err) throw err;
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ user, session, loading, authError, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
