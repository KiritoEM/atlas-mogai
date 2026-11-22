import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-[16px] border border-line bg-surface", className)}
      {...props}
    />
  );
}
