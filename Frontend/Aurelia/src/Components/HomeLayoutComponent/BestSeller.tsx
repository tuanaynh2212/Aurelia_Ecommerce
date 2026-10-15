import { useState, useContext, useMemo } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import type { Product } from "../../types/type";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";
import { cn } from "../../lib/cn";

export const BestSeller = () => {
  const [activeTab, setActiveTab] = useState<"Newest" | "Popular">("Popular");
  const { dataProduct, isLoading } = useContext(FilterProductContext);

  const displayedProducts = useMemo<Product[]>(() => {
    if (!dataProduct || dataProduct.length === 0) return [];
    const list = [...dataProduct];

    if (activeTab === "Popular") {
      return list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 4);
    }
    return list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 4);
  }, [dataProduct, activeTab]);

  return (
    <Section
      badge="TOP INVENTORY"
      title="Sản Phẩm Trọng Điểm"
      subtitle="Thống kê lượng xuất kho thực tế và các thiết kế hoàn thiện mới nhất"
    >
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("Popular")}
          className={cn(
            "px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border",
            activeTab === "Popular"
              ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold"
              : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] border-[var(--color-rule)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
          )}
        >
          BÁN CHẠY NHẤT
        </button>
        <button
          onClick={() => setActiveTab("Newest")}
          className={cn(
            "px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border",
            activeTab === "Newest"
              ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold"
              : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] border-[var(--color-rule)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
          )}
        >
          MỚI NHẬP KHO
        </button>
      </div>

      <ProductGrid
        products={displayedProducts}
        isLoading={isLoading}
        columns={4}
      />
    </Section>
  );
};

export default BestSeller;
