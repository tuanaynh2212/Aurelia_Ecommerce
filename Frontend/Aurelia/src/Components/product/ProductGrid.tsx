import * as React from "react";
import type { Product } from "../../types/type";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "../ui/Skeleton";
import { cn } from "../../lib/cn";

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
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
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
  if (isLoading) {
    return (
      <div className={cn("grid gap-3 sm:gap-4", columnClasses[columns], className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 p-3 bg-[var(--color-bg)] rounded-none border border-[var(--color-rule)]">
            <Skeleton className="aspect-[3/4] w-full rounded-none bg-[var(--color-surface)]" />
            <Skeleton className="h-3 w-1/3 rounded-none bg-[var(--color-surface)]" />
            <Skeleton className="h-4 w-3/4 rounded-none bg-[var(--color-surface)]" />
            <Skeleton className="h-3 w-1/2 rounded-none bg-[var(--color-surface)]" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[var(--color-surface)] rounded-none border border-[var(--color-rule)]">
        <p className="text-sm font-heading font-semibold text-[var(--color-ink)] uppercase tracking-wider">
          Không tìm thấy sản phẩm trong danh mục
        </p>
        <p className="text-xs font-mono text-[var(--color-ink-muted)] mt-1.5">
          Vui lòng thay đổi thông số tìm kiếm hoặc chọn danh mục khác.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 sm:gap-4", columnClasses[columns], className)}>
      {products.map((product, index) => (
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
