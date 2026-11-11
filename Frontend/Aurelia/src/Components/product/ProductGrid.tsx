import type { Product } from "../../types/type";
import { ProductCard } from "./ProductCard";
import { MerchTagSkeleton } from "../UI/primitives/MerchTag";
import { EmptyState } from "../UI/primitives/Feedback";
import { cn } from "../../utils/cn";
import { filterRealProducts } from "../../utils/productFilters";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  isSale?: boolean;
  onQuickAdd?: (product: Product) => void;
}

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
};

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  columns = 4,
  className,
  isSale,
  onQuickAdd,
}: ProductGridProps) {
  const realProducts = filterRealProducts(products);

  if (isLoading && realProducts.length === 0) {
    return (
      <div className={cn("grid gap-4 sm:gap-6", columnClasses[columns], className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MerchTagSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (realProducts.length === 0) {
    return (
      <EmptyState
        code="[RACK // EMPTY]"
        title="Không tìm thấy sản phẩm trong danh mục"
        description="Vui lòng thay đổi thông số tìm kiếm hoặc chọn danh mục khác."
      />
    );
  }

  return (
    <div className={cn("grid gap-4 sm:gap-6", columnClasses[columns], className)}>
      {realProducts.map((product, index) => (
        <ProductCard
          key={product.id || index}
          product={product}
          index={index}
          isSale={isSale}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
