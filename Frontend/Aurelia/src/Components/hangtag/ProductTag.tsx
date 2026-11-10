import { motion } from "framer-motion";
import {
  Truck,
  Repeat2,
  ShoppingBag,
} from "lucide-react";
import type { Product } from "../../types/type";
import { cn } from "../../utils/cn";
import {
  useProductTag,
  formatPrice,
  getSalePrice,
  getCareIcons,
  getAvailableSizes,
  getColors,
  colorHex,
  getSku,
} from "../../hooks/useProductTag";

export {
  useProductTag,
  formatPrice,
  getSalePrice,
  getCareIcons,
  getAvailableSizes,
  getColors,
  colorHex,
  getSku,
};

function TagString({ length = 78 }: { length?: number }) {
  return (
    <div
      className="absolute pointer-events-none z-100 left-1/2"
      style={{
        top: `-${82}px`,
        width: "1.5px",
        height: `${length}px`,
        background: "linear-gradient(to bottom, transparent, #9E9086 25%, #6B5E54 55%, #9E9086 80%, transparent)",
      }}
      aria-hidden="true"
    />
  );
}

function TagHole() {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 pointer-events-none left-1/2"
      style={{ top: "10px" }}
      aria-hidden="true"
    >
      <div className="w-5 h-5 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-[inset_0_1px_2px_rgba(42,33,27,0.15)]" />
    </div>
  );
}

const TAG_CLIP =
  "polygon(25% 0, 75% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)";

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
  const {
    isFlipped,
    selectedSize,
    setSelectedSize,
    isSwinging,
    detailsBtnRef,
    backFirstFocusRef,
    sizes,
    colors,
    salePrice,
    sku,
    care,
    isSoldOut,
    stockLow,
    thumbnail,
    prefersReduced,
    handleFlip,
    handleMouseEnter,
    handleAddToCart,
    goToProduct,
  } = useProductTag(product, onAddToCart);

  const delay = Math.min(index * 0.05, 0.3);

  const cardHeight = 480;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex flex-col items-center", className)}
      style={{ paddingTop: `${stringLength + 14}px`, minHeight: `${cardHeight + stringLength + 14}px` }}
    >
      <TagString length={stringLength} />

      <div
        className={cn(
          "relative w-full transition-transform duration-[220ms] ease-out",
          isSwinging && !prefersReduced.current ? "animate-tag-swing" : ""
        )}
        style={{ transformOrigin: "50% 0" }}
        onMouseEnter={handleMouseEnter}
      >
        <TagHole />

        <div
          className="w-full tag-flip-scene"
          style={{ height: `${cardHeight}px` }}
        >
          <div
            className={cn("tag-flip-card w-full h-full", isFlipped && "is-flipped")}
            aria-live="polite"
          >
            <div className="absolute inset-0 tag-face tag-face--front">
              <div
                className={cn(
                  "tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col",
                  isSoldOut && "opacity-75"
                )}
                style={{ clipPath: TAG_CLIP }}
              >
                <button
                  onClick={goToProduct}
                  className="relative flex-shrink-0 block w-full overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
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
                      className="object-cover w-full h-full"
                      style={{ display: "block" }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-kraft">
                      <span className="font-mono text-xs text-ink-faint">No image</span>
                    </div>
                  )}

                  {isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-paper/70">
                      <span className="font-mono text-[0.6875rem] font-semibold tracking-widest uppercase text-ink-muted border border-ink-muted px-2 py-0.5">
                        Hết hàng
                      </span>
                    </div>
                  )}

                  {salePrice && !isSoldOut && (
                    <span className="absolute top-2 left-2 bg-cobalt text-white font-mono text-[10px] font-semibold px-1.5 py-0.5 uppercase tracking-wider">
                      {product.discountValue}%
                    </span>
                  )}
                </button>

                <div className="flex flex-col gap-1 px-3 pt-2.5 pb-3 flex-1">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
                    {sku}
                  </span>

                  <p className="text-sm font-medium leading-snug font-body text-ink line-clamp-2">
                    {product.name}
                  </p>

                  <div className="flex items-baseline gap-2 mt-0.5">
                    {salePrice ? (
                      <>
                        <span className="text-base price-tag price-tag--sale">
                          {formatPrice(salePrice)}
                        </span>
                        <span className="text-xs price-tag price-tag--original">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-base price-tag text-ink">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

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

                  {sizes.length > 0 && (
                    <div className="mt-1 size-row" aria-label="Size có sẵn">
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
                    <p className="font-mono text-[10px] text-cobalt mt-1 tracking-wide">
                      ! Chỉ còn {product.stock} sản phẩm
                    </p>
                  )}

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

            <div className="absolute inset-0 tag-face tag-face--back" aria-hidden={!isFlipped}>
              <div
                className={cn("tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col")}
                style={{ clipPath: TAG_CLIP }}
              >
                <div className="px-3.5 pt-8 pb-3 flex flex-col gap-3 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-2">
                    <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">{sku}</span>
                    <span className="font-mono text-[10px] text-ink-faint">THÔNG TIN SẢN PHẨM</span>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1">THÀNH PHẦN</p>
                    <p className="text-sm leading-snug font-body text-ink">
                      {product.material || "[Chất liệu — cần cập nhật]"}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1">KIỂU DÁNG</p>
                    <p className="text-sm leading-snug font-body text-ink">
                      {product.description
                        ? product.description.slice(0, 80) + (product.description.length > 80 ? "…" : "")
                        : "Regular fit"}
                    </p>
                  </div>

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
                          <span className="font-mono text-sm leading-none text-ink">{c.sym}</span>
                          <span className="font-mono text-[8px] text-ink-faint text-center leading-tight">
                            {c.label.replace("°C", "°")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[var(--color-rule)] pt-2 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Truck size={11} className="flex-shrink-0 text-ink-muted" aria-hidden />
                      <span className="text-xs font-body text-ink-muted">Giao 2–3 ngày toàn quốc</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat2 size={11} className="flex-shrink-0 text-ink-muted" aria-hidden />
                      <span className="text-xs font-body text-ink-muted">Đổi size miễn phí trong 14 ngày</span>
                    </div>
                  </div>

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

export interface FeaturedTagProps extends ProductTagProps {
  angle?: number;
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
  const {
    isFlipped,
    selectedSize,
    setSelectedSize,
    backFirstFocusRef,
    sizes,
    colors,
    salePrice,
    sku,
    care,
    isSoldOut,
    stockLow,
    thumbnail,
    handleFlip,
    handleAddToCart,
    goToProduct,
  } = useProductTag(product, onAddToCart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex flex-col items-center", className)}
      style={{
        paddingTop: `${0}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "50% 0",
      }}
    >
      <TagString length={100} />

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

            <div className="w-full tag-flip-scene" style={{ height: 540 }}>
              <div
                className={cn("tag-flip-card w-full h-full", isFlipped && "is-flipped")}
                aria-live="polite"
              >
                <div className="absolute inset-0 tag-face tag-face--front">
                  <div
                    className="tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col"
                    style={{ clipPath: TAG_CLIP }}
                  >
                    <button
                      onClick={goToProduct}
                      className="relative flex-shrink-0 block w-full overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
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
                          className="object-cover w-full h-full"
                          fetchPriority="high"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-kraft">
                          <span className="font-mono text-xs text-ink-faint">No image</span>
                        </div>
                      )}
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-paper/70">
                          <span className="px-3 py-1 font-mono text-xs font-semibold tracking-widest uppercase border text-ink-muted border-ink-muted">
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

                    <div className="flex flex-col flex-1 gap-2 px-4 pt-3 pb-4">
                      <span className="font-mono text-[10px] tracking-[0.14em] text-ink-faint uppercase">{sku}</span>

                      <p className="text-base font-medium leading-snug font-body text-ink">
                        {product.name}
                      </p>

                      <div className="flex items-baseline gap-2">
                        {salePrice ? (
                          <>
                            <span className="text-lg price-tag price-tag--sale">{formatPrice(salePrice)}</span>
                            <span className="text-sm price-tag price-tag--original">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          <span className="text-lg price-tag text-ink">{formatPrice(product.price)}</span>
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
                        <p className="font-mono text-xs tracking-wide text-cobalt">
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

                <div className="absolute inset-0 tag-face tag-face--back" aria-hidden={!isFlipped}>
                  <div
                    className="tag-grain w-full h-full bg-paper border border-[var(--color-rule)] shadow-tag flex flex-col"
                    style={{ clipPath: TAG_CLIP }}
                  >
                    <div className="flex flex-col flex-1 gap-3 px-4 pt-8 pb-4">
                      <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-2">
                        <span className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">{sku}</span>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1">THÀNH PHẦN</p>
                        <p className="text-sm font-body text-ink">{product.material || "[Chất liệu — cần cập nhật]"}</p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] tracking-wider uppercase text-ink-faint mb-1.5">HƯỚNG DẪN GIẶT</p>
                        <div className="flex gap-3">
                          {care.map((c) => (
                            <div key={c.label} className="flex flex-col items-center gap-0.5" title={c.label}>
                              <span className="font-mono text-base leading-none text-ink">{c.sym}</span>
                              <span className="font-mono text-[8px] text-ink-faint text-center">{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[var(--color-rule)] pt-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Truck size={12} className="text-ink-muted" aria-hidden />
                          <span className="text-xs font-body text-ink-muted">Giao 2–3 ngày toàn quốc</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Repeat2 size={12} className="text-ink-muted" aria-hidden />
                          <span className="text-xs font-body text-ink-muted">Đổi size miễn phí trong 14 ngày</span>
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

export function TagSkeleton({ stringLength = 40 }: { stringLength?: number }) {
  return (
    <div
      className="relative flex flex-col items-center"
      style={{ paddingTop: `${stringLength + 14}px`, minHeight: 494 }}
      aria-label="Đang tải sản phẩm"
      aria-busy="true"
    >
      <div
        className="absolute -translate-x-1/2 left-1/2"
        style={{ top: 0, width: 1.5, height: stringLength, background: "var(--color-rule)" }}
        aria-hidden="true"
      />
      <div className="w-5 h-5 rounded-full border border-[var(--color-rule)] bg-paper absolute left-1/2 -translate-x-1/2" style={{ top: stringLength + 4 }} aria-hidden="true" />
      <div
        className="w-full bg-paper border border-[var(--color-rule)] shadow-tag overflow-hidden"
        style={{ clipPath: TAG_CLIP }}
      >
        <div className="w-full skeleton" style={{ aspectRatio: "4/5", maxHeight: 280 }} />
        <div className="px-3 pt-3 pb-4 space-y-2">
          <div className="w-1/2 h-2 rounded-none skeleton" />
          <div className="w-3/4 h-4 rounded-none skeleton" />
          <div className="w-1/2 h-5 rounded-none skeleton" />
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="w-8 h-6 rounded-none skeleton" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div
        className="absolute -translate-x-1/2 pointer-events-none left-1/2"
        style={{
          top: 0,
          width: 1,
          height: 12,
          background: "var(--color-ink-muted)",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute -translate-x-1/2 left-1/2"
        style={{ top: 4 }}
        aria-hidden="true"
      >
        <div className="w-3 h-3 rounded-full border border-[var(--color-rule)] bg-paper" />
      </div>

      <div
        className="relative flex items-center justify-center px-2 bg-paper border border-[var(--color-rule)] shadow-tag group-hover:border-ink transition-colors"
        style={{
          minWidth: 36,
          minHeight: 26,
          clipPath: "polygon(0 8px, 0 100%, 100% 100%, 100% 8px, calc(50% + 8px) 8px, calc(50% + 8px) 0, calc(50% - 8px) 0, calc(50% - 8px) 8px)",
        }}
      >
        <span className="font-mono text-xs font-semibold leading-none tabular-nums text-ink">
          {count > 99 ? "99+" : count}
        </span>
      </div>
    </button>
  );
}
