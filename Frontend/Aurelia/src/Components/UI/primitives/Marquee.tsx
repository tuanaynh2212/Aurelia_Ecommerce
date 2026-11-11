import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

export interface MarqueeProps {
  items: ReactNode[];
  reverse?: boolean;
  tone?: "ink" | "volt" | "bone" | "flash";
  compact?: boolean;
  separator?: ReactNode;
  className?: string;
}

const TONE_STYLE: Record<NonNullable<MarqueeProps["tone"]>, string> = {
  ink: "bg-ink text-paper",
  volt: "bg-volt text-ink",
  bone: "bg-bone text-ink",
  flash: "bg-flash text-paper",
};

/**
 * Infinite kinetic ticker strip (40s linear, pauses on hover and prefers-reduced-motion).
 */
export function Marquee({
  items,
  reverse = false,
  tone = "ink",
  compact = false,
  separator = "///",
  className,
}: MarqueeProps) {
  const safeItems = items.length > 0 ? items : ["AURELIA ATELIER MONOLITH"];
  const repeated = [...safeItems, ...safeItems, ...safeItems, ...safeItems];

  return (
    <div
      data-pause-on-hover="true"
      className={cn(
        "marquee-host relative w-full overflow-hidden border-y-2 border-ink select-none",
        compact ? "h-8" : "h-11",
        TONE_STYLE[tone],
        className
      )}
      aria-label="Aurelia ticker"
    >
      <div
        className={cn(
          "marquee-track h-full items-center",
          reverse
            ? "marquee-animate-reverse animate-marquee-reverse"
            : "marquee-animate animate-marquee"
        )}
      >
        {repeated.map((item, idx) => (
          <span
            key={idx}
            className={cn(
              "inline-flex items-center gap-4 px-4 mono-label font-extrabold whitespace-nowrap",
              compact ? "text-[11px]" : "text-xs md:text-sm"
            )}
          >
            <span>{item}</span>
            <span
              aria-hidden="true"
              className={cn(
                "px-1.5 py-0.5 text-[10px]",
                tone === "ink" ? "text-volt" : "text-ink"
              )}
            >
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
