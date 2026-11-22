import { AppsSection } from "./apps-section";
import { ChallengeTicker } from "./challenge-ticker";
import { ChallengesSection } from "./challenges-section";
import { CtaSection } from "./cta-section";
import { Hero } from "./hero";
import { HowItWorksSection } from "./how-it-works-section";
import { LandingIntro } from "./landing-intro";
import { ScrollProgress } from "@/components/motion-primitives";
import { RoadmapSection } from "./roadmap-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { VisionSection } from "./vision-section";

export function LandingPage() {
  return (
    <>
      <LandingIntro />
      <noscript><style>{".landing-intro{display:none!important}"}</style></noscript>
      <ScrollProgress />

      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[8px] focus:border focus:border-line-strong focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg focus:outline-none"
      >
        Aller au contenu
      </a>

      <SiteHeader />

      <main id="contenu" className="flex-1">
        <div className="relative isolate">
          <Hero />
          <div className="relative z-10 bg-background pb-5 sm:pb-6">
            <ChallengeTicker />
          </div>
          <VisionSection />
        </div>

        <AppsSection />
        <ChallengesSection />
        <HowItWorksSection />
        <RoadmapSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
