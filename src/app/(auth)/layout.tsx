import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/features/landing/components/brand-mark";
import { AuthProvider } from "@/features/moramora/providers/auth-provider";
import { focusRing } from "@/components/ui";

const points = [
  "Analyse photo et vidéo par l'IA en quelques secondes",
  "Flux caméra en direct, alertes instantanées",
  "Journal des infractions détectées pendant la session",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <aside className="relative isolate hidden flex-col justify-between overflow-hidden border-r border-line bg-[radial-gradient(ellipse_at_76%_20%,rgba(255,90,31,0.22),transparent_39%),radial-gradient(ellipse_at_18%_92%,rgba(169,102,57,0.12),transparent_38%),linear-gradient(145deg,#1b1916_0%,#11100f_54%,#0c0b0a_100%)] p-10 lg:flex xl:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15rem] top-[12%] z-0 size-[40rem] rounded-full bg-[radial-gradient(circle_at_38%_38%,rgba(255,112,60,0.22),rgba(255,90,31,0.07)_34%,transparent_68%)] blur-[2px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[11rem] top-[19%] z-0 size-[32rem] rounded-full border border-white/[0.08]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute -right-[7.5rem] top-[25%] z-0 size-[25rem] rounded-full border border-white/[0.055]" />
          <Link
            href="/"
            className={`relative z-10 inline-flex w-fit items-center gap-2.5 rounded-[8px] ${focusRing}`}
          >
            <BrandMark size={24} />
            <span className="text-[17px] font-medium text-fg">MogAI</span>
          </Link>

          <div className="relative z-10 max-w-[30rem]">
            <p className="text-[2.25rem] leading-[1.1] font-medium tracking-[-0.02em] text-balance text-fg">
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

          <p className="relative z-10 text-[13px] text-fg-3">Mobilité plus sûre, au quotidien.</p>
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
            className="relative isolate flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_88%_8%,rgba(255,90,31,0.09),transparent_35%),radial-gradient(ellipse_at_10%_90%,rgba(169,102,57,0.06),transparent_38%),linear-gradient(145deg,#151411_0%,#100f0e_62%,#0d0c0b_100%)] px-6 pt-6 pb-16"
          >
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
