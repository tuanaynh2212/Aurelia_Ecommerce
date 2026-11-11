import { useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import type { Product } from "../../types/type";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";
import { Tabs } from "../UI/primitives/Overlays";
import { Button } from "../UI/primitives/Button";

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
      return list
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 8);
    }
    if (activeTab === "rating") {
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 8);
    }
    return list.slice(0, 8);
  }, [dataProduct, activeTab]);

  return (
    <Section
      badge="Bộ sưu tập thịnh hành"
      title="Sản Phẩm Nổi Bật"
      subtitle="Những thiết kế được yêu thích nhất bởi hàng ngàn khách hàng của Aurelia"
      action={
        <Button
          variant="secondary"
          onClick={() => navigate("/Fashion/Products")}
          iconRight={<ArrowRight size={15} />}
        >
          Xem tất cả
        </Button>
      }
    >
      <Tabs
        className="mb-8"
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as "hot" | "new" | "rating")}
        items={[
          { id: "hot", label: "Bán chạy nhất" },
          { id: "new", label: "Mới cập bến" },
          { id: "rating", label: "Đánh giá cao" },
        ]}
      />

      <ProductGrid
        products={filteredItems}
        isLoading={isLoading}
        columns={4}
      />
    </Section>
  );
};

export default HotProducts;
