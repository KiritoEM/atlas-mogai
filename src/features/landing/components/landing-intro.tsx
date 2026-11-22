"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const BRAND = ["M", "o", "g", "A", "I", "."];
const BARS = Array.from({ length: 7 }, (_, index) => index);

export function LandingIntro() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;

    document.documentElement.style.removeProperty("overflow");
    document.documentElement.dataset.mogaiIntroComplete = "false";
    let active = true;
    let finished = false;
    const finish = () => {
      if (!active || finished) return;
      finished = true;
      document.documentElement.dataset.mogaiIntroComplete = "true";
      window.dispatchEvent(new Event("mogai:intro-complete"));
      setVisible(false);
    };

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (motionPreference.matches) {
      gsap.set(element, { display: "none" });
      queueMicrotask(finish);
      return () => {
        active = false;
      };
    }

    const fallback = window.setTimeout(finish, 3400);

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: finish,
      });

      timeline
        .fromTo(
          "[data-intro-char]",
          {
            y: 76,
            rotation: 3,
            autoAlpha: 0,
            filter: "blur(5px)",
          },
          {
            y: 0,
            rotation: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.08,
            ease: "power4.out",
          },
          0.04,
        )
        .to(
          "[data-intro-word]",
          {
            autoAlpha: 0,
            y: -18,
            duration: 0.3,
            ease: "power2.in",
          },
          1.75,
        )
        .to(
          "[data-intro-bar]",
          {
            yPercent: -101,
            duration: 0.84,
            stagger: 0.04,
            ease: "power3.inOut",
          },
          1.9,
        );

      const stopForReducedMotion = (event: MediaQueryListEvent) => {
        if (event.matches) timeline.progress(1);
      };
      motionPreference.addEventListener("change", stopForReducedMotion);
      return () =>
        motionPreference.removeEventListener("change", stopForReducedMotion);
    }, element);

    return () => {
      active = false;
      context.revert();
      window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="landing-intro pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      role="status"
      aria-label="Chargement de MogAI"
    >
      <div className="absolute inset-0 grid grid-cols-7">
        {BARS.map((bar) => (
          <div key={bar} data-intro-bar className="h-full bg-[#201e1b]" />
        ))}
      </div>

      <div
        data-intro-word
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-fg"
      >
        <div className="flex overflow-hidden pb-2 text-[clamp(4.5rem,12vw,10rem)] leading-none font-medium tracking-[-0.09em]">
          {BRAND.map((letter, index) => (
            <span
              key={index}
              data-intro-char
              className={`inline-block ${letter === "." ? "text-ember" : ""}`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
