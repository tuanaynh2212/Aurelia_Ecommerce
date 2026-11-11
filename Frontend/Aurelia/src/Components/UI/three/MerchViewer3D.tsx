import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { HEX } from "./palette";
import { useSpatialQuality } from "./useSpatialQuality";
import { StudioLights } from "./StudioLights";

export interface MerchViewer3DProps {
  imageUrl?: string;
  productName?: string;
  sku?: string;
  className?: string;
}

const MAX_YAW = (35 * Math.PI) / 180; // ±35°
const MAX_PITCH = (12 * Math.PI) / 180; // ±12°

function GarmentSlabMesh({
  imageUrl,
  targetYawRef,
  targetPitchRef,
}: {
  imageUrl?: string;
  targetYawRef: React.MutableRefObject<number>;
  targetPitchRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setTexture(null);
      return;
    }
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      imageUrl,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {
        if (!cancelled) setTexture(null);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  const frontMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: texture ? HEX.paper : HEX.bone,
        map: texture ?? null,
        roughness: 0.45,
        metalness: 0.05,
      }),
    [texture]
  );

  useEffect(() => {
    return () => {
      frontMat.dispose();
    };
  }, [frontMat]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y +=
      (targetYawRef.current - groupRef.current.rotation.y) * 0.12;
    groupRef.current.rotation.x +=
      (targetPitchRef.current - groupRef.current.rotation.x) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Steel top hanger */}
      <mesh position={[0, 1.62, 0]}>
        <torusGeometry args={[0.14, 0.025, 10, 24, Math.PI * 1.25]} />
        <meshStandardMaterial color={HEX.ink} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Heavy cardstock garment monolith slab */}
      <RoundedBox args={[2.25, 2.95, 0.14]} radius={0.03} smoothness={3}>
        <meshStandardMaterial color={HEX.ink} roughness={0.35} metalness={0.2} />
      </RoundedBox>
      {/* Front textured plate */}
      <mesh position={[0, 0.08, 0.075]} material={frontMat}>
        <planeGeometry args={[2.05, 2.45]} />
      </mesh>
      {/* Back specification plate */}
      <mesh position={[0, 0.08, -0.075]} rotation={[0, Math.PI, 0]} material={frontMat}>
        <planeGeometry args={[2.05, 2.45]} />
      </mesh>
      {/* Volt calibration bar */}
      <mesh position={[0, -1.3, 0.076]}>
        <boxGeometry args={[2.05, 0.16, 0.01]} />
        <meshBasicMaterial color={HEX.volt} />
      </mesh>
    </group>
  );
}

/**
 * Interactive drag-to-rotate (`±35°` yaw, `±12°` pitch with spring inertia, double-click reset)
 * 3D garment slab for `MainProduct`.
 */
export function MerchViewer3D({
  imageUrl,
  productName = "AURELIA GARMENT",
  sku = "ATELIER-3D",
  className = "",
}: MerchViewer3DProps) {
  const { isFallback2D } = useSpatialQuality();
  const draggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    targetYawRef.current = Math.max(
      -MAX_YAW,
      Math.min(MAX_YAW, targetYawRef.current + dx * 0.008)
    );
    targetPitchRef.current = Math.max(
      -MAX_PITCH,
      Math.min(MAX_PITCH, targetPitchRef.current + dy * 0.005)
    );
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleDoubleClick = () => {
    targetYawRef.current = 0;
    targetPitchRef.current = 0;
  };

  if (isFallback2D) {
    return (
      <div
        className={`studio-grid-bg relative flex h-full w-full flex-col items-center justify-center border-2 border-ink p-6 ${className}`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={productName}
            className="max-h-[75%] w-auto border-2 border-ink bg-paper object-contain shadow-hard-lg"
          />
        )}
        <p className="mt-3 mono-label text-xs font-bold text-ink">
          [2D CALIBRATED FALLBACK // {sku}]
        </p>
      </div>
    );
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      className={`studio-grid-bg relative h-full w-full cursor-grab active:cursor-grabbing select-none ${className}`}
      aria-label={`Mô hình 3D ${productName} — Kéo để xoay, nhấp đúp để đặt lại`}
    >
      <Suspense fallback={<div className="h-full w-full skeleton-fog" />}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.1, 4.4], fov: 42 }}>
          <StudioLights floorY={-1.75} animatedCones={false} />
          <GarmentSlabMesh
            imageUrl={imageUrl}
            targetYawRef={targetYawRef}
            targetPitchRef={targetPitchRef}
          />
        </Canvas>
      </Suspense>
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between border-2 border-ink bg-paper/90 px-3 py-1.5 mono-label text-[10px] font-bold text-ink">
        <span>OPTICAL RIG // DRAG ±35° YAW · ±12° PITCH</span>
        <span>DBL-CLICK RESET</span>
      </div>
    </div>
  );
}

export default MerchViewer3D;
