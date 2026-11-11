import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

export interface SectionTitleProps {
  index?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  count?: number | string;
  action?: ReactNode;
  size?: "xl" | "l" | "m";
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Mono index `[01]` eyebrow + Vietnamese-safe Display XL/L/M heading + optional outlined count.
 */
export function SectionTitle({
  index = "01",
  eyebrow,
  title,
  subtitle,
  count,
  action,
  size = "l",
  tone = "light",
  className,
}: SectionTitleProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b-2 pb-5 md:flex-row md:items-end md:justify-between",
        isDark ? "border-paper/35" : "border-ink",
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center border-2 border-ink bg-volt px-2 py-0.5 mono-label text-[11px] font-extrabold text-ink">
            [{index}]
          </span>
          {eyebrow && (
            <span
              className={cn(
                "mono-label text-[11px] font-bold",
                isDark ? "text-volt" : "text-ink-muted"
              )}
            >
              {eyebrow}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-3 overflow-hidden">
          <h2
            className={cn(
              "font-display-safe",
              isDark ? "text-paper" : "text-ink",
              size === "xl" && "display-xl",
              size === "l" && "display-l",
              size === "m" && "display-m"
            )}
          >
            {title}
          </h2>
          {count !== undefined && (
            <span
              className="text-outline font-display text-3xl md:text-5xl font-black tabular select-none"
              style={isDark ? { WebkitTextStroke: "2px var(--color-paper)" } : undefined}
              aria-label={`Số lượng ${count}`}
            >
              ({count})
            </span>
          )}
        </div>
        {subtitle && (
          <p
            className={cn(
              "mt-2 max-w-2xl text-sm md:text-base",
              isDark ? "text-fog" : "text-ink-muted"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
