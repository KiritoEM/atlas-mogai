"use client";

import { useEffect, useRef, useState } from "react";
import { ImageUp, RotateCcw, ScanSearch } from "lucide-react";
import { api, errorMessage, isAbortError } from "@/features/moramora/api/client";
import { IMAGE_TYPES, LIMITS } from "@/features/moramora/api/config";
import { formatBytes } from "@/features/moramora/api/messages";
import type { ImageDetection } from "@/features/moramora/api/types";
import { useAuth, useExpireOn401 } from "@/features/moramora/auth/auth-provider";
import { AnnotatedImage, DetectionList, Verdict } from "@/features/moramora/components/detection-result";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Button, Notice, PageHeader, Panel, ProgressBar, Spinner } from "@/components/ui";

type Phase =
  | { name: "idle" }
  | { name: "ready" }
  | { name: "uploading"; progress: number }
  | { name: "analyzing" }
  | { name: "done"; result: ImageDetection }
  | { name: "error"; message: string };

export function PhotoAnalyzer() {
  const { token } = useAuth();
  const expireOn401 = useExpireOn401();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [rejection, setRejection] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  useEffect(() => {
    if (!preview) {
      return;
    }
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function choose(next: File) {
    if (!IMAGE_TYPES.includes(next.type)) {
      setRejection(
        "Format non pris en charge. Choisissez une photo JPEG ou PNG.",
      );
      return;
    }
    if (next.size > LIMITS.imageBytes) {
      setRejection(
        `Cette photo pèse ${formatBytes(next.size)}. La limite est de 5 Mo.`,
      );
      return;
    }
    setRejection(null);
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setPhase({ name: "ready" });
  }

  function reset() {
    controllerRef.current?.abort();
    setFile(null);
    setPreview(null);
    setPhase({ name: "idle" });
  }

  async function analyze() {
    if (!file || !token) {
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    setPhase({ name: "uploading", progress: 0 });
    try {
      const { data } = await api.detectImage(file, {
        token,
        signal: controller.signal,
        onProgress: (progress) => setPhase({ name: "uploading", progress }),
        onUploaded: () => setPhase({ name: "analyzing" }),
      });
      setPhase({ name: "done", result: data });
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }
      expireOn401(error);
      setPhase({ name: "error", message: errorMessage(error) });
    }
  }

  const busy = phase.name === "uploading" || phase.name === "analyzing";
  const result = phase.name === "done" ? phase.result : null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analyse photo"
        title="Repérer une infraction sur une photo"
        description="Envoyez une photo de la route : l'IA entoure chaque infraction détectée et indique son niveau de confiance."
      />

      {!file ? (
        <div className="max-w-[44rem] space-y-4">
          {rejection ? (
            <Notice tone="error" live>
              {rejection}
            </Notice>
          ) : null}
          <FileDropzone
            accept={IMAGE_TYPES.join(",")}
            label="Choisir une photo"
            hint="JPEG ou PNG, 5 Mo maximum. La photo est analysée puis n'est pas conservée par l'application."
            icon={ImageUp}
            onFile={choose}
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
          <div>
            {result ? (
              <AnnotatedImage
                base64={result.image}
                detections={result.detections}
              />
            ) : preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview (object URL)
              <img
                src={preview}
                alt={`Aperçu de la photo sélectionnée : ${file.name}`}
                className="block h-auto max-h-[70vh] w-full rounded-[12px] border border-line bg-ground object-contain"
              />
            ) : null}
          </div>

          <Panel
            className="h-fit p-5 sm:p-6"
            aria-labelledby="photo-panel-title"
          >
            <h2
              id="photo-panel-title"
              ref={resultRef}
              tabIndex={-1}
              className="text-[15px] font-medium text-fg outline-none"
            >
              {result ? "Résultat de l'analyse" : "Photo sélectionnée"}
            </h2>
            <p
              className="mt-1 truncate text-[13px] text-fg-3"
              title={file.name}
            >
              {file.name} · {formatBytes(file.size)}
            </p>

            <div className="mt-5 space-y-4" aria-live="polite">
              {phase.name === "ready" ? (
                <Button onClick={analyze} className="w-full">
                  <ScanSearch aria-hidden="true" />
                  Analyser la photo
                </Button>
              ) : null}

              {phase.name === "uploading" ? (
                <div className="space-y-2.5">
                  <p className="text-sm text-fg-2">Envoi de la photo…</p>
                  <ProgressBar
                    value={phase.progress}
                    label="Envoi de la photo"
                  />
                </div>
              ) : null}

              {phase.name === "analyzing" ? (
                <div className="space-y-2.5">
                  <p className="flex items-center gap-2 text-sm text-fg-2">
                    <Spinner className="size-3.5" />
                    Analyse par l&apos;IA en cours…
                  </p>
                  <ProgressBar label="Analyse en cours" />
                </div>
              ) : null}

              {phase.name === "error" ? (
                <>
                  <Notice tone="error" title="L'analyse n'a pas abouti">
                    {phase.message}
                  </Notice>
                  <Button onClick={analyze} className="w-full">
                    <RotateCcw aria-hidden="true" />
                    Réessayer
                  </Button>
                </>
              ) : null}

              {result ? (
                <>
                  <Verdict detections={result.detections} />
                  <DetectionList detections={result.detections} />
                </>
              ) : null}
            </div>

            <div className="mt-5 border-t border-line pt-5">
              <Button variant="secondary" onClick={reset} className="w-full">
                {busy ? "Annuler" : "Analyser une autre photo"}
              </Button>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
