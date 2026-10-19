import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "../../utils/cn";

export interface WishlistButtonProps {
  productId?: string | number;
  initialActive?: boolean;
  onToggle?: (active: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-7 h-7",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const iconSizes = {
  sm: 13,
  md: 15,
  lg: 18,
};

export function WishlistButton({
  productId,
  initialActive = false,
  onToggle,
  className,
  size = "md",
}: WishlistButtonProps) {
  const [active, setActive] = React.useState(initialActive);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !active;
    setActive(next);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleClick}
      className={cn(
        sizeClasses[size],
        "rounded-none bg-[var(--color-bg)]/90 border border-[var(--color-rule)] hover:border-[var(--color-ink)] flex items-center justify-center transition-colors duration-150 cursor-pointer",
        active
          ? "text-[var(--color-accent)] border-[var(--color-accent)]"
          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
        className
      )}
    >
      <Heart
        size={iconSizes[size]}
        className={cn("transition-colors duration-150", active ? "fill-current" : "")}
      />
    </button>
  );
}

export default WishlistButton;
