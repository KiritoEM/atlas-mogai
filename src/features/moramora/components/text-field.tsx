"use client";

import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { focusRing } from "./ui";

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  hint?: string;
  errors?: string[];
};

export function TextField({
  label,
  hint,
  errors = [],
  type = "text",
  className,
  ...props
}: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const invalid = errors.length > 0;
  const describedBy =
    [hint ? hintId : null, invalid ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[13px] font-medium text-fg">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={isPassword && revealed ? "text" : type}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 w-full rounded-[10px] border bg-ground px-3.5 text-[15px] text-fg transition-colors duration-150 placeholder:text-fg-3 hover:border-divider",
            focusRing,
            "focus-visible:border-ember/60",
            invalid ? "border-destructive/70" : "border-line-strong",
            isPassword && "pr-12",
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-pressed={revealed}
            aria-label={
              revealed ? "Masquer le mot de passe" : "Afficher le mot de passe"
            }
            className={cn(
              "absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-[10px] text-fg-3 transition-colors hover:text-fg",
              focusRing,
            )}
          >
            {revealed ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-[13px] text-fg-3">
          {hint}
        </p>
      ) : null}
      {invalid ? (
        <ul id={errorId} className="mt-1.5 space-y-0.5 text-[13px] text-[#ff8f92]">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
