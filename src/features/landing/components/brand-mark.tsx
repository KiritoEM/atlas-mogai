import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  size?: number;
};

export function BrandMark({ className, size = 24 }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center text-ember", className)}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 18.5c4.25 0 4.25-5.5 8.5-5.5s4.25-6 8.5-6"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <circle cx="3" cy="18.5" r="1.5" fill="currentColor" />
        <circle cx="20" cy="7" r="2.4" fill="currentColor" />
      </svg>
    </span>
  );
}
