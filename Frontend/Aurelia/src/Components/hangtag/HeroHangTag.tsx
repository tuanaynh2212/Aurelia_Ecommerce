
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { FeaturedTag, TagSkeleton } from "../hangtag/ProductTag";
import type { Product } from "../../types/type";

const SLOT_CONFIG = [
  { length: 64, angle: -1.5 },
  { length: 44, angle:  1.2 },
  { length: 72, angle: -0.6 },
  { length: 52, angle:  1.8 },
];

export function HeroHangTag() {
  const navigate = useNavigate();
  const { dataProduct, isLoading } = useContext(FilterProductContext);

  const heroProducts = useMemo<Product[]>(() => {
    if (!dataProduct || dataProduct.length === 0) return [];
    const sorted = [...dataProduct].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    return sorted.slice(0, 4);
  }, [dataProduct]);

  const showSkeletons = isLoading || heroProducts.length === 0;

  return (
    <section
      aria-label="Bộ sưu tập nổi bật"
      className="w-full overflow-hidden border-b border-[var(--color-rule)]"
      style={{ background: "var(--color-kraft)" }}
    >
      <div className="container-page">
        <div className="flex flex-col lg:flex-row gap-0 min-h-[600px] lg:min-h-[640px]">

          <div
            className="flex flex-col justify-center py-12 lg:py-0 lg:w-[340px] lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[rgba(42,33,27,0.18)]"
            style={{ paddingRight: "2.5rem" }}
          >
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-4">
              Aurellia — Thu/Đông 2026
            </p>

            <h1
              className="font-heading text-[2.5rem] leading-[1.1] font-semibold text-ink mb-5"
              style={{ fontVariationSettings: "'opsz' 72" }}
            >
              Quần áo may đo chuẩn xác. Giá niêm yết minh bạch.
            </h1>

            <p className="max-w-sm mb-8 text-base leading-relaxed font-body text-ink-muted">
              Mọi thông số — chất liệu, phom dáng, xuất xứ — được in trực tiếp trên từng chiếc mác sản phẩm.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/Fashion/Products")}
                className="font-mono text-xs tracking-wider uppercase btn btn-ink"
                aria-label="Xem toàn bộ sản phẩm"
              >
                Xem bộ sưu tập — 2026
              </button>
            </div>

            <p className="font-mono text-[10px] text-ink-faint mt-6 tracking-wide">
              * Đổi trả miễn phí trong 14 ngày · Giao hàng toàn quốc
            </p>
          </div>

          <div className="relative flex-1 pt-5">
            <div
              className="absolute top-0 left-0 right-0 flex h-px"
              style={{ background: "rgba(42,33,27,0.20)" }}
              aria-hidden="true"
            />

            <div className="gap-4 px-2 py-4 pt-6 snap-x-scroller lg:hidden"
              role="list"
              aria-label="Sản phẩm nổi bật"
            >
              {showSkeletons
                ? [0, 1, 2].map((i) => (
                    <div key={i} className="snap-x-item w-[220px] flex-shrink-0">
                      <TagSkeleton stringLength={44} />
                    </div>
                  ))
                : heroProducts.map((p, i) => (
                    <div
                      key={p.id}
                      className="snap-x-item w-[220px] flex-shrink-0"
                      role="listitem"
                    >
                      <FeaturedTag
                        product={p}
                        index={i}
                        stringLength={SLOT_CONFIG[i]?.length ?? 44}
                        angle={0}
                      />
                    </div>
                  ))}
            </div>

            <div
              className="items-start hidden grid-cols-4 gap-5 px-6 pt-20 pb-8 lg:grid"
              role="list"
              aria-label="Sản phẩm nổi bật"
            >
              {showSkeletons
                ? [0, 1, 2, 3].map((i) => (
                    <TagSkeleton key={i} stringLength={SLOT_CONFIG[i]?.length ?? 44} />
                  ))
                : heroProducts.map((p, i) => (
                    <FeaturedTag
                      key={p.id}
                      product={p}
                      index={i}
                      stringLength={SLOT_CONFIG[i]?.length ?? 44}
                      angle={SLOT_CONFIG[i]?.angle ?? 0}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
