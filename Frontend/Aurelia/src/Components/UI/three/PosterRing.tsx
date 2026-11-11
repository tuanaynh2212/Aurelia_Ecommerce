import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import { HEX } from "./palette";
import { spatialStore, useSpatialStore } from "./SpatialStore";

export interface PosterRingItem {
  id: string;
  title?: string;
  banner?: string;
}

export interface PosterRingProps {
  items: PosterRingItem[];
  activeIndex?: number | null;
  radius?: number;
}

function PosterArtworkPlane({ banner, isActive }: { banner?: string; isActive: boolean }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!banner) {
      setTexture(null);
      return;
    }
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      banner,
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
  }, [banner]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return (
    <mesh position={[0, -0.05, 0.04]}>
      <planeGeometry args={[0.95, 0.85]} />
      {texture ? (
        <meshBasicMaterial map={texture} />
      ) : (
        <meshStandardMaterial color={isActive ? HEX.ink : HEX.bone} />
      )}
    </mesh>
  );
}

/**
 * Cylindrical/spiral arrangement of seasonal poster slabs rotating with scroll
 * and highlighting the active `activeSeasonIndex` from DOM hover.
 */
export function PosterRing({
  items,
  activeIndex: propActiveIndex,
  radius = 2.0,
}: PosterRingProps) {
  const ringRef = useRef<Group>(null);
  const storeActiveIndex = useSpatialStore((s) => s.activeSeasonIndex);
  const activeIdx = propActiveIndex !== undefined ? propActiveIndex : storeActiveIndex;

  const count = Math.max(4, items.length || 5);
  const slabs = Array.from({ length: count }, (_, idx) => {
    const angle = (idx / count) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = (idx - (count - 1) / 2) * 0.24;
    return { idx, angle, x, y, z };
  });

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    const { scrollProgress, pointer } = spatialStore.getState();
    const targetRotY =
      activeIdx !== null && activeIdx !== undefined
        ? -(activeIdx / count) * Math.PI * 2
        : t * 0.28 + scrollProgress * Math.PI * 1.5 + pointer.x * 0.4;
    ringRef.current.rotation.y += (targetRotY - ringRef.current.rotation.y) * 0.08;
  });

  return (
    <group ref={ringRef}>
      {/* Central turntable spindle */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 3.2, 16]} />
        <meshStandardMaterial color={HEX.ink} metalness={0.7} roughness={0.25} />
      </mesh>

      {slabs.map((slab) => {
        const isActive = activeIdx === slab.idx;
        const banner = items[slab.idx]?.banner;
        return (
          <group
            key={slab.idx}
            position={[slab.x, slab.y, slab.z]}
            rotation={[0, slab.angle, 0]}
            scale={isActive ? 1.16 : 1}
          >
            {/* Poster slab */}
            <RoundedBox args={[1.15, 1.55, 0.06]} radius={0.02} smoothness={2}>
              <meshStandardMaterial
                color={isActive ? HEX.volt : HEX.paper}
                roughness={0.35}
                metalness={0.1}
              />
            </RoundedBox>
            {/* Outer ink frame */}
            <RoundedBox
              args={[1.21, 1.61, 0.04]}
              radius={0.02}
              smoothness={2}
              position={[0, 0, -0.02]}
            >
              <meshStandardMaterial
                color={isActive ? HEX.flash : HEX.ink}
                roughness={0.4}
              />
            </RoundedBox>
            {/* Header stripe */}
            <mesh position={[0, 0.55, 0.04]}>
              <boxGeometry args={[0.95, 0.18, 0.01]} />
              <meshBasicMaterial color={HEX.ink} />
            </mesh>
            {/* Center artwork photo */}
            <PosterArtworkPlane banner={banner} isActive={isActive} />
          </group>
        );
      })}
    </group>
  );
}
