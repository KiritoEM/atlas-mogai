import { Bus, Footprints, LocateFixed, Navigation, Search } from "lucide-react";

export function AizaScreen() {
  return (
    <div className="flex h-full flex-col bg-screen">
      <div className="px-3 pt-7">
        <div className="flex items-center gap-2 rounded-[8px] border border-line bg-raised px-2.5 py-2">
          <Search className="size-3.5 shrink-0 text-aiza" />
          <span className="text-[11px] text-fg-3">Où allez-vous ?</span>
          <LocateFixed className="ml-auto size-3.5 shrink-0 text-fg-3" />
        </div>
      </div>

      <div className="relative mx-3 mt-2.5 h-[104px] overflow-hidden rounded-[10px] border border-line bg-[#191714]">
        <svg
          viewBox="0 0 198 104"
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          <g
            fill="none"
            stroke="#efe9de"
            strokeOpacity="0.08"
            strokeLinecap="round"
          >
            <path d="M-10 36H70L96 54H210" />
            <path d="M-10 82H54L84 68H210" />
            <path d="M38 -10V46L58 76V120" />
            <path d="M132 -10V62L112 88V120" />
          </g>
          <path
            d="M30 92C54 78 60 60 86 52S128 40 152 16"
            fill="none"
            stroke="var(--aiza)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="30" cy="92" r="3.5" fill="var(--aiza)" />
          <circle cx="152" cy="16" r="4" fill="var(--aiza)" />
        </svg>
        <span className="absolute top-2 left-2 text-[11px] text-fg-3">
          Antaninarenina
        </span>
        <span className="absolute top-2 right-2 rounded-[6px] bg-[#191714]/90 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-aiza">
          18 min
        </span>
      </div>

      <div className="mx-3 mt-2.5 rounded-[10px] border border-line bg-raised p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-fg-3">Le plus rapide</p>
          <span className="text-[11px] font-medium text-aiza">Fluide</span>
        </div>
        <p className="mt-1 font-mono text-[16px] tabular-nums text-fg">
          18 min{" "}
          <span className="font-sans text-[11px] text-fg-3">· 4,2 km</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-[6px] bg-white/[0.05] px-1.5 py-1 text-[11px] text-fg-2">
            <Bus className="size-3 text-aiza" /> Bus 119 · 12 min
          </span>
          <span className="inline-flex items-center gap-1 rounded-[6px] bg-white/[0.05] px-1.5 py-1 text-[11px] text-fg-2">
            <Footprints className="size-3 text-aiza" /> Marche · 6 min
          </span>
        </div>
      </div>

      <div className="mx-3 mt-2">
        <span className="flex h-8 w-full items-center justify-center gap-1.5 rounded-[8px] bg-aiza text-[11px] font-semibold text-[#08151b]">
          <Navigation className="size-3.5" />
          Démarrer l&apos;itinéraire
        </span>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-line px-4 py-2 text-[11px]">
        <span className="text-aiza">Carte</span>
        <span className="text-fg-3">Transport</span>
        <span className="text-fg-3">Services</span>
      </div>
    </div>
  );
}
