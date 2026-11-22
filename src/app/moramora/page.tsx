import type { Metadata } from "next";
import { Overview } from "@/features/moramora/components/overview";

export const metadata: Metadata = {
  title: "Vue d'ensemble",
  description: "Vos analyses et alertes Moramora en temps réel.",
};

export default function Page() {
  return <Overview />;
}
