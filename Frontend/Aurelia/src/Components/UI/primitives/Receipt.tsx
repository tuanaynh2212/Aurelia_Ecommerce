import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";
import { SegmentMeter } from "./Meter";

export interface ReceiptRowProps {
  label: ReactNode;
  value: ReactNode;
  tone?: "default" | "accent" | "volt" | "muted" | "success";
  bold?: boolean;
  className?: string;
}

export function ReceiptRow({
  label,
  value,
  tone = "default",
  bold = false,
  className,
}: ReceiptRowProps) {
  return (
    <div
      className={cn(
        "dotted-leader py-1.5 text-sm",
        bold && "font-bold",
        tone === "muted" && "text-ink-muted",
        tone === "accent" && "text-flash font-bold",
        tone === "success" && "text-success font-bold",
        tone === "volt" && "bg-volt px-1.5 font-bold text-ink",
        className
      )}
    >
      <span className="shrink-0">{label}</span>
      <span className="leader-fill" aria-hidden="true" />
      <span className="shrink-0 font-mono tabular font-semibold">{value}</span>
    </div>
  );
}

export interface ReceiptProps {
  title?: ReactNode;
  code?: string;
  subtitle?: ReactNode;
  /** Optional 0..1 progress for 10-segment free-shipping meter */
  shippingProgress?: number;
  shippingLabel?: ReactNode;
  totalLabel?: ReactNode;
  totalValue?: ReactNode;
  /** Key that triggers the CSS-3D digit roll when total changes */
  totalKey?: string | number;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Thermal atelier receipt with header metadata, dotted-leader rows,
 * optional 10-segment free-shipping meter, tabular grand total with CSS-3D digit roll,
 * zig-zag torn bottom edge, and barcode footer.
 */
export function Receipt({
  title = "RECEIPT // AURELIA LAB",
  code = "[ATELIER-01]",
  subtitle,
  shippingProgress,
  shippingLabel,
  totalLabel,
  totalValue,
  totalKey,
  children,
  footer,
  className,
}: ReceiptProps) {
  return (
    <section
      className={cn(
        "relative border-2 border-ink bg-paper shadow-hard rounded-[2px] pb-3",
        className
      )}
    >
      {/* Header */}
      <header className="border-b-2 border-dashed border-ink px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <span className="mono-label text-[11px] font-bold text-ink-muted">{code}</span>
          <span className="inline-flex items-center gap-1.5 mono-label text-[10px] font-bold text-ink">
            <span className="h-2 w-2 rounded-full bg-flash animate-rec" aria-hidden="true" />
            THERMAL SLIP
          </span>
        </div>
        <h2 className="mt-1 font-display text-lg font-extrabold uppercase tracking-tight text-ink diacritic-safe">
          {title}
        </h2>
        {subtitle && <div className="mt-1 text-xs text-ink-muted">{subtitle}</div>}
      </header>

      {/* Free-shipping meter */}
      {typeof shippingProgress === "number" && (
        <div className="border-b-2 border-dashed border-ink bg-bone/60 px-5 py-3">
          {shippingLabel && (
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink">
              <span>{shippingLabel}</span>
              <span className="mono-label text-[11px] font-bold">
                {Math.min(100, Math.round(shippingProgress * 100))}%
              </span>
            </div>
          )}
          <SegmentMeter
            value={shippingProgress}
            segments={10}
            tone={shippingProgress >= 1 ? "success" : "volt"}
            size="sm"
            label="Tiến độ miễn phí vận chuyển"
          />
        </div>
      )}

      {/* Body rows */}
      <div className="px-5 py-4">{children}</div>

      {/* Grand total */}
      {totalValue !== undefined && (
        <div className="border-t-2 border-ink bg-bone px-5 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="mono-label text-xs font-extrabold text-ink">
              {totalLabel ?? "TỔNG CỘNG"}
            </span>
            <span
              key={totalKey ?? String(totalValue)}
              className="digit-roll font-mono text-2xl font-extrabold tabular text-ink"
            >
              {totalValue}
            </span>
          </div>
        </div>
      )}

      {/* Action / CTA slot */}
      {footer && <div className="px-5 pt-4 pb-2">{footer}</div>}

      {/* Barcode footer */}
      <div className="mt-3 border-t-2 border-dashed border-ink px-5 pt-3 pb-1">
        <div className="barcode w-full" aria-hidden="true" />
        <div className="mt-1 flex items-center justify-between mono-label text-[10px] text-ink-muted">
          <span>AURELIA // VERIFIED</span>
          <span>CALIBRATED</span>
        </div>
      </div>

      {/* Zig-zag bottom SVG edge */}
      <svg
        aria-hidden="true"
        viewBox="0 0 240 10"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[10px] left-0 h-[10px] w-full text-paper"
      >
        <polygon
          fill="currentColor"
          stroke="var(--color-ink)"
          strokeWidth="2"
          points="0,0 10,9 20,0 30,9 40,0 50,9 60,0 70,9 80,0 90,9 100,0 110,9 120,0 130,9 140,0 150,9 160,0 170,9 180,0 190,9 200,0 210,9 220,0 230,9 240,0"
        />
      </svg>
    </section>
  );
}
