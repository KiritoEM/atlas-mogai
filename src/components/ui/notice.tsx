import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const noticeTones = {
  info: { icon: Info, className: "border-line-strong bg-raised text-fg-2" },
  success: {
    icon: CircleCheck,
    className: "border-gaspika/30 bg-gaspika/[0.07] text-fg-2",
  },
  alert: {
    icon: TriangleAlert,
    className: "border-moramora/35 bg-moramora/[0.08] text-fg-2",
  },
  error: {
    icon: CircleAlert,
    className: "border-destructive/40 bg-destructive/[0.08] text-fg-2",
  },
};

const noticeIconColor = {
  info: "text-fg-2",
  success: "text-gaspika",
  alert: "text-moramora",
  error: "text-[#ff8f92]",
};

export function Notice({
  tone = "info",
  title,
  children,
  className,
  live = false,
}: {
  tone?: keyof typeof noticeTones;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  live?: boolean;
}) {
  const { icon: Icon, className: toneClass } = noticeTones[tone];
  return (
    <div
      role={live ? (tone === "error" ? "alert" : "status") : undefined}
      className={cn(
        "flex gap-3 rounded-[12px] border px-4 py-3 text-sm leading-[1.6]",
        toneClass,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("mt-0.5 size-4 shrink-0", noticeIconColor[tone])}
      />
      <div className="min-w-0">
        {title ? <p className="font-medium text-fg">{title}</p> : null}
        {children ? (
          <div className={title ? "mt-0.5" : ""}>{children}</div>
        ) : null}
      </div>
    </div>
  );
}
