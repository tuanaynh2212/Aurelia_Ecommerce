import type { Product } from "../../types/type";
import { MerchTag, MerchTagSkeleton } from "../UI/primitives/MerchTag";
import { useProductTag, formatPrice } from "../../hooks/useProductTag";

export interface ProductTagProps {
  product: Product;
  index?: number;
  className?: string;
  isSale?: boolean;
  onAddToCart?: (product: Product, size: string) => void;
  stringLength?: number;
  angle?: number;
  suspended?: boolean;
}

export function ProductTag({
  product,
  index = 0,
  className,
  isSale,
  onAddToCart,
  stringLength,
  angle,
  suspended,
}: ProductTagProps) {
  const {
    colors,
    salePrice,
    sku,
    isSoldOut,
    thumbnail,
    handleAddToCart,
    goToProduct,
  } = useProductTag(product, onAddToCart);

  const discountVal = product.discountValue || 0;
  const showDiscount = isSale || discountVal > 0;

  return (
    <MerchTag
      index={index}
      name={product.name}
      image={thumbnail}
      to={`/Fashion/Products/${product.id}`}
      onOpen={goToProduct}
      eyebrow={`${product.brand || "AURELIA"}${product.material ? ` // ${product.material}` : ""}`}
      priceLabel={formatPrice(salePrice ?? product.price)}
      originalPriceLabel={salePrice ? formatPrice(product.price) : null}
      discountLabel={
        showDiscount && discountVal > 0
          ? `-${discountVal}%`
          : showDiscount
          ? "SALE"
          : null
      }
      colors={colors}
      sku={sku}
      soldOut={isSoldOut}
      onQuickAdd={onAddToCart ? handleAddToCart : goToProduct}
      className={className}
      stringLength={stringLength}
      angle={angle}
      suspended={suspended}
    />
  );
}

export function FeaturedTag(props: ProductTagProps) {
  return <ProductTag {...props} suspended={props.suspended ?? true} />;
}

export function TagSkeleton({
  className,
  stringLength,
  suspended,
}: {
  stringLength?: number;
  className?: string;
  suspended?: boolean;
}) {
  return (
    <MerchTagSkeleton
      className={className}
      stringLength={stringLength}
      suspended={suspended}
    />
  );
}

export default ProductTag;
