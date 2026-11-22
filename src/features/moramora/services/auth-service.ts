import { request } from "../api/client";
import type { ApiEnvelope, User } from "@/types";

export type LoginInput = { email: string; password: string };

export type SignupInput = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export const authService = {
  login: (input: LoginInput) =>
    request<ApiEnvelope<{ access: string; user: User }>>(
      "/api/auth/login/",
      { method: "POST", body: input },
    ),

  signup: (input: SignupInput) =>
    request<ApiEnvelope<User>>("/api/auth/signup/", {
      method: "POST",
      body: input,
    }),

  logout: (token: string) =>
    request<{ success: boolean; message: string }>(
      "/api/auth/logout/",
      { method: "POST", token },
    ),
};
