/**
 * Price formatter utilities — centralised so format changes propagate everywhere.
 */

/**
 * Format a number as Vietnamese Dong (VND).
 * e.g. 1500000 → "1.500.000 ₫"
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a price with optional sale calculation.
 * Returns { display, original, isSale, discountLabel }
 */
export function formatProductPrice(price: number, discountValue: number) {
  const isSale = discountValue > 0;
  const salePrice = isSale ? price - (price * discountValue) / 100 : price;
  return {
    display: formatVND(salePrice),
    original: formatVND(price),
    isSale,
    discountLabel: isSale ? `-${discountValue}%` : null,
    raw: salePrice,
  };
}
