"use client";

import type { ComponentType } from "react";
import { Compass, Recycle, Route } from "lucide-react";
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
  moramora: Route,
  aiza: Compass,
  gaspika: Recycle,
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
      className="group flex h-full scroll-mt-24 flex-col rounded-[16px] border border-line bg-surface p-6 transition-colors duration-150 hover:border-line-strong"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-[10px] border border-line bg-raised text-fg-2 transition-colors duration-300 group-hover:border-line-strong group-hover:text-fg">
          <Icon className="size-4 transition-transform duration-300 group-hover:-rotate-6" />
        </span>
        <span className="font-mono text-[12px] tabular-nums text-fg-3">
          {app.index}
        </span>
      </div>

      <div className="mt-5">
        <p className="flex items-center gap-2 text-[12px] text-fg-3">
          <span className={cn("size-1.5 rounded-full", appDot[app.id])} />
          {app.category}
        </p>
        <h3 className="mt-2 text-[24px] leading-tight font-medium text-fg">
          {app.name}
        </h3>
        <p className="mt-2 text-sm leading-[1.65] text-fg-2">{app.tagline}</p>
      </div>

      <motion.div
        className="mt-6 rounded-[12px] border border-line bg-ground px-4 pt-5 pb-4 transition-colors duration-300 group-hover:border-line-strong"
        whileHover={reduced ? undefined : { scale: 1.015 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <PhoneFrame>
          <Screen />
        </PhoneFrame>
      </motion.div>

      <p className="mt-6 text-sm leading-[1.65] text-fg-2">{app.description}</p>

      <ul className="mt-5 space-y-2.5">
        {app.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[13px]">
            <span
              className={cn(
                "mt-1.5 size-1 shrink-0 rounded-full",
                appDot[app.id],
              )}
            />
            <span className="leading-[1.6] text-fg-2">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <p className="border-t border-line pt-5 text-[12.5px] leading-relaxed text-fg-3">
          {app.meaning}
        </p>
        <p className="mt-4 text-[12px] text-fg-3">
          {app.tech.join(" · ")}
        </p>
      </div>
    </motion.article>
  );
}
