"use client";

import { useQuery } from "@tanstack/react-query";
import { healthService } from "@/features/moramora/services/health-service";
import { moramoraQueryKeys } from "./query-keys";

export function useHealthQuery() {
  return useQuery({
    queryKey: moramoraQueryKeys.health(),
    queryFn: ({ signal }) => healthService.check(signal),
  });
}
