import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Camera,
  Cloud,
  Database,
  LineChart,
  Radio,
  Send,
} from "lucide-react";
import { STEPS, type Step } from "../content";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "./section-heading";

const stepIcons: Record<Step["id"], LucideIcon> = {
  signaler: Camera,
  comprendre: BrainCircuit,
  agir: Send,
  apprendre: LineChart,
};

const tech: { label: string; icon: LucideIcon }[] = [
  { label: "Intelligence artificielle", icon: BrainCircuit },
  { label: "Objets connectés", icon: Radio },
  { label: "Cloud", icon: Cloud },
  { label: "Données ouvertes", icon: Database },
];

export function HowItWorksSection() {
  return (
    <section
      id="methode"
      className="scroll-mt-20 border-t border-divider py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <SectionHeading
          eyebrow="La méthode"
          title="Du signalement à l'intervention"
          description="Une chaîne simple, lisible et mesurable. Chaque étape a un responsable, chaque action laisse une trace."
        />

        <Stagger
          className="mt-12"
          stagger={0.1}
          amount={0.15}
        >
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => {
              const Icon = stepIcons[step.id];

              return (
                <StaggerItem
                  as="li"
                  key={step.id}
                  className="group relative border-t border-line pt-6"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-[3px] left-0 size-1.5 rounded-full bg-ember transition-transform duration-300 group-hover:scale-150"
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] tabular-nums text-fg-3">
                      {step.index}
                    </span>
                    <Icon className="size-4 text-fg-3 transition-colors duration-300 group-hover:text-fg-2" />
                  </div>
                  <h3 className="mt-5 text-[17px] font-medium text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.65] text-fg-2">
                    {step.description}
                  </p>
                </StaggerItem>
              );
            })}
          </ol>
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-6 rounded-[16px] border border-line bg-surface p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[32rem] text-sm leading-[1.65] text-fg-2">
              <span className="font-medium text-fg">
                Une seule chaîne de valeur.
              </span>{" "}
              Du capteur citoyen à la décision publique, en passant par l&apos;IA
              et le cloud.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {tech.map((item) => {
                const Icon = item.icon;

                return (
                  <li
                    key={item.label}
                    className="inline-flex items-center gap-1.5 text-[12px] text-fg-3"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
