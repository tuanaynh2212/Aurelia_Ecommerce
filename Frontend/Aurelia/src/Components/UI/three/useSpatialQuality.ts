import { useEffect, useState } from "react";
import { spatialStore, type SpatialQuality } from "./SpatialStore";

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
}

function detectWebGL(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

function computeQuality(): SpatialQuality {
  if (typeof window === "undefined") return "fallback-2d";
  if (!detectWebGL()) return "fallback-2d";

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const nav = navigator as NavigatorWithHints;
  const saveData = Boolean(nav.connection?.saveData);
  if (saveData) return "fallback-2d";
  if (reducedMotion) return "low";

  const memory = nav.deviceMemory ?? 8;
  const isMobile = window.innerWidth < 768;

  if (memory < 4) return isMobile ? "fallback-2d" : "low";
  if (isMobile) return "medium";
  return "high";
}

export function useSpatialQuality(): {
  quality: SpatialQuality;
  isFallback2D: boolean;
} {
  const [quality, setQuality] = useState<SpatialQuality>(() => computeQuality());

  useEffect(() => {
    const update = () => {
      const next = computeQuality();
      setQuality(next);
      spatialStore.setQuality(next);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    quality,
    isFallback2D: quality === "fallback-2d",
  };
}
