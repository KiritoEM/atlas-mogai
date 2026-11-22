"use client";

import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/features/moramora/services/profile-service";
import { moramoraQueryKeys } from "./query-keys";

export function useProfileQuery(token: string | null) {
  return useQuery({
    queryKey: moramoraQueryKeys.profile(token ?? "anonymous"),
    queryFn: ({ signal }) =>
      profileService.get(token as string, signal).then(({ data }) => data),
    enabled: Boolean(token),
  });
}
