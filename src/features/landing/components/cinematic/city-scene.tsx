"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type CitySceneProps = {
  active: boolean;
  progressRef: RefObject<number>;
  reducedMotion: boolean;
};

const MODEL_PATH = "/models/city-kit/city-hall.glb";

const cameraCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(9.2, 5.2, 11.5),
    new THREE.Vector3(5.8, 3.2, 7.6),
    new THREE.Vector3(2.1, 1.65, 5.1),
    new THREE.Vector3(-2.8, 1.85, 4.4),
    new THREE.Vector3(-7.8, 3.9, 8.8),
  ],
  false,
  "catmullrom",
  0.34,
);

const targetCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1.1, 0),
  new THREE.Vector3(0.15, 1.15, 0),
  new THREE.Vector3(0, 0.9, 0),
  new THREE.Vector3(-0.25, 1.15, 0),
]);

function CityHall({ progressRef }: { progressRef: RefObject<number> }) {
  const model = useLoader(GLTFLoader, MODEL_PATH);
  const pivot = useRef<THREE.Group>(null);

  const scene = useMemo(() => {
    const clone = model.scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 3.9 / Math.max(size.x, size.y, size.z);

    clone.position.set(
      -center.x * scale,
      -bounds.min.y * scale,
      -center.z * scale,
    );
    clone.scale.setScalar(scale);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.material instanceof THREE.MeshStandardMaterial) {
        object.material = object.material.clone();
        object.material.roughness = 0.68;
        object.material.metalness = 0.1;
      }
    });

    return clone;
  }, [model.scene]);

  useFrame(() => {
    if (!pivot.current) return;
    const progress = progressRef.current;
    pivot.current.rotation.y = -0.32 + progress * 0.48;
    pivot.current.position.x = THREE.MathUtils.lerp(0.45, -0.35, progress);
    pivot.current.position.y = -0.13 + Math.sin(progress * Math.PI) * 0.06;
  });

  return (
    <group ref={pivot} position={[0.45, -0.13, 0]} rotation={[0, -0.32, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const position = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    cameraCurve.getPointAt(progress, position);
    targetCurve.getPointAt(progress, target);
    camera.position.copy(position);
    camera.lookAt(target);
  });

  return null;
}

function LightField({ progressRef }: { progressRef: RefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const points = new Float32Array(120 * 3);
    for (let index = 0; index < 120; index += 1) {
      const angle = index * 2.39996;
      const radius = 3.1 + (index % 12) * 0.31;
      points[index * 3] = Math.cos(angle) * radius;
      points[index * 3 + 1] = 0.18 + ((index * 7) % 15) * 0.14;
      points[index * 3 + 2] = Math.sin(angle) * radius;
    }
    return points;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = progressRef.current * 0.24;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff7a45"
        size={0.032}
        transparent
        opacity={0.48}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function Scene({ progressRef }: { progressRef: RefObject<number> }) {
  return (
    <>
      <fog attach="fog" args={["#100f0e", 8, 21]} />
      <ambientLight intensity={0.46} color="#efe9de" />
      <hemisphereLight args={["#ffb08d", "#171512", 1.15]} />
      <directionalLight
        castShadow
        color="#fff2df"
        intensity={2.8}
        position={[4.5, 7, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={18}
      />
      <spotLight
        color="#ff5a1f"
        intensity={52}
        angle={0.4}
        penumbra={0.9}
        position={[-4, 5, 3]}
      />

      <Suspense fallback={null}>
        <CityHall progressRef={progressRef} />
      </Suspense>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.14, 0]}
        receiveShadow
      >
        <circleGeometry args={[9, 96]} />
        <meshStandardMaterial color="#171512" roughness={0.92} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.125, 0]}>
        <ringGeometry args={[3.2, 3.22, 128]} />
        <meshBasicMaterial color="#ff5a1f" transparent opacity={0.4} />
      </mesh>
      <LightField progressRef={progressRef} />
      <CameraRig progressRef={progressRef} />
    </>
  );
}

export default function CityScene({
  active,
  progressRef,
  reducedMotion,
}: CitySceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      shadows
      dpr={[1, 1.5]}
      frameloop={active && !reducedMotion ? "always" : "demand"}
      camera={{ fov: 35, near: 0.1, far: 42, position: [9.2, 5.2, 11.5] }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
