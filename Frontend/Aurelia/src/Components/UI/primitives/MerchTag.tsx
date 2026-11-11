import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";
import { swatchHex } from "../three/palette";

export interface MerchTagProps {
  name: string;
  image?: string;
  /** Router path to the product detail page. */
  to?: string;
  /** Alternative to `to`: imperative open handler (kept for components that navigate in a handler). */
  onOpen?: () => void;
  priceLabel: string;
  originalPriceLabel?: string | null;
  discountLabel?: string | null;
  eyebrow?: string;
  colors?: string[];
  sku?: string;
  index?: number;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
  onQuickAdd?: () => void;
  quickAddLabel?: string;
  soldOut?: boolean;
  badge?: ReactNode;
  footer?: ReactNode;
  className?: string;
  imageLoading?: "lazy" | "eager";
  /** Optional drop cord length (px) when hung from an overhead studio rail */
  stringLength?: number;
  /** Optional resting pendulum tilt angle (deg) */
  angle?: number;
  /** Enables continuous gentle floating/pendulum levitation */
  suspended?: boolean;
}

/**
 * Signature product card: heavy cardstock hang-tag with punched hole + string loop,
 * pendulum swing on the outer shell only, 3:4 bone image frame and barcode strip.
 * Purely presentational — every handler is supplied by the owning component.
 */
export function MerchTag({
  name,
  image,
  to,
  onOpen,
  priceLabel,
  originalPriceLabel,
  discountLabel,
  eyebrow,
  colors = [],
  sku,
  index,
  isFavourite = false,
  onToggleFavourite,
  onQuickAdd,
  quickAddLabel = "Thêm nhanh",
  soldOut = false,
  badge,
  footer,
  className,
  imageLoading = "lazy",
  stringLength,
  angle = 0,
  suspended = false,
}: MerchTagProps) {
  const isSuspended = suspended || typeof stringLength === "number";
  const cordHeight = Math.max(26, stringLength ?? 32);
  const safeIndex = index ?? 0;
  const floatDuration = `${(5.1 + (safeIndex % 4) * 0.45).toFixed(2)}s`;
  const floatDelay = `-${((safeIndex % 4) * 1.15).toFixed(2)}s`;
  const suspendedVars = isSuspended
    ? ({
        "--tag-rest-angle": `${angle}deg`,
        "--tag-float-duration": floatDuration,
        "--tag-float-delay": floatDelay,
      } as CSSProperties)
    : undefined;
  const visibleColors = colors.slice(0, 5);
  const extraColors = Math.max(0, colors.length - visibleColors.length);

  const media = (
    <>
      <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-ink bg-bone">
        {image ? (
          <img
            src={image}
            alt={name}
            loading={imageLoading}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover/tag:scale-[1.04]"
          />
        ) : (
          <div className="studio-grid-bg h-full w-full" aria-hidden="true" />
        )}
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-ink py-1.5 text-center mono-label text-[11px] font-bold text-paper">
            SOLD OUT
          </span>
        )}
      </div>
      <div className="px-3 pt-3">
        {eyebrow && (
          <p className="mono-label truncate text-[10px] font-bold text-ink-muted">{eyebrow}</p>
        )}
        <h3 className="mt-1 line-clamp-2 min-h-[2.6em] pt-[0.12em] font-sans text-[15px] font-bold leading-[1.3] text-ink">
          {name}
        </h3>
      </div>
    </>
  );

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onOpen?.();
  };

  return (
    <article className={cn("group/tag relative", isSuspended ? "pt-0" : "pt-7", className)}>
      {isSuspended && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <span className="h-3 w-5 border-2 border-ink bg-volt shadow-hard-sm" />
        </span>
      )}
      <div
        style={{
          ...(isSuspended ? { paddingTop: `${cordHeight}px` } : undefined),
          ...suspendedVars,
        }}
        className={cn(
          "tag-shell relative",
          isSuspended && "tag-suspended"
        )}
      >
        {isSuspended && (
          <span
            aria-hidden="true"
            style={{ height: `${Math.max(4, cordHeight - 25)}px` }}
            className="pointer-events-none absolute left-1/2 top-0 w-[2px] -translate-x-1/2 bg-ink"
          />
        )}

        <div className="relative border-2 border-ink bg-paper shadow-hard rounded-[2px]">
          {/* string loop */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -top-7 left-1/2 h-9 w-10 -translate-x-1/2 text-ink"
            viewBox="0 0 40 36"
            fill="none"
          >
            <path d="M20 34 C 8 22, 10 4, 20 2 C 30 4, 32 22, 20 34" stroke="currentColor" strokeWidth="2" />
          </svg>
          {/* punched hole */}
          <span
            aria-hidden="true"
            className="punch-hole absolute left-1/2 top-2 z-[2] -translate-x-1/2"
          />
          <div className="flex items-center justify-between px-3 pb-2 pt-8">
            <span className="mono-label text-[10px] font-bold text-ink-muted">
              {typeof index === "number" ? `[${String(index + 1).padStart(2, "0")}]` : "[ATELIER]"}
            </span>
            {badge}
          </div>

          <div className="relative px-3">
            {to ? (
              <Link to={to} className="block focus-visible:outline-offset-4" aria-label={name}>
                {media}
              </Link>
            ) : onOpen ? (
              <button type="button" onClick={handleOpen} className="block w-full text-left" aria-label={name}>
                {media}
              </button>
            ) : (
              <div>{media}</div>
            )}

            {onToggleFavourite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavourite();
                }}
                aria-pressed={isFavourite}
                aria-label={isFavourite ? "Bỏ yêu thích" : "Yêu thích"}
                className={cn(
                  "hit-area-expand press-collapse absolute right-5 top-2 z-[3] flex h-10 w-10 items-center justify-center border-2 border-ink shadow-hard-sm rounded-[2px]",
                  isFavourite ? "bg-flash text-paper" : "bg-paper text-ink hover:bg-volt"
                )}
              >
                <Heart size={18} strokeWidth={2.5} fill={isFavourite ? "currentColor" : "none"} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="px-3 pb-3 pt-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-mono text-lg font-extrabold tabular text-ink">{priceLabel}</span>
              {originalPriceLabel && (
                <span className="font-mono text-xs tabular text-ink-muted line-through">{originalPriceLabel}</span>
              )}
              {discountLabel && (
                <span className="border-2 border-ink bg-volt px-1.5 mono-label text-[10px] font-bold text-ink">
                  {discountLabel}
                </span>
              )}
            </div>

            {visibleColors.length > 0 && (
              <ul className="mt-2.5 flex items-center gap-2" aria-label="Màu sắc">
                {visibleColors.map((c) => (
                  <li key={c} className="hit-area-expand relative">
                    <span
                      title={c}
                      className="block h-4 w-4 border-2 border-ink rounded-full"
                      style={{ backgroundColor: swatchHex(c) }}
                    />
                    <span className="sr-only">{c}</span>
                  </li>
                ))}
                {extraColors > 0 && (
                  <li className="mono-label text-[10px] font-bold text-ink-muted">+{extraColors}</li>
                )}
              </ul>
            )}
            {footer}
          </div>

          {onQuickAdd && (
            <div className="px-3 pb-3 opacity-100 transition-opacity duration-150 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/tag:opacity-100 [@media(hover:hover)]:group-focus-within/tag:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickAdd();
                }}
                disabled={soldOut}
                className="press-collapse flex min-h-[44px] w-full items-center justify-center gap-2 border-2 border-ink bg-ink mono-label text-[11px] font-bold text-paper shadow-hard-sm hover:bg-volt hover:text-ink disabled:cursor-not-allowed disabled:bg-fog disabled:text-ink-muted rounded-[2px]"
              >
                <Plus size={14} strokeWidth={3} aria-hidden="true" />
                {quickAddLabel}
              </button>
            </div>
          )}

          <div className="flex items-end justify-between gap-3 border-t-2 border-dashed border-ink px-3 py-2">
            <div className="barcode h-6 flex-1" aria-hidden="true" />
            {sku && <span className="mono-label text-[10px] font-bold text-ink-muted">{sku}</span>}
          </div>
        </div>
      </div>
      {isSuspended && (
        <div
          aria-hidden="true"
          style={suspendedVars}
          className="tag-float-shadow pointer-events-none mx-auto mt-3 h-1.5 w-3/4 bg-ink"
        />
      )}
    </article>
  );
}

export function MerchTagSkeleton({
  className,
  stringLength,
  suspended = false,
}: {
  className?: string;
  stringLength?: number;
  suspended?: boolean;
}) {
  const isSuspended = suspended || typeof stringLength === "number";
  const cordHeight = Math.max(26, stringLength ?? 32);
  return (
    <div className={cn("relative", isSuspended ? "pt-0" : "pt-7", className)} aria-hidden="true">
      <div
        style={isSuspended ? { paddingTop: `${cordHeight}px` } : undefined}
        className={cn(isSuspended && "tag-suspended relative")}
      >
        {isSuspended && (
          <span
            aria-hidden="true"
            style={{ height: `${Math.max(4, cordHeight - 8)}px` }}
            className="pointer-events-none absolute left-1/2 top-0 w-[2px] -translate-x-1/2 bg-ink/40"
          />
        )}
        <div className="border-2 border-fog bg-paper p-3 pt-10 rounded-[2px]">
          <div className="skeleton-fog aspect-[3/4] w-full" />
          <div className="skeleton-fog mt-3 h-3 w-1/3" />
          <div className="skeleton-fog mt-2 h-4 w-5/6" />
          <div className="skeleton-fog mt-2 h-4 w-2/3" />
          <div className="skeleton-fog mt-3 h-5 w-1/2" />
          <div className="skeleton-fog mt-3 h-6 w-full" />
        </div>
      </div>
    </div>
  );
}

