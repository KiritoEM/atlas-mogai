import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion-primitives";
import { SignalTick } from "./signature";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-[42rem]", className)}>
      <p className="flex items-center gap-2.5 text-[13px] font-medium text-fg-3 text-white">
        <SignalTick />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[2rem] leading-[1.1] font-medium tracking-[-0.015em] text-balance text-fg sm:text-[2.5rem] lg:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-[36rem] text-[15px] leading-[1.65] text-fg-2">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
