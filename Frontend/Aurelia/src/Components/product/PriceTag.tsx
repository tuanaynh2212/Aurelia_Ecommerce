import { cn } from "../../utils/cn";
import { formatVND } from "../../utils/formatters";

export interface PriceTagProps {
  price: number;
  originalPrice?: number;
  discountValue?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: {
    price: "text-xs sm:text-sm font-extrabold",
    original: "text-[11px] line-through text-ink-muted",
    badge: "text-[9px] px-1 py-0.5",
  },
  md: {
    price: "text-base sm:text-lg font-extrabold",
    original: "text-xs line-through text-ink-muted",
    badge: "text-[10px] px-1.5 py-0.5",
  },
  lg: {
    price: "text-xl sm:text-2xl font-black",
    original: "text-xs sm:text-sm line-through text-ink-muted",
    badge: "text-[11px] px-2 py-0.5",
  },
  xl: {
    price: "text-2xl sm:text-4xl font-black",
    original: "text-sm sm:text-base line-through text-ink-muted",
    badge: "text-xs px-2.5 py-1",
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
  const hasDiscount =
    (discountValue && discountValue > 0) ||
    (originalPrice && originalPrice > price);
  const strikePrice =
    originalPrice ||
    (discountValue ? Math.round(price / (1 - discountValue / 100)) : undefined);

  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-2 flex-wrap font-mono tabular",
        className
      )}
    >
      <span className={cn(currentSize.price, "text-ink")}>
        {formatVND(price)}
      </span>
      {hasDiscount && strikePrice && (
        <span className={cn(currentSize.original)}>{formatVND(strikePrice)}</span>
      )}
      {discountValue && discountValue > 0 ? (
        <span
          className={cn(
            currentSize.badge,
            "border-2 border-ink bg-volt text-ink mono-label font-extrabold leading-none"
          )}
        >
          -{discountValue}%
        </span>
      ) : null}
    </div>
  );
}

export default PriceTag;
