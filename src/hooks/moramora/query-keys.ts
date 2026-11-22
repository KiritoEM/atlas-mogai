export const moramoraQueryKeys = {
  all: ["moramora"] as const,
  health: () => [...moramoraQueryKeys.all, "health"] as const,
  profile: (token: string) =>
    [...moramoraQueryKeys.all, "profile", token] as const,
};
