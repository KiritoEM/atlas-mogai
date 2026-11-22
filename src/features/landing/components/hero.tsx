"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { ActionLink } from "./action-link";
import { AppOrbit } from "./app-orbit";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const timeline = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });
        timeline
          .fromTo(
            "[data-hero-word]",
            { yPercent: 112, rotation: 3, transformOrigin: "0% 100%" },
            {
              yPercent: 0,
              rotation: 0,
              duration: 0.92,
              stagger: 0.095,
              ease: "power4.out",
              clearProps: "all",
            },
          )
          .from(
            "[data-hero-copy]",
            { autoAlpha: 0, y: 18, duration: 0.68, clearProps: "all" },
            0.42,
          )
          .from(
            "[data-hero-actions]",
            { autoAlpha: 0, y: 12, duration: 0.6, clearProps: "all" },
            0.57,
          )
          .from(
            "[data-hero-globe]",
            {
              autoAlpha: 0,
              scale: 0.96,
              y: 18,
              duration: 1,
              ease: "power3.out",
              clearProps: "all",
            },
            0.2,
          );

        const reveal = () => timeline.play();

        window.addEventListener("mogai:intro-complete", reveal, { once: true });

        const fallback = window.setTimeout(reveal, 4300);
        if (document.documentElement.dataset.mogaiIntroComplete === "true") {
          reveal();
        }
        return () => {
          window.removeEventListener("mogai:intro-complete", reveal);
          window.clearTimeout(fallback);
        };
      },
      root,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      ref={root}
      id="accueil"
      className="relative isolate overflow-hidden border-b border-divider pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pb-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_55%_at_72%_42%,rgba(255,90,31,0.075),transparent_75%)]"
      />
      <div className="relative mx-auto grid w-full max-w-[92rem] items-center gap-8 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-8">
        <div className="relative z-10 py-6 lg:py-10">
          <h1 className="max-w-[43rem] text-[clamp(2.55rem,5vw,4.8rem)] leading-[1.05] font-medium tracking-[-0.055em] text-fg">
            <SparklesText
              sparklesCount={10}
              colors={{ first: "#ff5a1f", second: "#efe9de" }}
              className="block"
            >
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span className="block whitespace-nowrap">
                  <span data-hero-word className="inline-block">
                    Antananarivo,
                  </span>
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span className="block whitespace-nowrap">
                  <span data-hero-word className="inline-block">
                    en
                  </span>{" "}
                  <span data-hero-word className="inline-block">
                    temps
                  </span>{" "}
                  <span
                    data-hero-word
                    className="inline-block text-ember"
                  >
                    réel.
                  </span>
                </span>
              </span>
            </SparklesText>
          </h1>

          <p
            data-hero-copy
            className="mt-7 max-w-[34rem] text-[16px] leading-[1.75] text-fg-2 sm:text-[18px]"
          >
            Moramora, Aiza et Gaspika transforment les signalements des
            habitants en interventions suivies par les services de la ville.
          </p>

          <div
            data-hero-actions
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ActionLink href="#applications" className="gap-3">
              Découvrir les applications{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </ActionLink>
            <ActionLink href="#vision" variant="secondary">
              Lire la vision
            </ActionLink>
          </div>
        </div>

        <div
          data-hero-globe
          className="relative mx-auto w-full max-w-[610px] px-1 sm:px-0"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[10%] rounded-full bg-ember/12 blur-[76px]"
          />
          <AppOrbit />
        </div>
      </div>
    </section>
  );
}
