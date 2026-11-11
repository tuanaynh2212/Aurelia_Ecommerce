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
  sm: "w-10 h-10",
  md: "w-10 h-10",
  lg: "w-11 h-11",
};

const iconSizes = {
  sm: 16,
  md: 18,
  lg: 20,
};

export function WishlistButton({
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
      aria-pressed={active}
      onClick={handleClick}
      className={cn(
        sizeClasses[size],
        "hit-area-expand press-collapse flex items-center justify-center border-2 border-ink shadow-hard-sm cursor-pointer rounded-[2px]",
        active
          ? "bg-flash text-paper"
          : "bg-paper text-ink hover:bg-volt",
        className
      )}
    >
      <Heart
        size={iconSizes[size]}
        strokeWidth={2.5}
        className={cn(active ? "fill-current" : "")}
      />
    </button>
  );
}

export default WishlistButton;
