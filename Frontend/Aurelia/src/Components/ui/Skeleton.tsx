import { cn } from "../../utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width (e.g. "100%", "200px") — defaults to full width */
  width?: string;
  /** Height — defaults to "1rem" */
  height?: string;
  /** Use a circle shape (for avatars etc.) */
  circle?: boolean;
}

/**
 * Skeleton loader — shimmer placeholder for any loading state.
 *
 * @example
 * <Skeleton height="300px" />                  // image placeholder
 * <Skeleton height="1rem" width="60%" />        // text line
 * <Skeleton circle height="40px" width="40px" /> // avatar
 */
export function Skeleton({
  className,
  width,
  height = "1rem",
  circle = false,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        circle && "!rounded-full",
        className
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Pre-composed skeleton for a product card */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton height="360px" className="rounded-[var(--radius-lg)]" />
      <Skeleton height="1.25rem" width="75%" />
      <Skeleton height="1rem" width="40%" />
    </div>
  );
}

/** Pre-composed skeleton for a text paragraph block */
export function ParagraphSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}
