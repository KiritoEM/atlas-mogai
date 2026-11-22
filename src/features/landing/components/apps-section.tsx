"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Smartphone } from "lucide-react";
import { APPS } from "../content";
import { AppCard } from "./app-card";
import { SignalTick } from "./signature";

gsap.registerPlugin(ScrollTrigger);

export function AppsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const textTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-apps-copy]",
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        textTimeline
          .fromTo(
            "[data-apps-eyebrow]",
            { y: 14, autoAlpha: 0, filter: "blur(5px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.5,
              clearProps: "all",
            },
          )
          .fromTo(
            "[data-apps-title-line]",
            { yPercent: 115, rotation: 1.5, transformOrigin: "0% 100%" },
            {
              yPercent: 0,
              rotation: 0,
              duration: 0.9,
              stagger: 0.11,
              ease: "power4.out",
              clearProps: "all",
            },
            0.08,
          )
          .fromTo(
            "[data-apps-description]",
            { y: 18, autoAlpha: 0, filter: "blur(6px)" },
            {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.65,
              clearProps: "all",
            },
            0.42,
          )
          .fromTo(
            "[data-apps-mobile]",
            { y: 12, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              clearProps: "all",
            },
            0.56,
          );

        gsap.fromTo(
          "[data-apps-card]",
          { y: 64, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.78,
            stagger: 0.14,
            ease: "power4.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: "[data-apps-grid]",
              start: "top 84%",
              once: true,
            },
          },
        );
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="applications"
      className="scroll-mt-20 border-t border-divider py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <div data-apps-copy>
          <p
            data-apps-eyebrow
            className="flex items-center gap-2.5 text-[13px] font-medium text-white"
          >
            <SignalTick />
            L&apos;écosystème
          </p>
          <h2 className="mt-6 max-w-[46rem] text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.06] font-medium tracking-[-0.055em] text-fg">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-apps-title-line className="block">
                Trois applications,
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <span data-apps-title-line className="block text-ember">
                un même réflexe.
              </span>
            </span>
          </h2>
          <p
            data-apps-description
            className="mt-6 max-w-[42rem] text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.6] text-fg-2 text-balance"
          >
            Chacune répond à un défi précis. Toutes partagent la même donnée
            urbaine, pour que la ville agisse comme un seul système.
          </p>
          <div
            data-apps-mobile
            className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-ember/25 bg-ember/[0.07] px-4 py-2 text-[13px] font-medium text-fg"
          >
            <Smartphone aria-hidden="true" className="size-4 text-ember" />
            Applications mobiles bientôt disponibles
          </div>
        </div>

        <div data-apps-grid className="mt-12 grid gap-6 lg:grid-cols-3">
          {APPS.map((app) => (
            <div key={app.id} data-apps-card className="h-full">
              <AppCard app={app} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
