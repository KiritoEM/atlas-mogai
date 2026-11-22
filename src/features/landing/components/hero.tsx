"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { ActionLink } from "./action-link";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const locationFloatRef = useRef<HTMLDivElement>(null);
  const connectorFloatRef = useRef<HTMLDivElement>(null);
  const locationRevealRef = useRef<HTMLDivElement>(null);
  const connectorRevealRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const illustrations = [
          locationRevealRef.current,
          connectorRevealRef.current,
        ];
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
            { autoAlpha: 0, y: 18, duration: 0.38, clearProps: "all" },
            0.42,
          )
          .fromTo(
            illustrations,
            {
              opacity: 0,
              y: -40,
              scale: 0.72,
              filter: "blur(12px)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.05,
              stagger: 0.18,
              ease: "back.out(1.55)",
              clearProps: "opacity,transform,filter",
            },
            0.28,
          )
          .from(
            "[data-hero-actions]",
            { autoAlpha: 0, y: 12, duration: 0.3, clearProps: "all" },
            0.57,
          );

        gsap.to(locationFloatRef.current, {
          x: 7,
          y: -25,
          rotation: 4,
          scale: 1.035,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
        gsap.to(connectorFloatRef.current, {
          x: -8,
          y: 24,
          rotation: -4,
          scale: 1.04,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          delay: 0.7,
          ease: "power2.inOut",
        });

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
        className="pointer-events-none absolute bottom-[7%] left-1/2 h-52 w-[min(48rem,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,31,0.12),rgba(255,90,31,0.035)_42%,transparent_72%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(ellipse_70%_80%_at_50%_100%,rgba(255,90,31,0.18),rgba(255,90,31,0.06)_48%,transparent_78%)]"
      />

      <div
        ref={locationFloatRef}
        data-hero-float="location"
        aria-hidden="true"
        className="pointer-events-none absolute top-[26%] left-[4%] z-10 hidden w-[clamp(11rem,14vw,13.5rem)] opacity-80 drop-shadow-[0_22px_38px_rgba(255,90,31,0.12)] xl:block 2xl:left-[calc(50%_-_42rem)]"
      >
        <div ref={locationRevealRef} data-hero-illustration>
          <Image
            src="/illustrations/hero-location.svg"
            alt=""
            width={633}
            height={800}
            className="h-auto w-full"
          />
        </div>
      </div>

      <div
        ref={connectorFloatRef}
        data-hero-float="connector"
        aria-hidden="true"
        className="pointer-events-none absolute top-[29%] right-[3.5%] z-10 hidden w-[clamp(14rem,19vw,18rem)] opacity-78 drop-shadow-[0_22px_38px_rgba(255,90,31,0.12)] xl:block 2xl:right-[calc(50%_-_43rem)]"
      >
        <div ref={connectorRevealRef} data-hero-illustration>
          <Image
            src="/illustrations/hero-connection.svg"
            alt=""
            width={868}
            height={674}
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[92rem] justify-center px-6 lg:px-8">
        <div className="relative z-10 flex w-full flex-col items-center py-10 text-center lg:py-16">
          <h1 className="mx-auto max-w-[58rem] text-[clamp(2.75rem,6.5vw,6.5rem)] leading-[0.98] font-medium tracking-[-0.065em] text-fg">
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
                  <span data-hero-word className="inline-block text-ember">
                    réel.
                  </span>
                </span>
              </span>
            </SparklesText>
          </h1>

          <p
            data-hero-copy
            className="mx-auto mt-7 max-w-[40rem] text-[16px] leading-[1.75] text-fg-2 sm:text-[18px]"
          >
            Moramora, Aiza et Gaspika transforment les signalements des
            habitants en interventions suivies par les services de la ville.
          </p>

          <div
            data-hero-actions
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
      </div>
    </section>
  );
}
