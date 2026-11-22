import {
  CalendarDays,
  Check,
  Leaf,
  ListChecks,
  ShoppingBasket,
} from "lucide-react";

const week = [
  { day: "L", planned: true },
  { day: "M", planned: true },
  { day: "M", planned: false },
  { day: "J", planned: true },
  { day: "V", planned: true },
  { day: "S", planned: false },
  { day: "D", planned: false },
];

const groceries = [
  { label: "Tomates", amount: "1 kg", checked: true },
  { label: "Riz", amount: "2 kg", checked: false },
  { label: "Pain", amount: "2 pièces", checked: false },
];

export function GaspikaScreen() {
  return (
    <div className="flex h-full flex-col bg-screen">
      <div className="flex items-center justify-between px-4 pt-6">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-fg">
          <span className="size-1.5 rounded-full bg-gaspika" />
          Gaspika
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-gaspika">
          <Leaf aria-hidden="true" className="size-3.5" />
          2,4 kg sauvés
        </span>
      </div>

      <div className="mx-3 mt-3 rounded-[10px] border border-gaspika/25 bg-gaspika/[0.07] p-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-gaspika/15">
            <CalendarDays
              aria-hidden="true"
              className="size-3.5 text-gaspika"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-fg">Ma semaine</p>
              <span className="text-[11px] text-gaspika">
                4 repas planifiés
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-fg-3">18–24 novembre</p>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-7 gap-1">
          {week.map((item, index) => (
            <span
              key={`${item.day}-${index}`}
              className={
                item.planned
                  ? "flex h-6 items-center justify-center rounded-[6px] bg-gaspika text-[10px] font-medium text-[#101408]"
                  : "flex h-6 items-center justify-center rounded-[6px] bg-white/[0.05] text-[10px] text-fg-3"
              }
            >
              {item.day}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-3 mt-2.5 flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-fg">
          <ListChecks aria-hidden="true" className="size-3.5 text-gaspika" />
          Liste de courses
        </p>
        <span className="font-mono text-[10px] tabular-nums text-fg-3">
          1 / 3
        </span>
      </div>

      <div className="mx-3 mt-1.5 overflow-hidden rounded-[9px] border border-line bg-raised">
        {groceries.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 border-b border-line px-2.5 py-1.5 last:border-b-0"
          >
            <span
              className={
                item.checked
                  ? "flex size-4 shrink-0 items-center justify-center rounded-[5px] bg-gaspika text-[#101408]"
                  : "size-4 shrink-0 rounded-[5px] border border-line-strong"
              }
            >
              {item.checked && <Check aria-hidden="true" className="size-2.5" />}
            </span>
            <span
              className={
                item.checked
                  ? "text-[11px] text-fg-3 line-through"
                  : "text-[11px] text-fg"
              }
            >
              {item.label}
            </span>
            <span className="ml-auto font-mono text-[10px] tabular-nums text-fg-3">
              {item.amount}
            </span>
          </div>
        ))}
      </div>

      <div className="mx-3 mt-2 rounded-[9px] border border-gaspika/20 bg-gaspika/[0.06] px-2.5 py-2">
        <div className="flex items-center gap-2">
          <ShoppingBasket
            aria-hidden="true"
            className="size-4 shrink-0 text-gaspika"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-fg">
              Panier anti-gaspi compatible
            </p>
            <p className="text-[10px] text-fg-3">2 articles · à 450 m</p>
          </div>
          <span className="font-mono text-[11px] font-medium tabular-nums text-gaspika">
            8 000 Ar
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-around border-t border-line px-4 py-2 text-[11px]">
        <span className="text-fg-3">Planning</span>
        <span className="text-gaspika">Ma liste</span>
        <span className="text-fg-3">À sauver</span>
      </div>
    </div>
  );
}
