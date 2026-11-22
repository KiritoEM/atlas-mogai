import type { LucideIcon } from "lucide-react";
import {
  Car,
  Droplets,
  Landmark,
  Network,
  Trash2,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_BY_ID, CHALLENGES, type ChallengeId } from "../content";
import { appDot } from "../app-theme";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { SectionHeading } from "./section-heading";

const icons: Record<ChallengeId, LucideIcon> = {
  trafic: Car,
  dechets: Trash2,
  inondations: Droplets,
  services: Landmark,
  pollution: Wind,
  coordination: Network,
};

export function ChallengesSection() {
  return (
    <section
      id="defis"
      className="scroll-mt-20 border-t border-line py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[75rem] px-6 lg:px-8">
        <SectionHeading
          eyebrow="Les défis"
          title="Six problèmes réels, des réponses concrètes"
          description="Antananarivo n'attend pas une ville parfaite. Elle a besoin d'outils utiles, aujourd'hui, pour les problèmes qu'elle vit chaque jour."
        />

        <Stagger
          className="mt-12 grid gap-x-16 border-b border-line sm:grid-cols-2"
          stagger={0.07}
          amount={0.1}
        >
          {CHALLENGES.map((challenge) => {
            const Icon = icons[challenge.id];

            return (
              <StaggerItem
                as="article"
                key={challenge.id}
                className="group border-t border-line py-7"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0 text-fg-3 transition-transform duration-300 group-hover:-rotate-6 group-hover:text-fg-2" />
                  <h3 className="text-[17px] font-medium text-fg">
                    {challenge.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-[1.65] text-fg-2">
                  {challenge.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  {challenge.apps.map((appId) => (
                    <span
                      key={appId}
                      className="flex items-center gap-1.5 text-[12px] text-fg-3"
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          appDot[appId],
                        )}
                      />
                      {APP_BY_ID[appId].name}
                    </span>
                  ))}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-4 text-[13px] text-fg-3">
            Chaque signalement alimente une base commune.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
