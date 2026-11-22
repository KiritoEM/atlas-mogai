import type { LucideIcon } from "lucide-react";
import { Droplets, ThumbsUp, Wind } from "lucide-react";
import { ROADMAP, type RoadmapItem } from "../content";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "./section-heading";

const icons: Record<RoadmapItem["id"], LucideIcon> = {
  eau: Droplets,
  air: Wind,
  participation: ThumbsUp,
};

export function RoadmapSection() {
  return (
    <section
      id="suite"
      className="scroll-mt-20 border-t border-divider py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="La suite"
            title="Trois chantiers pour la suite"
            description="Les prochains chantiers suivent la même logique : un signal, une donnée, une action. Ils enrichissent l'écosystème sans le complexifier."
          />

          <Stagger stagger={0.1} amount={0.2}>
            <ul className="divide-y divide-line border-y border-line">
              {ROADMAP.map((item) => {
                const Icon = icons[item.id];

                return (
                  <StaggerItem
                    as="li"
                    key={item.id}
                    className="group flex gap-4 py-6"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-fg-3 transition-colors duration-300 group-hover:text-fg-2" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-[16px] font-medium text-fg">
                          {item.title}
                        </h3>
                        <span className="flex items-center gap-1.5 text-[12px] text-fg-3">
                          <span className="size-1 rounded-full bg-fg-3" />
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-[1.65] text-fg-2">
                        {item.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </ul>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
