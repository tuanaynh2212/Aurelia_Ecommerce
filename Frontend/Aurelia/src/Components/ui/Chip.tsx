import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const chipVariants = cva("chip", {
  variants: {
    color: {
      peach:  "bg-peach-100 text-accent-active",
      sage:   "bg-sage-100 text-[#4a7a52]",
      butter: "bg-butter-100 text-[#7a5a1a]",
      cream:  "bg-cream-200 text-ink-soft",
      accent: "bg-accent-soft text-accent-active",
      ink:    "bg-ink text-cream-50",
      sky:    "bg-sky-100 text-[#2a5a80]",
    },
    size: {
      sm: "text-xs py-0.5 px-2.5",
      md: "text-sm py-1 px-3.5",
    },
    interactive: {
      true: "cursor-pointer hover:opacity-80 transition-opacity",
      false: "",
    },
  },
  defaultVariants: {
    color: "cream",
    size: "md",
    interactive: false,
  },
});

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
}

export function Chip({
  className,
  color,
  size,
  interactive,
  icon,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(chipVariants({ color, size, interactive }), className)}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

const badgeVariants = cva("badge", {
  variants: {
    color: {
      new:     "bg-sage-200 text-[#2d6636]",
      sale:    "bg-peach-200 text-accent-active",
      hot:     "bg-butter-100 text-[#7a5a1a]",
      danger:  "bg-[#fde8e6] text-danger",
      success: "bg-[#e5f4ea] text-success",
      ink:     "bg-ink text-cream-50",
    },
  },
  defaultVariants: { color: "ink" },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, color, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ color }), className)} {...props} />
  );
}
