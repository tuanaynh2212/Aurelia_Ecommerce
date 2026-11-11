import type { Product } from "../types/type";

const SIZE_ORDER = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "28",
  "29",
  "30",
  "31",
  "32",
  "34",
  "36",
];

export function getSalePrice(product: Product): number | null {
  if (!product.discountValue || product.discountValue <= 0) return null;
  if (product.discountType === "percentage") {
    return Math.round(product.price * (1 - product.discountValue / 100));
  }
  return Math.round(product.price - product.discountValue);
}

export function getPercentageDiscountPrice(
  price: number,
  discountValue: number
): number {
  return discountValue > 0 ? price - (price * discountValue) / 100 : price;
}

export function getProductImages(product: Product): string[] {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  return product.thumbnail ? [product.thumbnail] : [""];
}

export function getPrimaryProductImage(product: Product): string {
  return (
    product.thumbnail ||
    (Array.isArray(product.images)
      ? product.images[0]
      : (product.images as unknown as string)) ||
    ""
  );
}

export function getCareIcons(
  material: string
): { label: string; sym: string }[] {
  const normalized = (material || "").toLowerCase();
  const icons: { label: string; sym: string }[] = [
    normalized.includes("linen") || normalized.includes("cotton")
      ? { sym: "30°", label: "Giặt 30°C" }
      : { sym: "40°", label: "Giặt 40°C" },
    { sym: "◻", label: "Không sấy" },
    { sym: "☽", label: "Phơi bóng râm" },
  ];

  if (!normalized.includes("linen")) {
    icons.push({ sym: "↑", label: "Ủi nhẹ" });
  }
  return icons;
}

export function getAvailableSizes(
  product: Product
): { size: string; qty: number }[] {
  if (!product.variants?.length) return [];

  const totals: Record<string, number> = {};
  product.variants.forEach((variant) =>
    variant.sizes?.forEach((sz) => {
      totals[sz.size] = (totals[sz.size] || 0) + (sz.quantity || 0);
    })
  );

  return Object.entries(totals)
    .sort(([a], [b]) => {
      const ai = SIZE_ORDER.indexOf(a);
      const bi = SIZE_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
    })
    .map(([size, qty]) => ({ size, qty }));
}

export function getAvailableSizeNames(product: Product): string[] {
  return Array.from(
    new Set(
      (product.variants || []).flatMap((variant) =>
        (variant.sizes || [])
          .filter((sz) => sz.quantity > 0)
          .map((sz) => sz.size)
      )
    )
  );
}

export function getProductColors(product: Product): string[] {
  return [
    ...new Set((product.variants || []).map((v) => v.color).filter(Boolean)),
  ];
}

export function getSku(product: Product): string {
  const prefix = (product.type || "AUR").slice(0, 3).toUpperCase();
  const suffix = (product.id || "000000").slice(-6).toUpperCase();
  return `${prefix}-${suffix}`;
}

