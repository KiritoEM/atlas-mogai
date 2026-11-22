import { ArrowUp } from "lucide-react";
import { APPS, NAV_LINKS } from "../content";
import { BrandMark } from "./brand-mark";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";

const projectLinks = [...NAV_LINKS, { label: "La suite", href: "#suite" }];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ground">
      <div className="mx-auto w-full max-w-[75rem] px-6 py-14 lg:px-8">
        <Stagger
          className="grid gap-10 md:grid-cols-[1.6fr_0.7fr_0.7fr]"
          stagger={0.1}
          amount={0.2}
        >
          <StaggerItem>
            <a
              href="#accueil"
              className="inline-flex items-center gap-2.5 rounded-[8px] focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-4 focus-visible:ring-offset-ground focus-visible:outline-none"
              aria-label="MogAI — retour en haut de la page"
            >
              <BrandMark size={22} />
              <span className="text-[17px] font-medium text-fg">
                MogAI
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-[1.65] text-fg-2">
              Trois applications citoyennes pour une capitale plus fluide, plus
              propre et plus accessible. Un signal, une donnée, une action.
            </p>
          </StaggerItem>

          <StaggerItem>
            <nav aria-label="Applications">
              <p className="text-[13px] text-fg-3">Applications</p>
              <ul className="mt-4 space-y-2.5">
                {APPS.map((app) => (
                  <li key={app.id}>
                    <a
                      href={`#${app.id}`}
                      className="text-sm text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-4 focus-visible:ring-offset-ground focus-visible:outline-none"
                    >
                      {app.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </StaggerItem>

          <StaggerItem>
            <nav aria-label="Le projet">
              <p className="text-[13px] text-fg-3">Projet</p>
              <ul className="mt-4 space-y-2.5">
                {projectLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-4 focus-visible:ring-offset-ground focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </StaggerItem>
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-[12px] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 MogAI · Projet Smart City pour Antananarivo</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p>Conçu à Antananarivo, pour Antananarivo</p>
              <a
                href="#accueil"
                className="inline-flex items-center gap-1.5 text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:outline-none"
              >
                Haut de page
                <ArrowUp className="size-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
