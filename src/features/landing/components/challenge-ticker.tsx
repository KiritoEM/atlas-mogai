"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
} from "motion/react";
import { Pause, Play } from "lucide-react";
import { TICKER } from "../content";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const SPEED = 36;

function TickerRow({ muted = false }: { muted?: boolean }) {
  return (
    <div
      aria-hidden={muted || undefined}
      className="flex shrink-0 items-center"
    >
      {TICKER.map((item) => (
        <span
          key={item}
          className="flex items-center gap-4 pr-4 text-[13px] whitespace-nowrap text-fg-3"
        >
          {item}
          <span aria-hidden="true" className="size-1 rounded-full bg-fg-3/40" />
        </span>
      ))}
    </div>
  );
}

function StaticTicker() {
  return (
    <div className="mx-auto w-full max-w-[75rem] px-6 py-4 lg:px-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {TICKER.map((item, index) => (
          <span
            key={item}
            className="flex items-center gap-4 text-[13px] text-fg-3"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-fg-3/40"
              />
            ) : null}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChallengeTicker() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);
  const x = useMotionValue(0);
  const [loopWidth, setLoopWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const measure = () => setLoopWidth(track.scrollWidth / 2);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!inView || reduced || paused || hovered || loopWidth <= 0) {
      return;
    }

    const next = x.get() - (delta / 1000) * SPEED;
    x.set(next <= -loopWidth ? next + loopWidth : next);
  });

  return (
    <div ref={sectionRef} className="relative border-y border-line">
      <div className="hidden motion-reduce:block">
        <StaticTicker />
      </div>

      <div className="motion-reduce:hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent"
          aria-hidden="true"
        />

        <div
          className="overflow-hidden py-4"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex w-max will-change-transform"
          >
            <TickerRow />
            <TickerRow muted />
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused
              ? "Reprendre le défilement des défis"
              : "Mettre le défilement des défis en pause"
          }
          className="absolute top-1/2 right-3 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/80 text-fg-3 backdrop-blur-sm transition-colors duration-150 hover:text-fg focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:outline-none"
        >
          {paused ? (
            <Play className="size-3" aria-hidden="true" />
          ) : (
            <Pause className="size-3" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
