import * as React from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/type";
import { formatVND } from "../../utils/formatters";
import {
  getPrimaryProductImage,
  getProductColors,
  getSalePrice,
  getSku,
} from "../../utils/productHelpers";
import { MerchTag } from "../UI/primitives/MerchTag";
import { FilterProductContext } from "../../contexts/FIlterProduct";

export interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
  isSale?: boolean;
  isGrayscale?: boolean;
  onQuickAdd?: (product: Product) => void;
}

export function ProductCard({
  product,
  index = 0,
  className,
  isSale,
  onQuickAdd,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isFavouriteProduct, toggleFavourite } = React.useContext(FilterProductContext);
  const [isHovered, setIsHovered] = React.useState(false);

  if (!product) return null;

  const primaryImage = getPrimaryProductImage(product);
  const secondaryImage =
    Array.isArray(product.images) && product.images.length > 1
      ? product.images[1]
      : primaryImage;

  const discount = isSale || (product.discountValue && product.discountValue > 0);
  const discountVal = product.discountValue || 0;
  const salePrice = getSalePrice(product);
  const colors = getProductColors(product);
  const sku = getSku(product);

  const handleCardClick = () => {
    navigate(`/Fashion/Products/${product.id}`);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      <MerchTag
        index={index}
        name={product.name}
        image={isHovered && secondaryImage ? secondaryImage : primaryImage}
        to={`/Fashion/Products/${product.id}`}
        onOpen={handleCardClick}
        eyebrow={`${product.brand || "AURELIA"}${product.type ? ` // ${product.type}` : ""}`}
        priceLabel={formatVND(salePrice ?? product.price)}
        originalPriceLabel={salePrice ? formatVND(product.price) : null}
        discountLabel={discount && discountVal > 0 ? `-${discountVal}%` : discount ? "SALE" : null}
        colors={colors}
        sku={sku}
        soldOut={(product.stock ?? 1) <= 0}
        isFavourite={isFavouriteProduct(product.id)}
        onToggleFavourite={() => {
          void toggleFavourite(product);
        }}
        onQuickAdd={onQuickAdd ? () => onQuickAdd(product) : undefined}
        badge={
          product.sold && product.sold > 0 ? (
            <span className="border border-ink bg-bone px-1.5 py-0.5 mono-label text-[9px] font-bold text-ink">
              ĐÃ BÁN {product.sold}
            </span>
          ) : undefined
        }
      />
    </div>
  );
}

export default ProductCard;
