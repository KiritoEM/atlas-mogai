import type { Metadata } from "next";
import { VideoAnalyzer } from "@/features/moramora/components/video-analyzer";

export const metadata: Metadata = {
  title: "Analyse vidéo",
  description: "Détectez les infractions routières dans une vidéo.",
};

export default function Page() {
  return <VideoAnalyzer />;
}
