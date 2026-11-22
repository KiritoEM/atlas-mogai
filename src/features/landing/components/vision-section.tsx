"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PILLARS } from "../content";
import { SignalTick } from "./signature";

gsap.registerPlugin(ScrollTrigger);

export function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const reveal = (target: string, x: number) => {
          gsap.fromTo(
            target,
            { x, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                end: "top 42%",
                scrub: 0.7,
              },
            },
          );
        };

        reveal("[data-vision-left]", -48);
        reveal("[data-vision-right]", 48);

        const card = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-vision-card]",
            start: "top 86%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        card
          .fromTo(
            "[data-vision-card]",
            { y: 48, scale: 0.98, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 1 },
          )
          .fromTo(
            "[data-vision-card-label]",
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5 },
            0.3,
          )
          .fromTo(
            "[data-vision-card-title]",
            { y: 26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.75 },
            0.38,
          )
          .fromTo(
            "[data-vision-pillar]",
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.1 },
            0.55,
          );
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vision"
      className="relative z-20 -mt-5 scroll-mt-20 overflow-hidden rounded-t-[20px] border-t border-divider bg-background py-20 shadow-[0_-12px_36px_rgba(0,0,0,0.12)] sm:-mt-6 sm:rounded-t-[24px] sm:py-28"
    >
      <div className="mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <div className="grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24">
          <div data-vision-left>
            <p className="flex items-center gap-2.5 text-[13px] font-medium text-white">
              <SignalTick />
              Notre vision
            </p>
            <h2 className="mt-6 max-w-[42rem] text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.06] font-medium tracking-[-0.055em] text-fg">
              Une ville qui écoute.{" "}
              <span className="text-ember">
                <br /> Et qui agit.
              </span>
            </h2>
          </div>

          <div data-vision-right className="lg:pb-2">
            <div className="border-l border-line-strong pl-5 sm:pl-7">
              <p className="max-w-[31rem] text-[clamp(1.2rem,1.7vw,1.7rem)] leading-[1.38] font-medium tracking-[-0.03em] text-fg text-balance">
                Les signalements des habitants deviennent des actions suivies
                sur le terrain.{" "}
                <span className="font-normal text-fg-2">
                  Chacun peut voir ce qui avance.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          data-vision-card
          className="mt-16 grid gap-10 rounded-[20px] border border-line-strong bg-surface p-7 transition-[border-color,box-shadow] duration-500 ease-out hover:border-ember/30 shadow-[0_30px_70px_-40px_rgba(255,90,31,0.35)] sm:mt-20 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:items-end lg:gap-16 lg:p-12"
        >
          <div>
            <p
              data-vision-card-label
              className="font-mono text-xs tracking-[0.14em] text-ember uppercase"
            >
              Notre cap
            </p>
            <p
              data-vision-card-title
              className="mt-5 max-w-[30rem] text-[clamp(1.55rem,2.5vw,2.5rem)] leading-[1.2] font-medium tracking-[-0.035em] text-white"
            >
              Chaque signal mérite une réponse visible.
            </p>
          </div>

          <ul className="grid gap-0 border-t border-line-strong lg:border-t-0">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.index}
                data-vision-pillar
                className="group flex items-baseline gap-5 border-b border-line py-5 last:border-b-0 sm:gap-7 sm:py-6"
              >
                <span className="font-mono text-[clamp(1.1rem,1.7vw,1.6rem)] leading-none tracking-[0.08em] text-ember">
                  {pillar.index}
                </span>
                <span className="text-[clamp(1.35rem,2vw,2rem)] leading-[1.15] font-medium tracking-[-0.035em] text-fg transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                  {pillar.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
