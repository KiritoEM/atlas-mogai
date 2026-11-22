"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type ActionLinkProps = HTMLMotionProps<"a"> & {
  variant?: "primary" | "secondary" | "quiet";
};

const variants = {
  primary: "bg-ember text-ember-ink hover:bg-[#ff6d38]",
  secondary:
    "border border-line-strong bg-raised text-fg hover:border-line-strong hover:bg-[#2d2a26]",
  quiet: "text-fg-2 hover:text-fg",
};

export function ActionLink({
  children,
  variant = "primary",
  className,
  ...props
}: ActionLinkProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.a
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color] duration-150 focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.a>
  );
}
