import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/features/moramora/providers/auth-provider";
import { MoramoraShell } from "@/features/moramora/components/app-shell";

export const metadata: Metadata = {
  title: {
    default: "Moramora",
    template: "%s · Moramora",
  },
  description:
    "Détection d'infractions routières par l'IA : photos, vidéos et flux caméra en direct.",
};

export default function MoramoraLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MoramoraShell>{children}</MoramoraShell>
    </AuthProvider>
  );
}
