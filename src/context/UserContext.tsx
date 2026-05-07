
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  photoUrl: string | null;
  avatar: string;       // iniciales derivadas del nombre
  color: string;        // color de fondo del avatar
  colorFg: string;      // color del texto del avatar
}

// Deriva las iniciales de hasta 2 palabras del nombre
export function deriveAvatar(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const EMPTY_USER: UserProfile = {
  name: '',
  email: '',
  phone: '',
  city: '',
  bio: '',
  photoUrl: null,
  avatar: '?',
  color: 'var(--primary-hl)',
  colorFg: 'var(--primary)',
};

interface UserContextValue {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(EMPTY_USER);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}