import { Bell, Camera, Map, ScanLine, UsersRound } from "lucide-react";

export function MoramoraScreen() {
  return (
    <div className="flex h-full flex-col bg-screen">
      <div className="flex items-center justify-between px-4 pt-6">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-fg">
          <span className="size-1.5 rounded-full bg-moramora" />
          Moramora
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-moramora">
          <Camera aria-hidden="true" className="size-3.5" />
          Caméra active
        </span>
      </div>

      <div className="relative mx-3 mt-3 h-[132px] overflow-hidden rounded-[10px] border border-line-strong bg-[#12100f]">
        <svg
          viewBox="0 0 198 132"
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#24211e" />
              <stop offset="1" stopColor="#151311" />
            </linearGradient>
          </defs>
          <rect width="198" height="132" fill="url(#road)" />
          <path d="M0 44H198" stroke="#efe9de" strokeOpacity="0.08" />
          <path
            d="M45 132L82 45M153 132L116 45"
            stroke="#efe9de"
            strokeOpacity="0.12"
          />
          <path
            d="M99 120V104M99 92V76M99 65V52"
            stroke="#efe9de"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <ellipse
            cx="128"
            cy="94"
            rx="19"
            ry="9"
            fill="#090807"
            stroke="var(--moramora)"
            strokeOpacity="0.7"
          />
          <rect
            x="103"
            y="76"
            width="50"
            height="37"
            rx="4"
            fill="none"
            stroke="var(--moramora)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </svg>

        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-[6px] bg-black/55 px-1.5 py-1 text-[10px] text-fg-2">
          <span className="size-1.5 rounded-full bg-moramora" />
          Analyse en direct
        </span>
        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-[6px] bg-moramora px-1.5 py-1 text-[10px] font-medium text-ember-ink">
          <ScanLine aria-hidden="true" className="size-3" />
          Danger détecté
        </span>
      </div>

      <div className="mx-3 mt-3 rounded-[9px] border border-line bg-raised px-2.5 py-2">
        <div className="flex items-center gap-2">
          <UsersRound
            aria-hidden="true"
            className="size-4 shrink-0 text-moramora"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-fg">
              48 usagers avertis
            </p>
            <p className="text-[10px] text-fg-3">
              À proximité · rayon de 800 m
            </p>
          </div>
          <div className="flex -space-x-1.5">
            {["MR", "TN", "FH"].map((initials) => (
              <span
                key={initials}
                className="flex size-5 items-center justify-center rounded-full border border-raised bg-moramora/15 font-mono text-[7px] text-moramora"
              >
                {initials}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-line px-4 py-2">
        <Camera aria-hidden="true" className="size-4 text-moramora" />
        <Map aria-hidden="true" className="size-4 text-fg-3" />
        <Bell aria-hidden="true" className="size-4 text-fg-3" />
      </div>
    </div>
  );
}
