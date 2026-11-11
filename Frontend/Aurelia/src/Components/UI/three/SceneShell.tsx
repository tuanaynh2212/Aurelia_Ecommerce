import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { cn } from "../../../utils/cn";
import { useSpatialQuality } from "./useSpatialQuality";
import { useScrollProgress } from "./useScrollProgress";
import { usePointerParallax } from "./usePointerParallax";
import { spatialStore, useSpatialStore, type SpatialStation } from "./SpatialStore";
import { StudioLights } from "./StudioLights";
import { StageWordmark } from "./StageWordmark";
import { ClothesRack } from "./ClothesRack";
import { FloatingTicket } from "./FloatingTicket";
import { FloatingPass } from "./FloatingPass";

export interface SceneShellProps {
  station?: SpatialStation;
  images?: string[];
  children?: ReactNode;
  frameloop?: "always" | "demand" | "never";
  withDefaultStage?: boolean;
  cameraPosition?: [number, number, number];
  className?: string;
  fallbackTitle?: string;
}

function CameraRig({ station }: { station: SpatialStation }) {
  useFrame(({ camera }) => {
    const { scrollProgress, pointer } = spatialStore.getState();
    if (station === "HOME_HALL") {
      // Camera dollies from [0, 0.5, 6.5] to [0, -4.0, 4.0] across scroll
      const targetX = pointer.x * 0.35;
      const targetY = 0.5 - scrollProgress * 4.5 + pointer.y * 0.2;
      const targetZ = 6.5 - scrollProgress * 2.5;
      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.y += (targetY - camera.position.y) * 0.08;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.lookAt(0, camera.position.y - 0.15, -1.5);
    }
  });
  return null;
}

/**
 * Structured 2D Brutalist Fallback Composition rendered whenever `isFallback2D` is true
 * or while the WebGL chunk initializes (zero layout shift).
 */
export function Brutalist2DFallback({
  title = "AURELIA // KINETIC ATELIER MONOLITH",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "studio-grid-bg pointer-events-none relative h-full w-full overflow-hidden border-b-2 border-ink",
        className
      )}
    >
      {/* Architectural corner registration marks */}
      <div className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l-2 border-t-2 border-ink/45" />
      <div className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-ink/45" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b-2 border-l-2 border-ink/45" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 border-b-2 border-r-2 border-ink/45" />

      {/* Giant brutalist background monogram */}
      <div className="flex h-full w-full items-center justify-center px-6">
        <span className="text-outline select-none font-display text-[clamp(3.5rem,14vw,11rem)] font-black uppercase tracking-tighter opacity-25">
          {title}
        </span>
      </div>
    </div>
  );
}

/**
 * Lazy-ready R3F Canvas shell with `<PerformanceMonitor>`, `IntersectionObserver` auto-pause
 * when off-screen, `aria-hidden="true"`, `touch-action: pan-y`, and `pointer-events: none`
 * so DOM controls are never blocked.
 */
export function SceneShell({
  station: propStation,
  images = [],
  children,
  frameloop = "always",
  withDefaultStage = false,
  cameraPosition = [0, 0.5, 6.5],
  className,
  fallbackTitle,
}: SceneShellProps) {
  const storeStation = useSpatialStore((s) => s.station);
  const station = propStation ?? storeStation;
  const { isFallback2D } = useSpatialQuality();

  useScrollProgress();
  usePointerParallax();

  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

  useEffect(() => {
    if (propStation) {
      spatialStore.setStation(propStation);
    }
  }, [propStation]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.02 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (isFallback2D || station === "CONTROL_ROOM") {
    return <Brutalist2DFallback title={fallbackTitle} className={className} />;
  }

  const activeFrameloop = !inView
    ? "never"
    : station === "CASHIER_DESK"
    ? "demand"
    : frameloop;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{ touchAction: "pan-y" }}
      className={cn("pointer-events-none relative h-full w-full overflow-hidden", className)}
    >
      <Suspense fallback={<Brutalist2DFallback title={fallbackTitle} className="h-full w-full" />}>
        <Canvas
          dpr={dpr}
          frameloop={activeFrameloop}
          camera={{ position: cameraPosition, fov: 45 }}
          style={{ pointerEvents: "none", touchAction: "pan-y" }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr([1, 1])}
            onIncline={() => setDpr([1, 1.5])}
          />
          <StudioLights />
          <CameraRig station={station} />

          {withDefaultStage && (
            <>
              <StageWordmark position={[0, 0.65, -2.2]} />
              <ClothesRack
                images={images.slice(0, 4)}
                position={[-3.3, -0.35, -0.8]}
                rotation={[0, 0.28, 0]}
                railWidth={3.6}
                count={3}
              />
              <ClothesRack
                images={images.slice(2, 6)}
                position={[3.3, -0.35, -0.8]}
                rotation={[0, -0.28, 0]}
                railWidth={3.6}
                count={3}
              />
              <FloatingTicket
                position={[-2.4, 1.6, 0.8]}
                rotation={[0.15, 0.35, -0.12]}
                scale={0.72}
                tone="volt"
              />
              <FloatingPass
                tier="royal"
                position={[2.5, 1.35, 0.7]}
                rotation={[0.05, -0.35, 0.08]}
                scale={0.62}
              />
            </>
          )}

          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}

export default SceneShell;
