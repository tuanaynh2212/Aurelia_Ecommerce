import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { HEX } from "./palette";
import { HangingGarment } from "./HangingGarment";

export interface ClothesRackProps {
  images?: string[];
  position?: [number, number, number];
  rotation?: [number, number, number];
  railWidth?: number;
  count?: number;
}

/**
 * Overhead black steel kinetic rail (`TubeGeometry`) holding instanced hangers (`InstancedMesh`)
 * and cloth-simulated `HangingGarment` planes textured from existing product/banner images.
 */
export function ClothesRack({
  images = [],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  railWidth = 4.4,
  count = 4,
}: ClothesRackProps) {
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  const railGeo = useMemo(() => {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(-railWidth / 2, 1.15, 0),
      new THREE.Vector3(railWidth / 2, 1.15, 0)
    );
    return new THREE.TubeGeometry(curve, 16, 0.045, 12, false);
  }, [railWidth]);

  const hangerRingGeo = useMemo(
    () => new THREE.TorusGeometry(0.065, 0.014, 8, 16),
    []
  );
  const hangerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: HEX.ink,
        metalness: 0.75,
        roughness: 0.25,
      }),
    []
  );

  const slots = useMemo(() => {
    const total = Math.max(1, count);
    return Array.from({ length: total }, (_, i) => {
      const t = total === 1 ? 0.5 : i / (total - 1);
      const x = -railWidth * 0.38 + t * railWidth * 0.76;
      return {
        x,
        img: images[i % Math.max(1, images.length)],
      };
    });
  }, [count, railWidth, images]);

  useEffect(() => {
    if (!instancedRef.current) return;
    const dummy = new THREE.Object3D();
    slots.forEach((slot, idx) => {
      dummy.position.set(slot.x, 1.15, 0);
      dummy.rotation.set(0, Math.PI / 2, 0);
      dummy.updateMatrix();
      instancedRef.current?.setMatrixAt(idx, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [slots]);

  useEffect(() => {
    return () => {
      railGeo.dispose();
      hangerRingGeo.dispose();
      hangerMat.dispose();
    };
  }, [railGeo, hangerRingGeo, hangerMat]);

  return (
    <group position={position} rotation={rotation}>
      {/* Horizontal steel rail */}
      <mesh geometry={railGeo} material={hangerMat} />

      {/* Vertical uprights */}
      <mesh position={[-railWidth / 2, -0.35, 0]} material={hangerMat}>
        <cylinderGeometry args={[0.04, 0.04, 3.0, 12]} />
      </mesh>
      <mesh position={[railWidth / 2, -0.35, 0]} material={hangerMat}>
        <cylinderGeometry args={[0.04, 0.04, 3.0, 12]} />
      </mesh>

      {/* Instanced hanger rings along rail */}
      <instancedMesh
        ref={instancedRef}
        args={[hangerRingGeo, hangerMat, slots.length]}
      />

      {/* Hanging garments */}
      {slots.map((slot, idx) => (
        <HangingGarment
          key={idx}
          index={idx}
          imageUrl={slot.img}
          position={[slot.x, 0.08, (idx % 2 === 0 ? 1 : -1) * 0.06]}
          rotation={[0, (idx % 2 === 0 ? 1 : -1) * 0.08, 0]}
          width={1.08}
          height={1.55}
          accentColor={idx % 2 === 0 ? HEX.volt : HEX.flash}
        />
      ))}
    </group>
  );
}
