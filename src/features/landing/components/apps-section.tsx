import { APPS } from "../content";
import { AppCard } from "./app-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { SignalTick } from "./signature";

export function AppsSection() {
  return (
    <section
      id="applications"
      className="scroll-mt-20 border-t border-divider py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <Reveal>
          <p className="flex items-center gap-2.5 text-[13px] font-medium text-white">
            <SignalTick />
            L&apos;écosystème
          </p>
          <h2 className="mt-6 max-w-[46rem] text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.06] font-medium tracking-[-0.055em] text-fg">
            Trois applications,{" "}
            <span className="text-ember">un même réflexe.</span>
          </h2>
          <p className="mt-6 max-w-[42rem] text-[clamp(1rem,1.1vw,1.125rem)] leading-[1.6] text-fg-2 text-balance">
            Chacune répond à un défi précis. Toutes partagent la même donnée
            urbaine, pour que la ville agisse comme un seul système.
          </p>
        </Reveal>

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
      </div>
    </section>
  );
}
