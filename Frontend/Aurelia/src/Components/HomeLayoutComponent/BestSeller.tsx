import { useState, useContext, useMemo } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import type { Product } from "../../types/type";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";
import { Tabs } from "../UI/primitives/Overlays";

export const BestSeller = () => {
  const [activeTab, setActiveTab] = useState<"Newest" | "Popular">("Popular");
  const { dataProduct, isLoading } = useContext(FilterProductContext);

  const displayedProducts = useMemo<Product[]>(() => {
    if (!dataProduct || dataProduct.length === 0) return [];
    const list = [...dataProduct];

    if (activeTab === "Popular") {
      return list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 4);
    }
    return list
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [dataProduct, activeTab]);

  return (
    <Section
      badge="TOP INVENTORY"
      title="Sản Phẩm Trọng Điểm"
      subtitle="Thống kê lượng xuất kho thực tế và các thiết kế hoàn thiện mới nhất"
    >
      <Tabs
        className="mb-8"
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as "Newest" | "Popular")}
        items={[
          { id: "Popular", label: "BÁN CHẠY NHẤT" },
          { id: "Newest", label: "MỚI NHẬP KHO" },
        ]}
      />

      <ProductGrid
        products={displayedProducts}
        isLoading={isLoading}
        columns={4}
      />
    </Section>
  );
};

export default BestSeller;
