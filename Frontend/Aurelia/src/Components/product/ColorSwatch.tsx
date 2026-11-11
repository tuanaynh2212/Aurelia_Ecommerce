import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import { swatchHex } from "../UI/three/palette";

export interface ColorSwatchProps {
  colors: string[];
  selected?: string;
  onSelect?: (color: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
};

export function ColorSwatch({
  colors,
  selected,
  onSelect,
  size = "md",
  className,
}: ColorSwatchProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {colors.map((color) => {
        const bg = swatchHex(color);
        const isSelected = selected === color;

        return (
          <button
            key={color}
            type="button"
            title={color}
            aria-label={`Màu ${color}`}
            aria-pressed={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(color);
            }}
            className={cn(
              sizeClasses[size],
              "hit-area-expand relative flex items-center justify-center rounded-full border-2 border-ink cursor-pointer transition-transform",
              isSelected
                ? "ring-2 ring-volt ring-offset-2 ring-offset-paper scale-110"
                : "hover:scale-105"
            )}
            style={{ backgroundColor: bg }}
          >
            {isSelected && (
              <Check
                size={size === "sm" ? 10 : 14}
                strokeWidth={3}
                className="text-ink drop-shadow-[0_1px_0_var(--color-paper)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ColorSwatch;
