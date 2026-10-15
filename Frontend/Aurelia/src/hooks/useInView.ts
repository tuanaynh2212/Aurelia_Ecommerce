import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Root margin in px — use positive values to start loading before the element enters view */
  rootMargin?: string;
  /** Only trigger once (recommended for entrance animations) */
  once?: boolean;
  /** Fraction of element visible before triggering (0–1) */
  threshold?: number;
}

/**
 * Returns a [ref, isInView] pair.
 * Attach `ref` to a DOM element; `isInView` becomes true once the element
 * intersects the viewport (with optional rootMargin pre-loading buffer).
 *
 * @example
 * const [ref, visible] = useInView({ rootMargin: "200px", once: true });
 * return <div ref={ref}>{visible ? <HeavyComponent /> : <Skeleton />}</div>;
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T>, boolean] {
  const { rootMargin = "0px", once = false, threshold = 0 } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true); // degrade gracefully
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once, threshold]);

  return [ref, isInView];
}
