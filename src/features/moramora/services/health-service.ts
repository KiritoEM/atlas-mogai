import { request } from "../api/client";

export const healthService = {
  check: (signal?: AbortSignal) =>
    request<{ status: string }>("/api/health/", { signal }),
};
