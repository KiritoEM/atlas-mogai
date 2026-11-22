import { APPS, CHALLENGES } from "../content";
import { ActionLink } from "./action-link";
import { CountUp, Reveal } from "@/components/motion-primitives";

const spec = [
  { label: "Applications", value: APPS.length },
  { label: "Plateforme de données", value: 1 },
  { label: "Défis traités", value: CHALLENGES.length },
];

export function CtaSection() {
  return (
    <section id="rejoindre" className="scroll-mt-20 pb-20 sm:pb-24">
      <div className="mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <Reveal
          y={28}
          className="rounded-[16px] border border-line bg-surface p-8 sm:p-12"
        >
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-[2rem] leading-[1.1] font-medium tracking-[-0.015em] text-balance text-fg sm:text-[2.5rem]">
                Les prototypes sont ouverts
              </h2>
              <p className="mt-4 max-w-[32rem] text-[15px] leading-[1.65] text-fg-2">
                Moramora, Aiza et Gaspika sont pensés pour Antananarivo.
                Testez-les, critiquez-les, améliorez-les.
              </p>
              <div className="mt-8">
                <ActionLink href="#applications">
                  Découvrir les applications
                </ActionLink>
              </div>
              <p className="mt-6 text-[12px] text-fg-3">
                Aperçu conceptuel · les données affichées sont fictives
              </p>
            </div>

            <dl className="self-center divide-y divide-line border-y border-line">
              {spec.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 py-4"
                >
                  <dt className="text-[13px] text-fg-3">{row.label}</dt>
                  <dd className="font-mono text-[18px] text-fg">
                    <CountUp value={row.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
