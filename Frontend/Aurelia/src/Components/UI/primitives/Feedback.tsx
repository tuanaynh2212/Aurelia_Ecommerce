import type { ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { cn } from "../../../utils/cn";
import { Button } from "./Button";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn("skeleton-fog rounded-[2px]", className)} />;
}

export interface EmptyStateProps {
  code?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Brutalist empty-stage illustration + message + secondary CTA.
 */
export function EmptyState({
  code = "[STAGE // EMPTY]",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed border-ink bg-paper p-8 md:p-12 text-center rounded-[2px]",
        className
      )}
    >
      {/* Empty atelier stage hanger graphic */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 72"
        className="mb-4 h-16 w-28 text-ink"
        fill="none"
      >
        <line x1="6" y1="8" x2="114" y2="8" stroke="currentColor" strokeWidth="3" />
        <path
          d="M60 8 V18 C60 18 68 18 68 24 C68 29 60 30 60 34 L22 56 H98 L60 34"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <rect x="44" y="54" width="32" height="10" fill="var(--color-volt)" stroke="currentColor" strokeWidth="2" />
      </svg>

      <span className="mono-label text-[11px] font-bold text-ink-muted">{code}</span>
      <h3 className="mt-1 font-display text-xl font-extrabold uppercase text-ink diacritic-safe">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export interface ErrorStateProps {
  code?: string;
  title?: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Torn ticket illustration + retry button.
 */
export function ErrorState({
  code = "[TICKET // TORN]",
  title = "Đã xảy ra sự cố",
  description,
  onRetry,
  retryLabel = "Thử lại",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center border-2 border-ink bg-paper p-8 text-center shadow-hard rounded-[2px]",
        className
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center border-2 border-ink bg-flash text-paper">
        <AlertOctagon size={24} aria-hidden="true" />
      </div>
      <span className="mono-label text-[11px] font-bold text-danger">{code}</span>
      <h3 className="mt-1 font-display text-xl font-extrabold uppercase text-ink diacritic-safe">
        {title}
      </h3>
      {description && <p className="mt-1.5 max-w-md text-sm text-ink-muted">{description}</p>}
      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" onClick={onRetry} iconLeft={<RotateCcw size={15} />}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function NotFound({
  title = "404 — KHÔNG TÌM THẤY",
  description,
  action,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="container-atelier py-16">
      <EmptyState
        code="[ERR // 404]"
        title={title}
        description={description}
        action={action}
      />
    </div>
  );
}
