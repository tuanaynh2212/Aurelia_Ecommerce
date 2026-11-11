import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const SIZE_CLASSES: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1440px]",
  full: "max-w-none",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, narrow = false, size = "xl", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "container-atelier",
        SIZE_CLASSES[size],
        narrow && "max-w-4xl",
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

export interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "main" | "aside";
  spacious?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionWrapperProps>(
  ({ className, as: Tag = "section", spacious = false, ...props }, ref) => (
    // @ts-expect-error — polymorphic tag ref
    <Tag
      ref={ref}
      className={cn(
        "py-12 md:py-16",
        spacious && "py-20 md:py-28",
        className
      )}
      {...props}
    />
  )
);
Section.displayName = "Section";
