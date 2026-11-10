import { cn } from "../../utils/cn";
import { forwardRef } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, narrow = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "container-page",
        narrow && "max-w-4xl",
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "main" | "aside";
  spacious?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, as: Tag = "section", spacious = false, ...props }, ref) => (
    // @ts-expect-error — ref type varies by tag, safe in practice
    <Tag
      ref={ref}
      className={cn(
        "section-padding",
        spacious && "py-24 md:py-32",
        className
      )}
      {...props}
    />
  )
);
Section.displayName = "Section";

export { Container, Section };
