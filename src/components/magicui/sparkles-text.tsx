"use client";

import {
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Sparkle = {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
};

type SparklesTextProps = ComponentPropsWithoutRef<"span"> & {
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
};

function SparkleIcon({ x, y, color, delay, scale }: Sparkle) {
  return (
    <motion.svg
      aria-hidden="true"
      className="pointer-events-none absolute z-20"
      initial={{ opacity: 0, left: x, top: y }}
      animate={{
        opacity: [0, 0.9, 0],
        scale: [0.35, scale, 0.35],
        rotate: [75, 120, 150],
      }}
      transition={{
        duration: 1.1,
        repeat: Infinity,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      width="16"
      height="16"
      viewBox="0 0 21 21"
    >
      <path
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
        fill={color}
      />
    </motion.svg>
  );
}

// Adapted from the Magic UI Sparkles Text registry component.
export function SparklesText({
  children,
  className,
  colors = { first: "#ff5a1f", second: "#efe9de" },
  sparklesCount = 6,
  ...props
}: SparklesTextProps) {
  const reducedMotion = useReducedMotion();
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkle = (): Sparkle => ({
      id: crypto.randomUUID(),
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: Math.random() > 0.5 ? colors.first : colors.second,
      delay: Math.random() * 2,
      scale: Math.random() * 0.55 + 0.35,
      lifespan: Math.random() * 10 + 5,
    });

    let interval: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      if (reducedMotion) {
        setSparkles([]);
        return;
      }

      setSparkles(
        Array.from({ length: sparklesCount }, () => generateSparkle()),
      );

      interval = window.setInterval(() => {
        setSparkles((currentSparkles) =>
          currentSparkles.map((sparkle) =>
            sparkle.lifespan <= 0
              ? generateSparkle()
              : { ...sparkle, lifespan: sparkle.lifespan - 0.1 },
          ),
        );
      }, 100);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [colors.first, colors.second, reducedMotion, sparklesCount]);

  return (
    <span
      className={cn("relative inline-block isolate", className)}
      {...props}
    >
      {sparkles.map((sparkle) => (
        <SparkleIcon key={sparkle.id} {...sparkle} />
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
