import { useEffect, useRef } from "react";
import { spatialStore } from "./SpatialStore";

/**
 * Passive native browser scroll listener updating both a mutable ref (`0..1`)
 * and the external `spatialStore`. Never hijacks native scroll.
 */
export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const next = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      progressRef.current = next;
      spatialStore.setScrollProgress(next);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progressRef;
}
