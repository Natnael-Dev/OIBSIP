import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cc_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem('cc_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    if (token && !user) {
      api.get<{ success: boolean; data: UserProfile }>('/api/auth/me')
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('cc_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          // Token invalid
          localStorage.removeItem('cc_token');
          localStorage.removeItem('cc_user');
          setToken(null);
          setUser(null);
        });
    }
  }, [token, user]);

  const login = async (email: string, pass: string) => {
    const res = await api.post<{
      success: boolean;
      data: { token: string; user: UserProfile };
    }>('/api/auth/login', { email, password: pass });

    if (res.data?.token) {
      localStorage.setItem('cc_token', res.data.token);
      localStorage.setItem('cc_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthOpen(false);
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    await api.post('/api/auth/register', {
      name,
      email,
      password: pass,
      phone,
    });
    // Auto-login after registration
    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
