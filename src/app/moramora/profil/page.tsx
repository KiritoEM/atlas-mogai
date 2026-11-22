import type { Metadata } from "next";
import { ProfileView } from "@/features/moramora/components/profile-view";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Votre compte Moramora.",
};

export default function Page() {
  return <ProfileView />;
}
