import type { Metadata } from "next";
import { PhotoAnalyzer } from "@/features/moramora/components/photo-analyzer";

export const metadata: Metadata = {
  title: "Analyse photo",
  description: "Détectez les infractions routières sur une photo.",
};

export default function Page() {
  return <PhotoAnalyzer />;
}
