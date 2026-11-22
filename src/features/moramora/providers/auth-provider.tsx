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
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../api/client";
import {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
} from "@/hooks/moramora/use-auth-mutations";
import { moramoraQueryKeys } from "@/hooks/moramora/query-keys";
import { useProfileQuery } from "@/hooks/moramora/use-profile-query";
import type { User } from "@/types";
import { sessionStore, type Session } from "@/lib/session-store";

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
  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery(token);
  const { mutateAsync: loginRequest } = useLoginMutation();
  const { mutateAsync: signupRequest } = useSignupMutation();
  const { mutateAsync: logoutRequest } = useLogoutMutation();

  // Validate a stored token once and refresh the cached user.
  useEffect(() => {
    if (profileQuery.data) {
      sessionStore.updateUser({
        id: profileQuery.data.id,
        username: profileQuery.data.username,
        email: profileQuery.data.email,
      });
    }
    if (profileQuery.error instanceof ApiError && profileQuery.error.status === 401) {
      sessionStore.set(null);
    }
  }, [profileQuery.data, profileQuery.error]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await loginRequest({ email, password });
    sessionStore.set({ token: data.access, user: data.user });
  }, [loginRequest]);

  const signup = useCallback<AuthContextValue["signup"]>(
    async (input) => {
      await signupRequest(input);
      await login(input.email, input.password);
    },
    [login, signupRequest],
  );

  const logout = useCallback(async () => {
    const current = sessionStore.getSnapshot();
    sessionStore.set(null);
    if (current) {
      queryClient.removeQueries({
        queryKey: moramoraQueryKeys.profile(current.token),
      });
      await logoutRequest(current.token).catch(() => undefined);
    }
  }, [logoutRequest, queryClient]);

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
