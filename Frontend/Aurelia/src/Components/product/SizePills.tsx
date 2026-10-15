import * as React from "react";
import { cn } from "../../lib/cn";

export interface SizePillsProps {
  sizes: string[];
  selected?: string;
  onSelect?: (size: string) => void;
  disabledSizes?: string[];
  className?: string;
}

export function SizePills({
  sizes,
  selected,
  onSelect,
  disabledSizes = [],
  className,
}: SizePillsProps) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {sizes.map((size) => {
        const isSelected = selected === size;
        const isDisabled = disabledSizes.includes(size);

        return (
          <button
            key={size}
            type="button"
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(size);
            }}
            className={cn(
              "min-w-[40px] h-8 px-3 text-xs font-mono font-medium rounded-none border transition-colors duration-150 flex items-center justify-center cursor-pointer",
              isSelected
                ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold"
                : "bg-[var(--color-bg)] text-[var(--color-ink)] border-[var(--color-rule)] hover:border-[var(--color-ink)]",
              isDisabled && "opacity-30 line-through cursor-not-allowed bg-[var(--color-surface)] border-[var(--color-rule)]"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

export default SizePills;
