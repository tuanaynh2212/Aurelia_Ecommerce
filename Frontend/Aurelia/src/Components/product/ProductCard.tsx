import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "../../types/type";
import { cn } from "../../lib/cn";
import { PriceTag } from "./PriceTag";
import { WishlistButton } from "./WishlistButton";
import { ColorSwatch } from "./ColorSwatch";

export interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
  isSale?: boolean;
  isGrayscale?: boolean; // kept for legacy signature compatibility
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
  const [isHovered, setIsHovered] = React.useState(false);

  if (!product) return null;

  // Extract images safely
  const primaryImage = product.thumbnail || (Array.isArray(product.images) ? product.images[0] : (product.images as string)) || "";
  const secondaryImage = Array.isArray(product.images) && product.images.length > 1 ? product.images[1] : primaryImage;

  const discount = isSale || (product.discountValue && product.discountValue > 0);
  const discountVal = product.discountValue || 0;

  const handleCardClick = () => {
    navigate(`/Fashion/Products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col bg-[var(--color-bg)] rounded-none border border-[var(--color-rule)] overflow-hidden",
        "transition-colors duration-150 hover:border-[var(--color-ink)] cursor-pointer",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-rule)]">
        {/* Main image */}
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300 ease-out",
            secondaryImage !== primaryImage && isHovered ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Secondary image on hover */}
        {secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Badges top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discount && (
            <span className="bg-[var(--color-accent)] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none uppercase tracking-wider">
              {discountVal > 0 ? `-${discountVal}%` : "SALE"}
            </span>
          )}
          {product.isNew && (
            <span className="bg-[var(--color-ink)] text-[var(--color-bg)] text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-none uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist button top-right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton productId={product.id} size="sm" />
        </div>

        {/* Quick action buttons floating on bottom of image */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/Fashion/Products/${product.id}`);
            }}
            className="flex-1 h-8 rounded-none bg-[var(--color-bg)] border border-[var(--color-rule)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)] text-[11px] font-mono font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye size={13} />
            <span>Chi tiết</span>
          </button>
          {onQuickAdd && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product);
              }}
              aria-label="Thêm vào giỏ"
              className="w-8 h-8 rounded-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ShoppingBag size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5 bg-[var(--color-bg)]">
        <div>
          {/* Brand & Type */}
          <div className="flex items-center justify-between text-[11px] text-[var(--color-ink-muted)] font-mono mb-1">
            <span className="uppercase tracking-wider font-medium truncate">
              {product.brand || "Aurelia"}
            </span>
            {product.type && <span className="uppercase tracking-wider text-[10px]">{product.type}</span>}
          </div>

          {/* Product Name */}
          <h3 className="font-heading font-semibold text-sm text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Color preview if available */}
        {product.colors && product.colors.length > 0 && (
          <div className="pt-0.5">
            <ColorSwatch colors={product.colors.slice(0, 4)} size="sm" />
          </div>
        )}

        {/* Price Tag */}
        <div className="pt-2 border-t border-[var(--color-rule)] flex items-baseline justify-between">
          <PriceTag
            price={product.price}
            discountValue={product.discountValue}
            size="md"
          />
          {product.sold !== undefined && product.sold > 0 && (
            <span className="text-[11px] font-mono text-[var(--color-ink-muted)] tabular-nums uppercase tracking-wider">
              ĐÃ BÁN {product.sold}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
