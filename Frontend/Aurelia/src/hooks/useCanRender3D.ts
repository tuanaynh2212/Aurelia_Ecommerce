import { useMemo } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface CanRender3DOptions {
  /** Force disable regardless of other checks */
  disabled?: boolean;
}

/**
 * Returns true when 3D rendering is safe and appropriate for this device/session.
 *
 * Disables 3D when ANY of the following is true:
 *  - User prefers reduced motion
 *  - navigator.connection.saveData is enabled
 *  - Effective connection type is "2g" or "slow-2g"
 *  - Device memory is ≤ 2 GB (when available)
 *  - WebGL is not supported
 *  - caller passes disabled=true
 *
 * @example
 * const canRender3D = useCanRender3D();
 * return canRender3D ? <HeroScene /> : <SceneFallback />;
 */
export function useCanRender3D(options: CanRender3DOptions = {}): boolean {
  const prefersReduced = useReducedMotion();

  return useMemo(() => {
    if (options.disabled) return false;
    if (prefersReduced) return false;

    // Network quality checks (Network Information API — not universally available)
    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
      deviceMemory?: number;
    };

    if (nav.connection?.saveData) return false;
    const ect = nav.connection?.effectiveType;
    if (ect === "2g" || ect === "slow-2g") return false;

    // Device memory check (deviceMemory API — Chrome only)
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return false;

    // WebGL support check
    try {
      const canvas = document.createElement("canvas");
      const ctx =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!ctx) return false;
    } catch {
      return false;
    }

    return true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, options.disabled]);
}
