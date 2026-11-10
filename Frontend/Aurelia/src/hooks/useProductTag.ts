import * as React from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/type";

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

export function getSalePrice(product: Product): number | null {
  if (!product.discountValue || product.discountValue <= 0) return null;
  if (product.discountType === "percentage")
    return Math.round(product.price * (1 - product.discountValue / 100));
  return Math.round(product.price - product.discountValue);
}

export function getCareIcons(material: string): { label: string; sym: string }[] {
  const m = (material || "").toLowerCase();
  const icons: { label: string; sym: string }[] = [];
  if (m.includes("linen") || m.includes("cotton"))
    icons.push({ sym: "30°", label: "Giặt 30°C" });
  else icons.push({ sym: "40°", label: "Giặt 40°C" });
  icons.push({ sym: "◻", label: "Không sấy" });
  icons.push({ sym: "☽", label: "Phơi bóng râm" });
  if (!m.includes("linen")) icons.push({ sym: "↑", label: "Ủi nhẹ" });
  return icons;
}

export function getAvailableSizes(product: Product): { size: string; qty: number }[] {
  if (!product.variants?.length) return [];
  const ORDER = ["XS", "S", "M", "L", "XL", "XXL", "28", "29", "30", "31", "32", "34", "36"];
  const map: Record<string, number> = {};
  product.variants.forEach((v) =>
    v.sizes?.forEach((s) => { map[s.size] = (map[s.size] || 0) + (s.quantity || 0); })
  );
  return Object.entries(map)
    .sort(([a], [b]) => {
      const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
    })
    .map(([size, qty]) => ({ size, qty }));
}

export function getColors(product: Product): string[] {
  return [...new Set((product.variants || []).map((v) => v.color).filter(Boolean))];
}

export function colorHex(name: string): string {
  const map: Record<string, string> = {
    "đen": "#1a1a1a", "trắng": "#f5f5f5", "đỏ": "#c0392b",
    "xanh navy": "#1a2a4a", "xanh": "#1a6b3a", "xanh dương": "#1a4080",
    "xanh lá": "#2d6a2a", "be": "#d4b896", "kem": "#f5ead3",
    "nâu": "#6b4226", "vàng": "#c9a227", "hồng": "#e8a0a8",
    "tím": "#6a3d7a", "xám": "#888888", "cam": "#d4600a",
    "rêu": "#5a6b3a", "sand": "#c9a88a", "navy": "#1a2a4a",
    "nude": "#ddb89a", "olive": "#6b7a3a", "black": "#1a1a1a", "white": "#f5f5f5",
  };
  return map[name.toLowerCase()] || "#888888";
}

export function getSku(product: Product): string {
  return `${(product.type || "AUR").slice(0, 3).toUpperCase()}-${(product.id || "000000").slice(-6).toUpperCase()}`;
}

export function useProductTag(product: Product, onAddToCart?: (p: Product, size: string) => void) {
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
  const colors = getColors(product);
  const salePrice = getSalePrice(product);
  const sku = getSku(product);
  const care = getCareIcons(product.material || "");
  const isSoldOut = (product.stock || 0) <= 0;
  const stockLow = !isSoldOut && (product.stock || 0) <= 3;
  const thumbnail =
    product.thumbnail || (Array.isArray(product.images) ? product.images[0] : "") || "";

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
    isFlipped, selectedSize, setSelectedSize, isSwinging,
    detailsBtnRef, backFirstFocusRef,
    sizes, colors, salePrice, sku, care, isSoldOut, stockLow, thumbnail,
    prefersReduced,
    handleFlip, handleMouseEnter, handleAddToCart, goToProduct,
  };
}
