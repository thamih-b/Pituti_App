import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken } from '../api/client';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  bio?: string;
  photoUrl?: string | null;
  avatar?: string;
  color?: string;
  colorFg?: string;
}

interface UserContextValue {
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restaura sessão ao carregar a app
  useEffect(() => {
    const token = getToken();
    if (token) {
      const raw =
        localStorage.getItem('pitutiuser') ??
        sessionStorage.getItem('pitutiuser');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as AppUser;
          setUserState({
            ...parsed,
            avatar:
              parsed.avatar ??
              (parsed.name
                ? parsed.name
                    .trim()
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0]?.toUpperCase())
                    .join('')
                : '?'),
            color: parsed.color ?? 'var(--primary-hl)',
            colorFg: parsed.colorFg ?? 'var(--primary)',
          });
        } catch {
          removeToken();
        }
      } else {
        removeToken(); // token sem dados de user: força re-login
      }
    }
    setHydrated(true);
  }, []);

  const setUser = (u: AppUser | null) => setUserState(u);

  const logout = () => {
    removeToken();
    setUserState(null);
  };

  // Evita flash de conteúdo não autenticado
  if (!hydrated) return null;

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, isAuthenticated: !!user }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
