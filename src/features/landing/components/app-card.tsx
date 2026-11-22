"use client";

import type { ComponentType } from "react";
import { Compass, ScanLine, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";
import type { AppContent, AppId } from "../content";
import { appDot } from "../app-theme";
import { PhoneFrame } from "./phone-frame";
import { AizaScreen } from "./screens/aiza-screen";
import { GaspikaScreen } from "./screens/gaspika-screen";
import { MoramoraScreen } from "./screens/moramora-screen";

const icons: Record<AppId, ComponentType<{ className?: string }>> = {
  moramora: ScanLine,
  aiza: Compass,
  gaspika: ShoppingBasket,
};

const screens: Record<AppId, ComponentType> = {
  moramora: MoramoraScreen,
  aiza: AizaScreen,
  gaspika: GaspikaScreen,
};

type AppCardProps = {
  app: AppContent;
};

export function AppCard({ app }: AppCardProps) {
  const Icon = icons[app.id];
  const Screen = screens[app.id];
  const reduced = usePrefersReducedMotion();

  return (
    <motion.article
      id={app.id}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group flex h-full scroll-mt-24 flex-col rounded-[16px] border border-line-strong bg-[#211f1c] p-6 shadow-[0_18px_45px_-32px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.025)_inset] transition-[background-color,border-color,box-shadow] duration-300 hover:border-ember/25 hover:bg-[#24211e] hover:shadow-[0_24px_55px_-32px_rgba(255,90,31,0.18),0_1px_0_rgba(255,255,255,0.035)_inset]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-[10px] border border-line bg-raised text-fg-2 transition-colors duration-300 group-hover:border-line-strong group-hover:text-fg">
          <Icon className="size-4 !text-white                              transition-transform duration-300 group-hover:-rotate-6" />
        </span>
        <span className="font-mono text-[clamp(1.1rem,1.7vw,1.5rem)] leading-none tracking-[0.06em] text-ember tabular-nums">
          {app.index}
        </span>
      </div>

      <div className="mt-5">
        <p className="flex items-center gap-2 text-[12px] text-fg-3">
          <span className={cn("size-1.5 rounded-full", appDot[app.id])} />
          {app.category}
        </p>
        <h3 className="mt-2 text-[clamp(1.6rem,2vw,2rem)] leading-[1.1] font-medium tracking-[-0.03em] text-fg">
          {app.name}
        </h3>
        <p className="mt-2 text-sm leading-[1.65] text-fg-2">{app.tagline}</p>
      </div>

      <div className="mt-auto pt-7">
        <motion.div
          className="rounded-[12px] border border-line bg-ground px-4 pt-5 pb-4 transition-colors duration-300 group-hover:border-line-strong"
          whileHover={reduced ? undefined : { scale: 1.015 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <PhoneFrame>
            <Screen />
          </PhoneFrame>
        </motion.div>
      </div>
    </motion.article>
  );
}
