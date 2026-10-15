import { useEffect, useState } from "react";

/**
 * Reactive media query hook.
 * Returns true while the query matches, false otherwise.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 767px)");
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    setMatches(mql.matches); // sync on mount in case SSR default differs
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Convenience shortcuts matching the design token breakpoints */
export const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
} as const;
