import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative mx-auto w-[224px] rounded-[24px] border border-line-strong bg-[#0c0b0a] p-[6px] shadow-[0_18px_44px_-28px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="relative h-[440px] overflow-hidden rounded-[19px] bg-screen">
        <div className="absolute top-2 left-1/2 z-20 h-4 w-14 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}
