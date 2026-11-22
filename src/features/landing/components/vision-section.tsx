import { PILLARS } from "../content";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { SectionHeading } from "./section-heading";
import { SignalTick } from "./signature";

export function VisionSection() {
  return (
    <section id="vision" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[75rem] px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Notre vision"
            title="La ville n'a pas besoin de plus de bruit. Elle a besoin de meilleurs signaux."
          />

          <Stagger
            className="space-y-5 text-[15px] leading-[1.7] text-fg-2 lg:pt-10"
            delay={0.1}
            stagger={0.12}
            amount={0.3}
          >
            <StaggerItem>
              <p>
                Antananarivo produit chaque jour des millions de signaux : un
                nid-de-poule, un bus en retard, un dépôt sauvage, une rue
                inondée. Aujourd&apos;hui, la plupart se perdent entre deux
                appels et trois services.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                Moramora, Aiza et Gaspika captent ces signaux, les relient et
                les transforment en décisions utiles — pour les habitants, les
                agents sur le terrain et les décideurs. Pas une ville de robots
                : une ville qui écoute.
              </p>
            </StaggerItem>
          </Stagger>
        </div>

        <Reveal
          delay={0.1}
          y={30}
          className="mt-14 rounded-[16px] border border-line bg-surface p-8 sm:p-10 lg:p-12"
        >
          <p className="flex items-center gap-2.5 text-[13px] font-medium text-fg-3">
            <SignalTick />
            Notre conviction
          </p>
          <blockquote className="mt-5 max-w-[54rem] text-[1.5rem] leading-[1.42] tracking-[-0.01em] text-fg sm:text-[1.9rem] lg:text-[2.25rem]">
            « La meilleure technologie est celle qu&apos;on ne voit pas : elle se
            contente de rendre la ville plus humaine. »
          </blockquote>
          <p className="mt-6 text-[13px] text-fg-3">L&apos;équipe MogAI</p>
        </Reveal>

        <Stagger
          className="mt-14 border-t border-line pt-8"
          stagger={0.1}
          amount={0.2}
        >
          <ul className="grid gap-10 sm:grid-cols-3 sm:gap-12">
            {PILLARS.map((pillar) => (
              <StaggerItem as="li" key={pillar.index}>
                <p className="font-mono text-[12px] tabular-nums text-fg-3">
                  {pillar.index}
                </p>
                <h3 className="mt-4 text-[18px] font-medium text-fg">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-[1.65] text-fg-2">
                  {pillar.description}
                </p>
              </StaggerItem>
            ))}
          </ul>
        </Stagger>
      </div>
    </section>
  );
}
