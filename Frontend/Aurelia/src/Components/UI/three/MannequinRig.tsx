import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HEX } from "./palette";

export interface MannequinMeasurements {
  vai?: number | string;
  nguc?: number | string;
  eo?: number | string;
  hong?: number | string;
  chieuCao?: number | string;
}

export interface MannequinRigProps {
  measurements?: MannequinMeasurements;
  position?: [number, number, number];
  scale?: number;
}

function toNum(v: number | string | undefined, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  if (typeof v === "string") {
    const parsed = parseFloat(v);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return fallback;
}

/**
 * Procedural wireframe/lathe dress-form surrounded by 5 orbiting measurement rings
 * (`vai`, `nguc`, `eo`, `hong`, `chieuCao`) mapped safely from read-only numeric props.
 */
export function MannequinRig({
  measurements,
  position = [0, -0.1, 0],
  scale = 1,
}: MannequinRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const vai = toNum(measurements?.vai, 40);
  const nguc = toNum(measurements?.nguc, 88);
  const eo = toNum(measurements?.eo, 68);
  const hong = toNum(measurements?.hong, 92);
  const chieuCao = toNum(measurements?.chieuCao, 168);

  const latheGeo = useMemo(() => {
    const points = [
      new THREE.Vector2(0.08, -1.2),
      new THREE.Vector2(0.42, -0.95), // hips
      new THREE.Vector2(0.46, -0.55),
      new THREE.Vector2(0.31, -0.1), // waist
      new THREE.Vector2(0.44, 0.42), // bust
      new THREE.Vector2(0.48, 0.78), // shoulders
      new THREE.Vector2(0.18, 0.96), // neck base
      new THREE.Vector2(0.15, 1.22), // neck top
    ];
    return new THREE.LatheGeometry(points, 24);
  }, []);

  useEffect(() => {
    return () => {
      latheGeo.dispose();
    };
  }, [latheGeo]);

  const ringSpecs = useMemo(
    () => [
      { y: 0.76, radius: Math.min(1.15, Math.max(0.55, (vai / 42) * 0.72)), color: HEX.flash, tilt: 0.14 },
      { y: 0.4, radius: Math.min(1.15, Math.max(0.55, (nguc / 90) * 0.68)), color: HEX.volt, tilt: -0.12 },
      { y: -0.1, radius: Math.min(1.1, Math.max(0.45, (eo / 70) * 0.56)), color: HEX.ink, tilt: 0.1 },
      { y: -0.62, radius: Math.min(1.2, Math.max(0.55, (hong / 94) * 0.72)), color: HEX.volt, tilt: -0.15 },
      { y: 1.12, radius: Math.min(1.25, Math.max(0.6, (chieuCao / 170) * 0.85)), color: HEX.info, tilt: 0.22 },
    ],
    [vai, nguc, eo, hong, chieuCao]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.35;
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, idx) => {
        child.rotation.z = ringSpecs[idx].tilt + Math.sin(t * 1.1 + idx) * 0.08;
        child.rotation.y = -t * (0.4 + idx * 0.08);
      });
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Central stand rod + tripod base */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
        <meshStandardMaterial color={HEX.ink} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -2.02, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.08, 20]} />
        <meshStandardMaterial color={HEX.ink} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Mannequin dress-form */}
      <group ref={groupRef}>
        <mesh geometry={latheGeo}>
          <meshStandardMaterial color={HEX.bone} roughness={0.65} metalness={0.05} />
        </mesh>
        <mesh geometry={latheGeo} scale={1.012}>
          <meshBasicMaterial color={HEX.ink} wireframe />
        </mesh>
      </group>

      {/* 5 orbiting measurement rings */}
      <group ref={ringsRef}>
        {ringSpecs.map((spec, idx) => (
          <mesh key={idx} position={[0, spec.y, 0]} rotation={[Math.PI / 2, 0, spec.tilt]}>
            <torusGeometry args={[spec.radius, 0.018, 12, 48]} />
            <meshBasicMaterial color={spec.color} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
