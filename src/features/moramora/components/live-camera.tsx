"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, SwitchCamera } from "lucide-react";
import { cn } from "@/lib/utils";
import { DETECTION_ERRORS, pluralize, violationsOf } from "../api/messages";
import type { Detection } from "../api/types";
import { useDetectionSocket, useSocketMessages } from "../realtime/detection-socket";
import { AnnotatedImage, DetectionList, Verdict } from "./detection-result";
import { Button, Notice, PageHeader, Panel } from "@/components/ui";

type CameraState = "off" | "starting" | "on" | "denied" | "unsupported" | "error";

const INTERVALS = [
  { value: 1000, label: "1 s" },
  { value: 2000, label: "2 s" },
  { value: 4000, label: "4 s" },
];

/** Frames are downscaled before sending: faster upload, same detections. */
const MAX_FRAME_WIDTH = 960;
/** A frame without answer after this delay is considered lost. */
const IN_FLIGHT_TIMEOUT_MS = 15_000;

type LatestResult = { image: string; detections: Detection[]; at: number };

export function LiveCamera() {
  const { status: socketStatus, send } = useDetectionSocket();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inFlightRef = useRef<number | null>(null);
  const [camera, setCamera] = useState<CameraState>("off");
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [interval, setIntervalMs] = useState(2000);
  const [latest, setLatest] = useState<LatestResult | null>(null);
  const [stats, setStats] = useState({ frames: 0, alerts: 0 });
  const [serverError, setServerError] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    inFlightRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamera("off");
  }, []);

  const start = useCallback(
    async (mode: "environment" | "user") => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCamera("unsupported");
        return;
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setCamera("starting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode }, width: { ideal: 1280 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setServerError(null);
        setCamera("on");
      } catch (error) {
        const name = error instanceof DOMException ? error.name : "";
        setCamera(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      }
    },
    [],
  );

  useEffect(() => stop, [stop]);

  useSocketMessages((message) => {
    if (message.type === "detection_result") {
      inFlightRef.current = null;
      setServerError(null);
      setLatest({ image: message.data.image, detections: message.data.detections, at: Date.now() });
      setStats((current) => ({
        frames: current.frames + 1,
        alerts: current.alerts + (violationsOf(message.data.detections).length > 0 ? 1 : 0),
      }));
    } else if (message.type === "error") {
      inFlightRef.current = null;
      // `busy`: the engine serves someone else; the next tick simply retries.
      if (message.code !== "busy") {
        setServerError(DETECTION_ERRORS[message.code] ?? message.message);
      }
    }
  });

  // Capture loop: one frame in flight at a time, so a slow model never queues up.
  useEffect(() => {
    if (camera !== "on" || socketStatus !== "open") {
      return;
    }
    const tick = () => {
      const video = videoRef.current;
      const now = Date.now();
      if (inFlightRef.current && now - inFlightRef.current < IN_FLIGHT_TIMEOUT_MS) {
        return;
      }
      if (!video || video.readyState < 2 || !video.videoWidth) {
        return;
      }
      const scale = Math.min(1, MAX_FRAME_WIDTH / video.videoWidth);
      const canvas = (canvasRef.current ??= document.createElement("canvas"));
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      inFlightRef.current = now;
      canvas.toBlob(
        (blob) => {
          if (!blob || !send(blob)) {
            inFlightRef.current = null;
          }
        },
        "image/jpeg",
        0.8,
      );
    };
    tick();
    const id = window.setInterval(tick, interval);
    return () => window.clearInterval(id);
  }, [camera, socketStatus, interval, send]);

  function switchCamera() {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    void start(next);
  }

  const running = camera === "on";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Direct"
        title="Surveiller la route en direct"
        description="Pointez la caméra vers la circulation : une image est analysée à intervalle régulier et chaque infraction déclenche une alerte."
      />

      {socketStatus !== "open" ? (
        <Notice tone="info" title="Connexion temps réel indisponible" live>
          Le direct passe par la connexion temps réel au serveur. Elle se rétablit
          automatiquement ; vous pouvez déjà allumer la caméra.
        </Notice>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <section aria-labelledby="camera-title" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="camera-title" className="text-[15px] font-medium text-fg">
              Caméra
            </h2>
            {running ? (
              <span className="inline-flex items-center gap-2 text-[13px] text-fg-2">
                <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-moramora" />
                Analyse en cours
              </span>
            ) : null}
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[12px] border border-line bg-ground">
            <video
              ref={videoRef}
              muted
              playsInline
              aria-label="Image de la caméra en direct"
              className={cn(
                "size-full object-cover",
                !running && "invisible",
                facing === "user" && "-scale-x-100",
              )}
            />
            {!running ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <CameraOff aria-hidden="true" className="size-6 text-fg-3" />
                <p className="text-sm text-fg-2">
                  {camera === "starting"
                    ? "Autorisez l'accès à la caméra dans votre navigateur…"
                    : "Caméra éteinte"}
                </p>
              </div>
            ) : null}
          </div>

          {camera === "denied" ? (
            <Notice tone="error" title="Accès à la caméra refusé" live>
              Autorisez la caméra pour ce site dans les réglages du navigateur, puis réessayez.
            </Notice>
          ) : null}
          {camera === "unsupported" ? (
            <Notice tone="error" title="Caméra non disponible" live>
              Ce navigateur ne permet pas d&apos;utiliser la caméra. Le direct nécessite une
              connexion sécurisée (HTTPS) ou localhost.
            </Notice>
          ) : null}
          {camera === "error" ? (
            <Notice tone="error" title="Impossible de démarrer la caméra" live>
              Vérifiez qu&apos;aucune autre application ne l&apos;utilise, puis réessayez.
            </Notice>
          ) : null}

          <div className="flex flex-wrap items-end gap-3">
            {running ? (
              <Button variant="danger" onClick={stop}>
                <CameraOff aria-hidden="true" />
                Arrêter
              </Button>
            ) : (
              <Button onClick={() => void start(facing)} disabled={camera === "starting"}>
                <Camera aria-hidden="true" />
                Démarrer la caméra
              </Button>
            )}
            {running ? (
              <Button variant="secondary" onClick={switchCamera}>
                <SwitchCamera aria-hidden="true" />
                Changer de caméra
              </Button>
            ) : null}

            <fieldset className="ml-auto">
              <legend className="mb-1.5 text-[12px] text-fg-3">Une analyse toutes les</legend>
              <div className="flex rounded-[10px] border border-line-strong bg-ground p-1">
                {INTERVALS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex h-8 min-w-11 cursor-pointer items-center justify-center rounded-[7px] px-2.5 font-mono text-[13px] transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ember/50",
                      interval === option.value
                        ? "bg-raised text-fg"
                        : "text-fg-3 hover:text-fg",
                    )}
                  >
                    <input
                      type="radio"
                      name="interval"
                      value={option.value}
                      checked={interval === option.value}
                      onChange={() => setIntervalMs(option.value)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        <section aria-labelledby="latest-title" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="latest-title" className="text-[15px] font-medium text-fg">
              Dernière analyse
            </h2>
            <p className="text-[13px] text-fg-3">
              {pluralize(stats.frames, "image")} · {pluralize(stats.alerts, "alerte")}
            </p>
          </div>

          {latest ? (
            <>
              <AnnotatedImage base64={latest.image} detections={latest.detections} />
              <Verdict detections={latest.detections} />
              <DetectionList detections={latest.detections} />
            </>
          ) : (
            <Panel
              className={cn(
                "flex aspect-video flex-col items-center justify-center gap-2 px-6 text-center",
              )}
            >
              <p className="text-sm text-fg-2">Les images analysées apparaîtront ici.</p>
              <p className="text-[13px] text-fg-3">
                Les alertes sont aussi ajoutées au journal de la vue d&apos;ensemble.
              </p>
            </Panel>
          )}

          {serverError ? (
            <Notice tone="error" live>
              {serverError}
            </Notice>
          ) : null}

          <p className="text-[13px] leading-[1.6] text-fg-3">
            Les images sont envoyées au serveur uniquement pour l&apos;analyse. Respectez la vie
            privée des personnes filmées.
          </p>
        </section>
      </div>
    </div>
  );
}
