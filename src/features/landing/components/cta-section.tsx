import { ActionLink } from "./action-link";
import { Reveal } from "@/components/motion-primitives";
import Image from "next/image";

export function CtaSection() {
  return (
    <section id="rejoindre" className="scroll-mt-20 pb-20 sm:pb-24">
      <div className="mx-auto w-full max-w-[92rem] px-6 lg:px-8">
        <Reveal
          y={28}
          className="rounded-[16px] border border-line bg-surface p-8 sm:p-12"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
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
            </div>

            <div
              aria-hidden="true"
              className="relative mx-auto aspect-[1.75] w-full max-w-[36rem] overflow-hidden rounded-[14px] border border-line bg-ground p-3 sm:p-5"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,90,31,0.1),transparent_68%)]" />
              <Image
                src="/illustrations/city-life.svg"
                alt=""
                width={1048}
                height={450}
                unoptimized
                className="relative size-full object-contain"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
