import type { Metadata } from "next";
import { PhotoAnalyzer } from "@/components/moramora/photo-analyzer";

export const metadata: Metadata = {
  title: "Analyse photo",
  description: "Détectez les infractions routières sur une photo.",
};

export default function Page() {
  return <PhotoAnalyzer />;
}
