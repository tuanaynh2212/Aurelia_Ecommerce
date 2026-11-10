import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

export function FloatingBlobs() {
  const meshRef1 = useRef<THREE.Mesh>(null!);
  const meshRef2 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef1.current) {
      meshRef1.current.rotation.x = t * 0.15;
      meshRef1.current.rotation.y = t * 0.2;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = -t * 0.1;
      meshRef2.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh ref={meshRef1} position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial
            color="#E89B85"
            roughness={0.25}
            metalness={0.1}
            distort={0.45}
            speed={2.5}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
        <mesh ref={meshRef2} position={[1.4, -0.6, -0.8]} scale={0.65}>
          <torusGeometry args={[1.2, 0.4, 32, 64]} />
          <MeshDistortMaterial
            color="#84A98C"
            roughness={0.3}
            metalness={0.15}
            distort={0.3}
            speed={2}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh position={[-1.6, 1, -0.5]} scale={0.4}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial
            color="#EED5C2"
            roughness={0.2}
            metalness={0.2}
            distort={0.2}
            speed={3}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default FloatingBlobs;
