import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";
import { Button } from "../UI/primitives/Button";

export const DiscountProducts = () => {
  const navigate = useNavigate();
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const saleProducts =
    dataProduct?.filter((p) => (p.discountValue ?? 0) > 0).slice(0, 4) || [];

  if (!isLoading && saleProducts.length === 0) return null;

  return (
    <Section
      badge="Ưu đãi giới hạn"
      title="Sản Phẩm Đang Giảm Giá"
      subtitle="Cơ hội sở hữu những mẫu thiết kế cao cấp với mức giá ưu đãi đặc biệt"
      action={
        <Button
          variant="primary"
          onClick={() => navigate("/Fashion/Products")}
          iconLeft={<Tag size={15} />}
          iconRight={<ArrowRight size={15} />}
        >
          Săn ưu đãi ngay
        </Button>
      }
    >
      <div className="border-2 border-ink bg-bone p-6 shadow-hard rounded-[2px]">
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
