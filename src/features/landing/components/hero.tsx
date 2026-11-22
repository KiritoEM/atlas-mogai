"use client";

import { motion, type Variants } from "motion/react";
import { ActionLink } from "./action-link";
import { AppOrbit } from "./app-orbit";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero() {
  const reduced = usePrefersReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.1,
        delayChildren: reduced ? 0 : 0.15,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.7, ease: EASE },
    },
  };

  return (
    <section
      id="accueil"
      className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pb-24"
    >
      <div className="mx-auto grid w-full max-w-[75rem] items-center gap-14 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.p
            variants={item}
            className="flex items-center gap-2.5 text-[13px] text-fg-3"
          >
            <motion.span
              className="size-1.5 rounded-full bg-fg-3"
              animate={reduced ? { opacity: 1 } : { opacity: [0.35, 1, 0.35] }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
              }
            />
            Prototype
            <span aria-hidden="true" className="h-3 w-px bg-line-strong" />
            Antananarivo
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-[2.6rem] leading-[1.04] font-medium tracking-[-0.03em] text-fg sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.4rem]"
          >
            <span className="block">Antananarivo,</span>
            <span className="block">en temps réel</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[34rem] text-[17px] leading-[1.65] text-fg-2"
          >
            Moramora, Aiza et Gaspika transforment les signalements des
            habitants en interventions suivies par les services de la ville.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ActionLink href="#applications">
              Découvrir les applications
            </ActionLink>
            <ActionLink href="#vision" variant="secondary">
              Lire la vision
            </ActionLink>
          </motion.div>
        </motion.div>

        <motion.div
          className="px-2 sm:px-0"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.9,
            delay: reduced ? 0 : 0.3,
            ease: EASE,
          }}
        >
          <motion.div
            animate={reduced ? { y: 0 } : { y: [0, -10, 0] }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.4,
                  }
            }
          >
            <AppOrbit />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
