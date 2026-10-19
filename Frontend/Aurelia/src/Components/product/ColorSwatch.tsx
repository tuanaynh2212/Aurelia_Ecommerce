import * as React from "react";
import { cn } from "../../utils/cn";
import { Check } from "lucide-react";

export interface ColorSwatchProps {
  colors: string[];
  selected?: string;
  onSelect?: (color: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap: Record<string, string> = {
  black: "#1F1F1F",
  white: "#FFFFFF",
  cream: "#F6F4EE",
  beige: "#EDE9E0",
  brown: "#685044",
  navy: "#1B2A38",
  blue: "#3E5C76",
  green: "#4A5D4E",
  sage: "#7D8C7B",
  pink: "#D9A094",
  rose: "#C2847A",
  red: "#A63A24",
  gray: "#8C887F",
  grey: "#8C887F",
  denim: "#2F4858",
  charcoal: "#262422",
};

function resolveColor(c: string): string {
  const lower = c.toLowerCase().trim();
  if (colorMap[lower]) return colorMap[lower];
  if (lower.startsWith("#") || lower.startsWith("rgb")) return lower;
  return "#D6D0C2";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
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
    <div className={cn("flex items-center gap-1.5 flex-wrap", className)}>
      {colors.map((color) => {
        const bg = resolveColor(color);
        const isSelected = selected === color;
        const isWhite = bg.toLowerCase() === "#ffffff" || bg.toLowerCase() === "#f6f4ee";

        return (
          <button
            key={color}
            type="button"
            title={color}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(color);
            }}
            className={cn(
              sizeClasses[size],
              "rounded-none transition-colors duration-150 relative flex items-center justify-center cursor-pointer",
              "border border-[var(--color-rule)]",
              isSelected
                ? "ring-1 ring-[var(--color-ink)] ring-offset-1 border-[var(--color-ink)]"
                : "hover:border-[var(--color-ink)]"
            )}
            style={{ backgroundColor: bg }}
          >
            {isSelected && (
              <Check
                size={size === "sm" ? 9 : 11}
                className={isWhite ? "text-[var(--color-ink)]" : "text-white"}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ColorSwatch;
