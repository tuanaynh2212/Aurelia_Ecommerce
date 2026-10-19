import * as React from "react";
import { cn } from "../../utils/cn";
import { Container } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  title?: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  spacing?: "sm" | "md" | "lg" | "xl" | "none";
}

const spacingClasses = {
  none: "py-0",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-20 md:py-32",
};

export function Section({
  as: Component = "section",
  title,
  subtitle,
  badge,
  action,
  containerSize = "lg",
  spacing = "lg",
  className,
  children,
  ...props
}: SectionProps) {
  const hasHeader = title || subtitle || badge || action;

  return (
    <Component className={cn(spacingClasses[spacing], className)} {...props}>
      <Container size={containerSize}>
        {hasHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              {badge && (
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[var(--color-accent)] mb-2 px-2.5 py-1 rounded-[var(--radius-pill)] bg-[var(--color-peach-100)]">
                  {badge}
                </span>
              )}
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[var(--color-ink)] tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-[var(--color-ink-soft)] max-w-2xl font-body">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </Component>
  );
}
