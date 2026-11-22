import type { Metadata } from "next";
import { LiveCamera } from "@/features/moramora/components/live-camera";

export const metadata: Metadata = {
  title: "Direct",
  description: "Analyse en continu du flux caméra.",
};

export default function Page() {
  return <LiveCamera />;
}
