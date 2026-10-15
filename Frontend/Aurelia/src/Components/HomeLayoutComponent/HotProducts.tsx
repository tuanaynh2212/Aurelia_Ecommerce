import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, Star } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import type { Product } from "../../types/type";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";
import { cn } from "../../lib/cn";

export const HotProducts = () => {
  const navigate = useNavigate();
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const [activeTab, setActiveTab] = useState<"hot" | "new" | "rating">("hot");

  const filteredItems = useMemo<Product[]>(() => {
    if (!dataProduct || dataProduct.length === 0) return [];
    const list = [...dataProduct];

    if (activeTab === "hot") {
      return list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 8);
    }
    if (activeTab === "new") {
      return list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 8);
    }
    if (activeTab === "rating") {
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 8);
    }
    return list.slice(0, 8);
  }, [dataProduct, activeTab]);

  const tabs = [
    { id: "hot" as const, label: "Bán chạy nhất", icon: Flame },
    { id: "new" as const, label: "Mới cập bến", icon: Sparkles },
    { id: "rating" as const, label: "Đánh giá cao", icon: Star },
  ];

  return (
    <Section
      badge="Bộ sưu tập thịnh hành"
      title="Sản Phẩm Nổi Bật"
      subtitle="Những thiết kế được yêu thích nhất bởi hàng ngàn khách hàng của Aurelia"
      action={
        <button
          onClick={() => navigate("/Fashion/Products")}
          className="btn btn-outline btn-sm group inline-flex items-center gap-1.5"
        >
          <span>Xem tất cả</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>
      }
    >
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-pill)] text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap",
                isActive
                  ? "bg-[var(--color-ink)] text-white shadow-sm"
                  : "bg-white text-[var(--color-ink-soft)] border border-[var(--color-cream-300)] hover:bg-[var(--color-cream-100)] hover:text-[var(--color-ink)]"
              )}
            >
              <Icon size={16} className={isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink-faint)]"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <ProductGrid
        products={filteredItems}
        isLoading={isLoading}
        columns={4}
      />
    </Section>
  );
};

export default HotProducts;
