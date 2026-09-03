import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { clearToken } from '../api/client';
import { usersApi } from '../api';
import i18n from '../i18n/i18n';

export interface UserProfile {
  id: string; name: string; email: string;
  phone: string; city: string; bio: string;
  photoUrl: string | null; avatar: string;
  color: string; colorFg: string;
  // FIX (sync): idioma sincronizado entre aparelhos (antes só localStorage)
  language: string;
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
  language: '',
};

function fromApiUser(api: {
  id: string; name: string; email: string
  phone?: string | null; city?: string | null; bio?: string | null
  photoUrl?: string | null; language?: string | null
}): UserProfile {
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    phone: api.phone ?? '',
    city: api.city ?? '',
    bio: api.bio ?? '',
    photoUrl: api.photoUrl ?? null,
    avatar: deriveAvatar(api.name ?? ''),
    color: 'var(--primary-hl)',
    colorFg: 'var(--primary)',
    language: api.language ?? '',
  };
}

function persistUser(u: UserProfile) {
  const key = 'pitutiuser';
  const storage = localStorage.getItem(key) ? localStorage : sessionStorage;
  storage.setItem(key, JSON.stringify(u));
}

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
        const cached: UserProfile = {
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
          language: parsed.language ?? '',
        };
        // 1. Mostra já o que está em cache local (UI instantânea)
        setUser(cached);
        setReady(true);

        // FIX (sync entre aparelhos): busca sempre a versão mais recente do
        // servidor ao arrancar (antes só lia o localStorage deste aparelho).
        if (cached.id) {
          usersApi.getById(cached.id)
            .then(res => {
              const fresh = fromApiUser(res.data)
              setUser(fresh)
              persistUser(fresh)
              // FIX (idioma entre aparelhos): aplica o idioma vindo do
              // servidor, se existir e for diferente do atual.
              if (fresh.language && fresh.language !== i18n.language) {
                i18n.changeLanguage(fresh.language)
                localStorage.setItem('lang', fresh.language)
              }
            })
            .catch(err => {
              console.warn('[UserContext] falha ao atualizar perfil a partir do servidor:', err)
            })
        }
        return
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
