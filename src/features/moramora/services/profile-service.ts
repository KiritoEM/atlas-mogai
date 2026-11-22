import { request } from "../api/client";
import type { ApiEnvelope, Profile } from "@/types";

export const profileService = {
  get: (token: string, signal?: AbortSignal) =>
    request<ApiEnvelope<Profile>>("/api/auth/profile/", {
      token,
      signal,
    }),
};
