import { cn } from "../../../utils/cn";

export interface SplitFlapProps {
  value: string | number;
  label?: string;
  sublabel?: string;
  tone?: "ink" | "volt" | "flash";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Mechanical split-flap character/number scoreboard display for Shop & Admin KPIs.
 * Zero WebGL overhead; crisp tabular numerals with horizontal split rule.
 */
export function SplitFlap({
  value,
  label,
  sublabel,
  tone = "ink",
  size = "md",
  className,
}: SplitFlapProps) {
  const str = String(value ?? "0");
  const chars = str.split("");

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      {label && (
        <span className="mono-label text-[11px] font-bold text-ink-muted">{label}</span>
      )}
      <div
        className="inline-flex flex-wrap items-center gap-1"
        aria-label={`${label ? `${label}: ` : ""}${str}`}
      >
        {chars.map((ch, idx) => {
          const isSeparator = ch === "," || ch === "." || ch === " " || ch === ":" || ch === "/";
          return (
            <span
              key={`${idx}-${ch}`}
              aria-hidden="true"
              className={cn(
                "relative inline-flex items-center justify-center font-mono font-extrabold tabular select-none rounded-[2px] border-2 border-ink",
                size === "sm" && (isSeparator ? "h-8 w-4 text-sm" : "h-8 min-w-[26px] px-1 text-base"),
                size === "md" && (isSeparator ? "h-10 w-5 text-base" : "h-10 min-w-[32px] px-1.5 text-xl"),
                size === "lg" && (isSeparator ? "h-12 w-6 text-lg" : "h-12 min-w-[38px] px-2 text-2xl"),
                tone === "ink" && "bg-ink text-paper shadow-hard-sm",
                tone === "volt" && "bg-volt text-ink shadow-hard-sm",
                tone === "flash" && "bg-flash text-paper shadow-hard-sm"
              )}
            >
              <span className="digit-roll">{ch}</span>
              {/* Mechanical horizontal split line */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2",
                  tone === "volt" ? "bg-ink/30" : "bg-paper/25"
                )}
              />
            </span>
          );
        })}
      </div>
      {sublabel && <span className="text-xs font-medium text-ink-muted">{sublabel}</span>}
    </div>
  );
}
