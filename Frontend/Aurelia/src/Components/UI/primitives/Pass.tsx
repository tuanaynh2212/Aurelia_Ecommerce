import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";
import { TIER_CSS, TIER_INK, toTierKey, type TierKey } from "../three/palette";

export interface PassProps {
  tier: TierKey | string;
  title?: ReactNode;
  holderName?: ReactNode;
  pointsLabel?: ReactNode;
  code?: string;
  active?: boolean;
  onSelect?: () => void;
  children?: ReactNode;
  className?: string;
}

const TIER_LABEL: Record<TierKey, string> = {
  bronze: "BRONZE PASS",
  silver: "SILVER PASS",
  gold: "GOLD PASS",
  diamond: "DIAMOND PASS",
  royal: "ROYAL MONOLITH",
};

/**
 * 2D / CSS-3D acrylic backstage lanyard pass for loyalty tiers (Bronze -> Royal).
 * Rounded 6px physical pass corner radius (`--radius-pass`), lanyard slot at top.
 */
export function Pass({
  tier,
  title,
  holderName,
  pointsLabel,
  code = "VIP ACCESS",
  active = false,
  onSelect,
  children,
  className,
}: PassProps) {
  const key = toTierKey(tier);
  const bg = TIER_CSS[key];
  const fg = TIER_INK[key];
  const isRoyal = key === "royal";

  const content = (
    <div
      className={cn(
        "tag-shell relative flex flex-col justify-between rounded-[6px] border-[3px] border-ink p-4 shadow-hard-lg transition-transform",
        isRoyal && "outline outline-2 outline-flash -outline-offset-4",
        active && "ring-4 ring-volt",
        className
      )}
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* Lanyard slot + clip */}
      <div className="mb-3 flex flex-col items-center">
        <div
          aria-hidden="true"
          className="h-3 w-14 rounded-full border-2 border-ink bg-bone shadow-inner"
        />
        <div className="mt-2 flex w-full items-center justify-between mono-label text-[10px] font-bold">
          <span>[AURELIA LAB]</span>
          <span
            className={cn(
              "px-1.5 py-0.5 border border-current",
              isRoyal && "bg-volt text-ink border-ink"
            )}
          >
            {code}
          </span>
        </div>
      </div>

      {/* Tier headline */}
      <div className="my-2">
        <p className="mono-label text-[10px] opacity-80">{TIER_LABEL[key]}</p>
        <h3 className="font-display text-2xl font-black uppercase tracking-tight diacritic-safe">
          {title ?? key.toUpperCase()}
        </h3>
        {holderName && (
          <p className="mt-1 truncate font-sans text-sm font-bold">{holderName}</p>
        )}
        {pointsLabel && (
          <p
            className={cn(
              "mt-2 inline-block border-2 border-ink px-2 py-0.5 font-mono text-xs font-extrabold tabular",
              isRoyal ? "bg-volt text-ink" : "bg-paper text-ink"
            )}
          >
            {pointsLabel}
          </p>
        )}
      </div>

      {children && <div className="mt-2 border-t-2 border-dashed border-current/40 pt-2 text-xs">{children}</div>}

      {/* Barcode strip */}
      <div className="mt-4 rounded-[2px] border-2 border-ink bg-paper p-2 text-ink">
        <div className="barcode h-5 w-full" aria-hidden="true" />
        <div className="mt-1 flex justify-between mono-label text-[9px] font-bold text-ink-muted">
          <span>PASS // {key.toUpperCase()}</span>
          <span>ADMIT ONE</span>
        </div>
      </div>
    </div>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className="block w-full text-left cursor-pointer focus-visible:outline-offset-4"
      >
        {content}
      </button>
    );
  }
  return content;
}
