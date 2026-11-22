"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "../content";
import { ActionLink } from "./action-link";
import { BrandMark } from "./brand-mark";
import { EASE } from "./motion-primitives";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-line-strong bg-background/85 backdrop-blur-md"
          : "border-line bg-background",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[75rem] items-center justify-between gap-8 px-6 lg:px-8">
        <a
          href="#accueil"
          className="flex items-center gap-2.5 rounded-[8px] focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
          aria-label="MogAI — retour en haut de la page"
        >
          <BrandMark size={24} />
          <span className="text-[17px] font-medium text-fg">MogAI</span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-2 text-sm text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ember transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ActionLink
            href="#applications"
            variant="secondary"
            className="h-9 px-4 text-[13px]"
          >
            Découvrir
          </ActionLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="navigation-mobile"
          className="flex size-9 items-center justify-center rounded-[8px] border border-line bg-raised text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:outline-none lg:hidden"
        >
          <span className="relative flex size-4 items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.18, ease: EASE }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {open ? (
                  <X className="size-4" aria-hidden="true" />
                ) : (
                  <Menu className="size-4" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="sr-only">
            {open ? "Fermer le menu" : "Ouvrir le menu"}
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="navigation-mobile"
            id="navigation-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                duration: reduced ? 0 : 0.25,
                ease: EASE,
              },
            }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
            className="overflow-hidden border-t border-line bg-background lg:hidden"
          >
            <div className="px-6 pt-2 pb-6">
              <nav aria-label="Navigation mobile" className="flex flex-col">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.25,
                      delay: reduced ? 0 : 0.05 + index * 0.04,
                      ease: EASE,
                    }}
                    className="rounded-[8px] py-3 text-[15px] text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:outline-none"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <ActionLink
                href="#applications"
                onClick={() => setOpen(false)}
                className="mt-4 w-full"
              >
                Découvrir les applications
              </ActionLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
