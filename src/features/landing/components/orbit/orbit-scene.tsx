"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbitSceneProps = {
  animate?: boolean;
};

const ORBIT_RADIUS = 1.9;
const ORBIT_TILT = new THREE.Euler(-1.13, 0.1, -0.16);
const ORBIT_SPEED = 0.11;
const GLOBE_RADIUS = 1.4;
const LOGO_RADIUS = 0.38;

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

function DottedGlobe() {
  const positions = useMemo(() => {
    const count = 1200;
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

  const city = useMemo(() => {
    const point = globePoint(-18.9, 28, GLOBE_RADIUS + 0.012);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      point.clone().normalize(),
    );
    return { point, quaternion };
  }, []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 48]} />
        <meshStandardMaterial color="#2b251e" roughness={0.85} metalness={0.05} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#efe9de"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <mesh position={city.point}>
        <sphereGeometry args={[0.026, 16, 16]} />
        <meshBasicMaterial color="#ff5a1f" toneMapped={false} />
      </mesh>
      <mesh position={city.point} quaternion={city.quaternion}>
        <torusGeometry args={[0.062, 0.0045, 6, 48]} />
        <meshBasicMaterial
          color="#ff5a1f"
          transparent
          opacity={0.45}
          toneMapped={false}
        />
      </mesh>
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
      | { width?: number; height?: number }
      | undefined;
    const width = image?.width ?? 256;
    const height = image?.height ?? 256;
    const aspect = width / height;
    const max = 0.5;
    return aspect >= 1 ? [max, max / aspect] : [max * aspect, max];
  }, [texture]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const angle = (animate ? clock.elapsedTime * ORBIT_SPEED : 0) + phase;
    scratch
      .set(
        Math.cos(angle) * ORBIT_RADIUS,
        Math.sin(angle) * ORBIT_RADIUS,
        0,
      )
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

export default function OrbitScene({ animate = true }: OrbitSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 6, 8]} intensity={2.4} color="#fff3e6" />
      <directionalLight position={[6, -3, 4]} intensity={0.55} color="#ff7a45" />

      <DottedGlobe />
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
