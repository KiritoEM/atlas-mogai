import type { ReactNode } from "react";

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
