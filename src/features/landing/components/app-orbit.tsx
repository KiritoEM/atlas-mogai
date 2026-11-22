"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OrbitScene = dynamic(() => import("./orbit/orbit-scene"), {
  ssr: false,
  loading: () => <OrbitFallback />,
});

function OrbitFallback() {
  return (
    <svg
      viewBox="0 0 520 520"
      fill="none"
      className="absolute inset-0 size-full"
    >
      <ellipse
        cx="260"
        cy="266"
        rx="215"
        ry="76"
        stroke="#efe9de"
        strokeOpacity="0.14"
      />
      <circle
        cx="260"
        cy="260"
        r="140"
        fill="#1c1a18"
        stroke="rgba(239,233,222,0.12)"
      />
      <circle cx="155" cy="286" r="6" fill="#ff7a5c" />
      <circle cx="375" cy="224" r="6" fill="#6fb6d9" />
      <circle cx="260" cy="330" r="6" fill="#a6c97a" />
    </svg>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function AppOrbit() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto aspect-square w-full max-w-[520px]"
    >
      <OrbitScene animate={!reduced} />
    </div>
  );
}
