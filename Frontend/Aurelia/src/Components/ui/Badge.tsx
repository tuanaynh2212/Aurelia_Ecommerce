import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-none tabular-nums",
  {
    variants: {
      variant: {
        default: "border border-rule bg-surface text-ink",
        accent: "bg-accent text-white border border-accent",
        stock: "border border-ink bg-transparent text-ink",
        muted: "border border-rule bg-transparent text-ink-muted",
        sale: "bg-accent text-white font-bold",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.2",
        md: "text-[11px] px-2 py-0.5",
        lg: "text-xs px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export default Badge;
