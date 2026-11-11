import { Star } from "lucide-react";
import { cn } from "../../../utils/cn";

export interface SegmentMeterProps {
  /** 0..1 */
  value: number;
  segments?: number;
  label?: string;
  tone?: "volt" | "ink" | "flash" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TONE: Record<NonNullable<SegmentMeterProps["tone"]>, string> = {
  volt: "bg-volt",
  ink: "bg-ink",
  flash: "bg-flash",
  success: "bg-success",
};

const HEIGHT: Record<NonNullable<SegmentMeterProps["size"]>, string> = {
  sm: "h-2.5",
  md: "h-4",
  lg: "h-6",
};

/** Segmented hardware level meter (10 segments for shipping/stock, 20 for body metrics). */
export function SegmentMeter({
  value,
  segments = 10,
  label,
  tone = "volt",
  size = "md",
  className,
}: SegmentMeterProps) {
  const clamped = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
  const lit = Math.round(clamped * segments);
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      className={cn("flex w-full gap-[3px]", className)}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "flex-1 border-2 border-ink rounded-[1px]",
            HEIGHT[size],
            i < lit ? TONE[tone] : "bg-paper"
          )}
        />
      ))}
    </div>
  );
}

export interface RatingStarsProps {
  value: number;
  max?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

/** Solid ink rating stars with tabular value. */
export function RatingStars({ value, max = 5, size = 16, className, showValue = false }: RatingStarsProps) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(max, value)) : 0;
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`${safe.toFixed(1)} / ${max}`}
      role="img"
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.max(0, Math.min(1, safe - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
            <Star size={size} className="absolute inset-0 text-ink" strokeWidth={2} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-ink" fill="currentColor" strokeWidth={2} />
            </span>
          </span>
        );
      })}
      {showValue && <span className="ml-1 font-mono text-sm font-bold tabular">{safe.toFixed(1)}</span>}
    </span>
  );
}

export interface EqualizerProps {
  bars?: number;
  className?: string;
  label?: string;
}

/** Equalizer loader used for distance/fee calculations and processing states. */
export function Equalizer({ bars = 5, className, label = "Đang xử lý" }: EqualizerProps) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex h-5 items-end gap-[3px]", className)}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="block h-full w-1.5 origin-bottom bg-ink animate-eq"
          style={{ animationDelay: `${i * 110}ms` }}
        />
      ))}
    </span>
  );
}

