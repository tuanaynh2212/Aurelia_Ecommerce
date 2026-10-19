import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";

export const DiscountProducts = () => {
  const navigate = useNavigate();
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const saleProducts = dataProduct?.filter((p) => (p.discountValue ?? 0) > 0).slice(0, 4) || [];

  if (!isLoading && saleProducts.length === 0) return null;

  return (
    <Section
      badge="Ưu đãi giới hạn"
      title="Sản Phẩm Đang Giảm Giá"
      subtitle="Cơ hội sở hữu những mẫu thiết kế cao cấp với mức giá ưu đãi đặc biệt"
      action={
        <button
          onClick={() => navigate("/Fashion/Products")}
          className="btn btn-primary btn-sm group inline-flex items-center gap-1.5"
        >
          <Tag size={15} />
          <span>Săn ưu đãi ngay</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>
      }
    >
      <div className="bg-[var(--color-peach-100)]/40 p-6 sm:p-8 rounded-[var(--radius-2xl)] border border-[var(--color-peach-200)]/60">
        <ProductGrid
          products={saleProducts}
          isLoading={isLoading}
          columns={4}
          isSale={true}
        />
      </div>
    </Section>
  );
};

export default DiscountProducts;
