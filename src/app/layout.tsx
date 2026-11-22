import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MogAI — Antananarivo en temps réel",
    template: "%s · MogAI",
  },
  description:
    "Moramora, Aiza et Gaspika : trois applications citoyennes pour une capitale plus fluide, plus propre et plus accessible.",
  applicationName: "MogAI",
  keywords: [
    "Smart City",
    "Antananarivo",
    "Madagascar",
    "mobilité urbaine",
    "gestion des déchets",
    "services publics",
    "Moramora",
    "Aiza",
    "Gaspika",
  ],
  openGraph: {
    title: "MogAI — Antananarivo en temps réel",
    description:
      "Trois applications, un même réflexe : transformer les signaux des habitants en actions concrètes pour Antananarivo.",
    siteName: "MogAI",
    locale: "fr_MG",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161513",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`dark scroll-smooth motion-reduce:scroll-auto ${instrumentSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
