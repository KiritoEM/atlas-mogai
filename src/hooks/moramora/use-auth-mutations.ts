"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/moramora/services/auth-service";

export function useLoginMutation() {
  return useMutation({ mutationFn: authService.login });
}

export function useSignupMutation() {
  return useMutation({ mutationFn: authService.signup });
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: authService.logout });
}
