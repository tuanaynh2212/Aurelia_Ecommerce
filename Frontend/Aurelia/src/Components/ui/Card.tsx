import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { forwardRef } from "react";

const cardVariants = cva("card", {
  variants: {
    hover: {
      true: "card-hover cursor-pointer",
      false: "",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    hover: false,
    padding: "md",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Aurelia Card — warm white rounded surface.
 *
 * @example
 * <Card hover padding="sm">...</Card>
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ hover, padding }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/** Sub-components */
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
  )
);
CardBody.displayName = "CardBody";

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-4 pt-4 border-t border-[var(--color-cream-200)]", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter, cardVariants };
