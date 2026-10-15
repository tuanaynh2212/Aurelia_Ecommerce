import * as React from "react";
import { cn } from "../../lib/cn";
import { formatVND } from "../../lib/formatters";

export interface PriceTagProps {
  price: number;
  originalPrice?: number;
  discountValue?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: {
    price: "text-xs sm:text-sm font-semibold",
    original: "text-[11px] line-through text-[var(--color-ink-muted)]",
    badge: "text-[9px] px-1 py-0.2",
  },
  md: {
    price: "text-sm sm:text-base font-bold",
    original: "text-xs line-through text-[var(--color-ink-muted)]",
    badge: "text-[10px] px-1.5 py-0.5",
  },
  lg: {
    price: "text-lg sm:text-xl font-bold",
    original: "text-xs sm:text-sm line-through text-[var(--color-ink-muted)]",
    badge: "text-[11px] px-1.5 py-0.5",
  },
  xl: {
    price: "text-2xl sm:text-3xl font-extrabold",
    original: "text-sm sm:text-base line-through text-[var(--color-ink-muted)]",
    badge: "text-xs px-2 py-0.5",
  },
};

export function PriceTag({
  price,
  originalPrice,
  discountValue,
  size = "md",
  className,
}: PriceTagProps) {
  const currentSize = sizeClasses[size];
  const hasDiscount = (discountValue && discountValue > 0) || (originalPrice && originalPrice > price);
  const strikePrice = originalPrice || (discountValue ? Math.round(price / (1 - discountValue / 100)) : undefined);

  return (
    <div className={cn("inline-flex items-baseline gap-2 flex-wrap tabular-nums", className)}>
      <span className={cn(currentSize.price, "text-[var(--color-ink)] font-heading tracking-tight")}>
        {formatVND(price)}
      </span>
      {hasDiscount && strikePrice && (
        <span className={cn(currentSize.original, "font-body")}>
          {formatVND(strikePrice)}
        </span>
      )}
      {discountValue && discountValue > 0 && (
        <span
          className={cn(
            currentSize.badge,
            "bg-[var(--color-accent)] text-white font-mono font-bold rounded-none uppercase leading-none"
          )}
        >
          -{discountValue}%
        </span>
      )}
    </div>
  );
}

export default PriceTag;
