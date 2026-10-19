/**
 * HANG TAG — Section 2: "Tuần này" wall
 * Dense 4-col grid of ProductTags. Tags hang from a single thin rule,
 * not individual repeated strings. Filter chips for category above.
 */

import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { ProductTag, TagSkeleton } from "../hangtag/ProductTag";
import { cn } from "../../utils/cn";
import type { Product } from "../../types/type";

/* Derive unique categories from data */
function getCategories(products: Product[]): string[] {
  const set = new Set<string>();
  products.forEach((p) => {
    if (p.type) set.add(p.type);
  });
  return ["Tất cả", ...Array.from(set)];
}

export function ThisWeekWall() {
  const navigate = useNavigate();
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const categories = useMemo(() => getCategories(dataProduct || []), [dataProduct]);

  const filtered = useMemo<Product[]>(() => {
    if (!dataProduct) return [];
    const list = activeCategory === "Tất cả"
      ? dataProduct
      : dataProduct.filter((p) => p.type === activeCategory);
    // Sort by sold desc, then by newest
    return [...list]
      .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
      .slice(0, 8);
  }, [dataProduct, activeCategory]);

  const showSkeletons = isLoading;

  return (
    <section
      aria-labelledby="this-week-heading"
      className="w-full"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="container-page py-12 md:py-16">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 border-b border-[var(--color-rule)] pb-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-1">
              — Cập nhật hàng tuần
            </p>
            <h2
              id="this-week-heading"
              className="font-heading text-2xl md:text-3xl font-semibold text-ink leading-tight"
            >
              Tuần này tại Aurellia
            </h2>
          </div>
          <button
            onClick={() => navigate("/Fashion/Products")}
            className="font-mono text-xs tracking-wider uppercase text-ink-muted underline underline-offset-2 hover:text-ink transition-colors self-start sm:self-end pb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
          >
            Xem tất cả →
          </button>
        </div>

        {/* Thin top rule that tags "hang" from */}
        <div
          className="w-full h-px mb-0"
          style={{ background: "var(--color-rule)" }}
          aria-hidden="true"
        />

        {/* Filter chips */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 pt-4 mb-0 scrollbar-none"
          role="group"
          aria-label="Lọc theo danh mục"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn("chip flex-shrink-0", activeCategory === cat && "is-active")}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product tag grid — 4 col desktop, 2 mobile */}
        {/* pt adds space for the hanging strings */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-0 pt-2"
          role="list"
          aria-label="Sản phẩm tuần này"
          aria-busy={isLoading}
        >
          {showSkeletons
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} role="listitem">
                  <TagSkeleton stringLength={28} />
                </div>
              ))
            : filtered.length === 0
            ? (
                <div className="col-span-4 text-center py-16">
                  <p className="font-mono text-sm text-ink-faint">
                    Không có sản phẩm trong danh mục này.
                  </p>
                </div>
              )
            : filtered.map((p, i) => (
                <div key={p.id} role="listitem">
                  <ProductTag
                    product={p}
                    index={i}
                    stringLength={28}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
