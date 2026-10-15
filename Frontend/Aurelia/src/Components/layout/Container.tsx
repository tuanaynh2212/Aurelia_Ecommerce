import { cn } from "../../lib/cn";
import { forwardRef } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Set to true for a narrower content column (e.g. blog posts) */
  narrow?: boolean;
}

/**
 * Container — centred, max-width-bounded content wrapper.
 * Applies responsive horizontal padding from the design token spacing scale.
 *
 * @example
 * <Container>...</Container>
 * <Container narrow>...</Container>
 */
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
  /** HTML element to render — defaults to <section> */
  as?: "section" | "div" | "main" | "aside";
  /** Extra vertical padding */
  spacious?: boolean;
}

/**
 * Section — semantic section wrapper with consistent vertical padding.
 *
 * @example
 * <Section id="arrivals"><Container>...</Container></Section>
 */
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
