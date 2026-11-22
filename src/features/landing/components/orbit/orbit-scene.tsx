"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroTheme } from "../../app-theme";
import {
  INITIAL_PITCH,
  INITIAL_YAW,
  type OrbitInteraction,
} from "./orbit-interaction";

type OrbitSceneProps = {
  animate: boolean;
  interaction: RefObject<OrbitInteraction>;
  resetKey: number;
  onInvalidateReady: (invalidate: () => void) => void;
};

const ORBIT_RADIUS = 1.9;
const ORBIT_TILT = new THREE.Euler(-1.13, 0.1, -0.16);
const ORBIT_SPEED = 0.11;
const GLOBE_RADIUS = 1.4;
const LOGO_RADIUS = 0.38;
const MARKER_COUNT = 16;

const APPS = [
  { id: "moramora", src: "/logos/moramora.svg" },
  { id: "aiza", src: "/logos/aiza.svg" },
  { id: "gaspika", src: "/logos/gaspika.svg" },
] as const;

const scratch = new THREE.Vector3();

function globePoint(latDeg: number, lonDeg: number, radius: number) {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg);
  return new THREE.Vector3(
    Math.cos(lat) * Math.sin(lon) * radius,
    Math.sin(lat) * radius,
    Math.cos(lat) * Math.cos(lon) * radius,
  );
}

const CITY_POINT = globePoint(-18.9, 47.5, GLOBE_RADIUS + 0.035);
const MARKER_POINTS = Array.from({ length: MARKER_COUNT }, (_, index) => {
  const y = 1 - (2 * (index + 0.5)) / MARKER_COUNT;
  const ring = Math.sqrt(1 - y * y);
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  return new THREE.Vector3(
    Math.cos(angle) * ring,
    y,
    Math.sin(angle) * ring,
  ).multiplyScalar(GLOBE_RADIUS + 0.035);
}).filter(
  (point) =>
    point.clone().normalize().dot(CITY_POINT.clone().normalize()) < 0.97,
);

function GlobeMarker({
  point,
  primary = false,
}: {
  point: THREE.Vector3;
  primary?: boolean;
}) {
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        point.clone().normalize(),
      ),
    [point],
  );

  return (
    <group position={point} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[primary ? 0.026 : 0.018, 12, 12]} />
        <meshBasicMaterial color={heroTheme.city} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[primary ? 0.064 : 0.048, 0.0035, 6, 40]} />
        <meshBasicMaterial
          color={heroTheme.city}
          transparent
          opacity={primary ? 0.68 : 0.5}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function DottedGlobe({
  animate,
  interaction,
  resetKey,
}: {
  animate: boolean;
  interaction: RefObject<OrbitInteraction>;
  resetKey: number;
}) {
  const globe = useRef<THREE.Group>(null);
  const rotation = useRef({
    yaw: INITIAL_YAW,
    pitch: INITIAL_PITCH,
    autoYaw: 0,
  });

  useEffect(() => {
    rotation.current = { yaw: INITIAL_YAW, pitch: INITIAL_PITCH, autoYaw: 0 };
    globe.current?.rotation.set(INITIAL_PITCH, INITIAL_YAW, -0.12);
  }, [resetKey]);

  useFrame((_, delta) => {
    if (!globe.current) return;
    const state = rotation.current;
    if (animate && !interaction.current.dragging)
      state.autoYaw += Math.min(delta, 0.05) * 0.1;
    const blend = animate ? 1 - Math.exp(-Math.min(delta, 0.05) * 10) : 1;
    state.yaw +=
      (interaction.current.targetYaw + state.autoYaw - state.yaw) * blend;
    state.pitch += (interaction.current.targetPitch - state.pitch) * blend;
    globe.current.rotation.set(state.pitch, state.yaw, -0.12);
  });

  const positions = useMemo(() => {
    const count = 3000;
    const out = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const radius = GLOBE_RADIUS + 0.004;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      out[i * 3] = Math.cos(theta) * r * radius;
      out[i * 3 + 1] = y * radius;
      out[i * 3 + 2] = Math.sin(theta) * r * radius;
    }

    return out;
  }, []);

  return (
    <group ref={globe} rotation={[0.12, -0.22, -0.12]}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 48]} />
        <meshStandardMaterial
          color={heroTheme.globe}
          roughness={0.82}
          metalness={0.16}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.035, 48, 32]} />
        <meshBasicMaterial
          color={heroTheme.glow}
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {[-0.86, -0.44, 0, 0.44, 0.86].map((latitude) => (
        <mesh
          key={latitude}
          position={[0, Math.sin(latitude) * (GLOBE_RADIUS + 0.009), 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry
            args={[(GLOBE_RADIUS + 0.009) * Math.cos(latitude), 0.002, 4, 128]}
          />
          <meshBasicMaterial
            color={heroTheme.grid}
            transparent
            opacity={latitude === 0 ? 0.2 : 0.1}
            depthWrite={false}
          />
        </mesh>
      ))}
      {[0, Math.PI / 3, (Math.PI * 2) / 3].map((longitude) => (
        <mesh key={longitude} rotation={[0, longitude, 0]}>
          <torusGeometry args={[GLOBE_RADIUS + 0.012, 0.002, 4, 128]} />
          <meshBasicMaterial
            color={heroTheme.grid}
            transparent
            opacity={0.13}
            depthWrite={false}
          />
        </mesh>
      ))}

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.016}
          color="#efe9de"
          transparent
          opacity={0.58}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {MARKER_POINTS.map((point, index) => (
        <GlobeMarker key={index} point={point} />
      ))}
      <GlobeMarker point={CITY_POINT} primary />
    </group>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={ORBIT_TILT}>
      <torusGeometry args={[ORBIT_RADIUS, 0.0045, 6, 320]} />
      <meshBasicMaterial
        color="#efe9de"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </mesh>
  );
}

function useSvgTexture(src: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;

    loader.load(src, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = 8;
      loaded.needsUpdate = true;

      if (!cancelled) {
        setTexture(loaded);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}

type OrbitLogoProps = {
  src: string;
  phase: number;
  animate: boolean;
};

function OrbitLogo({ src, phase, animate }: OrbitLogoProps) {
  const group = useRef<THREE.Group>(null);
  const orbitAngle = useRef(phase);
  const texture = useSvgTexture(src);

  const initial = useMemo(() => {
    const point = new THREE.Vector3(
      Math.cos(phase) * ORBIT_RADIUS,
      Math.sin(phase) * ORBIT_RADIUS,
      0,
    );
    point.applyEuler(ORBIT_TILT);
    point.z += 0.06;
    return point;
  }, [phase]);

  const plane = useMemo<[number, number]>(() => {
    const image = texture?.image as
      { width?: number; height?: number } | undefined;
    const width = image?.width ?? 256;
    const height = image?.height ?? 256;
    const aspect = width / height;
    const max = 0.5;
    return aspect >= 1 ? [max, max / aspect] : [max * aspect, max];
  }, [texture]);

  useFrame((_, delta) => {
    if (!group.current) return;
    if (animate) orbitAngle.current += Math.min(delta, 0.05) * ORBIT_SPEED;
    const angle = orbitAngle.current;
    scratch
      .set(Math.cos(angle) * ORBIT_RADIUS, Math.sin(angle) * ORBIT_RADIUS, 0)
      .applyEuler(ORBIT_TILT);
    scratch.z += 0.06;
    group.current.position.copy(scratch);
  });

  return (
    <group ref={group} position={initial}>
      <mesh>
        <circleGeometry args={[LOGO_RADIUS, 48]} />
        <meshBasicMaterial color="#1c1a18" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[LOGO_RADIUS + 0.006, LOGO_RADIUS + 0.012, 48]} />
        <meshBasicMaterial
          color="#efe9de"
          transparent
          opacity={0.18}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {texture ? (
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={plane} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}
    </group>
  );
}

export default function OrbitScene({
  animate,
  interaction,
  resetKey,
  onInvalidateReady,
}: OrbitSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
      onCreated={({ invalidate }) => onInvalidateReady(invalidate)}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 6, 8]} intensity={2.4} color="#fff3e6" />
      <directionalLight
        position={[6, -3, 4]}
        intensity={0.55}
        color="#ff7a45"
      />

      <DottedGlobe
        animate={animate}
        interaction={interaction}
        resetKey={resetKey}
      />
      <OrbitRing />

      {APPS.map((app, index) => (
        <OrbitLogo
          key={app.id}
          src={app.src}
          phase={(index * Math.PI * 2) / APPS.length}
          animate={animate}
        />
      ))}
    </Canvas>
  );
}
