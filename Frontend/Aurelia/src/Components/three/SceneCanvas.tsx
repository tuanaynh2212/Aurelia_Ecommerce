import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import { SceneFallback } from "./SceneFallback";

function checkCanRender3D(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
  enableOrbit?: boolean;
  fallbackImage?: string;
  fallbackLabel?: string;
  cameraPosition?: [number, number, number];
}

export function SceneCanvas({
  children,
  className = "",
  enableOrbit = true,
  fallbackImage,
  fallbackLabel = "3D Interactive Showcase",
  cameraPosition = [0, 0, 5],
}: SceneCanvasProps) {
  const canRender = checkCanRender3D();
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (!canRender || prefersReduced) {
    return (
      <SceneFallback
        className={className}
        imageSrc={fallbackImage}
        label={fallbackLabel}
      />
    );
  }

  const fallbackView = (
    <SceneFallback
      className={className}
      imageSrc={fallbackImage}
      label={fallbackLabel}
    />
  );

  return (
    <WebGLErrorBoundary fallback={fallbackView}>
      <div className={`relative w-full h-full min-h-[300px] ${className}`}>
        <Canvas
          camera={{ position: cameraPosition, fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#FCE7D2" />
          <pointLight position={[0, 4, 3]} intensity={0.6} color="#FFE6DE" />

          <Suspense fallback={null}>
            {children}
            {enableOrbit && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 2.5}
                rotateSpeed={0.6}
              />
            )}
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}

export default SceneCanvas;
