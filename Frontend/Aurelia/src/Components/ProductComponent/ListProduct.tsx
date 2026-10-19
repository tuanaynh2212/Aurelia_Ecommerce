import { useContext, useState, useMemo } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { ProductGrid } from "../product/ProductGrid";
import { Container } from "../layout/Container";
import { ArrowDown } from "lucide-react";

export const ListProduct = () => {
  const { key, dataProduct, isLoading } = useContext(FilterProductContext);
  const [displayCount, setDisplayCount] = useState(16);

  const filteredProducts = useMemo(() => {
    if (!dataProduct) return [];
    if (!key) return dataProduct;
    return dataProduct.filter(
      (p) => p.type?.toLowerCase() === key.toLowerCase() || p.subcategory?.toLowerCase() === key.toLowerCase()
    );
  }, [dataProduct, key]);

  const visibleProducts = filteredProducts.slice(0, displayCount);

  return (
    <section className="py-8">
      <Container>
        {/* Item count summary */}
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--color-ink-soft)]">
          <span>
            Hiển thị {visibleProducts.length} trên tổng số {filteredProducts.length} sản phẩm
          </span>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={visibleProducts}
          isLoading={isLoading}
          columns={4}
        />

        {/* Load more button */}
        {displayCount < filteredProducts.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setDisplayCount((prev) => prev + 12)}
              className="btn btn-outline inline-flex items-center gap-2 group"
            >
              <span>Xem thêm sản phẩm</span>
              <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ListProduct;
