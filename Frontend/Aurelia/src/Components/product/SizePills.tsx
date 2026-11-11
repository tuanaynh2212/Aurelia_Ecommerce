import { cn } from "../../utils/cn";
import { sizeTileClass } from "../UI/primitives/recipes";

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
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {sizes.map((size) => {
        const isSelected = selected === size;
        const isDisabled = disabledSizes.includes(size);

        return (
          <button
            key={size}
            type="button"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-pressed={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(size);
            }}
            className={sizeTileClass(isSelected, isDisabled)}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

export default SizePills;
