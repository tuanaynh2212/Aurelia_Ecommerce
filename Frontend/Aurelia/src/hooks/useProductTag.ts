import * as React from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/type";
import { swatchHex } from "../Components/UI/three/palette";
import { formatVND } from "../utils/formatters";
import {
  getAvailableSizes,
  getCareIcons,
  getPrimaryProductImage,
  getProductColors,
  getSalePrice,
  getSku,
} from "../utils/productHelpers";

export const formatPrice = formatVND;
export const getColors = getProductColors;
export { getSalePrice, getCareIcons, getAvailableSizes, getSku };

export function colorHex(name: string): string {
  return swatchHex(name);
}

export function useProductTag(
  product: Product,
  onAddToCart?: (p: Product, size: string) => void
) {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState("");
  const [isSwinging, setIsSwinging] = React.useState(false);

  const detailsBtnRef = React.useRef<HTMLButtonElement>(null);
  const backFirstFocusRef = React.useRef<HTMLButtonElement>(null);
  const prefersReduced = React.useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const sizes = getAvailableSizes(product);
  const colors = getProductColors(product);
  const salePrice = getSalePrice(product);
  const sku = getSku(product);
  const care = getCareIcons(product.material || "");
  const isSoldOut = (product.stock || 0) <= 0;
  const stockLow = !isSoldOut && (product.stock || 0) <= 3;
  const thumbnail = getPrimaryProductImage(product);

  React.useEffect(() => {
    if (isFlipped && backFirstFocusRef.current) {
      setTimeout(
        () => backFirstFocusRef.current?.focus(),
        prefersReduced.current ? 0 : 290
      );
    }
  }, [isFlipped]);

  const handleFlip = () => setIsFlipped((v) => !v);

  const handleMouseEnter = () => {
    if (prefersReduced.current) return;
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 250);
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      const first = sizes.find((s) => s.qty > 0);
      if (first) setSelectedSize(first.size);
      return;
    }
    onAddToCart?.(product, selectedSize);
  };

  const goToProduct = () => navigate(`/Fashion/Products/${product.id}`);

  return {
    isFlipped,
    selectedSize,
    setSelectedSize,
    isSwinging,
    detailsBtnRef,
    backFirstFocusRef,
    sizes,
    colors,
    salePrice,
    sku,
    care,
    isSoldOut,
    stockLow,
    thumbnail,
    prefersReduced,
    handleFlip,
    handleMouseEnter,
    handleAddToCart,
    goToProduct,
  };
}
