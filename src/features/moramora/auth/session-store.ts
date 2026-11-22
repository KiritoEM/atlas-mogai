import type { User } from "../api/types";

export type Session = { token: string; user: User };

const STORAGE_KEY = "moramora.session";
const listeners = new Set<() => void>();
let cached: Session | null | undefined;

function readStorage(): Session | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<Session>;
    return typeof parsed.token === "string" && parsed.user ? (parsed as Session) : null;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * The JWT has no expiry and is revoked server-side on logout, so it is kept in
 * localStorage and shared between tabs through the `storage` event.
 */
export const sessionStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        cached = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  getSnapshot(): Session | null {
    if (cached === undefined) {
      cached = readStorage();
    }
    return cached;
  },

  /** `undefined` while rendering on the server: the session is unknown. */
  getServerSnapshot(): Session | null | undefined {
    return undefined;
  },

  set(session: Session | null) {
    cached = session;
    try {
      if (session) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Private mode or blocked storage: the session lives in memory only.
    }
    emit();
  },

  updateUser(user: User) {
    const current = sessionStore.getSnapshot();
    if (current && JSON.stringify(current.user) !== JSON.stringify(user)) {
      sessionStore.set({ ...current, user });
    }
  },
};
