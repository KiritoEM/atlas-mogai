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
