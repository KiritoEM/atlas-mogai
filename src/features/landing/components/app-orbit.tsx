"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  createOrbitInteraction,
  INITIAL_PITCH,
  INITIAL_YAW,
} from "./orbit/orbit-interaction";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const OrbitScene = dynamic(() => import("./orbit/orbit-scene"), {
  ssr: false,
  loading: () => <OrbitFallback />,
});

function OrbitFallback() {
  return (
    <svg viewBox="0 0 520 520" fill="none" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <clipPath id="orbit-fallback-clip"><circle cx="260" cy="260" r="177" /></clipPath>
        <pattern id="orbit-fallback-dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#efe9de" fillOpacity="0.48" />
        </pattern>
      </defs>
      <ellipse cx="260" cy="260" rx="232" ry="82" stroke="#efe9de" strokeOpacity="0.16" />
      <circle cx="260" cy="260" r="177" fill="#292823" stroke="#efe9de" strokeOpacity="0.1" />
      <g clipPath="url(#orbit-fallback-clip)">
        <rect x="80" y="80" width="360" height="360" fill="url(#orbit-fallback-dots)" />
        <ellipse cx="260" cy="260" rx="177" ry="52" stroke="#b5b9ad" strokeOpacity="0.13" />
        <ellipse cx="260" cy="260" rx="76" ry="177" stroke="#b5b9ad" strokeOpacity="0.13" />
      </g>
      <circle cx="354" cy="301" r="4" fill="#ff5a1f" />
      <circle cx="354" cy="301" r="10" stroke="#ff5a1f" strokeOpacity="0.5" />
      <circle cx="72" cy="288" r="6" fill="#ff7a5c" />
      <circle cx="458" cy="229" r="6" fill="#6fb6d9" />
    </svg>
  );
}

type Drag = { pointerId: number; x: number; y: number };

export function AppOrbit() {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const interaction = useRef(createOrbitInteraction());
  const drag = useRef<Drag | null>(null);
  const invalidate = useRef<(() => void) | null>(null);

  const refresh = () => invalidate.current?.();

  const rotate = (x: number, y: number) => {
    interaction.current.targetYaw += x;
    interaction.current.targetPitch = Math.max(-0.68, Math.min(0.68, interaction.current.targetPitch + y));
    refresh();
  };

  const reset = () => {
    interaction.current.targetYaw = INITIAL_YAW;
    interaction.current.targetPitch = INITIAL_PITCH;
    setResetKey((value) => value + 1);
    refresh();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    interaction.current.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    interaction.current.dragging = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    current.x = event.clientX;
    current.y = event.clientY;
    rotate(dx * 0.006, dy * 0.006);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    const step = 0.16;
    if (event.key === "ArrowLeft") rotate(-step, 0);
    else if (event.key === "ArrowRight") rotate(step, 0);
    else if (event.key === "ArrowUp") rotate(0, -step);
    else if (event.key === "ArrowDown") rotate(0, step);
    else if (event.key === "Home") reset();
    else return;
    event.preventDefault();
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div
        role="group"
        tabIndex={0}
        aria-label="Globe interactif d’Antananarivo"
        aria-describedby="globe-instructions"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onKeyDown={onKeyDown}
        className="absolute inset-0 cursor-grab touch-pan-y rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ember/70"
      >
        <OrbitScene
          animate={!reduced && !paused}
          interaction={interaction}
          resetKey={resetKey}
          onInvalidateReady={(callback) => { invalidate.current = callback; }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-[1%] z-10 flex items-center justify-between gap-3 px-2 sm:bottom-[3%]">
        <p id="globe-instructions" className="max-w-[13rem] text-[11px] leading-4 text-fg-3">
          Glisser pour orienter · flèches pour ajuster
        </p>
        <div className="flex items-center gap-1">
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Relancer la rotation du globe" : "Mettre la rotation du globe en pause"}
              aria-pressed={paused}
              className="flex size-9 items-center justify-center rounded-full border border-line-strong bg-surface/90 text-fg-2 transition-colors hover:border-ember/50 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            aria-label="Réinitialiser l’orientation du globe"
            className="flex size-9 items-center justify-center rounded-full border border-line-strong bg-surface/90 text-fg-2 transition-colors hover:border-ember/50 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
