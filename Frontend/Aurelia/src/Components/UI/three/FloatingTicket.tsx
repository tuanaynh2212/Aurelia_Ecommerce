import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HEX } from "./palette";
import { spatialStore } from "./SpatialStore";

export interface FloatingTicketProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  tone?: "paper" | "volt" | "flash";
}

/**
 * Extruded notched admission ticket (`ExtrudeGeometry`) with spring-damped pointer sway
 * and ornamental industrial markings (`ADMIT ONE`, `AURELIA LAB`).
 */
export function FloatingTicket({
  position = [0, 0, 0],
  rotation = [0.1, -0.25, 0.08],
  scale = 1,
  tone = "paper",
}: FloatingTicketProps) {
  const groupRef = useRef<THREE.Group>(null);

  const ticketGeo = useMemo(() => {
    const w = 2.2;
    const h = 1.1;
    const r = 0.14;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, -r);
    shape.absarc(w / 2, 0, r, -Math.PI / 2, Math.PI / 2, true);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.lineTo(-w / 2, r);
    shape.absarc(-w / 2, 0, r, Math.PI / 2, -Math.PI / 2, true);
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
  }, []);

  useEffect(() => {
    return () => {
      ticketGeo.dispose();
    };
  }, [ticketGeo]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const { pointer } = spatialStore.getState();
    const targetY = rotation[1] + pointer.x * 0.35 + Math.sin(t * 0.9) * 0.12;
    const targetX = rotation[0] - pointer.y * 0.22 + Math.cos(t * 0.7) * 0.08;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.08;
  });

  const bodyColor =
    tone === "volt" ? HEX.volt : tone === "flash" ? HEX.flash : HEX.paper;
  const stripeColor = tone === "flash" ? HEX.volt : HEX.flash;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh geometry={ticketGeo} position={[0, 0, -0.03]}>
        <meshStandardMaterial color={bodyColor} roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Ink border frame */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.95, 0.85, 0.01]} />
        <meshBasicMaterial color={HEX.ink} wireframe />
      </mesh>

      {/* Stub tear line */}
      <mesh position={[0.52, 0, 0.045]}>
        <boxGeometry args={[0.02, 0.92, 0.015]} />
        <meshBasicMaterial color={HEX.ink} />
      </mesh>

      {/* Accent header band */}
      <mesh position={[-0.25, 0.26, 0.045]}>
        <boxGeometry args={[1.25, 0.18, 0.015]} />
        <meshBasicMaterial color={stripeColor} />
      </mesh>

      {/* Barcode bars */}
      {[-0.75, -0.62, -0.52, -0.38, -0.26, -0.12, 0.02, 0.16, 0.28].map(
        (x, i) => (
          <mesh key={i} position={[x, -0.26, 0.045]}>
            <boxGeometry args={[i % 2 === 0 ? 0.05 : 0.025, 0.22, 0.015]} />
            <meshBasicMaterial color={HEX.ink} />
          </mesh>
        )
      )}
    </group>
  );
}
