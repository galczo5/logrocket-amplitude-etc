import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { setUserId, setUserProperties, trackUserLogin } from '@/lib/analytics';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Track user identification when authenticated
  useEffect(() => {
    if (user && token) {
      // Identify user across analytics services
      setUserId(user.id);
      setUserProperties({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        loginTime: new Date().toISOString(),
      });
    }
  }, [user, token]);

  async function login(email: string, password: string) {
    const data = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    setUser(data.user);
    setToken(data.token);
    // Track login event
    trackUserLogin(data.user.id, data.user.email);
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
