
import { useContext, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { ProductTag, TagSkeleton } from "../hangtag/ProductTag";
import type { Product } from "../../types/type";

export function NewInScroller() {
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  const newProducts = useMemo<Product[]>(() => {
    if (!dataProduct || dataProduct.length === 0) return [];
    return [...dataProduct]
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 8);
  }, [dataProduct]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const itemWidth = el.querySelector("[data-scroll-item]")?.clientWidth || 240;
    el.scrollBy({ left: dir === "right" ? itemWidth + 12 : -(itemWidth + 12), behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") scroll("right");
    if (e.key === "ArrowLeft") scroll("left");
  };

  const showSkeletons = isLoading || newProducts.length === 0;

  return (
    <section
      aria-labelledby="new-in-heading"
      className="w-full"
      style={{ background: "var(--color-paper)" }}
    >
      <div className="container-page py-12 md:py-16">

        <div className="flex items-end justify-between mb-6 border-b border-[var(--color-rule)] pb-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-1">
              — Vừa nhập về
            </p>
            <h2 id="new-in-heading" className="font-heading text-2xl md:text-3xl font-semibold text-ink">
              Hàng mới về
            </h2>
          </div>

          <div className="flex gap-2" role="group" aria-label="Điều hướng hàng mới">
            <button
              onClick={() => scroll("left")}
              aria-label="Cuộn trái"
              className="w-9 h-9 flex items-center justify-center border border-[var(--color-rule)] text-ink-muted hover:text-ink hover:border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Cuộn phải"
              className="w-9 h-9 flex items-center justify-center border border-[var(--color-rule)] text-ink-muted hover:text-ink hover:border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </div>

        <div
          className="w-full h-px"
          style={{ background: "var(--color-rule)" }}
          aria-hidden="true"
        />

        <div
          ref={scrollRef}
          role="list"
          aria-label="Sản phẩm mới về"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="snap-x-scroller gap-3 pt-2 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
          aria-busy={isLoading}
        >
          {showSkeletons
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="snap-x-item flex-shrink-0"
                  style={{ width: 220 }}
                  role="listitem"
                >
                  <TagSkeleton stringLength={28} />
                </div>
              ))
            : newProducts.map((p, i) => (
                <div
                  key={p.id}
                  data-scroll-item
                  className="snap-x-item flex-shrink-0"
                  style={{ width: 220 }}
                  role="listitem"
                >
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
