"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useScroll,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.25,
  once = true,
}: RevealProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: reduced ? 0 : 0.6,
        delay: reduced ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
};

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  amount = 0.2,
}: StaggerProps) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduced ? 0 : delay,
        staggerChildren: reduced ? 0 : stagger,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  y?: number;
};

export function StaggerItem({
  children,
  className,
  as = "div",
  y = 20,
}: StaggerItemProps) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.55, ease: EASE },
    },
  };

  const tags = {
    div: motion.div,
    li: motion.li,
    article: motion.article,
  };
  const MotionTag = tags[as] as typeof motion.div;

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}

type CountUpProps = {
  value: number;
  className?: string;
};

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-ember"
    />
  );
}

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduced || !inView) {
      return;
    }

    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{reduced ? value : display}</span>
    </span>
  );
}
