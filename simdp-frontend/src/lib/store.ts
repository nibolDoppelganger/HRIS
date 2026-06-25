import { atom } from 'nanostores';

export const $isSidebarOpen = atom<boolean>(false);

export interface UserSession {
  session_token: string;
  expires_at: number;
  user: {
    email: string;
    nama: string;
    role_id: string;
    role_name: string;
    departement?: string;
    permissions: Record<string, {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      export: boolean;
    }>;
  };
}

// Read initial session from localStorage if present
const getInitialSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('simdp_session');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as UserSession;
    if (parsed.expires_at > Date.now()) {
      return parsed;
    } else {
      localStorage.removeItem('simdp_session');
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const $userSession = atom<UserSession | null>(getInitialSession());

export const setSession = (session: UserSession) => {
  $userSession.set(session);
  if (typeof window !== 'undefined') {
    localStorage.setItem('simdp_session', JSON.stringify(session));
  }
};

export const clearSession = () => {
  $userSession.set(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('simdp_session');
  }
};
