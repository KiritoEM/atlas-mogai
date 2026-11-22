import type { ReactNode } from "react";
import { focusRing } from "@/components/ui";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="w-full max-w-[28rem] rounded-[20px] border border-white/[0.07] bg-surface/85 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-8">
      <h1 className="text-center text-[1.75rem] leading-[1.15] font-medium tracking-[-0.015em] text-fg">
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-[1.6] text-fg-2">{description}</p>
      <div className="mt-8">{children}</div>
      <p className="mt-7 border-t border-line pt-5 text-sm text-fg-2">
        {footer}
      </p>
    </div>
  );
}

export const authLinkClass = `rounded-[4px] font-semibold text-ember underline decoration-ember/50 underline-offset-4 transition-colors hover:text-[#ffb18f] hover:decoration-[#ffb18f] ${focusRing}`;
