"use client";

import type { CSSProperties } from "react";
import { Marquee } from "@/components/magicui/marquee";
import { TICKER } from "../content";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const SECOND_ROW = [...TICKER].reverse();

function TickerRow({ items }: { items: readonly string[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={item}
          className="flex items-center gap-5 pr-5 text-base font-medium whitespace-nowrap text-white sm:gap-7 sm:pr-7 sm:text-lg"
        >
          {item}
          <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-ember" />
        </span>
      ))}
    </div>
  );
}

function StaticTicker() {
  return (
    <div className="mx-auto w-full max-w-[92rem] px-6 py-5 lg:px-8">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {TICKER.map((item, index) => (
          <span key={item} className="flex items-center gap-5 text-base font-medium text-white sm:text-lg">
            {index > 0 && <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-ember" />}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChallengeTicker() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative border-y border-line">
      {reduced ? (
        <StaticTicker />
      ) : (
        <>
          <span className="sr-only">{TICKER.join(", ")}</span>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

          <Marquee
            aria-hidden="true"
            repeat={2}
            pauseOnHover
            style={{ "--duration": "42s", "--gap": "0px" } as CSSProperties}
            className="px-0 py-3 sm:py-4"
          >
            <TickerRow items={TICKER} />
          </Marquee>

          <Marquee
            aria-hidden="true"
            repeat={2}
            reverse
            pauseOnHover
            style={{ "--duration": "48s", "--gap": "0px" } as CSSProperties}
            className="px-0 py-3 sm:py-4"
          >
            <TickerRow items={SECOND_ROW} />
          </Marquee>
        </>
      )}
    </div>
  );
}
