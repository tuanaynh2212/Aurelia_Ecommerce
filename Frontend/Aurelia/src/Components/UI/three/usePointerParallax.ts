import { useEffect, useRef } from "react";
import { spatialStore } from "./SpatialStore";

/**
 * Passive pointer listener updating normalized `-1..1` coordinates in a ref
 * and in `spatialStore`. Does not attach to the WebGL canvas so DOM clicks are never blocked.
 */
export function usePointerParallax() {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -(e.clientY / Math.max(1, window.innerHeight)) * 2 + 1;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
      spatialStore.setPointer(nx, ny);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointerRef;
}
