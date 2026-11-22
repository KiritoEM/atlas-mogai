import { Award, Camera, Recycle, Trash2 } from "lucide-react";

export function GaspikaScreen() {
  return (
    <div className="flex h-full flex-col bg-screen">
      <div className="flex items-center justify-between px-4 pt-6">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-fg">
          <span className="size-1.5 rounded-full bg-gaspika" />
          Gaspika
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-gaspika">
          <Award className="size-3.5" />
          320 pts
        </span>
      </div>

      <div className="mx-3 mt-3 rounded-[10px] border border-line bg-raised p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-fg-3">Prochaine collecte</p>
          <span className="text-[11px] font-medium text-gaspika">Demain</span>
        </div>
        <p className="mt-1 text-[13px] font-medium text-fg">
          Ivandry{" "}
          <span className="font-mono text-[11px] font-normal tabular-nums text-fg-3">
            · 14:30
          </span>
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-gaspika" />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-fg-3">
            72 %
          </span>
        </div>
      </div>

      <div className="mx-3 mt-2 space-y-1.5">
        <div className="flex items-center gap-2 rounded-[8px] bg-raised px-2.5 py-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-gaspika/10">
            <Recycle className="size-3 text-gaspika" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-fg">
              Point de tri · 350 m
            </p>
            <p className="truncate text-[11px] text-fg-3">
              Verre et plastique
            </p>
          </div>
          <span className="ml-auto shrink-0 text-[11px] text-gaspika">
            Y aller
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-[8px] bg-raised px-2.5 py-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-gaspika/10">
            <Trash2 className="size-3 text-gaspika" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-fg">
              Dépôt signalé
            </p>
            <p className="truncate text-[11px] text-fg-3">Ankorondrano</p>
          </div>
          <span className="ml-auto shrink-0 text-[11px] text-gaspika">
            Suivre
          </span>
        </div>
      </div>

      <div className="mx-3 mt-2">
        <span className="flex h-8 w-full items-center justify-center gap-1.5 rounded-[8px] bg-gaspika text-[11px] font-semibold text-[#101408]">
          <Camera className="size-3.5" />
          Signaler un dépôt
        </span>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-line px-4 py-2 text-[11px]">
        <span className="text-gaspika">Collecte</span>
        <span className="text-fg-3">Carte</span>
        <span className="text-fg-3">Récompenses</span>
      </div>
    </div>
  );
}
