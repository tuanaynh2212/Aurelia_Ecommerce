import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { HEX } from "./palette";
import { spatialStore } from "./SpatialStore";

export interface VinylProps {
  position?: [number, number, number];
  scale?: number;
}

/**
 * Grooved spinning vinyl record with brutalist sleeve for `About` and `LoadingScreen`.
 */
export function Vinyl({ position = [0, 0, 0], scale = 1 }: VinylProps) {
  const discRef = useRef<Group>(null);
  const wholeRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { scrollProgress, pointer } = spatialStore.getState();
    if (discRef.current) {
      discRef.current.rotation.z = -t * 1.4 - scrollProgress * Math.PI * 4;
    }
    if (wholeRef.current) {
      wholeRef.current.rotation.y = -0.25 + pointer.x * 0.28;
      wholeRef.current.rotation.x = 0.12 - pointer.y * 0.16;
    }
  });

  return (
    <group ref={wholeRef} position={position} scale={scale}>
      {/* Brutalist record sleeve */}
      <group position={[-0.55, 0, -0.08]}>
        <RoundedBox args={[2.3, 2.3, 0.08]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color={HEX.paper} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.65, 0.05]}>
          <boxGeometry args={[1.95, 0.42, 0.01]} />
          <meshBasicMaterial color={HEX.ink} />
        </mesh>
        <mesh position={[0, -0.2, 0.05]}>
          <boxGeometry args={[1.95, 0.95, 0.01]} />
          <meshBasicMaterial color={HEX.flash} />
        </mesh>
      </group>

      {/* Spinning vinyl record */}
      <group ref={discRef} position={[0.55, 0, 0.06]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.08, 1.08, 0.03, 48]} />
          <meshStandardMaterial color={HEX.ink} roughness={0.22} metalness={0.55} />
        </mesh>
        {/* Grooves */}
        {[0.88, 0.72, 0.56].map((r) => (
          <mesh key={r} position={[0, 0, 0.02]}>
            <torusGeometry args={[r, 0.006, 8, 48]} />
            <meshBasicMaterial color={HEX.bone} />
          </mesh>
        ))}
        {/* Volt center label */}
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.035, 32]} />
          <meshBasicMaterial color={HEX.volt} />
        </mesh>
        {/* Spindle hole */}
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshBasicMaterial color={HEX.ink} />
        </mesh>
      </group>
    </group>
  );
}
