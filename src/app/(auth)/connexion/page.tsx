import type { Metadata } from "next";
import { LoginForm } from "@/features/moramora/components/auth-forms";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à Moramora pour analyser les infractions routières.",
};

export default function ConnexionPage() {
  return <LoginForm />;
}
