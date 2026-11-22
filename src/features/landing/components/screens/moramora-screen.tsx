import { Bell, Map, Plus, TriangleAlert } from "lucide-react";

const alerts = [
  { label: "Rue inondée", place: "Anosy" },
  { label: "Feu hors service", place: "67 Ha" },
];

export function MoramoraScreen() {
  return (
    <div className="flex h-full flex-col bg-screen">
      <div className="flex items-center justify-between px-4 pt-6">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-fg">
          <span className="size-1.5 rounded-full bg-moramora" />
          Moramora
        </span>
        <Bell className="size-3.5 text-fg-3" />
      </div>

      <div className="relative mx-3 mt-2.5 h-[96px] overflow-hidden rounded-[10px] border border-line bg-[#191714]">
        <svg
          viewBox="0 0 198 96"
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          <g
            fill="none"
            stroke="#efe9de"
            strokeOpacity="0.08"
            strokeLinecap="round"
          >
            <path d="M-10 30H70L100 46H210" />
            <path d="M-10 70H60L90 56H210" />
            <path d="M46 -10V40L64 64V110" />
            <path d="M126 -10V58L110 80V110" />
          </g>
          <path
            d="M22 84C50 66 64 72 88 52S136 34 160 18"
            fill="none"
            stroke="var(--moramora)"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
          <circle cx="88" cy="52" r="7" fill="none" stroke="var(--moramora)" strokeOpacity="0.3" />
          <circle cx="88" cy="52" r="3.5" fill="var(--moramora)" />
        </svg>
        <span className="absolute top-2 left-2 text-[11px] text-fg-3">
          Analakely
        </span>
      </div>

      <div className="mx-3 mt-2.5 rounded-[10px] border border-moramora/25 bg-moramora/[0.07] p-2.5">
        <div className="flex items-start gap-2">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-moramora" />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-fg">Nid-de-poule</p>
            <p className="mt-0.5 text-[11px] text-fg-3">
              Analakely · 2 min
            </p>
          </div>
          <span className="shrink-0 text-[11px] font-medium text-moramora">
            Haute
          </span>
        </div>
      </div>

      <div className="mx-3 mt-2 space-y-1.5">
        {alerts.map((alert) => (
          <div
            key={alert.label}
            className="flex items-center gap-2 rounded-[8px] bg-raised px-2.5 py-1.5"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-moramora/70" />
            <p className="truncate text-[11px] text-fg-2">{alert.label}</p>
            <p className="ml-auto shrink-0 text-[11px] text-fg-3">
              {alert.place}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-line px-4 py-2">
        <Map className="size-4 text-fg-3" />
        <span className="flex size-7 items-center justify-center rounded-full bg-moramora text-ember-ink">
          <Plus className="size-3.5" />
        </span>
        <Bell className="size-4 text-fg-3" />
      </div>
    </div>
  );
}
