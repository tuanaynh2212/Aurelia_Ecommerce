import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { HEX } from "./palette";
import { spatialStore } from "./SpatialStore";

export interface StageWordmarkProps {
  position?: [number, number, number];
  scale?: number;
}

/**
 * Procedural extruded `AURELIA` block monolith in carbon ink with safety-orange
 * bevel trim and subtle idle + pointer sway.
 * Built from procedural ExtrudeGeometry & RoundedBox slabs — zero external font assets required.
 */
export function StageWordmark({
  position = [0, 0.4, -1.6],
  scale = 1,
}: StageWordmarkProps) {
  const groupRef = useRef<THREE.Group>(null);

  const monolithGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 6.2;
    const h = 1.45;
    const notch = 0.22;
    shape.moveTo(-w / 2 + notch, -h / 2);
    shape.lineTo(w / 2 - notch, -h / 2);
    shape.lineTo(w / 2, -h / 2 + notch);
    shape.lineTo(w / 2, h / 2 - notch);
    shape.lineTo(w / 2 - notch, h / 2);
    shape.lineTo(-w / 2 + notch, h / 2);
    shape.lineTo(-w / 2, h / 2 - notch);
    shape.lineTo(-w / 2, -h / 2 + notch);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
  }, []);

  useEffect(() => {
    return () => {
      monolithGeo.dispose();
    };
  }, [monolithGeo]);

  // Procedural 7-letter architectural glyph bars for A-U-R-E-L-I-A
  const letterOffsets = useMemo(
    () => [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4],
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const { pointer, scrollProgress } = spatialStore.getState();
    groupRef.current.rotation.y =
      Math.sin(t * 0.4) * 0.06 + pointer.x * 0.14;
    groupRef.current.rotation.x =
      Math.cos(t * 0.35) * 0.03 - pointer.y * 0.08;
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.7) * 0.05 + scrollProgress * 0.6;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main carbon monolith block */}
      <mesh geometry={monolithGeo} position={[0, 0, -0.21]}>
        <meshStandardMaterial
          color={HEX.ink}
          roughness={0.35}
          metalness={0.3}
        />
      </mesh>

      {/* Safety-orange bevel frame */}
      <RoundedBox args={[6.42, 1.62, 0.16]} radius={0.04} smoothness={2} position={[0, 0, -0.16]}>
        <meshStandardMaterial color={HEX.flash} roughness={0.4} metalness={0.15} />
      </RoundedBox>

      {/* Volt calibration bar */}
      <mesh position={[0, -0.62, 0.25]}>
        <boxGeometry args={[5.6, 0.1, 0.06]} />
        <meshBasicMaterial color={HEX.volt} />
      </mesh>

      {/* Architectural letter relief pillars (A U R E L I A) */}
      {letterOffsets.map((x, idx) => (
        <group key={idx} position={[x, 0.06, 0.24]}>
          <RoundedBox args={[0.52, 0.78, 0.12]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color={HEX.paper} roughness={0.25} />
          </RoundedBox>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.2, 0.42, 0.04]} />
            <meshStandardMaterial color={idx === 3 ? HEX.flash : HEX.ink} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
