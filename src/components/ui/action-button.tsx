import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { focusRing } from "./focus-ring";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[10px] text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity] duration-150 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const buttonVariants = {
  primary: "bg-ember text-ember-ink hover:bg-[#ff6d38]",
  secondary: "border border-line-strong bg-raised text-fg hover:bg-[#2d2a26]",
  quiet: "text-fg-2 hover:bg-raised hover:text-fg",
  danger: "border border-destructive/40 bg-destructive/10 text-[#ff8f92] hover:bg-destructive/20",
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
