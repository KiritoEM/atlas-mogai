import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { AuthProvider } from "@/features/moramora/auth/auth-provider";
import { focusRing } from "@/features/moramora/components/ui";

const points = [
  "Analyse photo et vidéo par l'IA en quelques secondes",
  "Flux caméra en direct, alertes instantanées",
  "Journal des infractions détectées pendant la session",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <aside className="hidden flex-col justify-between border-r border-line bg-ground p-10 lg:flex xl:p-14">
          <Link
            href="/"
            className={`inline-flex w-fit items-center gap-2.5 rounded-[8px] ${focusRing}`}
          >
            <BrandMark size={24} />
            <span className="text-[17px] font-medium text-fg">MogAI</span>
          </Link>

          <div className="max-w-[30rem]">
            <p className="flex items-center gap-2 text-[13px] font-medium text-fg-3">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-moramora" />
              Moramora · Mobilité & voirie
            </p>
            <p className="mt-4 text-[2.25rem] leading-[1.1] font-medium tracking-[-0.02em] text-balance text-fg">
              Le réflexe citoyen pour des routes plus sûres.
            </p>
            <ul className="mt-8 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] text-fg-2">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6rem] h-px w-4 shrink-0 bg-ember"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[13px] text-fg-3">
            « Moramora » : doucement, en malgache.
          </p>
        </aside>

        <div className="flex flex-col">
          <div className="flex h-16 items-center justify-between px-6 lg:px-10">
            <Link
              href="/"
              className={`inline-flex items-center gap-2.5 rounded-[8px] lg:hidden ${focusRing}`}
            >
              <BrandMark size={22} />
              <span className="text-[16px] font-medium text-fg">MogAI</span>
            </Link>
            <Link
              href="/"
              className={`ml-auto inline-flex h-9 items-center gap-1.5 rounded-[8px] px-2 text-[13px] text-fg-2 transition-colors hover:text-fg ${focusRing}`}
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Retour à l&apos;accueil
            </Link>
          </div>
          <main
            id="contenu"
            className="flex flex-1 items-center justify-center px-6 pt-6 pb-16"
          >
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
