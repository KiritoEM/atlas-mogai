import { Layers } from "lucide-react";
import { APPS, TECH_STACK } from "../content";
import { AppCard } from "./app-card";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { SectionHeading } from "./section-heading";

export function AppsSection() {
  return (
    <section
      id="applications"
      className="scroll-mt-20 border-t border-line py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[75rem] px-6 lg:px-8">
        <SectionHeading
          eyebrow="L'écosystème"
          title="Trois applications, un même réflexe"
          description="Chacune répond à un défi précis. Toutes partagent la même donnée urbaine, pour que la ville agisse comme un seul système."
        />

        <Stagger
          className="mt-12 grid gap-6 lg:grid-cols-3"
          stagger={0.1}
          amount={0.15}
        >
          {APPS.map((app) => (
            <StaggerItem key={app.id} className="h-full">
              <AppCard app={app} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col gap-5 rounded-[16px] border border-line bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Layers className="mt-0.5 size-4 shrink-0 text-fg-3" />
              <div>
                <p className="text-[15px] font-medium text-fg">
                  Une seule plateforme de données
                </p>
                <p className="mt-0.5 text-[13px] text-fg-2">
                  Les trois applications partagent la même information urbaine.
                </p>
              </div>
            </div>
            <p className="text-[12px] text-fg-3">
              {TECH_STACK.map((tech) => tech.short).join(" · ")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
