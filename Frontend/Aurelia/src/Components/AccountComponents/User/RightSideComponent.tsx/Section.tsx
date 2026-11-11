import React from "react";
import type { Coupon } from "../../../../types/type";
import { CouponCard } from "./CouponCard";

export const Section: React.FC<{
  title: string;
  icon: React.ElementType;
  coupons: Coupon[];
  type: string;
  emptyText: string;
}> = ({ title, icon: Icon, coupons = [], type, emptyText }) => {
  const safeCoupons = Array.isArray(coupons) ? coupons : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-2.5">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-[var(--color-flash)]" />
          <h2 className="font-display-safe text-sm font-extrabold uppercase text-[var(--color-ink)]">
            {title}
          </h2>
        </div>
        <span className="mono-label text-[var(--color-ink-muted)]">
          [{safeCoupons.length} PHIẾU]
        </span>
      </div>

      {safeCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} type={type} />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--color-bone)] border-2 border-dashed border-[var(--color-ink)] p-8 text-center text-xs font-mono text-[var(--color-ink-muted)]">
          {emptyText}
        </div>
      )}
    </div>
  );
};
