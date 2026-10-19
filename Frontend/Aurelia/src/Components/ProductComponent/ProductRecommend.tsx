import { useContext } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";

export const ProductRecommend = () => {
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const recommended = (dataProduct || [])
    .filter((a) => (a.rating ?? 0) >= 4.0)
    .slice(0, 4);

  if (!isLoading && recommended.length === 0) return null;

  return (
    <Section
      badge="Gợi ý riêng cho bạn"
      title="Sản Phẩm Có Thể Bạn Thích"
      subtitle="Những thiết kế cùng phong cách và được đánh giá cao bởi cộng đồng Aurelia"
      spacing="md"
    >
      <ProductGrid
        products={recommended}
        isLoading={isLoading}
        columns={4}
      />
    </Section>
  );
};

export default ProductRecommend;
