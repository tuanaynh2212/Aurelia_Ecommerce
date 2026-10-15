import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/cn";

export interface RatingProps {
  value: number; // 0–5
  max?: number;
  count?: number; // review count
  size?: number | "xs" | "sm" | "md" | "lg";
  showValue?: boolean; // display numeric rating e.g. 4.8
  className?: string;
}

const sizeMap: Record<string, number> = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
};

/**
 * Star rating display (read-only) for Trade Ledger design system.
 * Accessible: uses aria-label describing rating out of max.
 */
export function Rating({
  value = 5,
  max = 5,
  count,
  size = "sm",
  showValue = false,
  className,
}: RatingProps) {
  const numericSize =
    typeof size === "number" ? size : sizeMap[size] || 13;

  const numericValue = Number(value) || 0;
  const label = `${numericValue} / ${max} sao${
    count != null ? `, ${count} đánh giá` : ""
  }`;

  return (
    <span
      aria-label={label}
      role="img"
      className={cn("inline-flex items-center gap-1.5 flex-shrink-0", className)}
    >
      <span className="inline-flex items-center gap-0.5 flex-shrink-0" aria-hidden="true">
        {Array.from({ length: max }).map((_, i) => {
          const isFilled = i < Math.floor(numericValue);
          const isHalf = !isFilled && i < numericValue && numericValue - i >= 0.3;

          return (
            <Star
              key={i}
              size={numericSize}
              style={{
                width: `${numericSize}px`,
                height: `${numericSize}px`,
                maxWidth: `${numericSize}px`,
                maxHeight: `${numericSize}px`,
              }}
              className={cn(
                "flex-shrink-0 transition-colors",
                isFilled || isHalf
                  ? "text-[var(--color-accent)] fill-[var(--color-accent)]"
                  : "text-[var(--color-rule)] fill-transparent stroke-[var(--color-rule)]"
              )}
            />
          );
        })}
      </span>

      {showValue && (
        <span className="font-mono text-xs font-bold text-[var(--color-ink)] tabular-nums flex-shrink-0">
          {numericValue.toFixed(1)}
        </span>
      )}

      {count != null && (
        <span className="font-mono text-[11px] text-[var(--color-ink-muted)] tabular-nums flex-shrink-0">
          ({count.toLocaleString()})
        </span>
      )}
    </span>
  );
}

export default Rating;
