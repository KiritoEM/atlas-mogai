import type { Metadata } from "next";
import { SignupForm } from "@/features/moramora/components/auth-forms";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte Moramora.",
};

export default function InscriptionPage() {
  return <SignupForm />;
}
