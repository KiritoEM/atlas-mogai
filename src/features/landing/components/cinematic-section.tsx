"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const CityScene = dynamic(() => import("./cinematic/city-scene"), {
  ssr: false,
  loading: () => (
    <div className="size-full bg-[radial-gradient(circle_at_55%_50%,rgba(255,90,31,0.14),transparent_42%)]" />
  ),
});

export function CinematicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "20% 0px", threshold: 0.01 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      progressRef.current = 0.55;
      return;
    }

    const context = gsap.context(() => {
      const scrollState = { progress: 0 };

      gsap.set("[data-cinematic-beat]", { autoAlpha: 0, y: 44 });
      gsap.set("[data-cinematic-kicker]", { autoAlpha: 0 });
      gsap.set("[data-cinematic-curtain]", { autoAlpha: 0 });

      gsap.to(scrollState, {
        progress: 1,
        ease: "none",
        onUpdate: () => {
          progressRef.current = scrollState.progress;
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
          },
        })
        .to("[data-cinematic-kicker]", { autoAlpha: 1, duration: 0.08 })
        .to(
          '[data-cinematic-beat="one"]',
          { autoAlpha: 1, y: 0, duration: 0.16, ease: "power3.out" },
          0.04,
        )
        .to(
          '[data-cinematic-beat="one"]',
          { autoAlpha: 0, y: -34, duration: 0.12, ease: "power2.in" },
          0.31,
        )
        .to(
          '[data-cinematic-beat="two"]',
          { autoAlpha: 1, y: 0, duration: 0.16, ease: "power3.out" },
          0.48,
        )
        .to("[data-cinematic-kicker]", { autoAlpha: 0, duration: 0.1 }, 0.7)
        .to(
          '[data-cinematic-beat="two"]',
          { autoAlpha: 0, y: -28, duration: 0.12, ease: "power2.in" },
          0.76,
        )
        .to(
          "[data-cinematic-curtain]",
          { autoAlpha: 1, duration: 0.16, ease: "power2.inOut" },
          0.84,
        );
    }, section);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Transition vers les prototypes MogAI"
      className={
        reducedMotion
          ? "relative h-[72svh] min-h-[34rem] overflow-hidden bg-background"
          : "relative h-[250svh] bg-background"
      }
    >
      <div
        className={
          reducedMotion
            ? "relative h-full overflow-hidden"
            : "sticky top-0 h-svh overflow-hidden"
        }
      >
        <div className="absolute inset-0 bg-[#100f0e]">
          <CityScene
            active={active}
            progressRef={progressRef}
            reducedMotion={reducedMotion}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,transparent_15%,rgba(16,15,14,0.18)_58%,rgba(16,15,14,0.82)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent"
        />

        <div className="relative z-10 mx-auto h-full w-full max-w-[92rem] px-6 lg:px-8">
          <p
            data-cinematic-kicker
            className={`absolute top-[12%] left-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-white/55 uppercase lg:left-8 ${reducedMotion ? "opacity-100" : "opacity-0"}`}
          >
            <span className="h-px w-8 bg-ember" />
            Antananarivo · signal vivant
          </p>

          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 lg:inset-x-8">
            <p
              data-cinematic-beat="one"
              className={`max-w-[8ch] text-[clamp(3.4rem,9vw,9rem)] leading-[0.86] font-medium tracking-[-0.075em] text-white ${reducedMotion ? "hidden" : "opacity-0"}`}
            >
              La ville bouge.
            </p>
            <p
              data-cinematic-beat="two"
              className={`absolute top-1/2 right-0 max-w-[8ch] -translate-y-1/2 text-right text-[clamp(3.4rem,9vw,9rem)] leading-[0.86] font-medium tracking-[-0.075em] text-white ${reducedMotion ? "opacity-100" : "opacity-0"}`}
            >
              MogAI l’écoute.
            </p>
          </div>

          <p
            className={`absolute right-6 bottom-8 text-[10px] tracking-[0.18em] text-white/35 uppercase lg:right-8 ${reducedMotion ? "hidden" : ""}`}
          >
            Défiler pour traverser
          </p>
        </div>

        <div
          data-cinematic-curtain
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-background opacity-0"
        />
      </div>
    </section>
  );
}
