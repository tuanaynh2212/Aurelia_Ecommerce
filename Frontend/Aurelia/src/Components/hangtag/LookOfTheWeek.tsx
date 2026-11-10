import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { ShoppingBag, ArrowRight, Eye, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";
import { formatVND } from "../../utils/formatters";
import type { Product } from "../../types/type";
import { AnimatePresence, motion } from "framer-motion";

const HOTSPOT_CONFIG = [
  { slot: 0, x: 39, y: 35, label: "Áo Blazer Linen Bespoke" },
  { slot: 1, x: 58, y: 44, label: "Đầm Lụa Dáng Rũ Thượng Hạng" },
  { slot: 2, x: 42, y: 72, label: "Quần Âu May Đo Xếp Ly" },
];

interface HotspotTagProps {
  product: Product;
  x: number;
  y: number;
  index: number;
  isActive: boolean;
  onSelect: (index: number | null) => void;
  label?: string;
}

function HotspotTag({ product, x, y, index, isActive, onSelect, label }: HotspotTagProps) {
  const navigate = useNavigate();
  const anchorLeft = x < 55;

  const salePrice =
    product.discountValue && product.discountValue > 0
      ? product.discountType === "percentage"
        ? Math.round(product.price * (1 - product.discountValue / 100))
        : Math.round(product.price - product.discountValue)
      : null;

  return (
    <div
      className="absolute z-20"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <button
        type="button"
        onClick={() => onSelect(isActive ? null : index)}
        aria-expanded={isActive}
        aria-label={isActive ? `Đóng thông tin: ${product.name}` : `Xem thông tin: ${product.name}`}
        aria-controls={`hotspot-card-${product.id}`}
        className={cn(
          "relative group flex items-center justify-center transition-all duration-300 focus:outline-none",
          isActive ? "scale-110" : "hover:scale-105"
        )}
      >
        <span
          className={cn(
            "absolute -inset-2 rounded-full border transition-all duration-500",
            isActive
              ? "border-amber-400/80 bg-amber-400/20 scale-125 animate-pulse"
              : "border-white/60 bg-white/20 group-hover:scale-125 group-hover:border-white"
          )}
        />

        <span
          className={cn(
            "relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-colors duration-300 border",
            isActive
              ? "bg-amber-400 text-neutral-950 border-amber-300 font-bold"
              : "bg-neutral-900/80 text-white border-white/40 group-hover:bg-neutral-950"
          )}
        >
          <span className="font-mono text-xs font-semibold leading-none">
            {index + 1}
          </span>
        </span>

        {!isActive && label && (
          <span className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-neutral-900/85 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] px-2.5 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {label}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            id={`hotspot-card-${product.id}`}
            role="dialog"
            aria-label={product.name}
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute z-40 bg-neutral-950/95 backdrop-blur-xl border border-white/15 shadow-2xl rounded-xl w-60 md:w-64 text-white overflow-hidden",
              anchorLeft ? "left-12 -top-16" : "right-12 -top-16"
            )}
          >
            {(product.thumbnail || product.images?.[0]) && (
              <div className="relative w-full h-32 overflow-hidden bg-neutral-900">
                <img
                  src={product.thumbnail || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-white/10 backdrop-blur-md text-amber-300 border border-amber-300/30">
                  Item #{index + 1}
                </span>
              </div>
            )}

            <div className="p-3.5 space-y-2">
              <p className="font-heading text-sm font-medium text-white leading-snug line-clamp-2">
                {product.name}
              </p>

              <div className="flex items-baseline gap-2">
                {salePrice ? (
                  <>
                    <span className="font-mono text-sm font-semibold text-amber-300">
                      {formatVND(salePrice)}
                    </span>
                    <span className="font-mono text-xs text-neutral-400 line-through">
                      {formatVND(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-sm font-semibold text-white">
                    {formatVND(product.price)}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigate(`/Fashion/Products/${product.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] uppercase tracking-wider transition-colors"
                >
                  <Eye size={12} />
                  <span>Chi tiết</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/Fashion/Products/${product.id}`)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-colors shadow-sm"
                  aria-label={`Mua ${product.name}`}
                >
                  <ShoppingBag size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LookOfTheWeek() {
  const navigate = useNavigate();
  const { dataProduct } = useContext(FilterProductContext);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const lookProducts = useMemo<Product[]>(() => {
    if (!dataProduct || dataProduct.length === 0) return [];
    return [...dataProduct]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 3);
  }, [dataProduct]);

  if (lookProducts.length === 0) return null;

  return (
    <section
      aria-labelledby="look-heading"
      className="w-full py-12 md:py-20 transition-colors"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-[var(--color-rule)] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-amber-700" />
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-ink-muted">
                BỘ SƯU TẬP TUẦN NÀY · EDITORIAL BESPOKE
              </p>
            </div>
            <h2
              id="look-heading"
              className="font-heading text-3xl md:text-4xl font-semibold text-ink tracking-tight"
            >
              Look Của Tuần
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-muted max-w-md">
            Phối trang phục may đo thủ công tinh hoa từ Aurelia Atelier. Nhấn vào các điểm đánh số trên hình để khám phá từng thiết kế.
          </p>
        </div>

        <div className="relative w-full aspect-[3/2] max-h-[640px] rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-rule)] bg-neutral-900 group">
          <img
            src="/images/lookbook-editorial.jpg"
            alt="Look của tuần - Aurelia Atelier Bespoke Collection"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.01]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-neutral-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-neutral-200">
              Look No. 04 · Autumn Harmony
            </span>
          </div>

          <div className="hidden sm:flex absolute bottom-4 left-4 md:bottom-6 md:left-6 items-center gap-2 bg-neutral-950/65 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-white/90 text-xs font-mono">
            <span>Chạm số để xem thông số & giá niêm yết</span>
          </div>

          {lookProducts.map((product, i) => (
            <HotspotTag
              key={product.id}
              product={product}
              x={HOTSPOT_CONFIG[i]?.x ?? 30 + i * 20}
              y={HOTSPOT_CONFIG[i]?.y ?? 40}
              index={i}
              isActive={activeSlot === i}
              onSelect={(idx) => setActiveSlot(idx)}
              label={HOTSPOT_CONFIG[i]?.label}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {lookProducts.map((product, i) => {
            const isHighlighted = activeSlot === i;
            const salePrice =
              product.discountValue && product.discountValue > 0
                ? product.discountType === "percentage"
                  ? Math.round(product.price * (1 - product.discountValue / 100))
                  : Math.round(product.price - product.discountValue)
                : null;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setActiveSlot(i)}
                onMouseLeave={() => setActiveSlot(null)}
                onClick={() => navigate(`/Fashion/Products/${product.id}`)}
                className={cn(
                  "cursor-pointer relative p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 bg-paper",
                  isHighlighted
                    ? "border-amber-600/80 shadow-lg -translate-y-1 ring-1 ring-amber-600/30"
                    : "border-[var(--color-rule)] hover:border-ink/40 hover:shadow-md"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 transition-colors",
                    isHighlighted
                      ? "bg-amber-400 text-neutral-950 shadow-sm"
                      : "bg-neutral-200 text-neutral-800"
                  )}
                >
                  0{i + 1}
                </div>

                {(product.thumbnail || product.images?.[0]) && (
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                    <img
                      src={product.thumbnail || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {HOTSPOT_CONFIG[i]?.label || "Trang phục phối"}
                  </p>
                  <h3 className="font-heading text-sm font-medium text-ink truncate mt-0.5">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    {salePrice ? (
                      <>
                        <span className="font-mono text-sm font-semibold text-amber-700">
                          {formatVND(salePrice)}
                        </span>
                        <span className="font-mono text-xs text-ink-muted line-through">
                          {formatVND(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-sm font-semibold text-ink">
                        {formatVND(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-ink-muted group-hover:text-ink transition-transform group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LookOfTheWeek;
