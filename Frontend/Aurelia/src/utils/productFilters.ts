import type { Product } from "../types/type";

/**
 * Checks whether a product record is a sample / placeholder / mock item
 * (e.g. "Product 1".."Product 10", "Generic Brand", or example.com images).
 */
export function isSampleProduct(product?: Partial<Product> | null): boolean {
  if (!product) return true;

  const name = (product.name ?? "").trim();
  const brand = (product.brand ?? "").trim().toLowerCase();
  const type = (product.type ?? "").trim().toLowerCase();
  const thumbnail = (product.thumbnail ?? "").trim().toLowerCase();
  const description = (product.description ?? "").trim().toLowerCase();

  if (!name) return true;

  // Match "Product 1", "Product 2", ..., "Sản phẩm mẫu", "Sample Product", "Test Product"
  if (/^product\s*#?\d+$/i.test(name)) return true;
  if (
    /^(sản phẩm mẫu|product mẫu|sample product|test product|demo product|mock product)/i.test(
      name
    )
  ) {
    return true;
  }

  // Match placeholder brand "Generic Brand" or placeholder type "Fashion" with Generic Brand
  if (
    brand === "generic brand" ||
    brand === "sample brand" ||
    brand === "brand mẫu"
  ) {
    return true;
  }

  if (type === "fashion" && (brand === "" || brand === "generic brand")) {
    return true;
  }

  // Match placeholder description from Excel template
  if (/^high-quality clothing item number \d+/i.test(description)) {
    return true;
  }

  // Match broken example.com or placeholder image URLs
  if (
    thumbnail.includes("example.com") ||
    thumbnail.includes("placeholder.com")
  ) {
    return true;
  }

  if (
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    product.images.every(
      (img) =>
        typeof img === "string" &&
        (img.toLowerCase().includes("example.com") ||
          img.toLowerCase().includes("placeholder.com"))
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Filters out sample / mock products from any product list.
 */
export function filterRealProducts<T extends Partial<Product>>(
  products?: T[] | null
): T[] {
  if (!Array.isArray(products)) return [];
  return products.filter((item) => !isSampleProduct(item));
}

