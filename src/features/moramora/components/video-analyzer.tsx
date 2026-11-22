"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Film, Play, RotateCcw, ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError, api, errorMessage, isAbortError } from "../api/client";
import { LIMITS, VIDEO_TYPES } from "../api/config";
import {
  formatBytes,
  formatTimestamp,
  isViolation,
  labelName,
  pluralize,
  violationsOf,
} from "../api/messages";
import type { VideoDetection, VideoIncident } from "../api/types";
import {
  emptyVideoTracker,
  recoveredResult,
  recoveryTimeoutMs,
  trackVideoMessage,
  type VideoTracker,
} from "../api/video-recovery";
import { useAuth, useExpireOn401 } from "../auth/auth-provider";
import { useDetectionSocket, useSocketMessages } from "../realtime/detection-socket";
import { AnnotatedImage, Verdict } from "./detection-result";
import { FileDropzone } from "./file-dropzone";
import {
  Button,
  Notice,
  PageHeader,
  Panel,
  ProgressBar,
  Spinner,
  focusRing,
} from "./ui";

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".webm", ".mkv"];

const SAMPLE_RATES = [
  { value: 0.5, label: "Rapide", detail: "1 image toutes les 2 s" },
  { value: 1, label: "Standard", detail: "1 image par seconde" },
  { value: 2, label: "Précis", detail: "2 images par seconde" },
  { value: 5, label: "Très précis", detail: "5 images par seconde" },
];

type Phase =
  | { name: "idle" }
  | { name: "ready" }
  | { name: "uploading"; progress: number }
  | { name: "analyzing"; liveAlerts: number; lastTimestamp?: number }
  /** HTTP response lost: waiting for the result on the WebSocket. */
  | { name: "recovering" }
  | { name: "done"; result: VideoDetection; recovered: boolean }
  | { name: "error"; message: string };

const SOCKET_LOST_MESSAGE =
  "La connexion avec le serveur a été coupée pendant l'analyse et la connexion temps réel est tombée aussi : le serveur a probablement redémarré. Réessayez avec une précision plus faible ou une vidéo plus courte.";
const RECOVERY_TIMEOUT_MESSAGE =
  "La connexion avec le serveur a été coupée pendant l'analyse et le résultat n'est pas arrivé à temps. Réessayez avec une précision plus faible ou une vidéo plus courte.";

function isVideo(file: File) {
  const name = file.name.toLowerCase();
  return (
    VIDEO_TYPES.includes(file.type) ||
    VIDEO_EXTENSIONS.some((extension) => name.endsWith(extension))
  );
}

export function VideoAnalyzer() {
  const { token } = useAuth();
  const expireOn401 = useExpireOn401();
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [sampleFps, setSampleFps] = useState(1);
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [rejection, setRejection] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const rateGroupId = useId();
  const { status: socketStatus } = useDetectionSocket();
  // WebSocket messages of the running analysis, used if the HTTP response is lost.
  const trackingRef = useRef(false);
  const trackerRef = useRef<VideoTracker>(emptyVideoTracker);
  const recoveryRef = useRef<{
    sampleFps: number;
    timer: ReturnType<typeof setInterval>;
  } | null>(null);
  const socketStatusRef = useRef(socketStatus);
  useEffect(() => {
    socketStatusRef.current = socketStatus;
  });

  function stopTracking() {
    trackingRef.current = false;
    if (recoveryRef.current) {
      clearInterval(recoveryRef.current.timer);
      recoveryRef.current = null;
    }
  }

  /** Waits for `video_completed` on the WebSocket (see useSocketMessages below). */
  function recover(fps: number, frames: number | null) {
    let secondsLeft = Math.ceil(recoveryTimeoutMs(frames) / 1000);
    const check = () => {
      // Without the WebSocket, the lost result can no longer arrive.
      if (socketStatusRef.current !== "open") {
        fail(SOCKET_LOST_MESSAGE);
      } else if (secondsLeft-- <= 0) {
        fail(RECOVERY_TIMEOUT_MESSAGE);
      }
    };
    recoveryRef.current = { sampleFps: fps, timer: setInterval(check, 1000) };
    setPhase({ name: "recovering" });
    check();
  }

  function finish(result: VideoDetection, recovered: boolean) {
    stopTracking();
    setPhase({ name: "done", result: onlyInfractions(result), recovered });
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function fail(message: string) {
    stopTracking();
    setPhase({ name: "error", message });
  }

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      if (recoveryRef.current) {
        clearInterval(recoveryRef.current.timer);
      }
    },
    [],
  );
  useEffect(() => {
    if (!source) {
      return;
    }
    return () => URL.revokeObjectURL(source);
  }, [source]);

  // Violations are pushed on the WebSocket while the HTTP request is running.
  useSocketMessages((message) => {
    if (trackingRef.current) {
      trackerRef.current = trackVideoMessage(trackerRef.current, message);
      const recovery = recoveryRef.current;
      const recovered = recovery
        ? recoveredResult(trackerRef.current, recovery.sampleFps)
        : null;
      if (recovered) {
        finish(recovered, true);
        return;
      }
    }
    if (
      message.type !== "alert" ||
      message.source !== "video_upload" ||
      violationsOf(message.data.detections).length === 0
    ) {
      return;
    }
    setPhase((current) =>
      current.name === "analyzing"
        ? {
            name: "analyzing",
            liveAlerts: current.liveAlerts + 1,
            lastTimestamp: message.data.timestamp,
          }
        : current,
    );
  });

  function choose(next: File) {
    if (!isVideo(next)) {
      setRejection("Format non pris en charge. Choisissez une vidéo MP4, MOV, AVI ou WebM.");
      return;
    }
    if (next.size > LIMITS.videoBytes) {
      setRejection(`Cette vidéo pèse ${formatBytes(next.size)}. La limite est de 50 Mo.`);
      return;
    }
    setRejection(null);
    setFile(next);
    setDuration(null);
    setSource(URL.createObjectURL(next));
    setPhase({ name: "ready" });
  }

  function reset() {
    controllerRef.current?.abort();
    stopTracking();
    setFile(null);
    setSource(null);
    setDuration(null);
    setPhase({ name: "idle" });
  }

  async function analyze() {
    if (!file || !token) {
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    stopTracking();
    trackerRef.current = emptyVideoTracker;
    trackingRef.current = true;
    setPhase({ name: "uploading", progress: 0 });
    try {
      const { data } = await api.detectVideo(file, sampleFps, {
        token,
        signal: controller.signal,
        onProgress: (progress) => setPhase({ name: "uploading", progress }),
        onUploaded: () => setPhase({ name: "analyzing", liveAlerts: 0 }),
      });
      finish(data, false);
    } catch (error) {
      if (isAbortError(error)) {
        stopTracking();
        return;
      }
      if (error instanceof ApiError && error.code === "connection_lost") {
        // The server got the whole file and may still be analysing it.
        const recovered = recoveredResult(trackerRef.current, sampleFps);
        if (recovered) {
          finish(recovered, true);
          return;
        }
        recover(sampleFps, estimatedFrames);
        return;
      }
      expireOn401(error);
      fail(errorMessage(error));
    }
  }

  function seek(seconds: number) {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = seconds;
    video.pause();
    video.focus();
    video.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  const tooLong = duration !== null && duration > LIMITS.videoSeconds;
  const estimatedFrames =
    duration === null
      ? null
      : Math.min(LIMITS.videoMaxFrames, Math.max(1, Math.ceil(duration * sampleFps)));
  const busy =
    phase.name === "uploading" ||
    phase.name === "analyzing" ||
    phase.name === "recovering";
  const result = phase.name === "done" ? phase.result : null;
  const recovered = phase.name === "done" && phase.recovered;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analyse vidéo"
        title="Passer une vidéo au crible"
        description="L'IA extrait des images de la vidéo, repère les infractions et les place sur une frise chronologique. Les alertes arrivent en direct pendant l'analyse."
      />

      {!file ? (
        <div className="max-w-[44rem] space-y-4">
          {rejection ? (
            <Notice tone="error" live>
              {rejection}
            </Notice>
          ) : null}
          <FileDropzone
            accept={[...VIDEO_TYPES, ...VIDEO_EXTENSIONS].join(",")}
            label="Choisir une vidéo"
            hint="MP4, MOV, AVI ou WebM · 50 Mo et 2 minutes maximum."
            icon={Film}
            onFile={choose}
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
          <div className="space-y-4">
            {source ? (
              <video
                ref={videoRef}
                src={source}
                controls
                playsInline
                preload="metadata"
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                aria-label={`Vidéo sélectionnée : ${file.name}`}
                className={cn(
                  "block max-h-[70vh] w-full rounded-[12px] border border-line bg-black",
                  focusRing,
                )}
              />
            ) : null}

            {result && result.video.duration > 0 && result.incidents.length > 0 ? (
              <Timeline result={result} onSeek={seek} />
            ) : null}
          </div>

          <Panel className="h-fit p-5 sm:p-6" aria-labelledby="video-panel-title">
            <h2
              id="video-panel-title"
              ref={resultRef}
              tabIndex={-1}
              className="text-[15px] font-medium text-fg outline-none"
            >
              {result ? "Résultat de l'analyse" : "Vidéo sélectionnée"}
            </h2>
            <p className="mt-1 truncate text-[13px] text-fg-3" title={file.name}>
              {file.name} · {formatBytes(file.size)}
              {duration !== null && Number.isFinite(duration)
                ? ` · ${formatTimestamp(duration)}`
                : ""}
            </p>

            {phase.name === "ready" || phase.name === "error" ? (
              <fieldset className="mt-5" disabled={tooLong}>
                <legend id={rateGroupId} className="text-[13px] font-medium text-fg">
                  Précision de l&apos;analyse
                </legend>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {SAMPLE_RATES.map((rate) => (
                    <label
                      key={rate.value}
                      className={cn(
                        "relative flex cursor-pointer flex-col rounded-[10px] border px-3 py-2.5 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ember/50",
                        sampleFps === rate.value
                          ? "border-ember/60 bg-ember/[0.06]"
                          : "border-line-strong bg-ground hover:border-divider",
                      )}
                    >
                      <input
                        type="radio"
                        name="sample_fps"
                        value={rate.value}
                        checked={sampleFps === rate.value}
                        onChange={() => setSampleFps(rate.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-fg">{rate.label}</span>
                      <span className="text-[12px] text-fg-3">{rate.detail}</span>
                    </label>
                  ))}
                </div>
                {estimatedFrames !== null && !tooLong ? (
                  <p className="mt-2.5 text-[13px] text-fg-3">
                    ≈ {pluralize(estimatedFrames, "image analysée", "images analysées")}
                    {estimatedFrames >= LIMITS.videoMaxFrames ? " (plafond atteint)" : ""}.
                    Plus la précision est haute, plus l&apos;analyse est longue.
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            <div className="mt-5 space-y-4" aria-live="polite">
              {tooLong ? (
                <Notice tone="error">
                  Cette vidéo dure {formatTimestamp(duration ?? 0)}. La durée maximale est
                  de 2 minutes : coupez-la avant de l&apos;envoyer.
                </Notice>
              ) : null}

              {phase.name === "ready" && !tooLong ? (
                <Button onClick={analyze} className="w-full">
                  <ScanSearch aria-hidden="true" />
                  Analyser la vidéo
                </Button>
              ) : null}

              {phase.name === "uploading" ? (
                <div className="space-y-2.5">
                  <p className="text-sm text-fg-2">
                    Envoi de la vidéo… {Math.round(phase.progress * 100)} %
                  </p>
                  <ProgressBar value={phase.progress} label="Envoi de la vidéo" />
                </div>
              ) : null}

              {phase.name === "analyzing" ? (
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-sm text-fg-2">
                    <Spinner className="size-3.5" />
                    Analyse image par image en cours…
                  </p>
                  <ProgressBar label="Analyse de la vidéo en cours" />
                  <p className="text-[13px] text-fg-3">
                    {phase.liveAlerts > 0
                      ? `${pluralize(phase.liveAlerts, "image en infraction repérée", "images en infraction repérées")} jusqu'ici${
                          phase.lastTimestamp !== undefined
                            ? `, dernière à ${formatTimestamp(phase.lastTimestamp)}`
                            : ""
                        }.`
                      : "Aucune infraction repérée pour l'instant. Gardez cette page ouverte."}
                  </p>
                </div>
              ) : null}

              {phase.name === "recovering" ? (
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-sm text-fg-2">
                    <Spinner className="size-3.5" />
                    Récupération du résultat en cours…
                  </p>
                  <ProgressBar label="Récupération du résultat de l'analyse" />
                  <p className="text-[13px] text-fg-3">
                    La connexion a été coupée pendant l&apos;analyse, mais le serveur
                    continue : le résultat arrivera par la connexion temps réel.
                    Gardez cette page ouverte.
                  </p>
                </div>
              ) : null}

              {recovered ? (
                <Notice tone="info">
                  Résultat récupéré par la connexion temps réel : les images annotées
                  ne sont pas disponibles. Utilisez « Voir » pour retrouver chaque
                  infraction dans la vidéo.
                </Notice>
              ) : null}

              {phase.name === "error" ? (
                <>
                  <Notice tone="error" title="L'analyse n'a pas abouti">
                    {phase.message}
                  </Notice>
                  {!tooLong ? (
                    <Button onClick={analyze} className="w-full">
                      <RotateCcw aria-hidden="true" />
                      Réessayer
                    </Button>
                  ) : null}
                </>
              ) : null}

              {result ? <VideoSummary result={result} /> : null}
            </div>

            <div className="mt-5 border-t border-line pt-5">
              <Button variant="secondary" onClick={reset} className="w-full">
                {busy ? "Annuler" : "Analyser une autre vidéo"}
              </Button>
            </div>
          </Panel>

          {result && result.incidents.length > 0 ? (
            <IncidentList result={result} recovered={recovered} onSeek={seek} />
          ) : null}
        </div>
      )}
    </div>
  );
}

/** Keep infraction labels only (the API already does; older servers did not). */
function onlyInfractions(result: VideoDetection): VideoDetection {
  const infractions = (counts: Record<string, number>) =>
    Object.fromEntries(Object.entries(counts).filter(([label]) => isViolation(label)));
  return {
    ...result,
    incidents: (result.incidents ?? [])
      .map((incident) => ({ ...incident, counts: infractions(incident.counts) }))
      .filter((incident) => Object.keys(incident.counts).length > 0),
    violations: result.violations.filter(
      (frame) => violationsOf(frame.detections).length > 0,
    ),
    summary: infractions(result.summary),
  };
}

/** "Sans casque × 3 · Plus de deux personnes sur la moto" */
function describeCounts(counts: Record<string, number>) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => `${labelName(label)}${count > 1 ? ` × ${count}` : ""}`)
    .join(" · ");
}

function timeRange(incident: VideoIncident) {
  return incident.start === incident.end
    ? formatTimestamp(incident.start)
    : `${formatTimestamp(incident.start)} – ${formatTimestamp(incident.end)}`;
}

function VideoSummary({ result }: { result: VideoDetection }) {
  const summary = Object.entries(result.summary).sort((a, b) => b[1] - a[1]);
  const total = summary.reduce((sum, [, count]) => sum + count, 0);
  const rows = [
    { label: "Durée", value: formatTimestamp(result.video.duration) },
    { label: "Résolution", value: `${result.video.width} × ${result.video.height}` },
    { label: "Images analysées", value: String(result.frames_analyzed) },
    { label: "Scènes en infraction", value: String(result.incidents.length) },
  ];
  return (
    <>
      <Verdict
        detections={[]}
        counts={result.summary}
        cleanLabel="Aucune infraction confirmée dans cette vidéo"
        cleanDetail="Les détections isolées ou trop incertaines sont écartées."
      />
      {summary.length > 0 ? (
        <div>
          <h3 className="text-[13px] font-medium text-fg">Par type d&apos;infraction</h3>
          <ul className="mt-2 divide-y divide-line rounded-[12px] border border-line">
            {summary.map(([label, count]) => (
              <li key={label} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                <span className="text-fg">{labelName(label)}</span>
                <span className="font-mono text-fg-2 tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-fg-3">
            {total > 1 ? "Personnes" : "Personne"} (ou motos) distinctes, confirmées
            sur plusieurs images de chaque scène.
          </p>
        </div>
      ) : null}
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-[13px] text-fg-3">{row.label}</dt>
            <dd className="font-mono text-sm text-fg tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function Timeline({
  result,
  onSeek,
}: {
  result: VideoDetection;
  onSeek: (seconds: number) => void;
}) {
  const { duration } = result.video;
  const at = (seconds: number) => Math.min(1, Math.max(0, seconds / duration));
  return (
    <div>
      <p className="text-[13px] text-fg-3" id="timeline-label">
        Frise des infractions · {pluralize(result.incidents.length, "scène")}
      </p>
      <div className="relative mt-2 h-10 rounded-[10px] border border-line bg-ground">
        <span aria-hidden="true" className="absolute inset-x-3 top-1/2 h-px bg-line-strong" />
        {result.incidents.map((incident) => (
          <span
            key={`range-${incident.key_frame}`}
            aria-hidden="true"
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-moramora/30"
            style={{
              left: `calc(0.75rem + (100% - 1.5rem) * ${at(incident.start)})`,
              width: `max(0.375rem, calc((100% - 1.5rem) * ${at(incident.end) - at(incident.start)}))`,
            }}
          />
        ))}
        <ul aria-labelledby="timeline-label">
          {result.incidents.map((incident) => (
            <li
              key={incident.key_frame}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${at(incident.timestamp)})` }}
            >
              <button
                type="button"
                onClick={() => onSeek(incident.timestamp)}
                className={cn(
                  "group flex size-6 items-center justify-center rounded-full",
                  focusRing,
                )}
              >
                <span className="size-2.5 rounded-full bg-moramora ring-4 ring-moramora/15 transition-transform group-hover:scale-125" />
                <span className="sr-only">
                  Aller à {formatTimestamp(incident.timestamp)} (scène {timeRange(incident)}) :{" "}
                  {describeCounts(incident.counts)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="mt-1 flex justify-between font-mono text-[11px] text-fg-3">
        <span>0:00</span>
        <span>{formatTimestamp(duration)}</span>
      </div>
    </div>
  );
}

function IncidentList({
  result,
  recovered,
  onSeek,
}: {
  result: VideoDetection;
  recovered: boolean;
  onSeek: (seconds: number) => void;
}) {
  return (
    <section aria-labelledby="incidents-title" className="lg:col-span-2">
      <h2 id="incidents-title" className="text-[15px] font-medium text-fg">
        Scènes en infraction
      </h2>
      <p className="mt-1 text-[13px] text-fg-3">
        Une carte par scène : les images successives des mêmes personnes sont
        regroupées, avec l&apos;image la plus représentative.
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {result.incidents.map((incident) => (
          <li key={incident.key_frame}>
            <Panel className="overflow-hidden">
              {incident.image ? (
                <AnnotatedImage
                  base64={incident.image}
                  detections={incident.detections}
                  className="rounded-none border-0 border-b border-line"
                />
              ) : null}
              <div className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[13px] text-fg-3 tabular-nums">
                    {timeRange(incident)}
                  </p>
                  <p className="mt-0.5 text-sm text-fg">{describeCounts(incident.counts)}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSeek(incident.timestamp)}
                >
                  <Play aria-hidden="true" />
                  Voir
                  <span className="sr-only"> à {formatTimestamp(incident.timestamp)}</span>
                </Button>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
      {!recovered && result.incidents.some((incident) => !incident.image) ? (
        <p className="mt-3 text-[13px] text-fg-3">
          Seules les premières scènes ont une image annotée ; les suivantes restent
          consultables dans la vidéo.
        </p>
      ) : null}
    </section>
  );
}
