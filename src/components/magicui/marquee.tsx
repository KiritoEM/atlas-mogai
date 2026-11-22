import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children: ReactNode;
}

// Adapted from the Magic UI Marquee registry component.
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      data-pause-on-hover={pauseOnHover ? "true" : undefined}
      className={cn(
        "magic-marquee group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          data-reverse={reverse ? "true" : undefined}
          data-vertical={vertical ? "true" : undefined}
          className={cn(
            "magic-marquee-track flex shrink-0 justify-around gap-(--gap)",
            vertical ? "flex-col" : "flex-row",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
