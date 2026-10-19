import { useGLTF } from "@react-three/drei";

export interface ModelLoaderProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
}

export function ModelLoader({
  url,
  scale = 1,
  position = [0, 0, 0],
}: ModelLoaderProps) {
  const gltf = useGLTF(url);

  return (
    <primitive
      object={gltf.scene}
      scale={scale}
      position={position}
    />
  );
}

export default ModelLoader;
