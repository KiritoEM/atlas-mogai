import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const focusRing =
  "focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity] duration-150 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const buttonVariants = {
  primary: "bg-ember text-ember-ink hover:bg-[#ff6d38]",
  secondary:
    "border border-line-strong bg-raised text-fg hover:bg-[#2d2a26]",
  quiet: "text-fg-2 hover:bg-raised hover:text-fg",
  danger:
    "border border-destructive/40 bg-destructive/10 text-[#ff8f92] hover:bg-destructive/20",
};

const buttonSizes = {
  default: "h-11 px-5",
  sm: "h-9 px-3.5 text-[13px]",
};

type ButtonStyleProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function buttonClass({
  variant = "primary",
  size = "default",
}: ButtonStyleProps = {}) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], focusRing);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      type={type}
      className={cn(buttonClass({ variant, size }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return (
    <Link className={cn(buttonClass({ variant, size }), className)} {...props} />
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-[40rem]">
        {eyebrow ? (
          <p className="flex items-center gap-2 text-[13px] font-medium text-fg-3">
            <span aria-hidden="true" className="h-px w-4 bg-ember" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-[1.75rem] leading-[1.15] font-medium tracking-[-0.015em] text-balance text-fg sm:text-[2.25rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-[15px] leading-[1.65] text-fg-2">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}

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
  /** Announce the notice when it appears. */
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
        {children ? <div className={title ? "mt-0.5" : ""}>{children}</div> : null}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  label,
}: {
  /** 0 → 1, or undefined for an indeterminate bar. */
  value?: number;
  label: string;
}) {
  const percent = value === undefined ? undefined : Math.round(value * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={percent === undefined ? "En cours" : `${percent} %`}
      className="relative h-1.5 w-full overflow-hidden rounded-full bg-raised"
    >
      {percent === undefined ? (
        <span className="moramora-indeterminate absolute inset-y-0 w-1/3 rounded-full bg-ember" />
      ) : (
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-ember transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      )}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
    />
  );
}
