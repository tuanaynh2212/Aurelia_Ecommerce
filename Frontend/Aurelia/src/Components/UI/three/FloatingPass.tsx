import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { HEX, TIER_HEX, toTierKey, type TierKey } from "./palette";
import { spatialStore } from "./SpatialStore";

export interface FloatingPassProps {
  tier?: TierKey | string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * Heavy acrylic lanyard pass with spring-damped pointer drag-to-swing
 * and loyalty tier color coding (`Bronze` -> `Royal`).
 */
export function FloatingPass({
  tier = "royal",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: FloatingPassProps) {
  const groupRef = useRef<Group>(null);
  const key = toTierKey(tier);
  const passColor = TIER_HEX[key];
  const isRoyal = key === "royal";

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const { pointer } = spatialStore.getState();
    const targetRotZ = Math.sin(t * 1.1) * 0.06 - pointer.x * 0.18;
    const targetRotY = rotation[1] + pointer.x * 0.45 + Math.cos(t * 0.6) * 0.15;
    groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * 0.09;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.09;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Overhead lanyard strap */}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[0.16, 1.2, 0.02]} />
        <meshStandardMaterial color={HEX.ink} roughness={0.6} />
      </mesh>

      {/* Metal clip */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.14, 16]} />
        <meshStandardMaterial color={HEX.ink} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Acrylic pass body */}
      <RoundedBox args={[1.38, 2.05, 0.08]} radius={0.06} smoothness={3} position={[0, -0.25, 0]}>
        <meshStandardMaterial
          color={passColor}
          roughness={0.22}
          metalness={isRoyal ? 0.45 : 0.3}
        />
      </RoundedBox>

      {/* Trim edge */}
      <RoundedBox args={[1.44, 2.11, 0.05]} radius={0.06} smoothness={2} position={[0, -0.25, -0.02]}>
        <meshStandardMaterial color={isRoyal ? HEX.flash : HEX.ink} roughness={0.4} />
      </RoundedBox>

      {/* Volt VIP bar */}
      <mesh position={[0, 0.35, 0.05]}>
        <boxGeometry args={[1.12, 0.22, 0.02]} />
        <meshBasicMaterial color={HEX.volt} />
      </mesh>

      {/* Barcode strip at bottom */}
      <mesh position={[0, -0.92, 0.05]}>
        <boxGeometry args={[1.12, 0.28, 0.02]} />
        <meshBasicMaterial color={HEX.paper} />
      </mesh>
    </group>
  );
}
