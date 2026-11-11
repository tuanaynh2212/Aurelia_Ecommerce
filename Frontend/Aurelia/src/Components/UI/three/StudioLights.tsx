import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group } from "three";
import { CSS, HEX } from "./palette";

export interface StudioLightsProps {
  floorY?: number;
  withFloor?: boolean;
  animatedCones?: boolean;
}

/**
 * Procedural studio lighting: ambient + key/rim directional lights,
 * sweeping volumetric spotlight cones, and ContactShadows on the HEX.bone floor.
 * Zero external HDR files.
 */
export function StudioLights({
  floorY = -2.2,
  withFloor = true,
  animatedCones = true,
}: StudioLightsProps) {
  const coneGroupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!animatedCones || !coneGroupRef.current) return;
    const t = clock.getElapsedTime();
    coneGroupRef.current.rotation.z = Math.sin(t * 0.45) * 0.09;
  });

  return (
    <group>
      <ambientLight intensity={1.15} color={HEX.paper} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.6}
        color={HEX.paper}
      />
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.7}
        color={HEX.bone}
      />
      <pointLight position={[0, 3.5, 2]} intensity={0.8} color={HEX.flash} distance={12} />

      {/* Sweeping overhead spotlight cones */}
      <group ref={coneGroupRef} position={[0, 4.2, -1]}>
        <mesh position={[-2.4, -2.1, 0]} rotation={[0, 0, 0.18]}>
          <coneGeometry args={[1.6, 5.2, 24, 1, true]} />
          <meshBasicMaterial
            color={HEX.paper}
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[2.4, -2.1, 0]} rotation={[0, 0, -0.18]}>
          <coneGeometry args={[1.6, 5.2, 24, 1, true]} />
          <meshBasicMaterial
            color={HEX.volt}
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>
      </group>

      {withFloor && (
        <>
          <mesh
            position={[0, floorY - 0.02, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[28, 28]} />
            <meshStandardMaterial color={HEX.bone} roughness={0.92} metalness={0.02} />
          </mesh>
          <ContactShadows
            position={[0, floorY, 0]}
            opacity={0.28}
            scale={16}
            blur={2.1}
            far={5}
            color={CSS.ink}
          />
        </>
      )}
    </group>
  );
}
