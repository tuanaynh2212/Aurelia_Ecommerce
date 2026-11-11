import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Box, LayoutGrid } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { ProductTag, TagSkeleton } from "../hangtag/ProductTag";
import { MerchSelector3D } from "../hangtag/MerchSelector3D";
import { SectionTitle } from "../UI/primitives/SectionTitle";
import { Tabs } from "../UI/primitives/Overlays";
import { Button } from "../UI/primitives/Button";
import type { Product } from "../../types/type";
import { filterRealProducts } from "../../utils/productFilters";
import { cn } from "../../utils/cn";

export function ThisWeekWall() {
  const navigate = useNavigate();
  const { dataProduct: rawProducts, isLoading } = useContext(FilterProductContext);
  const dataProduct = useMemo(() => filterRealProducts(rawProducts), [rawProducts]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  const categories = useMemo(() => {
    if (!dataProduct?.length) return ["all"];
    const set = new Set<string>(["all"]);
    dataProduct.forEach((p) => {
      if (p.type) set.add(p.type);
    });
    return Array.from(set).slice(0, 6);
  }, [dataProduct]);

  const filtered = useMemo<Product[]>(() => {
    if (!dataProduct?.length) return [];
    const base =
      activeCategory === "all"
        ? dataProduct
        : dataProduct.filter((p) => p.type === activeCategory);
    return base.slice(0, 8);
  }, [dataProduct, activeCategory]);

  const showSkeletons = isLoading && filtered.length === 0;

  return (
    <section
      aria-label="Quầy merch tuần này"
      className="border-b-[3px] border-ink bg-paper"
    >
      {/* Concert Merch Tent Awning Trim */}
      <div className="border-b-2 border-ink bg-ink text-paper">
        <div className="container-atelier flex items-center justify-between py-2 mono-label text-[10px] font-extrabold">
          <span className="text-volt">MERCH BOOTH // SECTOR 05 — OFFICIAL TOUR GOODS</span>
          <span className="hidden sm:inline text-fog">3D INTERACTIVE STAGE SELECT</span>
        </div>
        <div aria-hidden="true" className="hazard-stripe h-2 w-full border-t border-paper/20" />
      </div>

      <div className="container-atelier py-14 md:py-20">
        <SectionTitle
          index="05"
          eyebrow="MERCH BOOTH // 3D STAGE SELECTOR"
          title="QUẦY MERCH TUẦN NÀY"
          count={filtered.length}
          action={
            <Button
              variant="secondary"
              onClick={() => navigate("/Fashion/Products")}
              iconRight={<ArrowUpRight size={16} strokeWidth={2.5} />}
            >
              Xem toàn bộ kệ
            </Button>
          }
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            activeId={activeCategory}
            onChange={setActiveCategory}
            items={categories.map((cat) => ({
              id: cat,
              label: cat === "all" ? "Tất cả" : cat,
            }))}
          />

          {/* 3D Stage vs 2D Grid Switcher */}
          <div
            role="group"
            aria-label="Chế độ xem sản phẩm"
            className="inline-flex border-2 border-ink bg-bone p-0.5 rounded-[2px] shadow-hard-sm"
          >
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              aria-pressed={viewMode === "3d"}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 mono-label text-[10px] font-extrabold cursor-pointer transition-colors rounded-[1px]",
                viewMode === "3d" ? "bg-volt text-ink" : "text-ink-muted hover:text-ink"
              )}
            >
              <Box size={13} strokeWidth={2.5} aria-hidden="true" />
              <span>SELECT 3D</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 mono-label text-[10px] font-extrabold cursor-pointer transition-colors rounded-[1px]",
                viewMode === "grid" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
              )}
            >
              <LayoutGrid size={13} strokeWidth={2.5} aria-hidden="true" />
              <span>LƯỚI 2D</span>
            </button>
          </div>
        </div>

        {showSkeletons ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <TagSkeleton key={i} />
            ))}
          </div>
        ) : viewMode === "3d" ? (
          <MerchSelector3D key={activeCategory} products={filtered} />
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product, idx) => (
              <ProductTag key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ThisWeekWall;
