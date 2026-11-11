import { getPercentageDiscountPrice } from "./productHelpers";

export function formatVND(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "0 ₫";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatProductPrice(price: number, discountValue: number) {
  const isSale = discountValue > 0;
  const salePrice = getPercentageDiscountPrice(price, discountValue);
  return {
    display: formatVND(salePrice),
    original: formatVND(price),
    isSale,
    discountLabel: isSale ? `-${discountValue}%` : null,
    raw: salePrice,
  };
}

export function formatOrderId(id: string | null | undefined): string {
  const prefix = "#";
  if (!id) return `${prefix}00000000`;
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, "");
  if (clean.length <= 8) return `${prefix}${clean.toUpperCase()}`;
  return `${prefix}${clean.slice(0, 8).toUpperCase()}`;
}

export function formatDateTime(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDateOnly(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getRelativeTimeVi(dateInput: string | number | Date | null | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return "Vừa xong";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${Math.floor(diffMonths / 12)} năm trước`;
}
