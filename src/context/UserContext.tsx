import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { clearToken } from '../api/client';

export interface UserProfile {
  id: string; name: string; email: string;
  phone: string; city: string; bio: string;
  photoUrl: string | null; avatar: string;
  color: string; colorFg: string;
}

export function deriveAvatar(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const EMPTY_USER: UserProfile = {
  id: '', name: '', email: '', phone: '', city: '', bio: '',
  photoUrl: null, avatar: '?',
  color: 'var(--primary-hl)', colorFg: 'var(--primary)',
};

interface UserContextValue {
  user: UserProfile;
  ready: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(EMPTY_USER);
  const [ready, setReady] = useState(false);
  const isAuthenticated = !!user.email;

  useEffect(() => {
    const storedUser = localStorage.getItem('pitutiuser') ?? sessionStorage.getItem('pitutiuser');
    const token      = localStorage.getItem('pitutitoken') ?? sessionStorage.getItem('pitutitoken');

    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          id:       parsed.id       ?? '',
          name:     parsed.name     ?? '',
          email:    parsed.email    ?? '',
          phone:    parsed.phone    ?? '',
          city:     parsed.city     ?? '',
          bio:      parsed.bio      ?? '',
          photoUrl: parsed.photoUrl ?? null,
          avatar:   parsed.avatar   ?? deriveAvatar(parsed.name ?? ''),
          color:    'var(--primary-hl)',
          colorFg:  'var(--primary)',
        });
      } catch {
        clearToken();
      }
    }
    setReady(true);
  }, []);

  const logout = () => {
    clearToken();
    setUser(EMPTY_USER);
    window.location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, ready, setUser, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
