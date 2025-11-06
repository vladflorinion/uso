import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../supabase/client';

const SESSION_KEY = 'macropulse-auth-session';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedSession = await SecureStore.getItemAsync(SESSION_KEY);
        if (storedSession) {
          const parsed: Session = JSON.parse(storedSession);
          setSession(parsed);
          setUser(parsed.user);
        } else {
          const {
            data: { session: freshSession },
          } = await supabase.auth.getSession();
          setSession(freshSession);
          setUser(freshSession?.user ?? null);
          if (freshSession) {
            await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(freshSession));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession) {
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(nextSession));
      } else {
        await SecureStore.deleteItemAsync(SESSION_KEY);
      }
    });

    initialize();

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }, []);

  const refreshSession = useCallback(async () => {
    const {
      data: { session: fresh },
      error,
    } = await supabase.auth.getSession();
    if (!error) {
      setSession(fresh);
      setUser(fresh?.user ?? null);
      if (fresh) {
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(fresh));
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, signIn, signUp, signOut, refreshSession }),
    [loading, session, signIn, signOut, signUp, user, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
