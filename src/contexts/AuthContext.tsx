import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { signIn, signOutUser, resetPassword, subscribeToAuthState } from '../services/firebase/authService';

type AuthContextValue = {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthState((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email: string, password: string) {
    const u = await signIn(email, password);
    if (u) {
      sessionStorage.setItem('partem_mock_user', JSON.stringify(u));
      setUser(u);
    }
  }

  async function logout() {
    await signOutUser();
    sessionStorage.removeItem('partem_mock_user');
    setUser(null);
  }

  async function forgotPassword(email: string) {
    await resetPassword(email);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
