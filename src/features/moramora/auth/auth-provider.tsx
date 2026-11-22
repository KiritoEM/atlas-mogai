"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ApiError, api } from "../api/client";
import type { User } from "../api/types";
import { sessionStore, type Session } from "./session-store";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  /** Drops a token the server no longer accepts. */
  expire: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore<Session | null | undefined>(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getServerSnapshot,
  );
  const token = session?.token ?? null;

  // Validate a stored token once and refresh the cached user.
  useEffect(() => {
    if (!token) {
      return;
    }
    const controller = new AbortController();
    api
      .profile(token, controller.signal)
      .then(({ data }) =>
        sessionStore.updateUser({
          id: data.id,
          username: data.username,
          email: data.email,
        }),
      )
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          sessionStore.set(null);
        }
      });
    return () => controller.abort();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.login({ email, password });
    sessionStore.set({ token: data.access, user: data.user });
  }, []);

  const signup = useCallback<AuthContextValue["signup"]>(
    async (input) => {
      await api.signup(input);
      await login(input.email, input.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    const current = sessionStore.getSnapshot();
    sessionStore.set(null);
    if (current) {
      // Best effort: the token is forgotten locally whatever happens.
      await api.logout(current.token).catch(() => undefined);
    }
  }, []);

  const expire = useCallback(() => sessionStore.set(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status:
        session === undefined
          ? "loading"
          : session
            ? "authenticated"
            : "anonymous",
      token,
      user: session?.user ?? null,
      login,
      signup,
      logout,
      expire,
    }),
    [session, token, login, signup, logout, expire],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return context;
}

/** Calls `expire` when an API error means the token was revoked. */
export function useExpireOn401() {
  const { expire } = useAuth();
  return useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        expire();
      }
    },
    [expire],
  );
}
