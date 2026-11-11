import * as React from "react";
import { cn } from "../../utils/cn";
import { Container } from "./Container";
import { SectionTitle } from "../UI/primitives/SectionTitle";

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
  lg: "py-16 md:py-20",
  xl: "py-20 md:py-28",
};

export function Section({
  as: Component = "section",
  title,
  subtitle,
  badge,
  action,
  containerSize = "xl",
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
          <SectionTitle
            index="01"
            eyebrow={badge}
            title={title ?? ""}
            subtitle={subtitle}
            action={action}
            className="mb-8 md:mb-10"
          />
        )}
        {children}
      </Container>
    </Component>
  );
}
