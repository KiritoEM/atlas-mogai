import { CircleCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  countByLabel,
  describeDetections,
  formatConfidence,
  isViolation,
  labelName,
  pluralize,
  violationsOf,
} from "../api/messages";
import type { Detection } from "../api/types";

export function jpegDataUrl(base64: string) {
  return base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
}

export function Verdict({
  detections,
  cleanLabel = "Aucune infraction détectée",
  className,
}: {
  detections: Detection[];
  cleanLabel?: string;
  className?: string;
}) {
  const violations = violationsOf(detections);
  const alert = violations.length > 0;
  const groups = countByLabel(violations);
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[12px] border px-4 py-3.5",
        alert
          ? "border-moramora/35 bg-moramora/[0.08]"
          : "border-gaspika/30 bg-gaspika/[0.07]",
        className,
      )}
    >
      {alert ? (
        <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-moramora" />
      ) : (
        <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gaspika" />
      )}
      <div>
        <p className="text-[15px] font-medium text-fg">
          {alert
            ? `${pluralize(violations.length, "infraction détectée", "infractions détectées")}`
            : cleanLabel}
        </p>
        <p className="mt-0.5 text-sm text-fg-2">
          {alert
            ? groups
                .map(([label, count]) => `${labelName(label)}${count > 1 ? ` × ${count}` : ""}`)
                .join(" · ")
            : detections.length > 0
              ? "Les conducteurs repérés sont en règle."
              : "Le modèle n'a rien relevé au-dessus du seuil de confiance de 50 %."}
        </p>
      </div>
    </div>
  );
}

export function DetectionList({ detections }: { detections: Detection[] }) {
  if (detections.length === 0) {
    return null;
  }
  // Infractions first, then compliant detections, each by confidence.
  const sorted = [...detections].sort(
    (a, b) =>
      Number(isViolation(b.label)) - Number(isViolation(a.label)) ||
      b.confidence - a.confidence,
  );
  return (
    <ul className="divide-y divide-line rounded-[12px] border border-line">
      {sorted.map((detection, index) => {
        const violation = isViolation(detection.label);
        return (
        <li
          key={`${detection.label}-${index}`}
          className="flex items-center gap-4 px-4 py-3"
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              violation ? "bg-moramora" : "bg-gaspika",
            )}
          />
          <span className="min-w-0 flex-1 truncate text-sm text-fg">
            {labelName(detection.label)}
            <span className={cn("ml-2 text-[12px]", violation ? "text-moramora" : "text-fg-3")}>
              {violation ? "Infraction" : "Conforme"}
            </span>
          </span>
          <span className="hidden h-1 w-20 overflow-hidden rounded-full bg-raised sm:block" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-fg-3"
              style={{ width: `${Math.round(detection.confidence * 100)}%` }}
            />
          </span>
          <span className="w-12 shrink-0 text-right font-mono text-[13px] text-fg-2 tabular-nums">
            <span className="sr-only">Confiance </span>
            {formatConfidence(detection.confidence)}
          </span>
        </li>
        );
      })}
    </ul>
  );
}

export function AnnotatedImage({
  base64,
  detections,
  className,
}: {
  base64: string;
  detections: Detection[];
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- base64 result from the API
    <img
      src={jpegDataUrl(base64)}
      alt={`Image analysée par l'IA, ${describeDetections(detections)}.`}
      className={cn(
        "block h-auto w-full rounded-[12px] border border-line bg-ground object-contain",
        className,
      )}
    />
  );
}
