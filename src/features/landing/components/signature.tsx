"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion-primitives";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type SignalTickProps = {
  className?: string;
};

export function SignalTick({ className }: SignalTickProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.svg
      width="22"
      height="8"
      viewBox="0 0 22 8"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.path
        d="M0 4h16.5"
        stroke="var(--ember)"
        strokeWidth="1.5"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: reduced ? 0 : 0.55, ease: EASE },
          },
        }}
      />
      <motion.circle
        cx="18.5"
        cy="4"
        r="2.5"
        fill="var(--ember)"
        style={{ transformOrigin: "18.5px 4px" }}
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: reduced ? 0 : 0.35,
              delay: reduced ? 0 : 0.35,
              ease: EASE,
            },
          },
        }}
      />
    </motion.svg>
  );
}
