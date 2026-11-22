"use client";

import { useLayoutEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { BusFront, Landmark, ScanLine, ShoppingBasket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { APP_BY_ID, CHALLENGES, type ChallengeId } from "../content";
import { appDot } from "../app-theme";
import { SignalTick } from "./signature";

gsap.registerPlugin(ScrollTrigger);

const icons: Record<ChallengeId, LucideIcon> = {
  trafic: BusFront,
  gaspillage: ShoppingBasket,
  dangers: ScanLine,
  services: Landmark,
};

const accents: Record<ChallengeId, string> = {
  trafic: "from-aiza/20 via-moramora/5",
  gaspillage: "from-gaspika/20 via-gaspika/5",
  dangers: "from-moramora/20 via-moramora/5",
  services: "from-aiza/20 via-aiza/5",
};

export function ChallengesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const getTravelDistance = () =>
            Math.max(
              0,
              track.scrollWidth - document.documentElement.clientWidth,
            );

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top+=64",
              end: () => "+=" + getTravelDistance(),
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          timeline
            .to(track, { x: () => -getTravelDistance(), ease: "none" }, 0)
            .fromTo(
              "[data-challenges-progress]",
              { scaleX: 0 },
              {
                scaleX: 1,
                transformOrigin: "0% 50%",
                ease: "none",
              },
              0,
            );
        }, section);

        return () => context.revert();
      },
    );

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="defis"
      className="relative scroll-mt-16 overflow-hidden border-t border-divider py-20 sm:py-24 lg:flex lg:min-h-[calc(100svh-4rem)] lg:flex-col lg:justify-center lg:py-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_78%_48%,rgba(255,90,31,0.055),transparent_72%)]"
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <div className="grid items-end gap-7 lg:grid-cols-[1fr_0.55fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-2.5 text-[13px] font-medium text-white">
              <SignalTick />
              Les défis
            </p>
            <h2 className="mt-5 max-w-[52rem] text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.06] font-medium tracking-[-0.055em] text-fg">
              Quatre défis du quotidien,{" "}
              <span className="text-ember">des réponses concrètes.</span>
            </h2>
          </div>
        </div>
      </div>

      <div
        role="region"
        aria-label="Défis et applications associées"
        aria-roledescription="défilement horizontal"
        tabIndex={0}
        className="relative mt-9 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] [scrollbar-color:rgba(239,233,222,0.18)_transparent] lg:mt-10 lg:overflow-x-hidden motion-reduce:lg:overflow-x-auto"
      >
        <div
          ref={trackRef}
          className="flex w-max gap-4 px-6 sm:gap-5 lg:gap-6 lg:px-[max(2rem,calc((100vw-92rem)/2+2rem))]"
        >
          {CHALLENGES.map((challenge, index) => {
            const Icon = icons[challenge.id];

            return (
              <article
                key={challenge.id}
                className="group relative flex min-h-[310px] w-[min(82vw,22rem)] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-line-strong bg-[#211f1c] p-6 shadow-[0_24px_64px_-42px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.035)_inset] transition-[border-color,background-color,box-shadow] duration-300 hover:border-ember/30 hover:bg-[#24211e] hover:shadow-[0_30px_72px_-42px_rgba(255,90,31,0.18),0_1px_0_rgba(255,255,255,0.045)_inset] sm:w-[min(70vw,25rem)] sm:p-7 lg:min-h-[330px] lg:w-[min(34vw,29rem)]"
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-80",
                    accents[challenge.id],
                  )}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 -right-20 size-56 rounded-full border border-white/[0.035]"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-[12px] border border-white/[0.07] bg-black/15 text-fg-2 transition-colors duration-300 group-hover:border-ember/25 group-hover:text-ember">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.12em] text-fg-3 tabular-nums">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(CHALLENGES.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative mt-9">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-ember uppercase">
                    Défi urbain
                  </p>
                  <h3 className="mt-3 max-w-[24rem] text-[clamp(1.55rem,2.2vw,2.1rem)] leading-[1.14] font-medium tracking-[-0.04em] text-fg">
                    {challenge.title}
                  </h3>
                  <p className="mt-4 max-w-[26rem] text-[14px] leading-[1.7] text-fg-2">
                    {challenge.description}
                  </p>
                </div>

                <div className="relative mt-auto flex flex-wrap items-center gap-2 pt-7">
                  {challenge.apps.map((appId) => (
                    <span
                      key={appId}
                      className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-black/15 px-3 py-1.5 text-[11px] font-medium text-fg-2"
                    >
                      <span
                        className={cn("size-1.5 rounded-full", appDot[appId])}
                      />
                      {APP_BY_ID[appId].name}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <p className="relative mx-auto mt-1 w-full max-w-[92rem] px-6 text-[11px] text-fg-3 lg:hidden">
        Glissez pour découvrir les autres défis
      </p>
    </section>
  );
}
