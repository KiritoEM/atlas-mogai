"use client";

import Link from "next/link";
import { ArrowUpRight, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthQuery } from "@/hooks/moramora/use-health-query";
import {
  countByLabel,
  formatConfidence,
  formatTimestamp,
  labelName,
} from "../api/messages";
import { useAuth } from "../providers/auth-provider";
import {
  useDetectionSocket,
  type AlertSource,
  type JournalEntry,
} from "../realtime/detection-socket";
import { NAV } from "./app-shell";
import { Button, PageHeader, Panel, focusRing } from "@/components/ui";

const ACTIONS = [
  {
    href: "/moramora/photo",
    title: "Analyser une photo",
    description: "Une image de la route, un verdict en quelques secondes.",
    meta: "JPEG ou PNG · 5 Mo",
  },
  {
    href: "/moramora/video",
    title: "Analyser une vidéo",
    description: "Les infractions placées sur une frise, image par image.",
    meta: "MP4, MOV, WebM · 2 min",
  },
  {
    href: "/moramora/direct",
    title: "Passer en direct",
    description: "La caméra de l'appareil analysée en continu.",
    meta: "Caméra · temps réel",
  },
];

const SOURCE_LABEL: Record<AlertSource, string> = {
  live: "Direct",
  image_upload: "Photo",
  video_upload: "Vidéo",
};

const timeFormat = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function Overview() {
  const { user } = useAuth();
  const { journal, clearJournal } = useDetectionSocket();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Moramora"
        title={`Bonjour ${user?.username ?? ""}`}
        description="Analysez une photo, une vidéo ou le flux de votre caméra : l'IA repère les infractions routières et vous alerte en temps réel."
      />

      <ul className="grid gap-4 md:grid-cols-3">
        {ACTIONS.map((action) => {
          const Icon = NAV.find((item) => item.href === action.href)?.icon;
          return (
            <li key={action.href}>
              <Link
                href={action.href}
                className={cn(
                  "group flex h-full flex-col rounded-[16px] border border-line bg-surface p-5 transition-colors duration-150 hover:border-line-strong hover:bg-[#1f1d1a] sm:p-6",
                  focusRing,
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-[10px] border border-line bg-raised text-fg-2 transition-colors group-hover:text-fg">
                    {Icon ? <Icon aria-hidden className="size-[18px]" /> : null}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-fg-3 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember"
                  />
                </div>
                <h2 className="mt-5 text-[17px] font-medium text-fg">{action.title}</h2>
                <p className="mt-1.5 text-sm leading-[1.6] text-fg-2">{action.description}</p>
                <p className="mt-auto pt-5 font-mono text-[12px] text-fg-3">{action.meta}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
        <Panel aria-labelledby="journal-title" className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="journal-title" className="text-[15px] font-medium text-fg">
                Journal des alertes
              </h2>
              <p className="mt-0.5 text-[13px] text-fg-3">
                Reçues en temps réel pendant cette session.
              </p>
            </div>
            {journal.length > 0 ? (
              <Button variant="quiet" size="sm" onClick={clearJournal}>
                Vider
              </Button>
            ) : null}
          </div>
          <JournalList entries={journal} />
        </Panel>

        <div className="space-y-6">
          <SessionStats entries={journal} />
          <ServiceStatus />
        </div>
      </div>
    </div>
  );
}

function JournalList({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-[12px] border border-dashed border-line-strong px-6 py-12 text-center">
        <BellOff aria-hidden="true" className="size-5 text-fg-3" />
        <p className="max-w-[22rem] text-sm text-fg-2">
          Aucune alerte pour l&apos;instant. Les infractions détectées sur vos photos, vidéos
          et en direct s&apos;afficheront ici.
        </p>
      </div>
    );
  }
  return (
    <ol className="mt-5 divide-y divide-line border-t border-line">
      {entries.map((entry) => {
        const top = Math.max(...entry.detections.map((d) => d.confidence));
        return (
          <li key={entry.id} className="flex items-start gap-4 py-3.5">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-moramora" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-fg">
                {countByLabel(entry.detections)
                  .map(([label, count]) => `${labelName(label)}${count > 1 ? ` × ${count}` : ""}`)
                  .join(" · ")}
              </p>
              <p className="mt-0.5 text-[13px] text-fg-3">
                {SOURCE_LABEL[entry.source]}
                {entry.source === "video_upload" && entry.timestamp !== undefined
                  ? ` · à ${formatTimestamp(entry.timestamp)}`
                  : ""}
                {" · "}confiance max. {formatConfidence(top)}
              </p>
            </div>
            <time
              dateTime={new Date(entry.receivedAt).toISOString()}
              className="shrink-0 font-mono text-[12px] text-fg-3 tabular-nums"
            >
              {timeFormat.format(entry.receivedAt)}
            </time>
          </li>
        );
      })}
    </ol>
  );
}

function SessionStats({ entries }: { entries: JournalEntry[] }) {
  const detections = entries.flatMap((entry) => entry.detections);
  const top = countByLabel(detections)[0];
  const rows = [
    { label: "Alertes reçues", value: String(entries.length) },
    { label: "Infractions relevées", value: String(detections.length) },
    { label: "La plus fréquente", value: top ? labelName(top[0]) : "—" },
  ];
  return (
    <Panel aria-labelledby="stats-title" className="p-5 sm:p-6">
      <h2 id="stats-title" className="text-[15px] font-medium text-fg">
        Cette session
      </h2>
      <dl className="mt-4 divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-[13px] text-fg-3">{row.label}</dt>
            <dd className="truncate font-mono text-[15px] text-fg tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function ServiceStatus() {
  const { status } = useDetectionSocket();
  const healthQuery = useHealthQuery();
  const health = healthQuery.isPending
    ? "checking"
    : healthQuery.isSuccess
      ? "ok"
      : "down";

  const rows: { label: string; state: "ok" | "pending" | "down"; text: string }[] = [
    {
      label: "API d'analyse",
      state: health === "ok" ? "ok" : health === "checking" ? "pending" : "down",
      text: health === "ok" ? "Opérationnelle" : health === "checking" ? "Vérification…" : "Injoignable",
    },
    {
      label: "Alertes temps réel",
      state: status === "open" ? "ok" : status === "connecting" ? "pending" : "down",
      text:
        status === "open"
          ? "Connectées"
          : status === "connecting"
            ? "Connexion…"
            : "Reconnexion…",
    },
  ];

  return (
    <Panel aria-labelledby="service-title" className="p-5 sm:p-6">
      <h2 id="service-title" className="text-[15px] font-medium text-fg">
        État du service
      </h2>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-fg-2">{row.label}</span>
            <span className="inline-flex items-center gap-2 text-fg">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  row.state === "ok" && "bg-gaspika",
                  row.state === "pending" && "animate-pulse bg-fg-3",
                  row.state === "down" && "bg-moramora",
                )}
              />
              {row.text}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
