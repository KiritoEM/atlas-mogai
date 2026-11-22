import type { Metadata } from "next";
import { VideoAnalyzer } from "@/components/moramora/video-analyzer";

export const metadata: Metadata = {
  title: "Analyse vidéo",
  description: "Détectez les infractions routières dans une vidéo.",
};

export default function Page() {
  return <VideoAnalyzer />;
}
