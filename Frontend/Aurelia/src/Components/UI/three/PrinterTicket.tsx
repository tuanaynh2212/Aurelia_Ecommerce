import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { HEX } from "./palette";

export type PrinterStatus = "processing" | "success" | "failure";

export interface PrinterTicketProps {
  status: PrinterStatus;
}

/**
 * Mechanical thermal slot that ejects a 3D ticket during `processing`,
 * slams a `HEX.success` / `HEX.flash` stamp on `success`, or tears the ticket diagonally in two on `failure`.
 */
export function PrinterTicket({ status }: PrinterTicketProps) {
  const ticketGroupRef = useRef<Group>(null);
  const leftHalfRef = useRef<Group>(null);
  const rightHalfRef = useRef<Group>(null);
  const stampRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ticketGroupRef.current) {
      if (status === "processing") {
        // Eject rhythmically
        const eject = -0.2 + ((t * 0.45) % 0.85);
        ticketGroupRef.current.position.y = -eject;
        ticketGroupRef.current.position.x = Math.sin(t * 28) * 0.012;
      } else {
        ticketGroupRef.current.position.y +=
          (-0.75 - ticketGroupRef.current.position.y) * 0.1;
        ticketGroupRef.current.position.x = 0;
      }
    }

    if (leftHalfRef.current && rightHalfRef.current) {
      if (status === "failure") {
        leftHalfRef.current.position.x += (-0.28 - leftHalfRef.current.position.x) * 0.1;
        leftHalfRef.current.rotation.z += (0.18 - leftHalfRef.current.rotation.z) * 0.1;
        rightHalfRef.current.position.x += (0.28 - rightHalfRef.current.position.x) * 0.1;
        rightHalfRef.current.rotation.z += (-0.18 - rightHalfRef.current.rotation.z) * 0.1;
      } else {
        leftHalfRef.current.position.x = 0;
        leftHalfRef.current.rotation.z = 0;
        rightHalfRef.current.position.x = 0;
        rightHalfRef.current.rotation.z = 0;
      }
    }

    if (stampRef.current) {
      const targetZ = status === "success" ? 0.12 : 1.4;
      stampRef.current.position.z += (targetZ - stampRef.current.position.z) * 0.18;
    }
  });

  return (
    <group position={[0, 0.35, 0]}>
      {/* Mechanical thermal printer head housing */}
      <RoundedBox args={[3.2, 0.9, 1.1]} radius={0.04} smoothness={2} position={[0, 1.05, 0]}>
        <meshStandardMaterial color={HEX.ink} roughness={0.35} metalness={0.4} />
      </RoundedBox>
      {/* Status LED bar */}
      <mesh position={[0, 1.25, 0.56]}>
        <boxGeometry args={[2.6, 0.12, 0.02]} />
        <meshBasicMaterial
          color={
            status === "success"
              ? HEX.success
              : status === "failure"
              ? HEX.danger
              : HEX.volt
          }
        />
      </mesh>
      {/* Ejection slot lip */}
      <mesh position={[0, 0.62, 0.42]}>
        <boxGeometry args={[2.4, 0.08, 0.35]} />
        <meshStandardMaterial color={HEX.flash} roughness={0.4} />
      </mesh>

      {/* Ejected thermal ticket */}
      <group ref={ticketGroupRef} position={[0, -0.4, 0.25]}>
        <group ref={leftHalfRef}>
          <RoundedBox args={[1.95, 2.25, 0.06]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color={HEX.paper} roughness={0.5} />
          </RoundedBox>
          {/* Ink border & receipt lines */}
          <mesh position={[0, 0.72, 0.04]}>
            <boxGeometry args={[1.55, 0.16, 0.01]} />
            <meshBasicMaterial color={HEX.ink} />
          </mesh>
          <mesh position={[0, 0.35, 0.04]}>
            <boxGeometry args={[1.55, 0.05, 0.01]} />
            <meshBasicMaterial color={HEX.ink} />
          </mesh>
          <mesh position={[0, 0.12, 0.04]}>
            <boxGeometry args={[1.55, 0.05, 0.01]} />
            <meshBasicMaterial color={HEX.ink} />
          </mesh>
        </group>

        <group ref={rightHalfRef}>
          {/* Lower barcode block */}
          <mesh position={[0, -0.65, 0.04]}>
            <boxGeometry args={[1.55, 0.28, 0.015]} />
            <meshBasicMaterial color={HEX.ink} />
          </mesh>
        </group>

        {/* Official Stamp on success / failure */}
        <mesh
          ref={stampRef}
          position={[0, -0.15, 1.4]}
          rotation={[0, 0, -0.12]}
        >
          <boxGeometry args={[1.35, 0.48, 0.06]} />
          <meshStandardMaterial
            color={status === "failure" ? HEX.danger : HEX.success}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}
