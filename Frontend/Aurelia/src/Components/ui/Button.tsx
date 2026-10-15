import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-heading font-semibold text-xs uppercase tracking-wider transition-colors duration-150 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-ink text-bg border border-ink hover:bg-ink/85 active:bg-ink",
        secondary: "bg-surface text-ink border border-rule hover:bg-bg active:bg-surface",
        accent: "bg-accent text-white border border-accent hover:bg-accent-hover active:bg-accent",
        outline: "bg-transparent text-ink border border-rule hover:bg-surface active:bg-bg",
        ghost: "bg-transparent text-ink hover:bg-surface active:bg-rule/40",
      },
      size: {
        sm: "h-9 px-3.5 text-[11px]",
        md: "h-11 px-5 text-xs min-h-[44px]",
        lg: "h-12 px-7 text-xs min-h-[44px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0",
      },
      radius: {
        none: "rounded-none",
        xs: "rounded-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      radius: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, radius }), className)}
        {...props}
      >
        {loading ? (
          <span
            className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            aria-hidden="true"
          />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
