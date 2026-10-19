/**
 * HANG TAG — ProductTag component
 * The core visual metaphor. Every product is presented as a garment hang tag:
 * die-cut paper silhouette, punched hole with string, printed SKU, size, price.
 *
 * States: default, hover (swing), flipped (details), sold-out, loading, error
 * Variants: ProductTag (grid), FeaturedTag (large), MiniTag (header/cart)
 * Accessibility: WCAG 2.2 AA — keyboard flip, aria-pressed, focus management
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Truck,
  Repeat2,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";
import type { Product } from "../../types/type";
import { cn } from "../../utils/cn";

/* ── Helpers ──────────────────────────────────────────────── */

function formatPrice(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

function getSalePrice(product: Product): number | null {
  if (!product.discountValue || product.discountValue <= 0) return null;
  if (product.discountType === "percentage") {
    return Math.round(product.price * (1 - product.discountValue / 100));
  }
  return Math.round(product.price - product.discountValue);
}

function getCareIcons(material: string): { label: string; sym: string }[] {
  const m = (material || "").toLowerCase();
  const icons: { label: string; sym: string }[] = [];
  if (m.includes("linen") || m.includes("cotton"))
    icons.push({ sym: "30°", label: "Giặt 30°C" });
  else icons.push({ sym: "40°", label: "Giặt 40°C" });
  icons.push({ sym: "◻", label: "Không sấy" });
  icons.push({ sym: "☽", label: "Phơi bóng râm" });
  if (!m.includes("linen")) icons.push({ sym: "↑", label: "Ủi nhẹ" });
  return icons;
}

function getAvailableSizes(product: Product): { size: string; qty: number }[] {
  if (!product.variants || product.variants.length === 0) return [];
  const sizes: Record<string, number> = {};
  product.variants.forEach((v) => {
    v.sizes?.forEach((s) => {
      sizes[s.size] = (sizes[s.size] || 0) + (s.quantity || 0);
    });
  });
  const ORDER = ["XS", "S", "M", "L", "XL", "XXL", "28", "29", "30", "31", "32", "34", "36"];
  const entries = Object.entries(sizes);
  entries.sort((a, b) => {
    const ai = ORDER.indexOf(a[0]);
    const bi = ORDER.indexOf(b[0]);
    if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return entries.map(([size, qty]) => ({ size, qty }));
}

function getColors(product: Product): string[] {
  if (!product.variants) return [];
  return [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
}

function colorHex(name: string): string {
  const map: Record<string, string> = {
    "đen": "#1a1a1a",
    "trắng": "#f5f5f5",
    "đỏ": "#c0392b",
    "xanh navy": "#1a2a4a",
    "xanh": "#1a6b3a",
    "xanh dương": "#1a4080",
    "xanh lá": "#2d6a2a",
    "be": "#d4b896",
    "kem": "#f5ead3",
    "nâu": "#6b4226",
    "vàng": "#c9a227",
    "hồng": "#e8a0a8",
    "tím": "#6a3d7a",
    "xám": "#888888",
    "cam": "#d4600a",
    "rêu": "#5a6b3a",
    "sand": "#c9a88a",
    "navy": "#1a2a4a",
    "nude": "#ddb89a",
    "olive": "#6b7a3a",
    "black": "#1a1a1a",
    "white": "#f5f5f5",
  };
  return map[name.toLowerCase()] || "#888888";
}

/* ── SKU generator (deterministic from product id) ────────── */
function getSku(product: Product): string {
  const prefix = (product.type || "AUR").slice(0, 3).toUpperCase();
  const suffix = (product.id || "000000").slice(-6).toUpperCase();
  return `${prefix}-${suffix}`;
}

/* ── String component ─────────────────────────────────────── */
function TagString({ length = 48 }: { length?: number }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-0"
      style={{
        top: `-${length}px`,
        width: "1.5px",
        height: `${length}px`,
        background: "linear-gradient(to bottom, transparent, #9E9086 25%, #6B5E54 55%, #9E9086 80%, transparent)",
      }}
      aria-hidden="true"
    />
  );
}

/* ── Punched hole ─────────────────────────────────────────── */
function TagHole() {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      style={{ top: "-10px" }}
      aria-hidden="true"
    >
      <div className="w-5 h-5 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-[inset_0_1px_2px_rgba(42,33,27,0.15)]" />
    </div>
  );
}

/* ── Die-cut SVG clip ──────────────────────────────────────── */
// Applied as inline style via clipPath CSS. The notch accommodates the hole.
const TAG_CLIP = "polygon(0 20px, 0 100%, 100% 100%, 100% 20px, calc(50% + 14px) 20px, calc(50% + 14px) 0, calc(50% - 14px) 0, calc(50% - 14px) 20px)";

/* ============================================================
   ProductTag — grid variant
   ============================================================ */
export interface ProductTagProps {
  product: Product;
  index?: number;
  className?: string;
  isSale?: boolean;
  onAddToCart?: (product: Product, size: string) => void;
  stringLength?: number;
}

export function ProductTag({
  product,
  index = 0,
  className,
  isSale,
  onAddToCart,
  stringLength = 40,
}: ProductTagProps) {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState("");
  const [isSwinging, setIsSwinging] = React.useState(false);
  const detailsBtnRef = React.useRef<HTMLButtonElement>(null);
  const backFirstFocusRef = React.useRef<HTMLButtonElement>(null);
  const prefersReduced = React.useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const sizes = getAvailableSizes(product);
  const colors = getColors(product);
  const salePrice = isSale ? getSalePrice(product) : getSalePrice(product);
  const sku = getSku(product);
  const care = getCareIcons(product.material || "");
  const isSoldOut = (product.stock || 0) <= 0;
  const stockLow = !isSoldOut && (product.stock || 0) <= 3;
  const thumbnail =
    product.thumbnail ||
    (Array.isArray(product.images) ? product.images[0] : "") ||
    "";

  const handleFlip = () => {
    setIsFlipped((v) => !v);
  };

  // On flip open: move focus to back
  React.useEffect(() => {
    if (isFlipped && backFirstFocusRef.current) {
      setTimeout(() => backFirstFocusRef.current?.focus(), prefersReduced.current ? 0 : 290);
    } else if (!isFlipped && detailsBtnRef.current) {
      // don't steal focus on initial render
    }
  }, [isFlipped]);

  // Swing on mount (staggered by index, desktop hover handled via CSS)
  const handleMouseEnter = () => {
    if (prefersReduced.current) return;
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 250);
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      const first = sizes.find((s) => s.qty > 0);
      if (first) setSelectedSize(first.size);
      return;
    }
    onAddToCart?.(product, selectedSize);
  };

  // Animation delay based on index for staggered entrance
  const delay = Math.min(index * 0.05, 0.3);

  const cardHeight = 480; // px — reserved to prevent layout shift

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex flex-col items-center", className)}
      style={{ paddingTop: `${stringLength + 14}px`, minHeight: `${cardHeight + stringLength + 14}px` }}
    >
      {/* String */}
      <TagString length={stringLength} />

      {/* Tag wrapper — swing pivot at hole */}
      <div
        className={cn(
          "relative w-full transition-transform duration-[220ms] ease-out",
          isSwinging && !prefersReduced.current ? "animate-tag-swing" : ""
        )}
        style={{ transformOrigin: "50% 0" }}
        onMouseEnter={handleMouseEnter}
      >
        {/* Hole */}
        <TagHole />

        {/* 3D flip scene */}
        <div
          className="tag-flip-scene w-full"
          style={{ height: `${cardHeight}px` }}
        >
          <div
            className={cn("tag-flip-card w-full h-full", isFlipped && "is-flipped")}
            aria-live="polite"
          >
            {/* ── FRONT ──────────────────────────────────── */}
            <div className="tag-face tag-face--front absolute inset-0">
              <div
                className={cn(
                  "tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col",
                  isSoldOut && "opacity-75"
                )}
                style={{ clipPath: TAG_CLIP }}
              >
                {/* Product image — 4:5 ratio, reserved height */}
                <button
                  onClick={() => navigate(`/Fashion/Products/${product.id}`)}
                  className="relative block w-full overflow-hidden cursor-pointer flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                  style={{ aspectRatio: "4/5", maxHeight: 280 }}
                  aria-label={`Xem ${product.name}`}
                  tabIndex={isFlipped ? -1 : 0}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={product.name}
                      loading={index < 4 ? "eager" : "lazy"}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      style={{ display: "block" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-kraft flex items-center justify-center">
                      <span className="font-mono text-xs text-ink-faint">No image</span>
                    </div>
                  )}

                  {/* Sold-out overlay */}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-paper/70 flex items-center justify-center">
                      <span className="font-mono text-[0.6875rem] font-semibold tracking-widest uppercase text-ink-muted border border-ink-muted px-2 py-0.5">
                        Hết hàng
                      </span>
                    </div>
                  )}

                  {/* Sale stamp — cobalt on paper */}
                  {salePrice && !isSoldOut && (
                    <span className="absolute top-2 left-2 bg-cobalt text-white font-mono text-[10px] font-semibold px-1.5 py-0.5 uppercase tracking-wider">
                      {product.discountValue}%
                    </span>
                  )}
                </button>

                {/* Tag info block */}
                <div className="flex flex-col gap-1 px-3 pt-2.5 pb-3 flex-1">
                  {/* SKU row */}
                  <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
                    {sku}
                  </span>

                  {/* Product name */}
                  <p className="font-body text-sm font-medium text-ink leading-snug line-clamp-2">
                    {product.name}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-0.5">
                    {salePrice ? (
                      <>
                        <span className="price-tag price-tag--sale text-base">
                          {formatPrice(salePrice)}
                        </span>
                        <span className="price-tag price-tag--original text-xs">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="price-tag text-base text-ink">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {/* Color swatches */}
                  {colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1" aria-label="Màu sắc">
                      {colors.slice(0, 5).map((c) => (
                        <span
                          key={c}
                          className="w-3.5 h-3.5 rounded-full border border-[var(--color-rule)] flex-shrink-0"
                          style={{ background: colorHex(c) }}
                          title={c}
                        />
                      ))}
                      {colors.length > 5 && (
                        <span className="font-mono text-[10px] text-ink-faint">+{colors.length - 5}</span>
                      )}
                    </div>
                  )}

                  {/* Size row */}
                  {sizes.length > 0 && (
                    <div className="size-row mt-1" aria-label="Size có sẵn">
                      {sizes.map(({ size, qty }) => (
                        <span
                          key={size}
                          className={cn("size-chip", qty === 0 && "is-unavailable")}
                          aria-label={qty === 0 ? `${size} – hết hàng` : size}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stock warning */}
                  {stockLow && (
                    <p className="font-mono text-[10px] text-cobalt mt-1 tracking-wide">
                      ! Chỉ còn {product.stock} sản phẩm
                    </p>
                  )}

                  {/* Flip trigger */}
                  <button
                    ref={detailsBtnRef}
                    onClick={handleFlip}
                    aria-pressed={isFlipped}
                    aria-label="Xem chi tiết chất liệu & chăm sóc"
                    tabIndex={isFlipped ? -1 : 0}
                    className="mt-auto self-start font-mono text-[10px] tracking-wider uppercase text-ink-muted underline underline-offset-2 hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                  >
                    ↺ Chi tiết vải &amp; chăm sóc
                  </button>
                </div>
              </div>
            </div>

            {/* ── BACK ───────────────────────────────────── */}
            <div className="tag-face tag-face--back absolute inset-0" aria-hidden={!isFlipped}>
              <div
                className={cn("tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col")}
                style={{ clipPath: TAG_CLIP }}
              >
                <div className="px-3.5 pt-8 pb-3 flex flex-col gap-3 flex-1 overflow-y-auto">
                  {/* SKU back header */}
                  <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-2">
                    <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">{sku}</span>
                    <span className="font-mono text-[10px] text-ink-faint">THÔNG TIN SẢN PHẨM</span>
                  </div>

                  {/* Material */}
                  <div>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1">THÀNH PHẦN</p>
                    <p className="font-body text-sm text-ink leading-snug">
                      {product.material || "[Chất liệu — cần cập nhật]"}
                    </p>
                  </div>

                  {/* Fit */}
                  <div>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1">KIỂU DÁNG</p>
                    <p className="font-body text-sm text-ink leading-snug">
                      {product.description
                        ? product.description.slice(0, 80) + (product.description.length > 80 ? "…" : "")
                        : "Regular fit"}
                    </p>
                  </div>

                  {/* Care */}
                  <div>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1.5">HƯỚNG DẪN GIẶT</p>
                    <div className="flex flex-wrap gap-2">
                      {care.map((c) => (
                        <div
                          key={c.label}
                          className="flex flex-col items-center gap-0.5"
                          title={c.label}
                          aria-label={c.label}
                        >
                          <span className="font-mono text-sm text-ink leading-none">{c.sym}</span>
                          <span className="font-mono text-[8px] text-ink-faint text-center leading-tight">
                            {c.label.replace("°C", "°")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="border-t border-[var(--color-rule)] pt-2 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Truck size={11} className="text-ink-muted flex-shrink-0" aria-hidden />
                      <span className="font-body text-xs text-ink-muted">Giao 2–3 ngày toàn quốc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat2 size={11} className="text-ink-muted flex-shrink-0" aria-hidden />
                      <span className="font-body text-xs text-ink-muted">Đổi size miễn phí trong 14 ngày</span>
                    </div>
                  </div>

                  {/* Size selector on back */}
                  {sizes.length > 0 && !isSoldOut && (
                    <div>
                      <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1.5">CHỌN SIZE</p>
                      <div className="size-row">
                        {sizes.map(({ size, qty }) => (
                          <button
                            key={size}
                            onClick={() => qty > 0 && setSelectedSize(size)}
                            disabled={qty === 0}
                            className={cn(
                              "size-chip",
                              qty === 0 && "is-unavailable",
                              selectedSize === size && "is-selected"
                            )}
                            aria-label={qty === 0 ? `${size} hết hàng` : `Chọn size ${size}`}
                            aria-pressed={selectedSize === size}
                            tabIndex={isFlipped ? 0 : -1}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to cart */}
                  <button
                    ref={backFirstFocusRef}
                    onClick={handleAddToCart}
                    disabled={isSoldOut}
                    tabIndex={isFlipped ? 0 : -1}
                    className={cn(
                      "btn btn-primary w-full mt-auto gap-2",
                      isSoldOut && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={isSoldOut ? "Hết hàng" : `Thêm vào giỏ — ${formatPrice(salePrice || product.price)}`}
                  >
                    <ShoppingBag size={14} aria-hidden />
                    <span className="font-mono text-xs tabular-nums">
                      {isSoldOut ? "Hết hàng" : `Thêm vào giỏ — ${formatPrice(salePrice || product.price)}`}
                    </span>
                  </button>

                  {/* Back flip trigger */}
                  <button
                    onClick={handleFlip}
                    aria-label="Quay lại mặt trước"
                    tabIndex={isFlipped ? 0 : -1}
                    className="self-center font-mono text-[10px] tracking-wider uppercase text-ink-muted underline underline-offset-2 hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                  >
                    ↺ Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   FeaturedTag — large hero variant
   ============================================================ */
export interface FeaturedTagProps extends ProductTagProps {
  angle?: number; // slight rotation angle for the hero
}

export function FeaturedTag({
  product,
  index = 0,
  isSale,
  onAddToCart,
  angle = 0,
  stringLength = 56,
  className,
}: FeaturedTagProps) {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState("");
  const backFirstFocusRef = React.useRef<HTMLButtonElement>(null);
  const prefersReduced = React.useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const sizes = getAvailableSizes(product);
  const colors = getColors(product);
  const salePrice = getSalePrice(product);
  const sku = getSku(product);
  const care = getCareIcons(product.material || "");
  const isSoldOut = (product.stock || 0) <= 0;
  const stockLow = !isSoldOut && (product.stock || 0) <= 3;
  const thumbnail =
    product.thumbnail ||
    (Array.isArray(product.images) ? product.images[0] : "") ||
    "";

  const handleFlip = () => setIsFlipped((v) => !v);

  React.useEffect(() => {
    if (isFlipped && backFirstFocusRef.current) {
      setTimeout(() => backFirstFocusRef.current?.focus(), prefersReduced.current ? 0 : 290);
    }
  }, [isFlipped]);

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      const first = sizes.find((s) => s.qty > 0);
      if (first) setSelectedSize(first.size);
      return;
    }
    onAddToCart?.(product, selectedSize);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex flex-col items-center", className)}
      style={{
        paddingTop: `${stringLength + 14}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "50% 0",
      }}
    >
      <TagString length={stringLength} />

      {/* Hover swing wrapper */}
      <div
        className="relative w-full group"
        style={{ transformOrigin: "50% 0" }}
      >
        <style>{`
          .featured-tag-inner { transition: transform 220ms ease-out; }
          .featured-tag-wrapper:hover .featured-tag-inner {
            transform: rotate(2.5deg);
          }
          @media (prefers-reduced-motion: reduce) {
            .featured-tag-wrapper:hover .featured-tag-inner { transform: none; }
          }
        `}</style>

        <div className="featured-tag-wrapper">
          <div className="featured-tag-inner" style={{ transformOrigin: "50% 0" }}>
            <TagHole />

            <div className="tag-flip-scene w-full" style={{ height: 540 }}>
              <div
                className={cn("tag-flip-card w-full h-full", isFlipped && "is-flipped")}
                aria-live="polite"
              >
                {/* FRONT */}
                <div className="tag-face tag-face--front absolute inset-0">
                  <div
                    className="tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col"
                    style={{ clipPath: TAG_CLIP }}
                  >
                    {/* Image — 4:5 */}
                    <button
                      onClick={() => navigate(`/Fashion/Products/${product.id}`)}
                      className="relative block w-full overflow-hidden cursor-pointer flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                      style={{ aspectRatio: "4/5", maxHeight: 360 }}
                      aria-label={`Xem ${product.name}`}
                      tabIndex={isFlipped ? -1 : 0}
                    >
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={product.name}
                          loading="eager"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          fetchPriority="high"
                        />
                      ) : (
                        <div className="w-full h-full bg-kraft flex items-center justify-center">
                          <span className="font-mono text-xs text-ink-faint">No image</span>
                        </div>
                      )}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-paper/70 flex items-center justify-center">
                          <span className="font-mono text-xs font-semibold tracking-widest uppercase text-ink-muted border border-ink-muted px-3 py-1">
                            Hết hàng
                          </span>
                        </div>
                      )}
                      {salePrice && !isSoldOut && (
                        <span className="absolute top-3 left-3 bg-cobalt text-white font-mono text-xs font-semibold px-2 py-0.5 uppercase tracking-wider">
                          -{product.discountValue}%
                        </span>
                      )}
                    </button>

                    {/* Info block */}
                    <div className="flex flex-col gap-2 px-4 pt-3 pb-4 flex-1">
                      <span className="font-mono text-[10px] tracking-[0.14em] text-ink-faint uppercase">{sku}</span>

                      <p className="font-body text-base font-medium text-ink leading-snug">
                        {product.name}
                      </p>

                      <div className="flex items-baseline gap-2">
                        {salePrice ? (
                          <>
                            <span className="price-tag price-tag--sale text-lg">{formatPrice(salePrice)}</span>
                            <span className="price-tag price-tag--original text-sm">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          <span className="price-tag text-lg text-ink">{formatPrice(product.price)}</span>
                        )}
                      </div>

                      {colors.length > 0 && (
                        <div className="flex gap-1.5" aria-label="Màu">
                          {colors.slice(0, 6).map((c) => (
                            <span
                              key={c}
                              className="w-4 h-4 rounded-full border border-[var(--color-rule)]"
                              style={{ background: colorHex(c) }}
                              title={c}
                            />
                          ))}
                        </div>
                      )}

                      {sizes.length > 0 && (
                        <div className="size-row">
                          {sizes.map(({ size, qty }) => (
                            <span
                              key={size}
                              className={cn("size-chip", qty === 0 && "is-unavailable")}
                              aria-label={qty === 0 ? `${size} – hết hàng` : size}
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      )}

                      {stockLow && (
                        <p className="font-mono text-xs text-cobalt tracking-wide">
                          ! Chỉ còn {product.stock} sản phẩm
                        </p>
                      )}

                      <button
                        onClick={handleFlip}
                        aria-pressed={isFlipped}
                        tabIndex={isFlipped ? -1 : 0}
                        className="mt-auto self-start font-mono text-[10px] tracking-wider uppercase text-ink-muted underline underline-offset-2 hover:text-ink transition-colors cursor-pointer"
                      >
                        ↺ Chi tiết vải &amp; chăm sóc
                      </button>
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div className="tag-face tag-face--back absolute inset-0" aria-hidden={!isFlipped}>
                  <div
                    className="tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col"
                    style={{ clipPath: TAG_CLIP }}
                  >
                    <div className="px-4 pt-8 pb-4 flex flex-col gap-3 flex-1">
                      <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-2">
                        <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">{sku}</span>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1">THÀNH PHẦN</p>
                        <p className="font-body text-sm text-ink">{product.material || "[Chất liệu — cần cập nhật]"}</p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1.5">HƯỚNG DẪN GIẶT</p>
                        <div className="flex gap-3">
                          {care.map((c) => (
                            <div key={c.label} className="flex flex-col items-center gap-0.5" title={c.label}>
                              <span className="font-mono text-base text-ink leading-none">{c.sym}</span>
                              <span className="font-mono text-[8px] text-ink-faint text-center">{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[var(--color-rule)] pt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Truck size={12} className="text-ink-muted" aria-hidden />
                          <span className="font-body text-xs text-ink-muted">Giao 2–3 ngày toàn quốc</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Repeat2 size={12} className="text-ink-muted" aria-hidden />
                          <span className="font-body text-xs text-ink-muted">Đổi size miễn phí trong 14 ngày</span>
                        </div>
                      </div>

                      {sizes.length > 0 && !isSoldOut && (
                        <div>
                          <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1.5">CHỌN SIZE</p>
                          <div className="size-row">
                            {sizes.map(({ size, qty }) => (
                              <button
                                key={size}
                                ref={size === sizes[0]?.size ? backFirstFocusRef : undefined}
                                onClick={() => qty > 0 && setSelectedSize(size)}
                                disabled={qty === 0}
                                className={cn("size-chip", qty === 0 && "is-unavailable", selectedSize === size && "is-selected")}
                                aria-pressed={selectedSize === size}
                                tabIndex={isFlipped ? 0 : -1}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                        tabIndex={isFlipped ? 0 : -1}
                        className={cn("btn btn-primary w-full mt-auto", isSoldOut && "opacity-50 cursor-not-allowed")}
                        aria-label={`Thêm vào giỏ — ${formatPrice(salePrice || product.price)}`}
                      >
                        <ShoppingBag size={14} aria-hidden />
                        <span className="font-mono text-xs tabular-nums">
                          {isSoldOut ? "Hết hàng" : `Thêm — ${formatPrice(salePrice || product.price)}`}
                        </span>
                      </button>

                      <button
                        onClick={handleFlip}
                        tabIndex={isFlipped ? 0 : -1}
                        className="self-center font-mono text-[10px] tracking-wider uppercase text-ink-muted underline underline-offset-2 hover:text-ink cursor-pointer"
                      >
                        ↺ Quay lại
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   TagSkeleton — loading state
   ============================================================ */
export function TagSkeleton({ stringLength = 40 }: { stringLength?: number }) {
  return (
    <div
      className="relative flex flex-col items-center"
      style={{ paddingTop: `${stringLength + 14}px`, minHeight: 494 }}
      aria-label="Đang tải sản phẩm"
      aria-busy="true"
    >
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 0, width: 1.5, height: stringLength, background: "var(--color-rule)" }}
        aria-hidden="true"
      />
      <div className="w-5 h-5 rounded-full border border-[var(--color-rule)] bg-paper absolute left-1/2 -translate-x-1/2" style={{ top: stringLength + 4 }} aria-hidden="true" />
      <div
        className="w-full bg-paper border border-[var(--color-rule)] shadow-tag overflow-hidden"
        style={{ clipPath: TAG_CLIP }}
      >
        <div className="skeleton w-full" style={{ aspectRatio: "4/5", maxHeight: 280 }} />
        <div className="px-3 pt-3 pb-4 space-y-2">
          <div className="skeleton h-2 w-1/2 rounded-none" />
          <div className="skeleton h-4 w-3/4 rounded-none" />
          <div className="skeleton h-5 w-1/2 rounded-none" />
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-6 w-8 rounded-none" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MiniTag — header cart count + cart line item
   ============================================================ */
export interface MiniTagProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export function MiniTag({ count, onClick, className }: MiniTagProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Giỏ hàng: ${count} sản phẩm`}
      className={cn(
        "relative flex flex-col items-center cursor-pointer group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-1",
        className
      )}
      style={{ paddingTop: 12 }}
    >
      {/* Mini string */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: 0,
          width: 1,
          height: 12,
          background: "var(--color-ink-muted)",
        }}
        aria-hidden="true"
      />

      {/* Mini hole */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 4 }}
        aria-hidden="true"
      >
        <div className="w-3 h-3 rounded-full border border-[var(--color-rule)] bg-paper" />
      </div>

      {/* Mini tag body */}
      <div
        className="relative flex items-center justify-center px-2 bg-paper border border-[var(--color-rule)] shadow-tag group-hover:border-ink transition-colors"
        style={{
          minWidth: 36,
          minHeight: 26,
          clipPath: "polygon(0 8px, 0 100%, 100% 100%, 100% 8px, calc(50% + 8px) 8px, calc(50% + 8px) 0, calc(50% - 8px) 0, calc(50% - 8px) 8px)",
        }}
      >
        <span className="font-mono text-xs font-semibold tabular-nums text-ink leading-none">
          {count > 99 ? "99+" : count}
        </span>
      </div>
    </button>
  );
}
